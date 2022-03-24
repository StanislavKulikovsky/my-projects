/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
'use strict'

const functions = require('firebase-functions')
const { runTransaction, performOperation } = require('../../submodules/domain/firebase/firestore')
const { TournamentGatewayFactory } = require('../../submodules/domain/firebase/tournament/firebase_tournament')
const { Config } = require('../../submodules/domain/tournament/config')
const { RegistrationState } = require('../../submodules/domain/tournament/entities/registration')
const { TournamentState } = require('../../submodules/domain/tournament/entities/tournament')
const { TournamentStartType } = require('../../submodules/domain/tournament/entities/tournament_type')
const { loadTournamentsInteractor, TournamentFilter } = require('../../submodules/domain/tournament/interactors/tournament/crud/load_tournaments')
const { sendPayoutInteractor } = require('../../submodules/domain/tournament/interactors/tournament/payouts/send_payouts')
const { cancelRegistrationInTournamentInteractor } = require('../../submodules/domain/tournament/interactors/tournament/registration/cancel_registration')
const { loadTournamentRegistrationsInteractor, TournamentRegistrationFilter } = require('../../submodules/domain/tournament/interactors/tournament/registration/load_tournament_registrations')
const { finishCancellingTournamentInteractor, startCancellingTournamentInteractor } = require('../../submodules/domain/tournament/interactors/tournament/state_management/cancel')
const { closeRegistrationInteractor } = require('../../submodules/domain/tournament/interactors/tournament/state_management/close_registration')
const { finishTournamentInteractor } = require('../../submodules/domain/tournament/interactors/tournament/state_management/finish')
const { startTournamentInteractor } = require('../../submodules/domain/tournament/interactors/tournament/state_management/start')
const { suspendRegistrationInTournamentInteractor } = require('../../submodules/domain/tournament/interactors/tournament/registration/suspend_registration')
const { openRegistrationInteractor } = require('../../submodules/domain/tournament/interactors/tournament/state_management/open_registration')
const { loadTournamentTypesCollectionInteractor, TournamentTypeFilter } = require('../../submodules/domain/tournament/interactors/tournament_type/load_types')
const { isString } = require('../../submodules/domain/core/utils')
const Cron = require('cron-converter')
const { createTournamentInteractor } = require('../../submodules/domain/tournament/interactors/tournament/crud/create')

exports.refundBuyinsForCancelledTournaments = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
    async function cancelConfirmedRegistrationsInTournament(tournamentId) {
        let maxNumberOfCancellationsInOneBatch = 100
        let registrations = await runTransaction(transaction => loadTournamentRegistrationsInteractor(tournamentId, new TournamentRegistrationFilter(RegistrationState.confirmed), undefined, undefined, new TournamentGatewayFactory(transaction)))
        let batches = registrations.data[1].reduce((batches, registration) => {
            if (batches[batches.length - 1].length >= maxNumberOfCancellationsInOneBatch) {
                batches.push([])
            }

            batches[batches.length - 1].push(registration)
            return batches
        }, [[]])

        await Promise.all(batches.map(batch => {
            return runTransaction(async transaction => {
                let gateway = new TournamentGatewayFactory(transaction)
                return Promise.all(batch.map(registration => {
                    return cancelRegistrationInTournamentInteractor(Config.tournamentSystemId, tournamentId, registration.id, gateway, false).catch(e => e)
                })).catch(e => e)
            })
        }))
    }

    await performOperation("refundBuyinsForCancelledTournaments", async () => {
        let tournaments = (await runTransaction(async (transaction) => loadTournamentsInteractor(new TournamentFilter(TournamentState.cancelling), 10, undefined, new TournamentGatewayFactory(transaction)))).data[1]
        await Promise.all(tournaments.map(tournament => cancelConfirmedRegistrationsInTournament(tournament.id).catch(e => e)))
    })
})

exports.sendPayouts = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
    async function sendPayoutsForTournament(tournament) {
        let maxNumberOfPayoutsInOneBatch = 100
        let registrations = await runTransaction(transaction => loadTournamentRegistrationsInteractor(tournament.id, new TournamentRegistrationFilter(RegistrationState.confirmed), undefined, undefined, new TournamentGatewayFactory(transaction)))
        let batches = registrations.data[1].reduce((batches, registration) => {
            if (batches[batches.length - 1].length >= maxNumberOfPayoutsInOneBatch) {
                batches.push([])
            }

            batches[batches.length - 1].push(registration)
            return batches
        }, [[]])

        await Promise.all(batches.map(batch => {
            return runTransaction(async transaction => {
                let gateway = new TournamentGatewayFactory(transaction)
                return Promise.all(batch.map(registration => {
                    return sendPayoutInteractor(tournament.id, registration.player.id, gateway).catch(e => e)
                })).catch(e => e)
            })
        }))
    }

    await performOperation("sendPayouts", async () => {
        let tournaments = (await runTransaction(async (transaction) => loadTournamentsInteractor(new TournamentFilter(TournamentState.sendingPayouts), 20, undefined, new TournamentGatewayFactory(transaction)))).data[1]
        await Promise.all(tournaments.map(tournament => sendPayoutsForTournament(tournament).catch(e => e)))
    })
})

exports.finishTournaments = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
    const timeNeededToSendPayouts = functions.config().process.env === "LOCAL" ? 0 : 60 * 5 * 1000 // five mins in production environment
    const maxNumberOfTournamentsToFinishAtOnce = 250

    await runTransaction(async (transaction) => {
        let tournamentsToFinish = await loadTournamentsInteractor(
            new TournamentFilter(TournamentState.sendingPayouts, undefined, undefined, timeNeededToSendPayouts),
            maxNumberOfTournamentsToFinishAtOnce,
            undefined,
            new TournamentGatewayFactory(transaction))
        await Promise.all(tournamentsToFinish[1].map(tournament => finishTournamentInteractor(tournament.id, new TournamentGatewayFactory(transaction)).catch(e => e)))
    })
})

exports.startOrCancelScheduledTournaments = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
    await performOperation("startOrCancelScheduledTournaments", async () => {
        // load tournaments
        let tournaments = await Promise.all(
            [TournamentState.registrationOpen, TournamentState.registrationClosed]
                .map(state => {
                    return runTransaction(async (transaction) => {
                        return loadTournamentsInteractor(
                            new TournamentFilter(state, TournamentStartType.scheduled, true),
                            undefined,
                            undefined,
                            new TournamentGatewayFactory(transaction))
                    })
                }))

        tournaments = tournaments.flatMap(tournamentsData => {
            return tournamentsData.data[1]
        })

        // run or cancel loaded tournaments
        await Promise.all(tournaments.map(async tournament => {
            try {
                if (tournament.state === TournamentState.registrationOpen) {
                    let response = await runTransaction((transaction) => closeRegistrationInteractor(tournament.id, new TournamentGatewayFactory(transaction)))
                    if (response.error !== undefined) {
                        throw response.error
                    }
                }

                await suspendUnconfirmedRegistrationsInTournament(tournament.id)

                let response = await runTransaction((transaction) => startTournamentInteractor(tournament.id, new TournamentGatewayFactory(transaction)))
                if (response.error !== undefined) {
                    throw response.error
                }
            } catch (error) {
                if (error.code === Config.errorCodes.notEnoughPlayers) {
                    await runTransaction((transaction) => {
                        return startCancellingTournamentInteractor(
                            Config.tournamentSystemId,
                            tournament.id,
                            new TournamentGatewayFactory(transaction)
                        )
                    })
                }
            }
        }))
    })
})

exports.finishTournamentCancellationProcess = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
    const timeNeededToRefundBuyins = functions.config().process.env === "LOCAL" ? 0 : 60 * 5 * 1000 // five mins in production environment
    const maxNumberOfTournamentsToCancelAtOnce = 250

    await runTransaction(async (transaction) => {
        let tournamentsToCancel = await loadTournamentsInteractor(
            new TournamentFilter(TournamentState.cancelling, undefined, undefined, timeNeededToRefundBuyins),
            maxNumberOfTournamentsToCancelAtOnce,
            undefined,
            new TournamentGatewayFactory(transaction))

        await Promise.all(tournamentsToCancel[1].map(tournament => finishCancellingTournamentInteractor(tournament.id, new TournamentGatewayFactory(transaction)).catch(e => e)))
    })
})

exports.openTournamentRegistrationIfNeeded = functions.pubsub.schedule('*/3 * * * *').onRun(async (context) => {
    await performOperation("openTournamentRegistrationIfNeeded", async () => {
        let lastModificationTime = functions.config().process.env === "LOCAL" ? 0 : 125000 // two minutes 5 sec in production environment
        let tournaments = (await runTransaction(async (transaction) => {
            return loadTournamentsInteractor(
                new TournamentFilter(TournamentState.registrationClosed, undefined, undefined, lastModificationTime),
                undefined,
                undefined,
                new TournamentGatewayFactory(transaction))
        })).data[1]

        await Promise.all(tournaments.map(async tournament => {
            try {
                await suspendUnconfirmedRegistrationsInTournament(tournament.id)
                await runTransaction(async (transaction) => {
                    return openRegistrationInteractor(
                        Config.tournamentSystemId,
                        tournament.id,
                        new TournamentGatewayFactory(transaction)
                    )
                })
            } catch (error) {
                // do nothing
            }
        }))
    })
})

exports.createScheduledTournamentsWithAutomatedGameAndTimeSchedule = functions.pubsub.schedule('0 0 * * *').onRun(async (context) => {
    await performOperation("createScheduledTournamentsWithAutomatedGameAndTimeSchedule", async () => {
        let tournamentTypes = (await loadTournamentTypesCollectionInteractor(
            new TournamentTypeFilter(),
            undefined,
            undefined,
            new TournamentGatewayFactory()))[1]

        tournamentTypes = tournamentTypes.filter(type => {
            let gateway = new TournamentGatewayFactory()
            let isTimeScheduleSpecified = isString(type.timeSchedule)
            let isGameAutomated = gateway.gameGateway().isAutomatedGame(type.gameConfig.type, type.gameConfig.config)
            return isTimeScheduleSpecified && isGameAutomated
        })

        console.log(`loaded tournaments: ${tournamentTypes}`)

        await Promise.all(tournamentTypes.map(async type => {
            await runTransaction(async (transaction) => {
                console.log(`started processing of type: ${type}`)
                let today = new Date()
                today.setHours(0, 0, 0, 0)
                let tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

                await Promise.all([new Date(), tomorrow].map(async date => {
                    console.log(`load already created tournaments`)
                    let tournaments = (await loadTournamentsInteractor(
                        new TournamentFilter(TournamentState.registrationOpen, undefined, undefined, undefined, undefined, type.id, date.getTime()),
                        1,
                        undefined,
                        new TournamentGatewayFactory(transaction)))[1]

                    console.log(`loaded ${tournaments.length} tournaments`)

                    if (tournaments.length > 0) { return }

                    let cronInstance = new Cron()
                    cronInstance.fromString(type.timeSchedule)
                    let schedule = cronInstance.schedule(date)
                    let tournamentStartTime = schedule.next().toDate()
                    let endDate = new Date(date.getTime())
                    endDate.setHours(23, 59, 59, 0)
                    let tournamentsSchedule = []
                    let gateway = new TournamentGatewayFactory(transaction)

                    while (tournamentStartTime.getTime() <= endDate.getTime()) {
                        tournamentsSchedule.push(tournamentStartTime)
                        tournamentStartTime = schedule.next().toDate()
                    }

                    console.log(`created time schedule: ${tournamentsSchedule}`)

                    await Promise.all(tournamentsSchedule.map(async startTime => {
                        console.log(`create tournament`)
                        let createdTournament = await createTournamentInteractor(Config.tournamentSystemId, type.id, startTime.getTime(), gateway)
                        console.log(`open registration for tournament`)
                        await openRegistrationInteractor(Config.tournamentSystemId, createdTournament.id, gateway)
                        console.log(`finish tournament creation process`)
                    }))
                }))
            })
        }))
    })
})

// Private 

async function suspendUnconfirmedRegistrationsInTournament(tournamentId) {
    let maxNumberInOneBatch = 200
    let registrations = await runTransaction(transaction => loadTournamentRegistrationsInteractor(tournamentId, new TournamentRegistrationFilter(RegistrationState.reserved), undefined, undefined, new TournamentGatewayFactory(transaction)))
    let batches = registrations.data[1].reduce((batches, registration) => {
        if (batches[batches.length - 1].length >= maxNumberInOneBatch) {
            batches.push([])
        }

        batches[batches.length - 1].push(registration)
        return batches
    }, [[]])

    await Promise.all(batches.map(batch => {
        return runTransaction(async transaction => {
            let gateway = new TournamentGatewayFactory(transaction)
            return Promise.all(batch.map(async registration => {
                return suspendRegistrationInTournamentInteractor(tournamentId, registration.id, gateway).catch(e => e)
            }))
        })
    }))
}
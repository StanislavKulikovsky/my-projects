const functions = require('firebase-functions')
const { runTransaction, performOperation } = require('../../submodules/domain/firebase/firestore')
const { FirestoreGameGateway } = require('../../submodules/domain/firebase/games/quiz/game_gateway')
const { GameState } = require('../../submodules/domain/games/quiz/entities/game')
const { loadGamesInteractor, GamesFilter } = require('../../submodules/domain/games/quiz/interactors/load_games')
const { finishGameInteractor } = require('../../submodules/domain/games/quiz/interactors/finish_game')
const { calculatePayoutsInteractor } = require('../../submodules/domain/tournament/interactors/tournament/payouts/calculate_payouts')
const { loadTournamentsInteractor, TournamentFilter } = require('../../submodules/domain/tournament/interactors/tournament/crud/load_tournaments')
const { TournamentGatewayFactory } = require('../../submodules/domain/firebase/tournament/firebase_tournament')

exports.finishQuizGames = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
    await performOperation("finishQuizGames", async () => {
        let maxNumberOfOperationsInOneBatch = 100
        let gamesToFinish = await runTransaction(transaction => loadGamesInteractor(new GamesFilter(GameState.inProgress, true), undefined, undefined, new FirestoreGameGateway(transaction)))
        let batches = gamesToFinish.data[1].reduce((batches, game) => {
            if (batches[batches.length - 1].length >= maxNumberOfOperationsInOneBatch) {
                batches.push([])
            }

            batches[batches.length - 1].push(game)
            return batches
        }, [[]])

        await Promise.all(batches.map(batch => {
            return runTransaction(async transaction => {
                return Promise.all(batch.map(async game => {
                    try {
                        let tournament = (await loadTournamentsInteractor(new TournamentFilter(undefined, undefined, undefined, undefined, game.id), 1, undefined, new TournamentGatewayFactory(transaction)))[1][0]
                        await finishGameInteractor(game.id, new FirestoreGameGateway(transaction))
                        await calculatePayoutsInteractor(tournament.id, new TournamentGatewayFactory(transaction))
                    } catch (e) {
                        // do nothing
                    }
                }))
            })
        }))
    })
})
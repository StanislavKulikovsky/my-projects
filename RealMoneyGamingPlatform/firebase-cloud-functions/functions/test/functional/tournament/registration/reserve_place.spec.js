// DBUtils should be the first import
const DBUtils = require('../../../utils/db_test_utils')
const { expect, use } = require("chai")
const assertArrays = require('chai-arrays')
use(assertArrays)
const { describe } = require("mocha")
const TestData = require('../../../utils/test_data')
const APIManager = require('../../../utils/api_manager')
const { testCaseSteps } = require('../../../utils/mocha_utils')
const { RegistrationState } = require('../../../../submodules/domain/tournament/entities/registration')
const { DomainError } = require('../../../../submodules/domain/core/error')
const { Config } = require('../../../../submodules/domain/tournament/config')
const { TournamentState } = require('../../../../submodules/domain/tournament/entities/tournament')
const { PaymentTransaction } = require('../../../../submodules/domain/payment/entities/payment_transaction')
const PaymentConfig = require('../../../../submodules/domain/payment/config')

describe('TEST SCENARIO: Reserve place in the tournament', () => {

    describe(`TEST CASE: Check that reservation is created`, () => {
        let stepsOutput = {}


        testCaseSteps(async () => {
            await DBUtils.createUsersProfiles()
            stepsOutput.createTournamentTypeResponse = await APIManager.Tournament.createTournamentType(TestData.user0(), TestData.tournamentTypeSNGCustomManual1USD2Players().asDTO())
            stepsOutput.createTournamentResponse = await APIManager.Tournament.createTournament(TestData.user0(), stepsOutput.createTournamentTypeResponse.body.data.id)
            await APIManager.Tournament.openRegistration(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.reservePlaceResponse = await APIManager.Tournament.reservePlace(TestData.user1(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.registrationsInfoResponse = await APIManager.Tournament.loadRegistrationsInfo(TestData.user1(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.tournamentRegistrationsResponse = await APIManager.Tournament.loadTournamentRegistrations(TestData.user1(), stepsOutput.createTournamentResponse.body.data.id)
        })

        it('Reserve place response SHOULD contain created reservation', () => {
            expect(stepsOutput.reservePlaceResponse.body.data.id).to.be.not.empty.string
            expect(stepsOutput.reservePlaceResponse.body.data.expirationTime).to.be.greaterThan(Date.now())
            expect(stepsOutput.reservePlaceResponse.body.data.player.id).to.be.equal(TestData.user1().id)
            expect(stepsOutput.reservePlaceResponse.body.data.player.name).to.be.equal(TestData.user1().name)
            expect(stepsOutput.reservePlaceResponse.body.data.state).to.be.equal(RegistrationState.reserved)
            expect(stepsOutput.reservePlaceResponse.body.data.paymentId).to.be.undefined
            expect(stepsOutput.reservePlaceResponse.body.data.results).to.be.undefined
        })

        it('Total count of reservations SHOULD be increased by one', () => {
            expect(stepsOutput.registrationsInfoResponse.body.data.reserved).to.be.equal(1)
            expect(stepsOutput.registrationsInfoResponse.body.data.confirmed).to.be.equal(0)
            expect(stepsOutput.registrationsInfoResponse.body.data.cancelled).to.be.equal(0)
            expect(stepsOutput.registrationsInfoResponse.body.data.overdue).to.be.equal(0)
        })

        it('Tournament registrations list SHOULD contain user reservation', () => {
            expect(stepsOutput.tournamentRegistrationsResponse.body.data).to.be.an.array()
            expect(stepsOutput.tournamentRegistrationsResponse.body.data.length).to.be.equal(1)
            expect(stepsOutput.tournamentRegistrationsResponse.body.data[0]).to.be.eql(stepsOutput.reservePlaceResponse.body.data)
        })
    })

    describe(`TEST CASE: Check that reservation is created when user has one cancelled registration in the same tournament`, () => {
        let stepsOutput = {}

        testCaseSteps(async () => {
            await DBUtils.createUsersProfiles()
            stepsOutput.createTournamentTypeResponse = await APIManager.Tournament.createTournamentType(TestData.user0(), TestData.tournamentTypeSNGCustomManual1USD2Players().asDTO())
            stepsOutput.createTournamentResponse = await APIManager.Tournament.createTournament(TestData.user0(), stepsOutput.createTournamentTypeResponse.body.data.id)
            await APIManager.Tournament.openRegistration(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.reservePlaceResponse = await APIManager.Tournament.reservePlace(TestData.user1(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.cancelReservationResponse = await APIManager.Tournament.cancelRegistration(TestData.user1(), stepsOutput.createTournamentResponse.body.data.id, stepsOutput.reservePlaceResponse.body.data.id)
            stepsOutput.reservePlaceResponse = await APIManager.Tournament.reservePlace(TestData.user1(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.registrationsInfoResponse = await APIManager.Tournament.loadRegistrationsInfo(TestData.user1(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.tournamentRegistrationsResponse = await APIManager.Tournament.loadTournamentRegistrations(TestData.user1(), stepsOutput.createTournamentResponse.body.data.id)
        })

        it('Reserve place response SHOULD contain created reservation', () => {
            expect(stepsOutput.reservePlaceResponse.body.data.id).to.be.not.empty.string
            expect(stepsOutput.reservePlaceResponse.body.data.expirationTime).to.be.greaterThan(Date.now())
            expect(stepsOutput.reservePlaceResponse.body.data.player.id).to.be.equal(TestData.user1().id)
            expect(stepsOutput.reservePlaceResponse.body.data.player.name).to.be.equal(TestData.user1().name)
            expect(stepsOutput.reservePlaceResponse.body.data.state).to.be.equal(RegistrationState.reserved)
            expect(stepsOutput.reservePlaceResponse.body.data.paymentId).to.be.undefined
            expect(stepsOutput.reservePlaceResponse.body.data.results).to.be.undefined
        })

        it('Total count of reservations SHOULD be increased by one', () => {
            expect(stepsOutput.registrationsInfoResponse.body.data.reserved).to.be.equal(1)
            expect(stepsOutput.registrationsInfoResponse.body.data.confirmed).to.be.equal(0)
            expect(stepsOutput.registrationsInfoResponse.body.data.cancelled).to.be.equal(1)
            expect(stepsOutput.registrationsInfoResponse.body.data.overdue).to.be.equal(0)
        })

        it('Tournament registrations list SHOULD contain user reservation', () => {
            expect(stepsOutput.tournamentRegistrationsResponse.body.data).to.be.an.array()
            expect(stepsOutput.tournamentRegistrationsResponse.body.data.length).to.be.equal(2)
        })
    })

    describe(`TEST CASE: Check that reservation is not created when owner of the tournament attempts to participate in own tournament`, () => {
        let stepsOutput = {}

        testCaseSteps(async () => {
            await DBUtils.createUsersProfiles()
            stepsOutput.createTournamentTypeResponse = await APIManager.Tournament.createTournamentType(TestData.user0(), TestData.tournamentTypeSNGCustomManual1USD2Players().asDTO())
            stepsOutput.createTournamentResponse = await APIManager.Tournament.createTournament(TestData.user0(), stepsOutput.createTournamentTypeResponse.body.data.id)
            await APIManager.Tournament.openRegistration(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.reservePlaceResponse = await APIManager.Tournament.reservePlace(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.registrationsInfoResponse = await APIManager.Tournament.loadRegistrationsInfo(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.tournamentRegistrationsResponse = await APIManager.Tournament.loadTournamentRegistrations(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
        })

        it('Reserve place response SHOULD contain error', () => {
            expect(stepsOutput.reservePlaceResponse.body.data).to.be.undefined
            expect(stepsOutput.reservePlaceResponse.body.error).to.be.eql(new DomainError(Config.errorDomains.tournament, Config.errorCodes.ownerCanNotParticipateInTheOwnTournament, `Owner can not participate in the own tournament`))
        })
    
        it('Total count of reservations SHOULD stay unchanged', () => {
            expect(stepsOutput.registrationsInfoResponse.body.data.reserved).to.be.equal(0)
            expect(stepsOutput.registrationsInfoResponse.body.data.confirmed).to.be.equal(0)
            expect(stepsOutput.registrationsInfoResponse.body.data.cancelled).to.be.equal(0)
            expect(stepsOutput.registrationsInfoResponse.body.data.overdue).to.be.equal(0)
        })
    
        it('Tournament registrations list SHOULD be empty', () => {
            expect(stepsOutput.tournamentRegistrationsResponse.body.data).to.be.an.empty.array()
        })
    })

    describe(`TEST CASE: Check that new reservation is not created and we return user's active reservation, when user reserve place and he has active reservation`, () => {
        let stepsOutput = {}

        testCaseSteps(async () => {
            await DBUtils.createUsersProfiles()
            stepsOutput.createTournamentTypeResponse = await APIManager.Tournament.createTournamentType(TestData.user0(), TestData.tournamentTypeSNGCustomManual1USD2Players().asDTO())
            stepsOutput.createTournamentResponse = await APIManager.Tournament.createTournament(TestData.user0(), stepsOutput.createTournamentTypeResponse.body.data.id)
            await APIManager.Tournament.openRegistration(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.reservePlaceResponse1 = await APIManager.Tournament.reservePlace(TestData.user1(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.reservePlaceResponse2 = await APIManager.Tournament.reservePlace(TestData.user1(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.registrationsInfoResponse = await APIManager.Tournament.loadRegistrationsInfo(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.tournamentRegistrationsResponse = await APIManager.Tournament.loadTournamentRegistrations(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
        })

        it('Calling reserve place API second time SHOULD return active reservation', () => {
            for (let key in stepsOutput.reservePlaceResponse2.body.data){
                if (key === 'player'){
                    expect(stepsOutput.reservePlaceResponse2.body.data[key].id).to.be.eql(stepsOutput.reservePlaceResponse1.body.data[key].id)
                    expect(stepsOutput.reservePlaceResponse2.body.data[key].name).to.be.eql(stepsOutput.reservePlaceResponse1.body.data[key].name)
                } else {
                    expect(stepsOutput.reservePlaceResponse2.body.data[key]).to.be.eql(stepsOutput.reservePlaceResponse1.body.data[key])
                }
            }
        })

        it('Total count of reservations SHOULD stay unchanged', () => {
            expect(stepsOutput.registrationsInfoResponse.body.data.reserved).to.be.equal(1)
            expect(stepsOutput.registrationsInfoResponse.body.data.confirmed).to.be.equal(0)
            expect(stepsOutput.registrationsInfoResponse.body.data.cancelled).to.be.equal(0)
            expect(stepsOutput.registrationsInfoResponse.body.data.overdue).to.be.equal(0)
        })

        it('Tournament registrations list SHOULD contain two reservations', () => {
            expect(stepsOutput.tournamentRegistrationsResponse.body.data).to.be.an.array()
            expect(stepsOutput.tournamentRegistrationsResponse.body.data.length).to.be.equal(1)
        })
    })

    describe(`TEST CASE: Check that reservation is not created when user tries to reserve more then one place`, () => {
        let stepsOutput = {}

        testCaseSteps(async () => {
            await DBUtils.createUsersProfiles()
            stepsOutput.createTournamentTypeResponse = await APIManager.Tournament.createTournamentType(TestData.user0(), TestData.tournamentTypeSNGCustomManual1USD2Players().asDTO())
            stepsOutput.createTournamentResponse = await APIManager.Tournament.createTournament(TestData.user0(), stepsOutput.createTournamentTypeResponse.body.data.id)
            await APIManager.Tournament.openRegistration(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.reservePlaceResponse2 = await APIManager.Tournament.reservePlace(TestData.user2(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.submitPaymentResponse = await APIManager.Payment.submitTransaction(
                TestData.user2(), 
                new PaymentTransaction(
                undefined,
                TestData.user2().id,
                PaymentConfig.Config.paymentSystemId,
                TestData.tournamentTypeSNGCustomManual1USD2Players().buyin,
                `tournament/${stepsOutput.createTournamentResponse.body.data.id}/registration/${stepsOutput.reservePlaceResponse2.body.data.id}`
            ))
            stepsOutput.confirmReservationResponse = await APIManager.Tournament.confirmReservation(TestData.user2(), stepsOutput.createTournamentResponse.body.data.id, stepsOutput.reservePlaceResponse2.body.data.id, stepsOutput.submitPaymentResponse.body.data.id)
            stepsOutput.reservePlaceResponse2 = await APIManager.Tournament.reservePlace(TestData.user2(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.registrationsInfoResponse = await APIManager.Tournament.loadRegistrationsInfo(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.tournamentRegistrationsResponse = await APIManager.Tournament.loadTournamentRegistrations(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
        })

        it('Reserve place API SHOULD return error when user has confirmed reservation', () => {
            expect(stepsOutput.reservePlaceResponse2.body.error).to.be.eql(new DomainError(Config.errorDomains.tournament, Config.errorCodes.doubleRegistration, `User ${TestData.user2().id} was already registered in the tournament`))
        })

        it('Total count of reservations SHOULD stay unchanged', () => {
            expect(stepsOutput.registrationsInfoResponse.body.data.reserved).to.be.equal(0)
            expect(stepsOutput.registrationsInfoResponse.body.data.confirmed).to.be.equal(1)
            expect(stepsOutput.registrationsInfoResponse.body.data.cancelled).to.be.equal(0)
            expect(stepsOutput.registrationsInfoResponse.body.data.overdue).to.be.equal(0)
        })

        it('Tournament registrations list SHOULD contain two reservations', () => {
            expect(stepsOutput.tournamentRegistrationsResponse.body.data).to.be.an.array()
            expect(stepsOutput.tournamentRegistrationsResponse.body.data.length).to.be.equal(1)
        })
    })

    describe(`TEST CASE: Check that reservation is not created when tournament is full`, () => {
        let stepsOutput = {}

        testCaseSteps(async () => {
            await DBUtils.createUsersProfiles()
            stepsOutput.createTournamentTypeResponse = await APIManager.Tournament.createTournamentType(TestData.user0(), TestData.tournamentTypeSNGCustomManual1USD2Players().asDTO())
            stepsOutput.createTournamentResponse = await APIManager.Tournament.createTournament(TestData.user0(), stepsOutput.createTournamentTypeResponse.body.data.id)
            await APIManager.Tournament.openRegistration(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.reservePlaceResponse = await APIManager.Tournament.reservePlace(TestData.user1(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.reservePlaceResponse = await APIManager.Tournament.reservePlace(TestData.user2(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.reservePlaceResponse = await APIManager.Tournament.reservePlace(TestData.user3(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.registrationsInfoResponse = await APIManager.Tournament.loadRegistrationsInfo(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
            stepsOutput.tournamentRegistrationsResponse = await APIManager.Tournament.loadTournamentRegistrations(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
        })

        it('Should not reserve second place', () => {
            expect(stepsOutput.reservePlaceResponse.body.error).to.be.eql(new DomainError(Config.errorDomains.tournament, Config.errorCodes.wrongTournamentState, `User ${TestData.user3().id} can not be registered in the tournament when tournament in state ${TournamentState.registrationClosed}`))
        })

        it('Total count of reservations SHOULD stay unchanged', () => {
            expect(stepsOutput.registrationsInfoResponse.body.data.reserved).to.be.equal(2)
            expect(stepsOutput.registrationsInfoResponse.body.data.confirmed).to.be.equal(0)
            expect(stepsOutput.registrationsInfoResponse.body.data.cancelled).to.be.equal(0)
            expect(stepsOutput.registrationsInfoResponse.body.data.overdue).to.be.equal(0)
        })

        it('Tournament registrations list SHOULD be empty', () => {
            expect(stepsOutput.tournamentRegistrationsResponse.body.data).to.be.an.array()
            expect(stepsOutput.tournamentRegistrationsResponse.body.data.length).to.be.equal(2)
        })
    })

    afterEach(async () => {
        await DBUtils.clearDB()
    })
})
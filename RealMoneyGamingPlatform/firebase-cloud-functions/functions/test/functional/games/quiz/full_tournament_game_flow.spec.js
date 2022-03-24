// DBUtils should be the first import
const DBUtils = require('../../../utils/db_test_utils')
const { expect, use } = require("chai")
const assertArrays = require('chai-arrays')
use(assertArrays)
const { describe } = require("mocha")
const TestData = require('../../../utils/test_data')
const APIManager = require('../../../utils/api_manager')
const { testCaseSteps } = require('../../../utils/mocha_utils')
const { createTournamentAndOpenRegistrationStep, registerUsersStep } = require('../../../utils/steps_utils')
const FirebaseFunctionsTest = require("firebase-functions-test")({
    projectId: process.env.GCLOUD_PROJECT
})
const TournamentFunctions = require('../../../../src/functions/tournament')
const QuizGameFunctions = require('../../../../src/functions/quiz_game')
const { GameState } = require('../../../../submodules/domain/games/quiz/entities/game')
const { TournamentState } = require('../../../../submodules/domain/tournament/entities/tournament')
const { QuestionComplexity } = require('../../../../submodules/domain/games/quiz/entities/question')
const { TournamentStartType } = require('../../../../submodules/domain/tournament/entities/tournament_type')

describe('TEST SCENARIO: Integration of quiz game with tournament module', () => {
    describe(`TEST CASE: Quiz game tournament with 20 participants is succesfully finished`, () => {
        let stepsOutput = {}
        let players = TestData.users(1, 4)

        testCaseSteps(async () => {
            const gameDuration = 10000

            await DBUtils.createUsersProfiles(players.length)
            await DBUtils.createQuizConfigs()
            await APIManager.QuizGame.addQuestion(TestData.user0(), TestData.quizQuestion3().asDTO())
            stepsOutput.createQuestion0Response = await APIManager.QuizGame.addQuestion(TestData.user0(), TestData.quizQuestion3().asDTO())
            stepsOutput.createQuestion1Response = await APIManager.QuizGame.addQuestion(TestData.user0(), TestData.quizQuestion1().asDTO())
            stepsOutput.createQuestion2Response = await APIManager.QuizGame.addQuestion(TestData.user0(), TestData.quizQuestion2().asDTO())
            await createTournamentAndOpenRegistrationStep(stepsOutput, TestData.tournamentTypeQuizGame1USDCustomNumberOfPlayers(TournamentStartType.sng, players.length, players.length, [QuestionComplexity.hard, QuestionComplexity.hard], [TestData.quizTopics[0], TestData.quizTopics[1]], gameDuration))
            stepsOutput.allQuestionsAfterGameWasCreated = await APIManager.QuizGame.loadAllQuestions(TestData.user0())
            stepsOutput.gameListAfterTournamentCreation = await APIManager.QuizGame.loadGames(TestData.user0())
            await registerUsersStep(stepsOutput, players, 1)
            stepsOutput.gameListAfterTournamentHasStarted = await APIManager.QuizGame.loadGames(TestData.user0())
            stepsOutput.gameQuestionRightPlayer = await APIManager.QuizGame.loadQuestion(players[0],stepsOutput.gameListAfterTournamentCreation.body.data.games[0].id, stepsOutput.createQuestion1Response.body.data.id)
            stepsOutput.gameQuestionWrongQuestionId = await APIManager.QuizGame.loadQuestion(players[0],stepsOutput.gameListAfterTournamentCreation.body.data.games[0].id, stepsOutput.createQuestion0Response.body.data.id)
            stepsOutput.gameQuestionWrongPlayer = await APIManager.QuizGame.loadQuestion(TestData.user(999),stepsOutput.gameListAfterTournamentCreation.body.data.games[0].id, stepsOutput.createQuestion1Response.body.data.id)
            stepsOutput.loadedQuestions = stepsOutput.gameListAfterTournamentCreation.body.data.games[0].questionIds.map(id => {
                return stepsOutput.allQuestionsAfterGameWasCreated.body.data.find(question => question.id === id)
            })
            
            // Submit answers
            let startSubmitTime = Date.now()
            for (let question of [stepsOutput.createQuestion1Response.body.data, stepsOutput.createQuestion2Response.body.data]) {
                for (let i = players.length - 1; i >= 0; i--) {
                    /* eslint-disable no-await-in-loop */
                    const gameId = stepsOutput.gameListAfterTournamentCreation.body.data.games[0].id
                    await APIManager.QuizGame.submitAnswer(players[i], gameId, question.id, i === players.length - 1 ? ["wrong answer"] : question.rightAnswers)
                    /* eslint-enable no-await-in-loop */
                }
            }

            let timeTillGameEnd = gameDuration - (Date.now() - startSubmitTime)
            if (timeTillGameEnd > 0) {
                await new Promise((resolve) => { setTimeout(() => resolve(), timeTillGameEnd) })
            }
            let finishQuizGamesFunction = FirebaseFunctionsTest.wrap(QuizGameFunctions.finishQuizGames)
            await finishQuizGamesFunction()
            let sendPayoutsFunction = FirebaseFunctionsTest.wrap(TournamentFunctions.sendPayouts)
            await sendPayoutsFunction()
            let finishTournamentsFunction = FirebaseFunctionsTest.wrap(TournamentFunctions.finishTournaments)
            await finishTournamentsFunction()
            stepsOutput.gameListAfterTournamentHasFinished = await APIManager.QuizGame.loadGames(TestData.user0())
            stepsOutput.tournamentAfterItWasFinished = await APIManager.Tournament.loadTournament(TestData.user0(), stepsOutput.createTournamentResponse.body.data.id)
        })

        it('Should load right questions in correct order', () => {
            result = [
                stepsOutput.loadedQuestions[0].topic + stepsOutput.loadedQuestions[0].complexity,
                stepsOutput.loadedQuestions[1].topic + stepsOutput.loadedQuestions[1].complexity
            ]
            expectedResult = [TestData.quizTopics[0] + QuestionComplexity.hard, TestData.quizTopics[1] + QuestionComplexity.hard]
            expect(result.length).to.be.equal(2)
            expectedResult.forEach((val, i) => {
                expect(result[i]).to.be.equal(val)
            })
        })

        it('Only game partycipants can get questions and only questions that used in this game', () => {
            expect(stepsOutput.gameQuestionRightPlayer.body.data.topic + stepsOutput.gameQuestionRightPlayer.body.data.complexity).to.be.equal(TestData.quizTopics[0] + QuestionComplexity.hard)
            expect(stepsOutput.gameQuestionWrongPlayer.body.error.message).to.be.equal('Only game partycipants can get questions')
            expect(stepsOutput.gameQuestionWrongQuestionId.body.error.message).to.be.equal('The question is not from this game')
        })

        it('Should update usageCount in used questions after game was created', () => {
            let questions = stepsOutput.allQuestionsAfterGameWasCreated.body.data
            expect(questions.length).to.be.greaterThan(0)
            for (let question of questions) {
                expect(question.usageCount).to.be.equal(1)
            }
        })

        it('Should have correct game state at all stages', () => {
            expect(stepsOutput.gameListAfterTournamentCreation.body.data.games[0].state).to.be.equal(GameState.readyToStart)
            expect(stepsOutput.gameListAfterTournamentHasStarted.body.data.games[0].state).to.be.equal(GameState.inProgress)
            expect(stepsOutput.gameListAfterTournamentHasFinished.body.data.games[0].state).to.be.equal(GameState.finished)
        })

        it('Tournament should be finished', () => {
            expect(stepsOutput.tournamentAfterItWasFinished.body.data.state).to.be.equal(TournamentState.finished)
        })

        it('Tournament results SHOULD be valid', () => {
            let tournament = stepsOutput.tournamentAfterItWasFinished.body.data
            expect(tournament.results.length).to.be.equal(players.length)
            players.forEach((player, index) => {
                let playerResults = tournament.results.find(results => results.playerId === player.id)
                if (index === players.length - 1) {
                    expect(playerResults.place).to.be.equal(players.length)
                } else {
                    expect(playerResults.place).to.be.equal(players.length - index - 1)
                }
            })
        })
    })

    afterEach(async () => {
        await DBUtils.clearDB()
    })
})
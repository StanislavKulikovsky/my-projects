// DBUtils should be the first import
const DBUtils = require('../../../utils/db_test_utils')
const { expect, use } = require("chai")
const assertArrays = require('chai-arrays')
use(assertArrays)
const { describe } = require("mocha")
const TestData = require('../../../utils/test_data')
const APIManager = require('../../../utils/api_manager')
const { testCaseSteps } = require('../../../utils/mocha_utils')

describe('TEST SCENARIO: Check the correctness of answers', () => {

    describe(`TEST CASE: Check single string answer`, () => {

        let question1 = TestData.quizQuestion1()
        
        it('Should accept answer that is written in any case (e.g. test, TEST, tEST)', () => {
            expect(question1.isRightAnswers(['test 1'])).to.be.equal(true)
            expect(question1.isRightAnswers(['TeSt 1'])).to.be.equal(true)
        })

        it('Should not accept wrong answer', () => {
            expect(question1.isRightAnswers(['fake answer'])).to.be.equal(false)
        })
    })

    describe(`TEST CASE: Check multiple string answers`, () => {

        let question2 = TestData.quizQuestion2()
        
        it('Should accept answers recieved in any order', () => {
            expect(question2.isRightAnswers([question2.listOfAnswersToChooseFrom[0],question2.listOfAnswersToChooseFrom[1]])).to.be.equal(true)
            expect(question2.isRightAnswers([question2.listOfAnswersToChooseFrom[1],question2.listOfAnswersToChooseFrom[0]])).to.be.equal(true)
        })

        it('Should not accept wrong number of answers', () => {
            expect(question2.isRightAnswers(question2.listOfAnswersToChooseFrom)).to.be.equal(false)
        })

        it('Should not accept answers if one of it is wrong', () => {
            expect(question2.isRightAnswers([question2.listOfAnswersToChooseFrom[0],question2.listOfAnswersToChooseFrom[2]])).to.be.equal(false)
        })

        it('Should not accept empty array of answers', () => {
            expect(question2.isRightAnswers([])).to.be.equal(false)
        })
    })

    describe(`TEST CASE: Check single number answer`, () => {

        let question3 = TestData.quizQuestion3()

        it('Should accept exact value in any format (e.g.   \'41,5\',\'  41.50 \')', () => {
            expect(question3.isRightAnswers(['   41.50 '])).to.be.equal(true)
            expect(question3.isRightAnswers(['41,5'])).to.be.equal(true)
        })

        it('Should accept any value from DELTA-range', () => {
            expect(question3.isRightAnswers(['41.49'])).to.be.equal(true)
            expect(question3.isRightAnswers(['41.495'])).to.be.equal(true)
            expect(question3.isRightAnswers(['41.51'])).to.be.equal(true)
            expect(question3.isRightAnswers(['41.505'])).to.be.equal(true)
        })

        it('Should not accept value out of DELTA-range', () => {
            expect(question3.isRightAnswers(['41.485'])).to.be.equal(false)
            expect(question3.isRightAnswers(['41.515'])).to.be.equal(false)
        })

        it('Should not accept empty string, or not numeric string', () => {
            expect(question3.isRightAnswers([41.5])).to.be.equal(false)
            expect(question3.isRightAnswers([NaN])).to.be.equal(false)
            expect(question3.isRightAnswers([null])).to.be.equal(false)
            expect(question3.isRightAnswers([undefined])).to.be.equal(false)
            expect(question3.isRightAnswers(['    '])).to.be.equal(false)
            expect(question3.isRightAnswers([''])).to.be.equal(false)
            expect(question3.isRightAnswers(['41.5asda'])).to.be.equal(false)
        })
    })
})
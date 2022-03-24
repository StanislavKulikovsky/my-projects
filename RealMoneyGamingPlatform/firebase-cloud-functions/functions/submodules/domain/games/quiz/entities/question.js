const { DomainError } = require("../../../core/error")
const { Config } = require("../config")
const Utils = require("../../../core/utils")

const QuestionComplexity = Object.freeze({
    easy: "easy",
    medium: "medium",
    hard: "hard",
    allValues: function () {
        return [
            this.easy,
            this.medium,
            this.hard
        ]
    }
})

const DELTA = 0.01

class Question {
    constructor(id, questionHTML, complexity, topic, rightAnswers, listOfAnswersToChooseFrom, usageCount) {
        this.id = id
        this.questionHTML = questionHTML
        this.complexity = complexity
        this.topic = topic
        this.rightAnswers = rightAnswers
        this.listOfAnswersToChooseFrom = listOfAnswersToChooseFrom
        this.usageCount = usageCount
    }

    static createFromDTO(data) {
        return new Question(data.id, data.questionHTML, data.complexity, data.topic, data.rightAnswers, data.listOfAnswersToChooseFrom, data.usageCount)
    }

    asDTO() {
        return {
            id: this.id,
            questionHTML: this.questionHTML,
            complexity: this.complexity,
            topic: this.topic,
            rightAnswers: this.rightAnswers,
            listOfAnswersToChooseFrom: this.listOfAnswersToChooseFrom,
            usageCount: this.usageCount
        }
    }

    setDataFrom(question) {
        this.id = question.id
        this.questionHTML = question.questionHTML
        this.complexity = question.complexity
        this.topic = question.topic
        this.rightAnswers = question.rightAnswers
        this.listOfAnswersToChooseFrom = question.listOfAnswersToChooseFrom
        this.usageCount = question.usageCount
    }

    copy() {
        let copy = new Question()
        copy.setDataFrom(this)
        return copy
    }

    isRightAnswers(answers) {
        if (answers.length === 0) {return false}
        
        let allAnswersAreCorrect = true
        let isQuestionWithAnswersList = this.listOfAnswersToChooseFrom !== undefined

        if (isQuestionWithAnswersList){
            allAnswersAreCorrect = this.checkAnswersFromList(answers)
        } else {
            let answer = answers[0]
            if (!Utils.isString(answer)) {return false}

            let rightAnswer = this.rightAnswers[0]

            if (Utils.isNumericString(rightAnswer)){
                allAnswersAreCorrect = this.checkSingleNumberAnswer(answer, rightAnswer)
            } else {
                allAnswersAreCorrect = this.checkSingleStringAnswer(answer, rightAnswer)
            }
        }

        return allAnswersAreCorrect
    }

    checkAnswersFromList(answers){
        if (answers.length !== this.rightAnswers.length) { return false }
        for (let answer of answers) {
            if (!this.rightAnswers.includes(answer)) {
                return false
            }
        }
        return true
    }

    checkSingleStringAnswer(answer, rightAnswer){
        let rightAnswerLowerCase = rightAnswer.trim().toLowerCase()
        let answerLowerCase = answer.trim().toLowerCase()
        if (answerLowerCase === rightAnswerLowerCase){
            return true
        }
        return false
    }

    checkSingleNumberAnswer(answer, rightAnswer){
        
        let answerNumber = Utils.getFloat(answer)
        let rightAnswersNumber = Utils.getFloat(rightAnswer)

        if (Utils.isNumber(answerNumber)){
            let isInRange = answerNumber >= (rightAnswersNumber - DELTA) && answerNumber <= (rightAnswersNumber + DELTA)
            if (isInRange){
                return true
            }
        } 
        return false
    }

    score() {
        switch (this.complexity) {
            case QuestionComplexity.easy:
                return 100
            case QuestionComplexity.medium:
                return 200
            case QuestionComplexity.hard:
                return 300
            default:
                throw new DomainError(Config.errorDomains.quizGame, Config.errorCodes.corruptedData, `Unknown complexity ${this.complexity}`)
        }
    }

    // Validation

    static validateQuestionHTML(questionHTML) {
        if (!Utils.isString(questionHTML) || questionHTML.length === 0) {
            throw new DomainError(Config.errorDomains.quizGame, Config.errorCodes.corruptedData, `Invalid question HTML`)
        }
    }

    static validateComplexity(complexity) {
        if (!QuestionComplexity.allValues().includes(complexity)) {
            throw new DomainError(Config.errorDomains.quizGame, Config.errorCodes.corruptedData, `Invalid question complexity`)
        }
    }

    static validateTopic(topic) {
        let isNotStringOrEmptyString = !Utils.isString(topic) || Utils.isEmptyString(topic)
        if (isNotStringOrEmptyString) {
            throw new DomainError(Config.errorDomains.quizGame, Config.errorCodes.corruptedData, `Invalid question topic`)
        }
    }

    static validateRightAnswers(rightAnswers, list) {
        if (!Array.isArray(rightAnswers) || rightAnswers.length === 0) {
            throw new DomainError(Config.errorDomains.quizGame, Config.errorCodes.corruptedData, `Invalid right answer`)
        }

        for (let answer of rightAnswers) {
            if (!Utils.isString(answer) || answer.length === 0) {
                throw new DomainError(Config.errorDomains.quizGame, Config.errorCodes.corruptedData, `Invalid right answer`)
            }
        }

        if (list === undefined && rightAnswers.length > 1) {
            throw new DomainError(Config.errorDomains.quizGame, Config.errorCodes.corruptedData, `There can be only one answer without a list of suggested answers`)
        }

        if (list !== undefined) {
            Question.validateThatRightAnswersExistInTheAnswersList(list, rightAnswers)
        }
    }

    static validateListOfAnswersToChooseFrom(listOfAnswersToChooseFrom, rightAnswers) {
        if (listOfAnswersToChooseFrom === undefined) { return }

        if (!Array.isArray(listOfAnswersToChooseFrom)) {
            throw new DomainError(Config.errorDomains.quizGame, Config.errorCodes.corruptedData, `Invalid list of answers`)
        } else {
            let invalidAnswer = listOfAnswersToChooseFrom.find(answer => !Utils.isString(answer) || answer.length === 0)
            if (invalidAnswer !== undefined) {
                throw new DomainError(Config.errorDomains.quizGame, Config.errorCodes.corruptedData, `Invalid list of answers`)
            }
        }

        if (rightAnswers !== undefined) {
            Question.validateThatRightAnswersExistInTheAnswersList(listOfAnswersToChooseFrom, rightAnswers)
        }
    }

    static validateThatRightAnswersExistInTheAnswersList(list, rightAnswers) {
        for (let rightAnswer of rightAnswers) {
            if (!list.includes(rightAnswer)) {
                throw new DomainError(Config.errorDomains.quizGame, Config.errorCodes.corruptedData, `Right answer should be part of proposed answers`)
            }
        }
    }

    static validateUsageCount(usageCount) {
        if (!Utils.isNumber(usageCount) || usageCount < 0) {
            throw new DomainError(Config.errorDomains.quizGame, Config.errorCodes.corruptedData, `Usage count should be positive number`)
        }
    }

    validate() {
        Question.validateQuestionHTML(this.questionHTML)
        Question.validateRightAnswers(this.rightAnswers, this.listOfAnswersToChooseFrom)
        Question.validateListOfAnswersToChooseFrom(this.listOfAnswersToChooseFrom, this.rightAnswers)
        Question.validateComplexity(this.complexity)
        Question.validateTopic(this.topic)
        Question.validateUsageCount(this.usageCount)
    }
}

exports.Question = Question
exports.QuestionComplexity = QuestionComplexity
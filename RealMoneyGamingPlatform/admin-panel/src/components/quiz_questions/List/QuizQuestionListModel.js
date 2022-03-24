import { useRef, useState } from 'react'
import { Question } from '../../../submodules/domain/games/quiz/entities/question'
import { loadQuestionsInteractor, QuestionFilter } from '../../../submodules/domain/games/quiz/interactors/load_questions'

export default function useQuizQuestionListModel(gameGateway) {
    const [editingQuestion, setEditingQuestion] = useState()
    const editingQuestionCallback = useRef()
    const defaultFilter = new QuestionFilter()

    async function loadQuestions(nextPageToken, filter) {
        return loadQuestionsInteractor(filter, 10, nextPageToken, gameGateway)
    }

    function questionActionsBuilder(question) {
        return [
            {
                title: 'Edit',
                onClick: () => setEditingQuestion(question)
            }
        ]
    }

    function addNewQuestion(callback) {
        editingQuestionCallback.current = callback
        setEditingQuestion(new Question())
    }

    function finishQuestionEditing(savedQuestion) {
        setEditingQuestion(undefined)
        
        if (editingQuestionCallback.current !== undefined) {
            editingQuestionCallback.current(savedQuestion)
            editingQuestionCallback.current = undefined
        }
    }

    return [loadQuestions, defaultFilter, editingQuestion, finishQuestionEditing, addNewQuestion, questionActionsBuilder]
}
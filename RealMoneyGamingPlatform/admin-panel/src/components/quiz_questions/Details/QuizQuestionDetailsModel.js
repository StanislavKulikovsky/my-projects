import { useRef, useState } from "react"
import { addQuestionInteractor } from "../../../submodules/domain/games/quiz/interactors/add_question"
import { updateQuestionInteractor } from "../../../submodules/domain/games/quiz/interactors/update_question"
import { useUID } from "../../../firebase/AuthProvider"
import useEditableListWithUniqueKeys from "../../common/Model/useEditableListWithUniqueKeys"
import { loadQuizGameTopicsInteractor } from "../../../submodules/domain/games/quiz/interactors/load_quiz_game_topics"
import useCollection from "../../common/Model/useCollection"

export default function useQuizQuestionDetailsModel(quizQuestion, gameGateway) {
    const [suggestedAnswers, addNewSuggestedAnswer, keyForSuggestedAnswer, removeSuggestedAnswer] = useEditableListWithUniqueKeys(
        () => listOfAnswersToChooseFromSource.current,
        (newList) => { listOfAnswersToChooseFromSource.current = newList }
    )
    const [rightAnswers, addNewRightAnswer, keyForRightAnswer, removeRightAnswer] = useEditableListWithUniqueKeys(
        () => rightAnswersSource.current,
        (newList) => { rightAnswersSource.current = newList }
    )
    const rightAnswersSource = useRef(quizQuestion.rightAnswers !== undefined ? quizQuestion.rightAnswers.map(answer => {return {text:answer};}) : [])
    const listOfAnswersToChooseFromSource = useRef(quizQuestion.listOfAnswersToChooseFrom !== undefined ? quizQuestion.listOfAnswersToChooseFrom.map(answer => {return {text:answer};}) : [])
    const draftQuizQuestion = useRef(quizQuestion.copy())
    const [isLoading, setIsLoading] = useState(false)
    const uid = useUID()

    async function saveChanges() {
        if (isLoading) { return }

        setIsLoading(true)

        draftQuizQuestion.current.rightAnswers = rightAnswersSource.current.map(answer => answer.text)
        draftQuizQuestion.current.listOfAnswersToChooseFrom = listOfAnswersToChooseFromSource.current.map(answer => answer.text)

        if (draftQuizQuestion.current.listOfAnswersToChooseFrom.length === 0) draftQuizQuestion.current.listOfAnswersToChooseFrom = undefined

        try {
            if (quizQuestion.id !== null && quizQuestion.id !== undefined) {
                draftQuizQuestion.current = await updateQuestionInteractor(uid, draftQuizQuestion.current, gameGateway)
            } else {
                draftQuizQuestion.current.usageCount = 0
                draftQuizQuestion.current = await addQuestionInteractor(uid, draftQuizQuestion.current, gameGateway)
            }
            quizQuestion.setDataFrom(draftQuizQuestion.current)
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }

        return draftQuizQuestion.current
    }

    const topics = useCollection(() => loadQuizGameTopicsInteractor(gameGateway))

    return [draftQuizQuestion.current, saveChanges, isLoading, suggestedAnswers, addNewSuggestedAnswer, keyForSuggestedAnswer, removeSuggestedAnswer, rightAnswers, addNewRightAnswer, keyForRightAnswer, removeRightAnswer, topics]
}
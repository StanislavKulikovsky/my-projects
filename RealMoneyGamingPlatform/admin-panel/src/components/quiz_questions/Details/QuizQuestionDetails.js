import React from 'react'
import { Button, Form } from 'react-bootstrap'
import DocumentDetailsModalContainer from '../../common/DocumentDetails/DocumentDetailsModalContainer'
import useQuizQuestionDetailsModel from './QuizQuestionDetailsModel'
import { QuestionComplexity } from '../../../submodules/domain/games/quiz/entities/question'

function QuizQuestionDetails({ quizQuestion, gameGateway, closeAction }) {
    let [
        draftQuizQuestion,
        saveChanges,
        isLoading,
        suggestedAnswers,
        addNewSuggestedAnswer,
        keyForSuggestedAnswer,
        removeSuggestedAnswer,
        rightAnswers,
        addNewRightAnswer,
        keyForRightAnswer,
        removeRightAnswer, 
        topics
    ] = useQuizQuestionDetailsModel(quizQuestion, gameGateway)

    return (
        <DocumentDetailsModalContainer
            cancelAction={() => closeAction()}
            saveAction={() => {
                return saveChanges().then(closeAction)
                    .catch(error => window.alert(error.toString()))
            }}>
            <Form>
                <div>
                    <Form.Group controlId="formQuizQuestionComplexity">
                        <Form.Label>Complexity</Form.Label>
                        <Form.Control
                            as="select"
                            defaultValue={draftQuizQuestion.complexity !== undefined ? draftQuizQuestion.complexity : ""}
                            onChange={(event) => draftQuizQuestion.complexity = event.target.value}
                            custom>

                            <option disabled value=""></option>
                            {QuestionComplexity.allValues().map(type => {
                                return <option
                                    value={type}
                                    key={type}>
                                    {type}
                                </option>
                            })}

                        </Form.Control>

                    </Form.Group>
                    <Form.Group controlId="formQuizQuestionTopic">
                        <Form.Label>Topic</Form.Label>
                        <Form.Control
                            as="select"
                            defaultValue={draftQuizQuestion.topic !== undefined ? draftQuizQuestion.topic : ""}
                            onChange={(event) => draftQuizQuestion.topic = event.target.value}
                            custom>

                            {draftQuizQuestion.topic === undefined && <option disabled value=""></option>}
                            {topics.map(topic => {
                                return <option
                                    value={topic}
                                    key={topic}>
                                    {topic}
                                </option>
                            })}

                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formQuizQuestionQuestionHTML">
                        <Form.Label>Question HTML</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={draftQuizQuestion.questionHTML !== undefined ? draftQuizQuestion.questionHTML : ""}
                            placeholder="Question HTML"
                            onChange={(event) => draftQuizQuestion.questionHTML = event.target.value}>
                        </Form.Control>
                    </Form.Group>
                    <div className='container border p-4 mb-4 bg-light'>
                        <div className='row'>
                            {"Suggested answers"}
                        </div>
                        {
                            suggestedAnswers().map((answer, index) =>
                                <div key={keyForSuggestedAnswer(answer)} className='row border p-4 mb-4'>
                                    <div className='col-1'>{`#${index}`}</div>
                                    <div className='col-8'>
                                        <Form.Group controlId="formQuizQuestionSuggestedAnswers">
                                            <Form.Control
                                                type="text"
                                                defaultValue={answer.text !== undefined ? answer.text : ""}
                                                placeholder="Type answer here"
                                                onChange={(event) => {
                                                    answer.text = event.target.value
                                                }}>
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-3">
                                        <Button
                                            variant='outline-danger'
                                            onClick={() => removeSuggestedAnswer(answer)}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )
                        }

                        <Button
                            variant='outline-secondary'
                            className="w-100"
                            onClick={addNewSuggestedAnswer}>
                            Add new suggested answer
                        </Button>
                    </div>

                    <div className='container border p-4 mb-4 bg-light'>
                        <div className='row'>
                            {"Right answers"}
                        </div>
                        {
                            rightAnswers().map((answer, index) =>
                                <div key={keyForRightAnswer(answer)} className='row border p-4 mb-4'>
                                    <div className='col-1'>{`#${index}`}</div>
                                    <div className='col-8'>
                                        <Form.Group controlId="formQuizQuestionRightAnswers">
                                            <Form.Control
                                                type="text"
                                                defaultValue={answer.text !== undefined ? answer.text : ""}
                                                placeholder="Type answer here"
                                                onChange={(event) => {
                                                    answer.text = event.target.value
                                                }}>
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col-3">
                                        <Button
                                            variant='outline-danger'
                                            onClick={() => removeRightAnswer(answer)}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )
                        }

                        <Button
                            variant='outline-secondary'
                            className="w-100"
                            onClick={addNewRightAnswer}>
                            Add new right answer
                        </Button>
                    </div>
                </div>
            </Form>

        </DocumentDetailsModalContainer>
    )
}

export default QuizQuestionDetails
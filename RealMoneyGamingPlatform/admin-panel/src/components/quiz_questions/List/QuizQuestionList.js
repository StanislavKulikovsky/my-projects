import React from 'react'
import QuizQuestionFilter from '../Filter/QuizQuestionFilter'
import QuizQuestionDetails from '../Details/QuizQuestionDetails'
import DocumentList from '../../common/DocumentList/DocumentList'
import useQuizQuestionListModel from './QuizQuestionListModel'

function QuizQuestionList({gameGateway}) {
  const [
    loadQuestions, 
    defaultFilter, 
    editingQuestion, 
    finishQuestionEditing, 
    addNewQuestion, 
    questionActionsBuilder
  ] = useQuizQuestionListModel(gameGateway)

  return (
    <div>
      <DocumentList
        loadCollection={loadQuestions}
        defaultFilter={defaultFilter}
        filterViewBuider={(changeFilter, filter) => {
          return <QuizQuestionFilter onFilterChange={changeFilter} currentFilter={filter} />
        }}
        cellActionsBuilder={questionActionsBuilder}
        addNewElement={addNewQuestion}
      />
      {
        editingQuestion !== undefined &&
        <QuizQuestionDetails
        quizQuestion={editingQuestion}
        gameGateway={gameGateway}
        closeAction={finishQuestionEditing}
        />
      }
    </div>
  )
}

export default QuizQuestionList

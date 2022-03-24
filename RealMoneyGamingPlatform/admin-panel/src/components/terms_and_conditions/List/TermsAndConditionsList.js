import React from 'react'
import useTermsAndConditionsListModel from './TermsAndConditionsListModel'
import InfiniteScroll from 'react-infinite-scroll-component'
import TermsAndConditionsDetails from '../Details/TermsAndConditionsDetails'
import { Alert, Button } from 'react-bootstrap'

function TermsAndConditionsList({tncGateway, actualTncVersionCallback, setActualTncVersionCallback}) {

  const model = useTermsAndConditionsListModel(actualTncVersionCallback, setActualTncVersionCallback, tncGateway)

  return (
    <div>
      {
        model.errorMessage !== undefined && 
        (()=>{alert(model.errorMessage) 
        model.setErrorMessage()})()
      }

      <InfiniteScroll
        dataLength={model.elements.length}
        next={model.loadMore}
        hasMore={model.hasMore}
        loader={<div> Loading items... </div>}>
        {model.elements}
      </InfiniteScroll>

      {
        model.addNewTermsAndConditions !== undefined &&
        <Button
          className="floating-button"
          onClick={model.addNewTermsAndConditions}>
          <em>New</em>
        </Button>
      }

      {
        model.shouldNotifyUser &&
        <Alert className='alert-container' variant="danger" onClose={model.declineUpdate} dismissible>
          <div className="d-flex justify-content-end">
            Content is outdated.
            <Button onClick={() => {
              model.markDataAsUpToDate()
              model.reset()
            }}
            variant="outline-success">
              Refresh!
            </Button>
          </div>
        </Alert>
      }

      {
        model.creatingTermsAndConditions !== undefined &&
        <TermsAndConditionsDetails
        tnc={model.creatingTermsAndConditions}
        tncGateway={tncGateway}
        closeAction={model.finishTermsAndConditionsCreating}
        />
      }
    </div>
  )
}

export default TermsAndConditionsList

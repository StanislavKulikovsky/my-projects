import React from 'react'
import useTournamentListModel from './TournamentListModel'
import InfiniteScroll from 'react-infinite-scroll-component'
import TournamentDetails from '../Details/TournamentDetails'
import { Alert, Button } from 'react-bootstrap'

function TournamentList({tournamentGateway, filterCallback}) {

  const model = useTournamentListModel(tournamentGateway, filterCallback)

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
        model.addNewTournament !== undefined &&
        <Button
          className="floating-button"
          onClick={model.addNewTournament}>
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
        model.creatingTournament !== undefined &&
        <TournamentDetails
        tournament={model.creatingTournament}
        tournamentGateway={tournamentGateway}
        closeAction={model.finishTournamentCreating}
        />
      }
    </div>
  )
}

export default TournamentList

import React from 'react'
import TournamentFilter from './Filter/TournamentFilter'
import TournamentList from './List/TournamentList'
import useTournamentModel from './TournamentModel'

function Tournament({tournamentGateway}) {
  const model = useTournamentModel()

  return (
    <div>
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-2 ml-5">
            <TournamentFilter changeFilterCallback={model.changeFilterCallback} tournamentGateway={tournamentGateway}/>
          </div>
          <div className="col-8">
            <TournamentList filterCallback={model.filterCallback} tournamentGateway={tournamentGateway}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tournament

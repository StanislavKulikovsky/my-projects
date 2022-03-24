import useTournamentListCellModel from "./TournamentListCellModel"
import React from "react"
import { Button } from "react-bootstrap"
import TournamentDetails from "../../Details/TournamentDetails"

function TournamentListCell({ tournament, tournamentGateway, uid }) {
    const model = useTournamentListCellModel(tournament, tournamentGateway, uid)

    return (
        <div className="container">
            {
                model.errorMessage !== undefined && 
                (()=>{alert(model.errorMessage) 
                model.setErrorMessage()})()
            }

            <div className={`row border bg-light py-2 my-2`}>
                <div className="col-10">
                    {model.viewData.map((el)=>el)}
                </div>

                <div className="col-2">
                    <Button
                    key={tournament.id + 'Edit'}
                    variant='outline-secondary'
                    className="w-100 mb-2"
                    onClick={model.startTournamentEditing}>
                        Edit
                    </Button>

                    {
                        model.canBeCancelled &&
                        <Button
                        key={tournament.id + 'Cancel'}
                        variant='outline-danger'
                        className="w-100 mb-2"
                        onClick={model.startTournamentCancelling}>
                        {model.cancelButtonText}
                        </Button>
                    }
                </div>
            </div>

            {
                model.isEditing &&
                <TournamentDetails
                tournament={model.currentTournament}
                tournamentGateway={tournamentGateway}
                closeAction={model.finishTournamentEditing}
                />
            }
        </div>
    )
}

export default TournamentListCell
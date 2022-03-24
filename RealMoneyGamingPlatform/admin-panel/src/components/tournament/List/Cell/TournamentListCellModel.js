import React, { useEffect, useState } from "react"
import { TournamentState } from "../../../../submodules/domain/tournament/entities/tournament"
import { startCancellingTournamentInteractor } from "../../../../submodules/domain/tournament/interactors/tournament/state_management/cancel"
import { Property } from '../../../common/DocumentList/DocumentListCell'


export default function useTournamentListCellModel(originalTournament, tournamentGateway, uid) {
    const [viewData, setViewData] = useState([])
    const [currentTournament, setTournament] = useState(originalTournament)
    const [isEditing, setIsEditing] = useState(false)
    const [canBeCancelled, setCanBeCancelled] = useState(checkCanBeCancelled(originalTournament))
    const [cancelButtonText, setCancelButtonText] = useState('Cancel')
    const [errorMessage, setErrorMessage] = useState()

    function createViewDataContent(element) {
        return [
            <Property key={element.id + 'id'} title={'id'} value={element.id}/> ,
            <Property key={element.id + 'state'} title={'state'} value={element.state}/>,
            <Property key={element.id + 'startTime'} title={'startTime'} value={element.startTime}/>,
            <Property key={element.id + 'createdAt'} title={'createdAt'} value={element.createdAt}/>,
            <Property key={element.id + 'modifiedAt'} title={'modifiedAt'} value={element.modifiedAt}/>,
            <Property key={element.id + 'ownerId'} title={'ownerId'} value={element.ownerId}/>,
            <Property key={element.id + 'gameId'} title={'gameId'} value={element.gameId}/>,
            <Property key={element.id + 'type'} title={'type'} value={element.type} id={element.id + 'type'}/>,
            <Property key={element.id + 'results'} title={'results'} value={element.results} id={element.id + 'results'}/>
        ]
    }   

    useEffect(()=>{setViewData(createViewDataContent(currentTournament))},[currentTournament])

    function startTournamentEditing() {
        setIsEditing(true)
    }

    async function startTournamentCancelling() {
        setCancelButtonText('Cancelling...')
        try {
            const loadResult = await startCancellingTournamentInteractor(uid, currentTournament.id ,tournamentGateway)
            if (loadResult.state === TournamentState.cancelling) {
                setCanBeCancelled(false)
                setTournament(loadResult)
            }
        } catch(error){
            setCancelButtonText('Cancel')
            setErrorMessage(error.toString())
        }
    }

    function finishTournamentEditing(savedTournament) {
        setIsEditing(false)
        if (savedTournament !== undefined) setTournament(savedTournament)
    }

    return {
        viewData,
        startTournamentEditing,
        startTournamentCancelling,
        isEditing,
        finishTournamentEditing,
        currentTournament,
        canBeCancelled,
        cancelButtonText,
        errorMessage,
        setErrorMessage,
    }
}

function checkCanBeCancelled(currentTournament) {   
    switch (currentTournament.state) {
        case TournamentState.draft:
        case TournamentState.registrationOpen:
        case TournamentState.registrationClosed:
        case TournamentState.inPlay:
            return true
        default:
            return false
    }
}
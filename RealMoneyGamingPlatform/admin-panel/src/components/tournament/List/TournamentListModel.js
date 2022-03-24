import React, { useEffect, useRef, useState } from 'react'
import { loadTournamentsInteractor} from '../../../submodules/domain/tournament/interactors/tournament/crud/load_tournaments'
import TournamentListCell from './Cell/TournamentListCell'
import { Tournament as TournamentEntity} from '../../../submodules/domain/tournament/entities/tournament'
import { useUID } from '../../../firebase/AuthProvider'
import { useOutdatedState } from '../../common/DocumentList/DocumentListModel'

export default function useTournamentListModel(tournamentGateway, filterCallback) {
    
    const [shouldNotifyUser, markDataAsOutdated, markDataAsUpToDate, declineUpdate] = useOutdatedState()

    const nextPageToken = useRef(undefined)
    const uid = useUID()
    const [hasMore, setHasMore] = useState(true)
    const [elements, setElements] = useState([])
    const [creatingTournament, setCreatingTournament] = useState()
    const [errorMessage, setErrorMessage] = useState()

    async function loadMore(isFirstLoad = false) {
        try {
            const [nextPage, loadedTournaments] = await loadTournamentsInteractor(filterCallback, 10, nextPageToken.current, tournamentGateway)
            if (nextPage === null) setHasMore(false)
            nextPageToken.current = nextPage
            addElements(loadedTournaments, isFirstLoad)
        } catch (error) {
            setHasMore(false)
            setErrorMessage(error.toString())
        }
    }

    function addElements(tournaments, isFirstLoad) {
        const newElements = tournaments.map((tournament) => <TournamentListCell key={tournament.id} tournamentGateway={tournamentGateway} uid={uid}
            tournament={tournament}/>)
        if (isFirstLoad){
            setElements(newElements)
        } else {
            setElements(elements.concat(newElements))
        }
    }
    
    function reset() {
        setHasMore(true)
        nextPageToken.current = undefined
        loadMore(true)
    }

    useEffect(reset, [filterCallback])

    function addNewTournament() {
        setCreatingTournament(new TournamentEntity())
    }

    function finishTournamentCreating(savedTournament) {
        if (savedTournament !== undefined) markDataAsOutdated()
        setCreatingTournament(undefined)
    }

    return  {
        elements,
        hasMore,
        loadMore,
        creatingTournament,
        addNewTournament,
        finishTournamentCreating,
        reset,
        errorMessage,
        setErrorMessage,
        shouldNotifyUser,
        markDataAsOutdated,
        markDataAsUpToDate,
        declineUpdate
    }
}
import { useRef } from 'react'
import { TournamentFilter } from '../../../submodules/domain/tournament/interactors/tournament/crud/load_tournaments'
import { loadTournamentTypesCollectionInteractor } from '../../../submodules/domain/tournament/interactors/tournament_type/load_types'
import useCollection from '../../common/Model/useCollection'

export default function useTournamentFilterModel(changeFilterCallback, tournamentGateway) {
    const tournamentFilterEntity = useRef(new TournamentFilter())

    const tournamentTypes = useCollection(async () => (await loadTournamentTypesCollectionInteractor(undefined, undefined, undefined, tournamentGateway))[1])

    function applyFilter() {
        changeFilterCallback(tournamentFilterEntity.current)
    }

    function changeState(value) {
        tournamentFilterEntity.current.state = value === '' ? undefined : value
    }

    function changeStartType(value) {
        tournamentFilterEntity.current.startType = value === '' ? undefined : value
    }

    function changeStartTimePassed(value) {
        tournamentFilterEntity.current.startTimePassed = value === 'true' ? true : undefined
    }

    function changeTimeSinceLastModification(value) {
        tournamentFilterEntity.current.timeSinceLastModification = value === '' ? undefined : Date.now() - Date.parse(new Date(value + ':00.000Z'))
    }

    function changeGameId(value) {
        tournamentFilterEntity.current.gameId = value === '' ? undefined : value
    }

    function changeTypeId(value) {
        tournamentFilterEntity.current.typeId = value === '' ? undefined : value
    }

    function changeStartTimeBottomBound(value) {
        tournamentFilterEntity.current.startTimeBottomBound = value === '' ? undefined : Date.parse(new Date(value + ':00.000Z'))
    }

    return {
        applyFilter,
        changeState,
        changeStartType,
        changeStartTimePassed,
        changeTimeSinceLastModification,
        changeGameId,
        changeTypeId,
        changeStartTimeBottomBound,
        tournamentTypes
    }
}
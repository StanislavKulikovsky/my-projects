import { useState } from 'react'
import { TournamentFilter } from '../../submodules/domain/tournament/interactors/tournament/crud/load_tournaments'

export default function useTournamentModel() {
    const [filterCallback, setFilterCallback] = useState(new TournamentFilter())

    function changeFilterCallback(tournamentFilterEntity) {
        setFilterCallback(TournamentFilter.createFromDTO(tournamentFilterEntity.asDTO()))
    }

    return {filterCallback, changeFilterCallback}
}
import { useRef, useState } from "react"
import useCollection from "../../common/Model/useCollection"
import { useUID } from "../../../firebase/AuthProvider"
import { createTournamentInteractor } from "../../../submodules/domain/tournament/interactors/tournament/crud/create"
import { loadTournamentTypesCollectionInteractor } from "../../../submodules/domain/tournament/interactors/tournament_type/load_types"
import { updateTournamentInteractor } from "../../../submodules/domain/tournament/interactors/tournament/crud/update"
import { TournamentStartType } from "../../../submodules/domain/tournament/entities/tournament_type"

export default function useTournamentDetailsModel(tournament, tournamentGateway) {
    let tournamentTypes = useCollection(async () => (await loadTournamentTypesCollectionInteractor(undefined, undefined, undefined, tournamentGateway))[1])
    const draftTournament = useRef(tournament.copy())
    const [isLoading, setIsLoading] = useState(false)
    const uid = useUID()

    const avilibleTournamentTypes = tournamentTypes.filter((type) => type.startType !== TournamentStartType.sng)

    async function saveChanges() {
        if (isLoading) { return }

        setIsLoading(true)

        try {
            if (tournament.id !== null && tournament.id !== undefined) {
                draftTournament.current = await updateTournamentInteractor(uid, draftTournament.current, tournamentGateway)
            } else {
                if (draftTournament.current.type === undefined) throw new Error("Missing or invalid tournament type")  
                draftTournament.current = await createTournamentInteractor(uid, draftTournament.current.type.id, draftTournament.current.startTime, tournamentGateway)
            }
            tournament.setDataFrom(draftTournament.current)
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }

        return draftTournament.current
    }

    function updateTournamentType(tournamentTypeId) {
        draftTournament.current.type = avilibleTournamentTypes.find((element) => element.id === tournamentTypeId);
    }

    function updateStartTime(value) {
        draftTournament.current.startTime = value === '' ? null : Date.parse(new Date(value+':00.000Z'))
    }

    return { avilibleTournamentTypes, updateTournamentType, draftTournament: draftTournament.current, saveChanges, isLoading, updateStartTime }
}
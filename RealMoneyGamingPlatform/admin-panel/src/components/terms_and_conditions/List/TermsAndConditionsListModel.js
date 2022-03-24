import React, { useEffect, useRef, useState } from 'react'
import { loadTermsAndConditionsInteractor} from '../../../submodules/domain/terms_and_conditions/interactors/load_tncs'
import TermsAndConditionsListCell from './Cell/TermsAndConditionsListCell'
import { TermsAndConditions as TermsAndConditionsEntity} from '../../../submodules/domain/terms_and_conditions/entities/tnc'
import { useOutdatedState } from '../../common/DocumentList/DocumentListModel'

export default function useTermsAndConditionsListModel(actualTncVersionCallback, setActualTncVersionCallback, tncGateway) {
    
    const [shouldNotifyUser, markDataAsOutdated, markDataAsUpToDate, declineUpdate] = useOutdatedState()

    const nextPageToken = useRef(undefined)
    const [hasMore, setHasMore] = useState(true)
    const [elements, setElements] = useState([])
    const [creatingTermsAndConditions, setCreatingTermsAndConditions] = useState()
    const [errorMessage, setErrorMessage] = useState()

    async function loadMore(isFirstLoad = false) {
        try {
            const [nextPage, loadedTermsAndConditions] = await loadTermsAndConditionsInteractor( 20, nextPageToken.current, tncGateway)
            if (nextPage === null) setHasMore(false)
            nextPageToken.current = nextPage
            addElements(loadedTermsAndConditions, isFirstLoad)
        } catch (error) {
            setHasMore(false)
            setErrorMessage(error.toString())
        }
    }

    function addElements(tncs, isFirstLoad) {
        const newElements = tncs.map((tnc) => <TermsAndConditionsListCell 
            key={tnc.id} 
            tnc={tnc}
            setActualTncVersionCallback={setActualTncVersionCallback}
            actualTncVersionCallback={actualTncVersionCallback}
            tncGateway={tncGateway}/>)
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

    useEffect(reset, [actualTncVersionCallback])

    function addNewTermsAndConditions() {
        setCreatingTermsAndConditions(new TermsAndConditionsEntity())
    }

    function finishTermsAndConditionsCreating(savedTermsAndConditions) {
        if (savedTermsAndConditions !== undefined) markDataAsOutdated()
        setCreatingTermsAndConditions(undefined)
    }

    return  {
        elements,
        hasMore,
        loadMore,
        actualTncVersionCallback,
        setActualTncVersionCallback,
        creatingTermsAndConditions,
        addNewTermsAndConditions,
        finishTermsAndConditionsCreating,
        reset,
        errorMessage,
        setErrorMessage,
        shouldNotifyUser,
        markDataAsOutdated,
        markDataAsUpToDate,
        declineUpdate
    }
}
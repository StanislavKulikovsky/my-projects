import React from 'react'
import TermsAndConditionsList from './List/TermsAndConditionsList'
import useTermsAndConditionsModel from './TermsAndConditionsModel'

function TermsAndConditions({tncGateway}) {
  const model = useTermsAndConditionsModel(tncGateway)

  return (
    <div>
      <div className="container-fluid">
        <div className="row mt-3">
            <strong className="mx-auto h2">Current T&C version: {model.actualTncVersionCallback}</strong>
          <div className="col-12">
            <TermsAndConditionsList actualTncVersionCallback={model.actualTncVersionCallback} setActualTncVersionCallback={model.setActualTncVersionCallback} tncGateway={tncGateway}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions

import useTermsAndConditionsListCellModel from "./TermsAndConditionsListCellModel"
import React from "react"
import { Button } from "react-bootstrap"
import TermsAndConditionsDetails from "../../Details/TermsAndConditionsDetails"

function TermsAndConditionsListCell({ tnc, tncGateway, setActualTncVersionCallback, actualTncVersionCallback}) {
    const model = useTermsAndConditionsListCellModel(tnc, setActualTncVersionCallback, actualTncVersionCallback, tncGateway)

    return (
        <div className="container">
            {
                model.errorMessage !== undefined && 
                (()=>{model.setErrorMessage()})()
            }

            <div className={`row border bg-light py-2 my-2`}>
                <div className="col-10">
                    {model.viewData.map((el)=>el)}
                </div>

                <div className="col-2">
                    {
                        !(model.currentTermsAndConditions.isDraft) && <>
                            <Button
                            key={tnc.id + 'View'}
                            variant='outline-danger'
                            className="w-100 mb-2"
                            onClick={model.viewTermsAndConditions}>
                                View
                            </Button>
                            {
                                !model.isActual && <Button
                                key={tnc.id + 'Apply'}
                                variant='outline-danger'
                                className="w-100 mb-2"
                                onClick={model.applyTermsAndConditions}>
                                    Apply
                                </Button>
                            }
                        </>
                    }
                    
                    {
                        model.currentTermsAndConditions.isDraft && <>
                            <Button
                            key={tnc.id + 'Edit'}
                            variant='outline-secondary'
                            className="w-100 mb-2"
                            onClick={model.startTermsAndConditionsEditing}>
                                Edit
                            </Button>

                            <Button
                            key={tnc.id + 'Release'}
                            variant='outline-secondary'
                            className="w-100 mb-2"
                            onClick={model.releaseTermsAndConditions}>
                                Release
                            </Button>
                        </>
                    }
                </div>
            </div>

            {
                model.isEditing &&
                <TermsAndConditionsDetails
                tnc={model.currentTermsAndConditions}
                tncGateway={tncGateway}
                closeAction={model.finishTermsAndConditionsEditing}
                />
            }
        </div>
    )
}

export default TermsAndConditionsListCell
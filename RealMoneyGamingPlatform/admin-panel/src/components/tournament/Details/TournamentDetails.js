import React from 'react'
import { Form } from 'react-bootstrap'
import DocumentDetailsModalContainer from '../../common/DocumentDetails/DocumentDetailsModalContainer'
import useTournamentDetailsModel from './TournamentDetailsModel'

function TournamentDetails({ tournament, tournamentGateway, closeAction }) {
    const model = useTournamentDetailsModel(tournament, tournamentGateway)

    return (
        <DocumentDetailsModalContainer
            cancelAction={() => closeAction()}
            saveAction={() => {
                return model.saveChanges().then(closeAction)
                    .catch(error => window.alert(error.toString()))
            }}>
            <Form>

                {
                    model.avilibleTournamentTypes.length > 0 &&
                    <Form.Group controlId="formTournamentDetailsType">
                        <Form.Label>Type</Form.Label>
                        <Form.Control
                            as="select"
                            defaultValue={model.draftTournament.type !== undefined ? model.draftTournament.type.id : ""}
                            onChange={(event) => model.updateTournamentType(event.target.value)}
                            custom>

                            <option disabled value = {undefined}></option>
                            {model.avilibleTournamentTypes.map(type => {
                                return <option
                                    value={type.id}
                                    key={type.id}>
                                    {type.name}
                                </option>
                            })}

                        </Form.Control>
                    </Form.Group>
                }

                <Form.Group controlId="formTournamentDetailsStartTime">
                    <Form.Label>Start time (UTC)</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        defaultValue={model.draftTournament.startTime !== undefined ? new Date(model.draftTournament.startTime).toISOString().substring(0,16) : ""}
                        placeholder="start time"
                        onChange={(event) => model.updateStartTime(event.target.value)}
                    />
                </Form.Group>

            </Form>
        </DocumentDetailsModalContainer>
    )
}

export default TournamentDetails
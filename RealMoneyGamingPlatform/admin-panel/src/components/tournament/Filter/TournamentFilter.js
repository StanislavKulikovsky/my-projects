import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { TournamentState } from '../../../submodules/domain/tournament/entities/tournament'
import { TournamentStartType } from '../../../submodules/domain/tournament/entities/tournament_type'
import useTournamentFilterModel from './TournamentFilterModel'

function TournamentFilter({ changeFilterCallback, tournamentGateway }) {
    const model = useTournamentFilterModel(changeFilterCallback, tournamentGateway)

        return <div className="border p-2 mt-2 rounded "> <strong>Filter settings</strong>
        <Form>
            <Form.Group controlId="formTournamentFilter">
                <Form.Label>State:</Form.Label>
                <Form.Control
                    as="select"
                    defaultValue=''
                    onChange={(event) => {model.changeState(event.target.value)}}
                    custom>

                    <option value = ''></option>
                    {TournamentState.allTypes().map(state => {
                    return <option
                        value={state}
                        key={state}>
                        {state}
                    </option>
                    })}
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="formTournamentFilterStartType">
                <Form.Label>Start type:</Form.Label>
                <Form.Control
                    as="select"
                    defaultValue=''
                    onChange={(event) => {model.changeStartType(event.target.value)}}
                    custom>

                    <option value = ''></option>
                    {TournamentStartType.allTypes().map(type => {
                    return <option
                        value={type}
                        key={type}>
                        {type}
                    </option>
                    })}
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="formTournamentFilterStartTimePassed">
                <Form.Label>Start time passed:</Form.Label>
                <Form.Control
                    as="select"
                    defaultValue=''
                    onChange={(event) => {model.changeStartTimePassed(event.target.value)}}
                    custom>

                    <option value = ''></option>
                    <option value = 'true'>yes</option>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="formTournamentFilterTimeSinceLastModification">
                <Form.Label>Last modidfication time (top bound, UTC):</Form.Label>
                <Form.Control
                    type="datetime-local"
                    defaultValue={""}
                    onChange={(event) => {model.changeTimeSinceLastModification(event.target.value)}}
                    />
            </Form.Group>

            <Form.Group controlId="formTournamentFilterGameId">
                <Form.Label>Game ID:</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue=''
                    onInput={(event) => {model.changeGameId(event.target.value)}}
                    placeholder="Game ID"/>
            </Form.Group>

            <Form.Group controlId="formTournamentFilterTypeId">
                <Form.Label>Tournament config:</Form.Label>
                <Form.Control
                    as="select"
                    defaultValue=''
                    onChange={(event) => {model.changeTypeId(event.target.value)}}
                    custom>

                    <option value = ''></option>
                    {Array.isArray(model.tournamentTypes) &&
                        model.tournamentTypes.map(type => {
                    return <option
                        value={type.id}
                        key={type.id}>
                        {type.name}
                    </option>
                    })
                    }
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="formTournamentFilterStartTimeBottomBound">
                <Form.Label>Start time (bottom bound, UTC):</Form.Label>
                <Form.Control
                    type="datetime-local"
                    defaultValue={""}
                    onChange={(event) => {model.changeStartTimeBottomBound(event.target.value)}}
                />

            </Form.Group>
            <Button type="submit" onClick={(event) => {
                event.preventDefault()
                model.applyFilter()
            }}>Apply</Button>
        </Form>
    </div>
}

export default TournamentFilter
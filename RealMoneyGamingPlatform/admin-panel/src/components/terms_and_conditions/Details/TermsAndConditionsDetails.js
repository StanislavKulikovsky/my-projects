import React from 'react'
import { Form } from 'react-bootstrap'
import DocumentDetailsModalContainer from '../../common/DocumentDetails/DocumentDetailsModalContainer'
import useTermsAndConditionsDetailsModel from './TermsAndConditionsDetailsModel'

function TermsAndConditionsDetails({ tnc, tncGateway, closeAction }) {
    const model = useTermsAndConditionsDetailsModel(tnc, tncGateway)

    return (
        <DocumentDetailsModalContainer
            cancelAction={() => closeAction()}
            saveAction={() => {
                return model.saveChanges().then(closeAction)
                    .catch(error => window.alert(error.toString()))
            }}>
            <Form>
                <Form.Group controlId="formTermsAndConditionsVersion">
                    <Form.Label>T&C version</Form.Label>
                    <Form.Control
                        type="text"
                        readOnly={tnc.isDraft === false}
                        defaultValue={model.draftTermsAndConditions.version !== undefined ? model.draftTermsAndConditions.version : ""}
                        placeholder="Version"
                        onChange={(event) => model.updateTncVersion(event.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formTermsAndConditionsVersion">
                    <Form.Label>T&C content</Form.Label>
                    <Form.Control
                        as="textarea"
                        readOnly={tnc.isDraft === false}
                        rows="20"
                        defaultValue={model.draftTermsAndConditions.content !== undefined ? model.draftTermsAndConditions.content : ""}
                        placeholder="Content"
                        onChange={(event) => model.updateTncContent(event.target.value)}>
                    </Form.Control>
                </Form.Group>
            </Form>
        </DocumentDetailsModalContainer>
    )
}

export default TermsAndConditionsDetails
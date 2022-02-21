import PropTypes from 'prop-types';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Trash, Pen, Plus } from 'react-bootstrap-icons';
import FilterContext from '../context/FilterContext';
import DisplayParameter from './DisplayParameter';
import InputParameter from './InputParameter';

function ConfigTab({ tabTitle }) {

    const { modelConfig, updateModelConfig, inputParameters, displayParameters } = useContext(FilterContext);
    const [editInputParameter, setEditInputParameter] = useState(false)
    const [editDisplayParameter, setEditDisplayParameter] = useState(false)
    const [selectedParameter, setSelectedParameter] = useState(null)

    const deleteInputParameter = useCallback(function _deleteInputParameter(paramName) {
        if (!window.confirm(`Are you sure you want to delete the input parameter "${paramName}" from the model configuration?`)) return;

        updateModelConfig(modelConfig => {
            var tmpParameters = { ...modelConfig.parameters }
            delete tmpParameters[paramName];
            modelConfig.parameters = tmpParameters;
        });

    }, [updateModelConfig])

    const deleteDisplayParameter = useCallback(function _deleteDisplayParameter(paramName) {
        if (!window.confirm(`Are you sure you want to delete the display parameter "${paramName}" from the model configuration?`)) return;

        updateModelConfig(modelConfig => {
            var tmpModelConfig = { ...modelConfig }
            delete tmpModelConfig.visualizations[paramName];
            updateModelConfig(tmpModelConfig);
        });

    }, [updateModelConfig])

    const addUpdateInputParameter = useCallback(function _addUpdateInputParameter(paramName, newParamDefn) {

        if (modelConfig.parameters[paramName] && !window.confirm(`Are you sure you want to update the existing field "${paramName}" in the model configuration?`)) return;

        updateModelConfig(modelConfig => {
            var tmpConfig = { ...modelConfig }
            var tmpParams = { ...tmpConfig.parameters }
            tmpParams[paramName] = newParamDefn;
            tmpConfig.parameters = tmpParams;
            setEditInputParameter(false);
            setSelectedParameter(null);
            updateModelConfig(tmpConfig);
        });

    }, [updateModelConfig, modelConfig.parameters, setEditInputParameter, setSelectedParameter])

    const addUpdateDisplayParameter = useCallback(function _addUpdateDisplayParameter(paramName, newParamDefn) {
        if (modelConfig.visualizations[paramName] && !window.confirm(`Are you sure you want to update the existing display parameter "${paramName}" in the model configuration?`)) return;
        updateModelConfig(modelConfig => {
            var tmpConfig = { ...modelConfig }
            delete tmpConfig.visualizations[paramName];
            for (const [key, val] of Object.entries(newParamDefn)) {
                tmpConfig["visualizations"][key] = val;
            }
            setEditDisplayParameter(false);
            setSelectedParameter(null);
            updateModelConfig(tmpConfig);
        });

    }, [updateModelConfig, modelConfig.visualizations, setEditDisplayParameter, setSelectedParameter])

    const editInputParamsModal = useMemo(function _editInputParamsModal() {
        return (
            <InputParameter
                key={`edit-input-parameter-${selectedParameter}`}
                save={(newParamDefn) => {
                    addUpdateInputParameter(selectedParameter, newParamDefn)
                }}
                inputParameters={inputParameters}
                show={editInputParameter}
                modelConfig={modelConfig}
                selectedParameter={selectedParameter}
                cancel={() => {
                    setEditInputParameter(false);
                    setSelectedParameter(null);
                }}
            />

        )
    }, [editInputParameter, selectedParameter, inputParameters, modelConfig, addUpdateInputParameter]);

    const editDisplayParamsModal = useMemo(function _editDisplayParamsModal() {
        return (
            <DisplayParameter
                key={`edit-display-parameter-${selectedParameter}`}
                save={(newParamDefn) => {
                    addUpdateDisplayParameter(selectedParameter, newParamDefn)
                }}
                displayParameters={displayParameters}
                show={editDisplayParameter}
                modelConfig={modelConfig}
                selectedParameter={selectedParameter}
                cancel={() => {
                    setEditDisplayParameter(false);
                    setSelectedParameter(null);
                }}
            />

        )
    }, [editDisplayParameter, selectedParameter, displayParameters, modelConfig, addUpdateDisplayParameter]);

    const inputParamRows = useMemo(function generateInputParamRows() {
        if (!modelConfig || !modelConfig.parameters) return console.debug("Did not generate input parameter rows");
        return Object.keys(modelConfig.parameters).map((parameterName, i) => {
            let parameterData = modelConfig.parameters[parameterName];
            return (
                <tr key={`param-row-${i}`}>
                    <td className="td-40">{parameterData["title"]}</td>
                    <td className="td-40">{parameterName}</td>
                    <td className="td-10">
                        <Button variant="primary" size="sm" onClick={() => setEditInputParameter(true)}><Pen /> Edit</Button>
                    </td>
                    <td className="td-10">
                        <Button variant="danger" size="sm" onClick={() => deleteInputParameter(parameterName)}><Trash /> Delete</Button>
                    </td>
                </tr>
            )
        })
    }, [modelConfig, setEditInputParameter, deleteInputParameter]);

    const displayParamRows = useMemo(function generateDisplayParamRows() {
        if (!modelConfig || !modelConfig.visualizations) return console.debug("Did not generate display parameter rows");
        return Object.keys(modelConfig.visualizations).map((parameterName, i) => {
            const parameterData = modelConfig.visualizations[parameterName];
            return (
                <tr key={`display-param-row-${i}`}>
                    <td className="td-40">{parameterName}</td>
                    <td className="td-40">{parameterData}</td>
                    <td className="td-10">
                        <Button variant="primary" size="sm" onClick={() => setEditDisplayParameter(true)}><Pen /> Edit</Button>
                    </td>
                    <td className="td-10">
                        <Button variant="danger" size="sm" onClick={() => deleteDisplayParameter(parameterName)}><Trash /> Delete</Button>
                    </td>
                </tr>
            )
        })
    }, [modelConfig, setEditDisplayParameter, deleteDisplayParameter]);

    return (
        <>
            <h3>{tabTitle}</h3>
            {editInputParamsModal}
            {editDisplayParamsModal}
            <h4>Input parameters</h4>
            <p>These are the parameters that are shown on the left side of the screen that are used as input to a model execution</p>
            <Button onClick={() => {
                setEditInputParameter(true);
                setSelectedParameter(null);
            }}><Plus /> Add new input parameter</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Parameter name</th>
                        <th>Label</th>
                        <th colSpan={2}>Choices</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(inputParamRows) && (inputParamRows)}
                </tbody>
            </Table>
            <h4>Display parameters</h4>
            <p>These are the parameters that are displayed in charts and tables when the model is run</p>
            <Button onClick={() => {
                setEditDisplayParameter(true);
                setSelectedParameter(null);
            }}><Plus /> Add new display parameter</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Parameter name</th>
                        <th>Label</th>
                        <th colSpan={2}>Choices</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(displayParamRows) && (displayParamRows)}
                </tbody>
            </Table>
            {/* <pre style={{ "overflowX": "hidden" }}>{JSON.stringify(modelConfig, null, 2)}</pre> */}
        </>
    )
}

ConfigTab.propTypes = {
    tabTitle: PropTypes.string.isRequired,
}

export default ConfigTab;
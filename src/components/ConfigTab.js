import PropTypes from 'prop-types';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Trash, Pen, Pencil, ArrowClockwise, InputCursor, GraphUp } from 'react-bootstrap-icons';
import FilterContext from '../context/FilterContext';
import { DisplayParameter } from './DisplayParameter';
import { InputParameter } from './InputParameter';
import EditTitle from './EditTitle';
import Api from '../utils/Api';

function ConfigTab({ tabTitle }) {

    const { modelConfig, updateModelConfig, inputParameters, modelName, setFilter } = useContext(FilterContext);
    const [editModelTitle, setEditModelTitle] = useState(false)
    const [editInputParameter, setEditInputParameter] = useState(false)
    const [editDisplayParameter, setEditDisplayParameter] = useState(false)
    const [selectedParameter, setSelectedParameter] = useState(null)

    const deleteInputParameter = useCallback(function _deleteInputParameter(paramName) {
        if (!window.confirm(`Are you sure you want to delete the input parameter "${paramName}" from the model configuration?`)) return;

        var tmpModelConfig = { ...modelConfig }
        delete tmpModelConfig.parameters[paramName];
        updateModelConfig(tmpModelConfig);
        return tmpModelConfig;

    }, [updateModelConfig, modelConfig])

    const deleteDisplayParameter = useCallback(function _deleteDisplayParameter(paramName) {
        if (!window.confirm(`Are you sure you want to delete the display parameter "${paramName}" from the model configuration?`)) return;

        var tmpModelConfig = { ...modelConfig }
        delete tmpModelConfig.visualizations[paramName];
        updateModelConfig(tmpModelConfig);
        return tmpModelConfig;

    }, [updateModelConfig, modelConfig])

    const addUpdateInputParameter = useCallback(function _addUpdateInputParameter(paramName, newParamDefn) {

        if (modelConfig.parameters[paramName] && !window.confirm(`Are you sure you want to update the existing field "${paramName}" in the model configuration?`)) return;

        var tmpConfig = { ...modelConfig }
        var tmpParams = { ...tmpConfig.parameters, ...newParamDefn }
        if (Object.keys(newParamDefn).indexOf(paramName) === -1) {
            delete tmpParams[paramName];
        }
        tmpConfig.parameters = tmpParams;
        setEditInputParameter(false);
        setSelectedParameter(null);
        updateModelConfig(tmpConfig);
        return tmpConfig;

    }, [updateModelConfig, modelConfig])

    const addUpdateDisplayParameter = useCallback(function _addUpdateDisplayParameter(paramName, newParamDefn) {
        if (modelConfig.visualizations[paramName] && !window.confirm(`Are you sure you want to update the existing display parameter "${paramName}" in the model configuration?`)) return;
        var tmpModelConfig = { ...modelConfig }
        var tmpVisualizations = { ...tmpModelConfig.visualizations, ...newParamDefn }
        if (Object.keys(newParamDefn).indexOf(paramName) === -1) {
            delete tmpVisualizations[paramName];
        }
        tmpModelConfig.visualizations = tmpVisualizations;
        setEditDisplayParameter(false);
        setSelectedParameter(null);
        updateModelConfig(tmpModelConfig);
        return tmpModelConfig;

    }, [updateModelConfig, modelConfig])

    /**
     * Modal dialogue for editing model title
     */
    const editTitleModal = useMemo(function _editTitleModal() {
        return (
            <EditTitle
                data={{ title: modelConfig.title }}
                show={editModelTitle}
                save={(data) => {
                    setEditModelTitle(false);
                    updateModelConfig({
                        ...modelConfig,
                        title: data.title
                    });
                }}
                cancel={() => {
                    setEditModelTitle(false);
                }}
            />
        )
    }, [modelConfig, updateModelConfig, editModelTitle])

    /**
     * Modal dialogue for editing model input parameters
     */
    const editInputParamsModal = useMemo(function _editInputParamsModal() {
        return (
            <InputParameter
                key={`edit-input-parameter-${selectedParameter}`}
                save={(newParamDefn, newParameter) => {
                    setEditInputParameter(false);
                    addUpdateInputParameter(selectedParameter, newParamDefn);
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

    /**
     * Modal dialogue for editing model display parameters (visualizations)
     */
    const editDisplayParamsModal = useMemo(function _editDisplayParamsModal() {
        return (
            <DisplayParameter
                key={`edit-display-parameter-${selectedParameter}`}
                save={(newParamDefn) => {
                    setEditDisplayParameter(false);
                    addUpdateDisplayParameter(selectedParameter, newParamDefn)
                }}
                inputParameters={inputParameters}
                show={editDisplayParameter}
                modelConfig={modelConfig}
                selectedParameter={selectedParameter}
                cancel={() => {
                    setEditDisplayParameter(false);
                    setSelectedParameter(null);
                }}
            />

        )
    }, [editDisplayParameter, selectedParameter, inputParameters, modelConfig, addUpdateDisplayParameter]);

    const inputParamSort = useCallback((a, b) => {
        let a0 = modelConfig.parameters[a]["order"] || 0;
        let b0 = modelConfig.parameters[b]["order"] || 0;
        if (a0 > b0) return 1;
        if (b0 > a0) return -1;
        return 0;
    }, [modelConfig.parameters])

    const inputParamRows = useMemo(function generateInputParamRows() {
        if (!modelConfig || !modelConfig.parameters) return console.debug("Did not generate input parameter rows");
        return Object.keys(modelConfig.parameters).sort(inputParamSort).map((parameterName, i) => {
            let parameterData = modelConfig.parameters[parameterName];
            return (
                <tr key={`param-row-${i}`}>
                    <td className="td-5">{parameterData["order"]}</td>
                    <td className="td-40">{parameterData["title"]}</td>
                    <td className="td-25">{parameterName}</td>
                    <td className="td-10">{parameterData["type"]}</td>
                    <td className="td-10">
                        <Button variant="primary" size="sm" onClick={() => {
                            setEditInputParameter(true);
                            setSelectedParameter(parameterName)
                        }}><Pen /> Edit</Button>
                    </td>
                    <td className="td-10">
                        <Button variant="danger" size="sm" onClick={() => deleteInputParameter(parameterName)}><Trash /> Delete</Button>
                    </td>
                </tr>
            )
        })
    }, [modelConfig, setEditInputParameter, deleteInputParameter, inputParamSort]);

    const displayParamRows = useMemo(function generateDisplayParamRows() {
        if (!modelConfig || !modelConfig.visualizations) return console.debug("Did not generate display parameter rows");
        return Object.keys(modelConfig.visualizations).sort((a, b) => +a.order > +b.order).map((parameterName, i) => {
            const parameterData = modelConfig.visualizations[parameterName];
            return (
                <tr key={`display-param-row-${i}`}>
                    <td className="td-40">{parameterName}</td>
                    <td className="td-40">{parameterData}</td>
                    <td className="td-10">
                        <Button variant="primary" size="sm" onClick={() => {
                            setEditDisplayParameter(true);
                            setSelectedParameter(parameterName);
                        }}><Pen /> Edit</Button>
                    </td>
                    <td className="td-10">
                        <Button variant="danger" size="sm" onClick={() => deleteDisplayParameter(parameterName)}><Trash /> Delete</Button>
                    </td>
                </tr>
            )
        })
    }, [modelConfig, setEditDisplayParameter, deleteDisplayParameter]);

    // Reset configuration to default
    const resetConfig = useCallback(() => {
        if (!window.confirm("Are you sure you wish to reset the input parameters and visualizations to the default state? All customization will be lost.")) return;
        if ("reset" !== window.prompt("I know this sounds paranoid, but please type 'reset' into this field to reset the configuration", "rese")) return;
        // Load documentatoin and run model without parameters
        Api.resetConfig(modelName, updateModelConfig, setFilter).then(res => {
        });
    }, [modelName, updateModelConfig, setFilter]);

    return (
        <>
            <h3 className="my-3">{tabTitle}</h3>
            <h4 className="my-3">Model title</h4>
            <p>{modelConfig.title}</p>
            <div className="d-grid">
                <Button onClick={() => {
                    setEditModelTitle(true);
                }}><Pencil /> Edit model title</Button>
            </div>
            <h4 className="my-3">Input parameters</h4>
            <p>These are the parameters that are shown on the left side of the screen that are used as input to a model execution</p>
            <div className="d-grid">
                <Button onClick={() => {
                    setEditInputParameter(true);
                    setSelectedParameter(null);
                }}><InputCursor /> Add new input parameter</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Parameter name</th>
                        <th>Label</th>
                        <th>Type</th>
                        <th colSpan={2}>Choices</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(inputParamRows) && (inputParamRows)}
                </tbody>
            </Table>
            <h4 className="my-3">Display parameters</h4>
            <p>These are the parameters that are displayed in charts and tables when the model is run</p>
            <div className="d-grid">
                <Button onClick={() => {
                    setEditDisplayParameter(true);
                    setSelectedParameter(null);
                }}><GraphUp /> Add new display parameter</Button>
            </div>
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
            {editInputParamsModal}
            {editDisplayParamsModal}
            {editTitleModal}
            <h4>Reset configuration</h4>
            <div className="d-grid">
                <Button variant="danger" onClick={() => resetConfig()}><ArrowClockwise /> Reset configuration</Button>
            </div>
        </>
    )
}

ConfigTab.propTypes = {
    tabTitle: PropTypes.string.isRequired,
}

export default ConfigTab;
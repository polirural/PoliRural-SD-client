import PropTypes from 'prop-types';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Trash, Pen, Plus } from 'react-bootstrap-icons';
import FilterContext from '../context/FilterContext';
import { DisplayParameter } from './DisplayParameter';
import { InputParameter } from './InputParameter';
import EditTitle from './EditTitle';

function ConfigTab({ tabTitle }) {

    const { modelConfig, updateModelConfig, inputParameters } = useContext(FilterContext);
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

    const inputParamRows = useMemo(function generateInputParamRows() {
        if (!modelConfig || !modelConfig.parameters) return console.debug("Did not generate input parameter rows");
        return Object.keys(modelConfig.parameters).map((parameterName, i) => {
            let parameterData = modelConfig.parameters[parameterName];
            return (
                <tr key={`param-row-${i}`}>
                    <td className="td-40">{parameterData["title"]}</td>
                    <td className="td-40">{parameterName}</td>
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

    // useEffect(() => {
    //     console.log(inputParameters);
    // }, [inputParameters])

    return (
        <>
            <h3 className="my-3">{tabTitle}</h3>
            <h4 className="my-3">Model title</h4>
            <p>{modelConfig.title}</p>
            <Button onClick={() => {
                setEditModelTitle(true);
            }}><Plus /> Edit model title</Button>
            <h4 className="my-3">Input parameters</h4>
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
            <h4 className="my-3">Display parameters</h4>
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
            {editInputParamsModal}
            {editDisplayParamsModal}
            {editTitleModal}
        </>
    )
}

ConfigTab.propTypes = {
    tabTitle: PropTypes.string.isRequired,
}

export default ConfigTab;
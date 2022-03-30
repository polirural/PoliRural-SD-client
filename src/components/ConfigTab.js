import PropTypes from 'prop-types';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Trash, Pen, Pencil, ArrowClockwise, InputCursor, GraphUp, ClipboardPlus, ClipboardCheck } from 'react-bootstrap-icons';
import { DisplayParameter } from './DisplayParameter';
import { InputParameter } from './InputParameter';
import EditTitle from './EditTitle';
import Api from '../utils/Api';
import ReducerContext from '../context/ReducerContext';
import { DefaultConfig, INPUT_PARAMETER_TYPE } from '../config/config';
import { setKeyVal } from '../context/ReducerProvider';
import { clone } from '../utils/Object';
import DialogPasteConfig from './DialogPasteConfig';

function ConfigTab({ tabTitle }) {

    const { state, dispatch } = useContext(ReducerContext);
    const { modelConfig, inputParameters, displayParameters, modelName, modelDoc, scenarios, filter } = state;

    const [editModelTitle, setEditModelTitle] = useState(false)
    const [editInputParameter, setEditInputParameter] = useState(false)
    const [editDisplayParameter, setEditDisplayParameter] = useState(false)
    const [pasteModelConfig, setPasteModelConfig] = useState(false)
    const [selectedParameter, setSelectedParameter] = useState(null)

    const updateModelConfig = useCallback((modelConfig) => {
        return Api.setConfig(modelConfig.modelName, modelConfig)
            .then(function _handleResponse(res) {
                dispatch({
                    type: 'setKeyVal',
                    payload: {
                        key: "modelConfig",
                        val: modelConfig
                    }
                })
            })
            .catch(function handleError(err) {
                console.error("Error updating model configuration", err);
            })
    }, [dispatch]);

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
                inputParameters={displayParameters}
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

    const doResetConfig = useCallback((modelName) => {
        return Promise.all([
            Api.getDoc(modelName),
            Api.runModel(modelName, {})
        ]).then((res) => {
            let mDoc = res[0].data;
            let mRes = res[1].data;
            let mResParams = Object.keys(mRes[0]);

            // Create new model config object based on template
            let nmc = {
                ...clone(DefaultConfig),
                modelName
            };

            // Add input parameters
            Object.keys(nmc.parameters).forEach((paramName, paramIdx) => {
                let paramDoc = mDoc.find((docData) => docData["Py Name"] === paramName);
                if (!paramDoc) {
                    console.debug(`Omitted input parameter ${paramName}, not present in model documentation`)
                    delete nmc.parameters[paramName];
                    return;
                }

                // Set default values
                let pDef = nmc.parameters[paramName]
                pDef.order = pDef.order || -1;

                if (pDef.type === INPUT_PARAMETER_TYPE.GRAPH) {
                    // Handle graphs
                    pDef.defaultValue = mRes.reduce((graphData, rowData) => {
                        if (Object.keys(rowData).indexOf(paramName) > -1) {
                            graphData.push({
                                x: +rowData["IDX_TIME"],
                                y: +rowData[paramName]
                            });
                        } else if (paramDoc && Object.keys(rowData).indexOf(paramDoc["Py Name"]) > -1) {
                            graphData.push({
                                x: +rowData["IDX_TIME"],
                                y: +rowData[paramDoc["Py Name"]]
                            });
                        }
                        return graphData;
                    }, [])
                } else if (pDef.type === INPUT_PARAMETER_TYPE.NUMBER) {
                    // Handle number inputs
                    pDef.defaultValue = paramDoc["Eqn"];
                } else {
                    // Handle others
                    pDef.defaultValue = null;
                }
                return;
            })

            // Add visualization parameters
            Object.keys(nmc.visualizations).forEach((curr) => {
                if (mResParams.indexOf(curr) === -1) {
                    console.debug(`Omitted visualization ${curr}, not present in model outputs`)
                    delete nmc.visualizations[curr];
                }
            }, {})

            // Load default filter
            let defaultFilter = Object.keys(nmc.parameters).reduce((flt, k1) => {
                let v = nmc.parameters[k1].defaultValue;
                if (!v) return flt;
                if (Array.isArray(v) && v.length === 0) return flt;
                if (Array.isArray(v)) {
                    flt[k1] = v;
                } else {
                    flt[k1] = +v;
                }
                return flt;
            }, {});

            // First save model config
            updateModelConfig(nmc)
                .then(res => {
                    console.warn("Updated and saved model config")
                    return Api.setScenarios(modelName, {
                        default: defaultFilter
                    })
                }).then(res => {
                    console.warn("Saved filter as default scenario")
                    dispatch(setKeyVal("filter", defaultFilter));
                    console.warn("Updated filter state")
                    return true;
                }).catch(err => {
                    console.error("Error resetting configuration", err);
                    return false;
                });
        })
    }, [dispatch, updateModelConfig]);

    // Reset configuration to default
    const resetConfig = useCallback(() => {
        if (!window.confirm("Are you sure you wish to reset the input parameters and visualizations to the default state? All customization will be lost.")) return;
        if ("reset" !== window.prompt("I know this sounds paranoid, but please type 'reset' into this field to reset the configuration", "rese")) return;
        // Load documentation and run model without parameters
        doResetConfig(modelName).then(res => {
        });
    }, [modelName, doResetConfig]);

    /**
     * Read default values from model where possible
     */
    const resetDefaultFilter = useCallback(() => {
        // if (!window.confirm("Are you sure you wish to reset the default filter? All manually entered values will be lost.")) return;
        dispatch({
            type: "modelLoading",
            payload: true
        })
        Api.runModel(modelName, {}).then((res) => {
            if (res.status !== 200) throw new Error("Error loading model data");
            let modelData = res.data;

            // Extract default filter
            let defaultFilter = Object.keys(modelConfig.parameters).reduce((paramMap, paramName) => {

                let paramDoc = modelDoc.find((docData) => docData["Py Name"] === paramName);
                if (!paramDoc) {
                    return paramMap;
                }
                let paramDef = modelConfig.parameters[paramName]

                if (paramDef.type === INPUT_PARAMETER_TYPE.GRAPH) {
                    // Handle graphs
                    paramMap[paramName] = modelData.reduce((graphParam, row) => {
                        if (Object.keys(row).indexOf(paramName) > -1) {
                            graphParam.push({
                                x: +row["IDX_TIME"],
                                y: +row[paramName]
                            });
                        } else if (paramDoc && Object.keys(row).indexOf(paramDoc["Py Name"]) > -1) {
                            graphParam.push({
                                x: +row["IDX_TIME"],
                                y: +row[paramDoc["Py Name"]]
                            });
                        }
                        return graphParam;
                    }, [])

                    // If arrays are empty, use current filter value
                    paramMap[paramName] = paramMap[paramName].length > 0 ? paramMap[paramName] : filter[paramName];

                    // If value is still empty, delete parameter from map
                    if (!paramMap[paramName]) delete paramMap[paramName];

                } else if (paramDef.type === INPUT_PARAMETER_TYPE.NUMBER) {
                    // Handle number inputs
                    paramMap[paramName] = paramDoc["Eqn"];
                }
                return paramMap;
            }, {});

            let newScenarios = {
                ...scenarios,
                "default": defaultFilter
            };

            Api.setScenarios(modelName, newScenarios).then(res => {
                dispatch({
                    type: "resetDefaultFilter",
                    payload: {
                        scenarios: newScenarios,
                        filter: defaultFilter
                    }
                });
                console.log(defaultFilter);
            })

        }).catch((err) => {
            console.error("Error loading model during reset of default filter", err);
        }).finally(() => {
            dispatch({
                type: "modelLoading",
                payload: false
            })
        })

    }, [dispatch, modelDoc, modelConfig, scenarios, modelName, filter])

    const copyModelConfiguration = useCallback(async () => {
        try {
            async function copy() {
                return await navigator.clipboard.writeText(JSON.stringify(modelConfig))
                    .then(() => {
                        return true;
                    })
                    .catch(err => {
                        return false;
                    })
            }
            if (!navigator.clipboard) throw new Error("Clipboard API not available.")
            if (!(await copy())) throw new Error("Error invoking Clipboard API")
        } catch (error) {
            console.warn("Error")
            window.prompt("Sorry, couldn't copy automatically, select and copy manually below.", JSON.stringify(modelConfig));
        }

    }, [modelConfig]);

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
            <h4>Copy configuration</h4>
            <div className="d-grid gap-3">
                <Button variant="primary" onClick={() => copyModelConfiguration()}><ClipboardPlus /> Copy model configuration</Button>
                <Button variant="primary" onClick={() => setPasteModelConfig(true)}><ClipboardCheck /> Paste model configuration</Button>
            </div>
            <h4>Reset configuration</h4>
            <div className="d-grid mb-3">
                <Button variant="primary" onClick={() => resetDefaultFilter()}><ArrowClockwise /> Reset default filter</Button>
            </div>
            <div className="d-grid">
                <Button variant="danger" onClick={() => resetConfig()}><ArrowClockwise /> Reset configuration</Button>
            </div>
            <DialogPasteConfig show={pasteModelConfig} onCancel={() => setPasteModelConfig(false)} onSave={(pastedModelConfig) => {
                setPasteModelConfig(false);
                try {
                    // Check if valid JSON
                    let modelConfigJson;
                    try {
                        modelConfigJson = JSON.parse(pastedModelConfig);
                    } catch (error) {
                        throw new Error("Pasted model config is not valid JSON");
                    }
                    Api.setConfig(modelName, modelConfigJson).then(res => {
                        dispatch(setKeyVal("modelConfig", modelConfigJson));
                    })

                } catch (error) {
                    window.alert(`Could not import JSON: ${error}`);
                }
            }} />
        </>
    )
}

ConfigTab.propTypes = {
    tabTitle: PropTypes.string.isRequired,
}

export default ConfigTab;
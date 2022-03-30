import { useCallback, useContext, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import PropTypes from 'prop-types';
import Api from "../utils/Api";
import { Folder2Open, Trash } from "react-bootstrap-icons";
import ReducerContext from "../context/ReducerContext";
import { setKeyVal } from "../context/ReducerProvider";

export function SavedScenariosTab({ tabTitle }) {

    const { state, dispatch } = useContext(ReducerContext)
    const { filter, scenarios, modelConfig } = state
    const { modelName } = modelConfig;

    const saveScenario = useCallback((newScenarioDefn) => {
        var name = window.prompt("Please specify a name for the saved scenario");
        if (!name) return console.debug("No name specified, cancelled");
        var tmpScenarios = {
            ...scenarios,
            [name]: newScenarioDefn
        };
        Api.setScenarios(modelName, tmpScenarios)
            .then(res => {
                dispatch({
                    type: "setKeyVal",
                    payload: {
                        key: "scenarios",
                        val: tmpScenarios
                    }
                })
                console.debug("Saved scenario", res);
            })
            .catch(err => {
                console.error("Error saving scenario", err);
            });
    }, [dispatch, scenarios, modelName]);

    const loadScenario = useCallback((scenarioName) => {
        dispatch({
            type: "setKeyVal",
            payload: {
                key: "filter",
                val: { ...scenarios[scenarioName] }
            }
        });
    }, [dispatch, scenarios])

    const deleteScenario = useCallback((scenarioName) => {
        if (!window.confirm(`Are you sure you wish to delete the saved scenario: "${scenarioName}"`)) return console.debug("Did not delete scenario");

        let tmpScenarios = { ...scenarios };
        delete tmpScenarios[scenarioName];
        Api.setScenarios(modelName, tmpScenarios)
            .then(function _handleResponse(res) {
                console.log("Updated scenarios after delete");
                dispatch({
                    type: "setKeyVal",
                    payload: {
                        key: "scenarios",
                        val: tmpScenarios
                    }
                })
            })
            .catch(function _handleError(err) {
                console.error("Error setting scenario", err);
            });
        return tmpScenarios;
    }, [dispatch, modelName, scenarios]);

    const createDefaultScenario = useCallback(() => {
        if (modelName) {
            let defaultScenarios = { default: {} };
            Api.setScenarios(modelName, defaultScenarios)
                .then(res => {
                    // setScenarios(defaultScenario);
                    dispatch({
                        type: "setKeyVal",
                        payload: {
                            key: "scenarios",
                            val: defaultScenarios
                        }
                    })
                    // setDefaultFilter(defaultScenario);
                    dispatch({
                        type: "setKeyVal",
                        payload: {
                            key: "defaultScenario",
                            val: defaultScenarios.default
                        }
                    })
                })
        }
    }, [modelName, dispatch])

    useEffect(function _loadSavedScenarios() {
        if (modelName) {
            Api.getScenarios(modelName)
                .then(function _handleResponse(res) {
                    // console.log("loading scenarios", res);
                    if (!res.data || !res.data.value) {
                        createDefaultScenario();
                    } else {
                        // setScenarios(res.data.value);
                        dispatch(setKeyVal("scenarios", res.data.value));
                        // setFilter(res.data.value["default"]);
                        dispatch(setKeyVal("filter", res.data.value["default"]))
                    }
                })
                .catch(function _handleError(err) {
                    console.error("Error loading scenarios", err);
                    createDefaultScenario();
                });
        }
    }, [dispatch, modelName, createDefaultScenario]);

    return (
        <>
            <h3 className="my-3">{tabTitle}</h3>
            <h4 className="my-3">Saved scenarios</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Scenario</th>
                        <th colSpan={2}>Choices</th>
                    </tr>
                </thead>
                <tbody>
                    {scenarios && Array.isArray(Object.keys(scenarios)) &&
                        Object.keys(scenarios).map(function _forEachScenarioName(scenarioName) {
                            return (
                                <tr key={`saved-scenario-${scenarioName}`}>
                                    <td className="td-60">
                                        {scenarioName}
                                    </td>
                                    <td className="td-right td-20">
                                        {scenarioName !== "default" && (
                                            <div className="d-grid gap-2">
                                                <Button variant="danger" size="sm" onClick={function _onDeleteScenario() { deleteScenario(scenarioName) }}><Trash /> Delete scenario</Button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="td-right td-20">
                                        <div className="d-grid gap-2">
                                            <Button variant="primary" size="sm" onClick={function _onLoadScenario() { loadScenario(scenarioName) }}><Folder2Open /> Load scenario</Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </Table>
            <h4>Current scenario</h4>
            <Button size="sm" onClick={function _onSaveNewScenario() { saveScenario(filter) }}>Save current scenario</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {filter && Object.keys(filter).sort().map(function _forEachParamName(paramName) {
                        let paramValue = JSON.stringify(filter[paramName], null, 2);
                        if (filter[paramName] && typeof filter[paramName] === 'object' && Array.isArray(filter[paramName].data)) {
                            let tmpData = filter[paramName].data;
                            paramValue = tmpData.filter((e, i) => i < 5);

                            paramValue = `[${paramValue.join(", ")}, ...] (${tmpData.length} values)`;
                        }
                        return (
                            <tr key={`current-scenario-key-${paramName}`}>
                                <td className="td-60">{paramName}</td>
                                <td className="td-40 td-right">{paramValue}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </>
    )
}

SavedScenariosTab.propTypes = {
    tabTitle: PropTypes.string.isRequired
}

export default SavedScenariosTab;
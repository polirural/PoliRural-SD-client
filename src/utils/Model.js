import { DefaultConfig, DefaultScenarios, INPUT_PARAMETER_TYPE } from "../config/config";
import Api from "./Api";
import { clone } from "./Object";

export function initModel(modelName, modelConfig, dispatch) {
    dispatch({
        type: "modelLoading",
        payload: true
    });

    return Promise.all([
        Api.getDoc(modelName),
        Api.getScenarios(modelName)
    ]).then((res) => {
        if (!res.every(r => r.status === 200)) throw new Error("An issue occurred");
        let modelDoc = res[0].data;
        let modelScenarios = res[1].data;

        return Api.runModel(modelName, modelScenarios.value.default).then(modelRes => {
            let modelData = modelRes.data;
            dispatch({
                type: "initModel",
                payload: {
                    modelConfig: modelConfig,
                    modelName,
                    filter: modelScenarios.value.default,
                    defaultFilter: modelScenarios.value.default,
                    inputParameters: modelDoc.map(d => '' + d["Py Name"]),
                    displayParameters: Object.keys(modelData[0]),
                    scenarios: modelScenarios.value,
                    compareScenario: "default",
                    modelDoc,
                    modelData,
                    modelBaselineData: modelData,
                    runModel: false,
                    modelLoading: false
                }
            })
        })
    }).then(()=>{
        console.info("Initialized model");
    })
    .catch(err => {
        console.error(err);
    }).finally(() => {
        dispatch({
            type: "modelLoading",
            payload: false
        });
    });

}

export function updateModelConfig(modelConfig, dispatch) {
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
        }).finally(() => {
        })
}

export function resetModelConfig(modelName, dispatch) {
    dispatch({
        type: "modelLoading",
        payload: true
    });

    return Promise.all([
        Api.getDoc(modelName),
        Api.runModel(modelName, {})
    ]).then((res) => {
        let modelDoc = res[0].data;
        let modelData = res[1].data;

        // Create new model config object based on template
        let modelConfig = {
            ...clone(DefaultConfig),
            modelName
        };

        let displayParameters = Object.keys(modelData[0]);
        let inputParameters = modelDoc.map(row => row["Py Name"]);

        // Add input parameters
        Object.keys(modelConfig.parameters).forEach((paramName) => {
            let paramDoc = modelDoc.find((docData) => docData["Py Name"] === paramName);
            if (!paramDoc) {
                console.debug(`Omitted input parameter ${paramName}, not present in model documentation`)
                delete modelConfig.parameters[paramName];
                return;
            }

            // Set default values
            let pDef = modelConfig.parameters[paramName]
            pDef.order = pDef.order || -1;

            if (pDef.type === INPUT_PARAMETER_TYPE.GRAPH) {
                // Handle graphs
                pDef.defaultValue = modelData.reduce((graphData, rowData) => {
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
            } else if (pDef.type === INPUT_PARAMETER_TYPE.NUMBER && !isNaN(+paramDoc["Eqn"])) {
                // Handle number inputs
                pDef.defaultValue = paramDoc["Eqn"];
            } else {
                // Handle others
                pDef.defaultValue = null;
            }
            return;
        })

        // Add visualization parameters
        Object.keys(modelConfig.visualizations).forEach((curr) => {
            if (displayParameters.indexOf(curr) === -1) {
                console.debug(`Omitted visualization ${curr}, not present in model outputs`)
                delete modelConfig.visualizations[curr];
            }
        }, {})

        // Load default filter
        let defaultFilter = Object.keys(modelConfig.parameters).reduce((flt, k1) => {
            let v = modelConfig.parameters[k1].defaultValue;
            if (!v) return flt;
            if (Array.isArray(v) && v.length === 0) return flt;
            if (Array.isArray(v)) {
                flt[k1] = v;
            } else {
                flt[k1] = +v;
            }
            return flt;
        }, {});

        // Set scenario
        let scenarios = clone(DefaultScenarios);
        scenarios.default = defaultFilter;

        return Promise.all([
            Api.setConfig(modelName, modelConfig),
            Api.setScenarios(modelName, scenarios)
        ]).then(() => {
            console.info("Saved config, scenarios");
        }).catch(err => {
            console.error("err");
        }).finally(() => {
            console.log(modelData, inputParameters, displayParameters, modelConfig);
            dispatch({
                type: "initModel",
                payload: {
                    modelConfig: modelConfig,
                    modelName,
                    filter: defaultFilter,
                    defaultFilter: defaultFilter,
                    inputParameters,
                    displayParameters,
                    scenarios: scenarios,
                    compareScenario: "default",
                    modelDoc,
                    modelData,
                    modelBaselineData: modelData,
                    runModel: false,
                    modelLoading: false
                }
            })
        })
    }).catch(err => {
        console.error(err);
        return false;
    })
}
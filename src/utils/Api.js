import axios from "axios";
import { DefaultConfig, INPUT_PARAMETER_TYPE } from "../config/config";

class Api {

    static sanitizeModelParam(params) {
        return Object.keys(params).reduce((acc, curr, idx) => {
            let val = params[curr];
            if (val === null || val === undefined || val === '') return acc;
            if (val && Array.isArray(val.index) && val.index.length > 0) {
                acc[curr] = val;
            } else if (!isNaN(+val)) {
                acc[curr] = +val;
            }
            return acc;
        }, {})
    }

    // Basic set
    static set(model, key, value) {
        return axios.post(`${process.env.REACT_APP_SDM_API_ENDPOINT}/sdm/storage/${model}/${key}`, value);
    }

    // Basic get
    static get(model, key) {
        return axios.get(`${process.env.REACT_APP_SDM_API_ENDPOINT}/sdm/storage/${model}/${key}`);
    }

    // Utility methods get/set

    /**
     * Store a scenario
     * 
     * @param {string} model Name of the model
     * @param {object} value JSON object with one key (and scenario definition) per saved scenario 
     * @returns An Axios promise with info on whether the operation was successful
     */
    static setScenarios(model, value) {
        return Api.set(model, "saved-scenarios", value);
    }

    /**
     * Load all scenarios for a model
     * 
     * @param {string} model Name of the model
     * @returns An Axios promise where the data property contains an object with one key per saved scenario
     */
    static getScenarios(model) {
        return Api.get(model, "saved-scenarios");
    }

    /**
     *  Store model config for a model
     * 
     * @param {string} model Name of model
     * @param {object} value Model configuration object
     * @returns 
     */
    static setConfig(model, value) {
        return Api.set(model, "config", value);
    }
    
    /**
     * Load model config
     * 
     * @param {string} model Name of model
     * @returns 
     */
    static getConfig(model) {
        return Api.get(model, "config");
    }

    // Model execution and doc services
    static getDoc(modelName) {
        return axios.get(`${process.env.REACT_APP_SDM_API_ENDPOINT}/sdm/model/${modelName}/doc`);
    }

    static runModel(modelName, filter) {
        return axios.post(`${process.env.REACT_APP_SDM_API_ENDPOINT}/sdm/model/${modelName}`, Api.sanitizeModelParam(filter));
    }

    static doLogin(authRequest) {
        return axios.post(`${process.env.REACT_APP_SDM_API_ENDPOINT}/auth/login`, authRequest);
    }

    // Session storage
    static sessionSet(key, val) {
        sessionStorage.setItem(key, JSON.stringify(val))
        return;
    }

    static sessionGet(key) {
        return JSON.parse(sessionStorage.getItem(key))
    }


    /**
     * 
     * @param {string} modelName 
     * @param {function} updateModelConfig 
     * @param {function} setFilter 
     * @returns Promise
     */
    static resetConfig(modelName, updateModelConfig, setFilter) {
        return Promise.all([
            Api.getDoc(modelName),
            Api.runModel(modelName, {})
        ]).then((res) => {
            let mDoc = res[0].data;
            let mRes = res[1].data;
            let mResParams = Object.keys(mRes[0]);

            // Create new model config object based on template
            let nmc = {
                ...JSON.parse(JSON.stringify(DefaultConfig)),
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
                    setFilter(defaultFilter);
                    console.warn("Updated filter state")
                    return true;
                }).catch(err => {
                    console.error("Error resetting configuration", err);
                    return false;
                });
        });
    }

    /**
     * Set or get authorizatoin status for user
     * 
     * @param {*} authResponse 
     * @returns 
     */
    static authorized(authResponse = undefined) {
        if (authResponse !== undefined) {
            Api.sessionSet("x-session-auth", authResponse);
        } else {
            return Api.sessionGet("x-session-auth");
        }
    }



}

export default Api
import axios from "axios";

class Api {

    // Basic set
    static set(model, key, value) {
        return axios.post(`${process.env.REACT_APP_SDM_API_ENDPOINT}/storage/set/${model}/${key}`, value);
    }
    
    // Basic get
    static get(model, key) {
        return axios.get(`${process.env.REACT_APP_SDM_API_ENDPOINT}/storage/get/${model}/${key}`);
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
    
    static setConfig(model, value) {
        return Api.set(model, "config", value);
    }
    
    static getConfig(model) {
        return Api.set(model, "config");
    }

    // Model execution and doc services
    static getDoc(modelName) {
        return axios.get(`${process.env.REACT_APP_SDM_API_ENDPOINT}/model/${modelName}/doc`);
    }

    static runModel(modelName, filter) {
        return axios.post(`${process.env.REACT_APP_SDM_API_ENDPOINT}/model/${modelName}`, filter);
    }

}

export default Api
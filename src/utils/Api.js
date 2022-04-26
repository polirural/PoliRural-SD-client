import axios from "axios";

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

    static doRegister(authRequest) {
        return axios.post(`${process.env.REACT_APP_SDM_API_ENDPOINT}/auth/register`, authRequest);
    }

    static getUserList() {
        return axios.get(`${process.env.REACT_APP_SDM_API_ENDPOINT}/auth/user-list`, {"auth": {"username": "runar", "password": "runar"}});
    }

    static deleteUser(username) {
        return axios.delete(`${process.env.REACT_APP_SDM_API_ENDPOINT}/auth/delete-user/${username}`, {"auth": {"username": "runar", "password": "runar"}});
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
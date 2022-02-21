import axios from "axios";

class Api {

    static set(model, key, value) {
        return axios.post(`${process.env.REACT_APP_SDM_API_ENDPOINT}/storage/set/${model}/${key}`, value);
    }
    
    static get(model, key) {
        return axios.get(`${process.env.REACT_APP_SDM_API_ENDPOINT}/storage/get/${model}/${key}`);
    }

    static getDoc(modelName) {
        return axios.get(`${process.env.REACT_APP_SDM_API_ENDPOINT}/model/${modelName}/doc`);
    }

    static runModel(modelName, filter) {
        return axios.post(`${process.env.REACT_APP_SDM_API_ENDPOINT}/model/${modelName}`, filter);
    }

}

export default Api
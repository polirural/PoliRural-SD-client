import { useCallback, useState } from "react";
import Api from "../utils/Api";

import FilterContext from "./FilterContext";

export function FilterProvider({ children }) {

    const [filter, setFilter] = useState({});
    const [auth, setAuth] = useState(Api.authorized());
    const [defaultFilter, setDefaultFilter] = useState({});
    const [showHelp, setShowHelp] = useState(true);
    const [inputParameters, setInputParameters] = useState([]);
    const [displayParameters, setDisplayParameters] = useState([]);
    const [modelConfig, setModelConfig] = useState(null);
    const [scenarios, setScenarios] = useState([]);
    const [runModel, setRunModel] = useState(true);
    const [modelLoading, setModelLoading] = useState(null);

    const updateFilter = useCallback((key, value) => {
        setFilter(prevFilter => {
            prevFilter[key] = value;
            return {
                ...prevFilter,
            }
        });
    }, [setFilter]);

    const updateDefaultFilter = useCallback(filter => {
        setDefaultFilter(filter => {
            return {
                ...filter,
            }
        });
    }, [setDefaultFilter]);

    const updateModelConfig = useCallback(function _updateModalConfig(newModelConfig) {        
        Api.set(newModelConfig.modelName, "config", newModelConfig)
        .then(function _handleResponse(res){
            setModelConfig(newModelConfig);
        })
        .catch(function handleError(err) {
            console.error(err);
        })

    }, [setModelConfig]);

    const providerValue = {
        // The scenario filters
        updateFilter,
        replaceFilter: setFilter,
        filter,
        // The compare scenario filter
        updateDefaultFilter,
        defaultFilter,

        // The boolean flag that determines if to show help 
        setShowHelp,
        showHelp,

        // The list of available input parameters to the model
        updateInputParameters: setInputParameters,
        inputParameters,

        // The list of available output parameters from the model
        updateDisplayParameters: setDisplayParameters,
        displayParameters,

        // The model configuration
        updateModelConfig,
        modelConfig,

        // The stored model scenarios
        updateScenarios: setScenarios,
        scenarios,

        // Flag to determine whether to run model
        setRunModel,
        runModel,

        // Flag to determine if model is presently loading
        setModelLoading,
        modelLoading,

        // Session authentication state
        setAuth,
        auth
    }

    return (
        <FilterContext.Provider value={providerValue}>
            {children}
        </FilterContext.Provider>
    );
}

export default FilterProvider;
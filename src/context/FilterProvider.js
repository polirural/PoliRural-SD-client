import { useCallback, useState } from "react";

import FilterContext from "./FilterContext";

export function FilterProvider({ children }) {

    const [filter, setFilter] = useState({});
    const [defaultFilter, setDefaultFilter] = useState({});
    const [showHelp, setShowHelp] = useState(true);
    const [inputParameters, setInputParameters] = useState([]);
    const [displayParameters, setDisplayParameters] = useState([]);
    const [modelConfig, setModelConfig] = useState(null);
    const [scenarios, setScenarios] = useState([]);

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

    const providerValue = {
        updateFilter,
        replaceFilter: setFilter,
        filter,
        updateDefaultFilter,
        defaultFilter,
        setShowHelp,
        showHelp,
        updateInputParameters: setInputParameters,
        inputParameters,
        updateDisplayParameters: setDisplayParameters,
        displayParameters,
        updateModelConfig: setModelConfig,
        modelConfig,
        updateScenarios: setScenarios,
        scenarios
    }

    return (
        <FilterContext.Provider value={providerValue}>
            {children}
        </FilterContext.Provider>
    );
}

export default FilterProvider;
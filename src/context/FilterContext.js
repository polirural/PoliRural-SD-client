import { createContext } from "react";

const FilterContext = createContext({
    updateFilter: (key, value) => { },
    filter: {},
    updateDefaultFilter: (key, value) => { },
    defaultFilter: {},
    setShowHelp: (b) => true,
    showHelp: true,
    updateInputParameters: (b) => true,
    inputParameters: [],
    updateDisplayParameters: (b) => true,
    displayParameters: [],
    updateModelConfig: (b) => true,
    modelConfig: null
});

export default FilterContext;
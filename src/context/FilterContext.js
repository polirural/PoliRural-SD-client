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
    modelConfig: null,
    setRunModel: ()=>true,
    runModel: true,
    setModelLoading: ()=>true,
    modelLoading: false
});

export default FilterContext;
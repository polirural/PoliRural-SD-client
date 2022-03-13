import { createContext } from "react";
import { VIEW_MODE } from "../config/config";

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
    modelLoading: false,
    setAuth: ()=>undefined,
    auth: null,
    setInputParameterMode: ()=>true,
    inputParameterMode: VIEW_MODE.WIZARD 
});

export default FilterContext;
import { useReducer } from "react";
import { VIEW_MODE } from "../config/config";
import Api from "../utils/Api";
import ReducerContext from "./ReducerContext";

const initialState = {
    auth: Api.authorized(),
    modelConfig: null,
    modelName: null,
    filter: null,
    defaultFilter: null,
    scenarios: null,
    compareScenario: null,
    showHelp: true,
    inputParameters: [],
    displayParameters: [],
    runModel: true,
    modelLoading: false,
    inputParameterMode: VIEW_MODE.WIZARD,
    modelData: null,
    modeDoc: null,
    modelBaselineData: null,
}

function reducer(state, action) {
    switch (action.type) {
        case 'updateFilter':
            let tmpState = {
                filter: {},
                ...state
            };
            tmpState.filter = {
                ...tmpState.filter,
                [action.payload.key]: action.payload.val
            }
            return tmpState;
        case 'updateDefaultFilter':
            let defaultFilter = state.defaultFilter || {};
            defaultFilter[action.payload.key] = action.payload.val;
            return {
                ...state,
                defaultFilter
            };
        case 'setKeyVal':
            return {
                ...state,
                [action.payload.key]: action.payload.val
            };
        case 'initModel':
            return {
                ...state,
                ...action.payload
            }
        case 'runModel':
            return {
                ...state,
                runModel: false,
                modelLoading: true
            }
        case 'modelLoading':
            return {
                ...state,
                modelLoading: action.payload
            }
        case 'closeWizardRun':
            return {
                ...state,
                modelLoading: true,
                runModel: true,
                inputParameterMode: VIEW_MODE.LIST
            }
        case 'loadFilterRunModel':
            return {
                ...state,
                filter: action.payload,
                runModel: true
            }
        case 'logout':
            return {
                ...initialState,
                auth: null
            }
        case 'login':
            return {
                ...state,
                auth: action.payload
            }
        default:
            throw new Error(`Reducer action not implemented: ${action.type}`);
    }
}

export function setKeyVal(key, val) {
    return {
        "type": "setKeyVal",
        "payload": {
            "key": key,
            "val": val
        }
    }
}
// const providerValue = {
//     // The scenario filters
//     updateFilter,
//     setFilter,
//     filter,

//     // The compare scenario filter
//     updateDefaultFilter,
//     setDefaultFilter,
//     defaultFilter,

//     // The boolean flag that determines if to show help 
//     setShowHelp,
//     showHelp,

//     // The list of available input parameters to the model
//     setInputParameters,
//     inputParameters,

//     // The list of available output parameters from the model
//     setDisplayParameters,
//     displayParameters,

//     // The model configuration
//     updateModelConfig,
//     setModelConfig,
//     modelConfig,

//     // The stored model scenarios
//     setScenarios,
//     scenarios,

//     // Flag to determine whether to run model
//     setRunModel,
//     runModel,

//     // Flag to determine if model is presently loading
//     setModelLoading,
//     modelLoading,

//     // Session authentication state
//     setAuth,
//     auth,

//     // Switch input parameter mode between list and wizard mode
//     setInputParameterMode,
//     inputParameterMode,

//     // Set model name
//     setModelName,
//     modelName,

//     // Set compare scenario
//     setCompareScenario,
//     compareScenario
// }

export function ReducerProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ReducerContext.Provider value={{ state, dispatch }}>
            {children}
        </ReducerContext.Provider>
    )
}

export default ReducerProvider;
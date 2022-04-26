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
            if (action.payload.val === null || action.payload.val === undefined) {
                delete tmpState.filter[action.payload.key];
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
        case 'resetDefaultFilter':
            return {
                ...state,
                scenarios: action.payload.scenarios,
                filter: action.payload.filter
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

export function ReducerProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ReducerContext.Provider value={{ state, dispatch }}>
            {children}
        </ReducerContext.Provider>
    )
}

export default ReducerProvider;
// import { useCallback, useState } from "react";
// import { VIEW_MODE } from "../config/config";
// import Api from "../utils/Api";

// import FilterContext from "./FilterContext";

// export function FilterProvider({ children }) {

//     const [modelConfig, setModelConfig] = useState(null);
//     const [filter, setFilter] = useState(null);
//     const [defaultFilter, setDefaultFilter] = useState(null);
//     const [scenarios, setScenarios] = useState(null);
//     const [compareScenario, setCompareScenario] = useState(null);
//     const [auth, setAuth] = useState(Api.authorized());
//     const [showHelp, setShowHelp] = useState(true);
//     const [inputParameters, setInputParameters] = useState([]);
//     const [displayParameters, setDisplayParameters] = useState([]);
//     const [runModel, setRunModel] = useState(true);
//     const [modelLoading, setModelLoading] = useState(null);
//     const [inputParameterMode, setInputParameterMode] = useState(VIEW_MODE.WIZARD);
//     const [modelName, setModelName] = useState(null);

//     const updateFilter = useCallback((key, value) => {
//         setFilter(prevFilter => {
//             return {
//                 ...prevFilter,
//                 [key]: value
//             }
//         });
//     }, [setFilter]);

//     const updateDefaultFilter = useCallback(filter => {
//         setDefaultFilter(filter => {
//             return {
//                 ...filter,
//             }
//         });
//     }, [setDefaultFilter]);

//     const updateModelConfig = useCallback(function _updateModalConfig(newModelConfig) {
//         return Api.setConfig(newModelConfig.modelName, newModelConfig)
//             .then(function _handleResponse(res) {
//                 setModelConfig(newModelConfig);
//             })
//             .catch(function handleError(err) {
//                 console.error("Error updating model configuration", err);
//             })
//     }, [setModelConfig]);

//     // const initialState = {
//     //     modelConfig: null,
//     //     filter: null,
//     //     defaultFilter: null,
//     //     scenarios: null,
//     //     compareScenario: null,
//     //     auth: Api.authorized(),
//     //     showHelp: true,
//     //     inputParameters: [],
//     //     displayParameters: [],
//     //     runModel: false,
//     //     modelLoading: false,
//     //     inputParameterMode: VIEW_MODE.WIZARD,
//     //     modelName: null,
//     //     updateFilter,
//     //     updateDefaultFilter,
//     //     updateModelConfig
//     // }

//     // const [state, hiddenSetState] = useState(initialState);

//     const providerValue = {
//         // The scenario filters
//         updateFilter,
//         setFilter,
//         filter,

//         // The compare scenario filter
//         updateDefaultFilter,
//         setDefaultFilter,
//         defaultFilter,

//         // The boolean flag that determines if to show help 
//         setShowHelp,
//         showHelp,

//         // The list of available input parameters to the model
//         setInputParameters,
//         inputParameters,

//         // The list of available output parameters from the model
//         setDisplayParameters,
//         displayParameters,

//         // The model configuration
//         updateModelConfig,
//         setModelConfig,
//         modelConfig,

//         // The stored model scenarios
//         setScenarios,
//         scenarios,

//         // Flag to determine whether to run model
//         setRunModel,
//         runModel,

//         // Flag to determine if model is presently loading
//         setModelLoading,
//         modelLoading,

//         // Session authentication state
//         setAuth,
//         auth,

//         // Switch input parameter mode between list and wizard mode
//         setInputParameterMode,
//         inputParameterMode,

//         // Set model name
//         setModelName,
//         modelName,

//         // Set compare scenario
//         setCompareScenario,
//         compareScenario
//     }

//     return (
//         <FilterContext.Provider value={providerValue}>
//             {children}
//         </FilterContext.Provider>
//     );
// }

// export default FilterProvider;
import { useContext } from "react"
import ReducerContext from "../context/ReducerContext";

function HelpText({ children }) {

    var { state } = useContext(ReducerContext)
    const { showHelp } = state;

    if (showHelp) {
        return <p className="text-secondary">{children}</p>
    }

    return null;
}

export default HelpText;
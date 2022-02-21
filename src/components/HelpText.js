import FilterContext from "../context/FilterContext"
import { useContext } from "react"

function HelpText({children}) {
    
    var {showHelp} = useContext(FilterContext)
    
    if (showHelp) {
        return <p className="text-secondary">{children}</p>
    }
    
    return null;
}

export default HelpText;
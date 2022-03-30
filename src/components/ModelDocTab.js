import { useContext } from "react";
import { Table } from "react-bootstrap";
import ReducerContext from "../context/ReducerContext";

export function ModelDocTab({ tabTitle }) {

    const { state } = useContext(ReducerContext);
    const { modelDoc } = state;
    
    return (
        <>
            <h3 className="my-3">{tabTitle}</h3>
            {
                Array.isArray(modelDoc) && modelDoc.length > 0 && (
                    <Table striped hover size="sm" responsive="sm">
                        <thead>
                            <tr>
                                <th>Real name</th>
                                <th>Unit</th>
                                <th>Eqn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modelDoc.sort((a, b) => (a["Py Name"].toLowerCase() > b["Py Name"].toLowerCase())).map((k, i) => {
                                return (
                                    <tr key={`tr-item-${i}`}>
                                        <td className="td-30">{k["Real Name"]}</td>
                                        <td className="td-20">{k["Unit"]}</td>
                                        <td className="td-50 td-break-word">{k["Eqn"]}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>)
            }
        </>
    )
}

export default ModelDocTab;
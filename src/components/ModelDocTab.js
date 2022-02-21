import { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import FilterContext from "../context/FilterContext";
import Api from "../utils/Api";

export function ModelDocTab({ tabTitle }) {

    const { updateInputParameters, modelConfig } = useContext(FilterContext);
    const { modelName } = modelConfig;
    const [doc, setDoc] = useState([]);

    useEffect(() => {
        Api.getDoc(modelName)
            .then(function (response) {
                if (response.status === 200) {
                    setDoc(response.data)
                    updateInputParameters(response.data.map(d => d["Real Name"]))
                } else {
                    throw new Error("Error loading model documentation")
                }
            })
            .catch((err) => console.error(err));
    }, [modelName, updateInputParameters])

    return (
        <>
            <h3>{tabTitle}</h3>
            {
                Array.isArray(doc) && doc.length > 0 && (
                    <Table striped hover size="sm" responsive="sm">
                        <thead>
                            <tr>
                                <th>Real name</th>
                                <th>Unit</th>
                                <th>Eqn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doc.map((k, i) => {
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
import { useContext, useEffect } from 'react';

import FilterContext from '../context/FilterContext';
import { Form } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

function NumberInput({ label, defaultValue, min, max, step, parameter }) {

    const { updateFilter } = useContext(FilterContext);

    useEffect(()=>{
        updateFilter(parameter, defaultValue)
    }, [updateFilter, parameter, defaultValue])

    return (
        <Form>
            <Form.Group className="mb-3">
                {label && (<Form.Label>{label}</Form.Label>)}
                <Form.Control
                    type="number"
                    max={max}
                    min={min}
                    step={step}
                    defaultValue={defaultValue}
                    onChange={(e) => updateFilter(parameter, (+e.target.value))} />
            </Form.Group>
        </Form>
    )
}

NumberInput.propTypes = {
    label: PropTypes.string.isRequired,
    parameter: PropTypes.string.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    defaultValue: PropTypes.number,
}

NumberInput.defaultProps = {
    min: undefined,
    max: undefined,
    step: 1
}

export default NumberInput;
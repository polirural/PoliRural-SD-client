import { useContext, useEffect, useState, useCallback } from 'react';

import FilterContext from '../context/FilterContext';
import { Form } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

function NumberInput({ label, min, max, step, parameter, defaultValue }) {

    const { filter, updateFilter } = useContext(FilterContext);
    const [value, setValue] = useState(defaultValue);

    const onChange = useCallback((event) => {
        setValue(+event.target.value || 0)
        updateFilter(parameter, (+event.target.value || 0))
    }, [updateFilter, parameter]);

    useEffect(()=>{
        if (filter[parameter]) {
            setValue(filter[parameter]);
        }
    }, [filter, parameter])

    return (
        <Form>
            <Form.Group className="mb-3">
                {label && (<Form.Label>{label}</Form.Label>)}
                <Form.Control
                    type="number"
                    max={max}
                    min={min}
                    step={step}
                    onChange={onChange}
                    value={value}/>
            </Form.Group>
        </Form>
    )
}

NumberInput.propTypes = {
    label: PropTypes.string.isRequired,
    parameter: PropTypes.string.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number
}

NumberInput.defaultProps = {
    min: undefined,
    max: undefined,
    step: 1
}

export default NumberInput;
import { Form } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

function NumberInput({ label, min, max, name, step, value, onChange }) {

    return (
        <Form>
            <Form.Group className="mb-3">
                {label && (<Form.Label>{label}</Form.Label>)}
                <Form.Control
                    type="number"
                    name={name}
                    max={max}
                    min={min}
                    step={step}
                    onChange={onChange}
                    value={!isNaN(value) ? value : ''} />
            </Form.Group>
        </Form>
    )
}

NumberInput.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    onChange: PropTypes.func
}

NumberInput.defaultProps = {
    label: 'Label',
    name: 'field_name',
    value: 0,
    min: 0,
    max: Infinity,
    step: 1,
    onChange: () => undefined
}

export default NumberInput;
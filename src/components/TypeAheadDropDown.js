// TypeAheadDropDown.js
import './TypeAheadDropDown.css'
import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

export function TypeAheadDropDown({ placeholder, name, items, onChange, value }) {

  const typeAheadRef = useRef();
  const [suggestions, setSuggestions] = useState([]);
  const [currentValue, setCurrentValue] = useState(value);

  const onTextChange = useCallback(function _onTextChange(event) {
    let tmpValue = event.target.value;
    if (tmpValue.length > 0) {
      const regex = new RegExp(`  ${tmpValue}`, `i`);
      let suggestions = items.sort().filter(v => regex.test(v));
      setSuggestions(suggestions);
    } else {
      setSuggestions([]);
    }
    setCurrentValue(tmpValue);
  }, [items]);

  const handleSelectSuggestion = useCallback(function _handleSelectSuggestion(suggestion) {
    setCurrentValue(suggestion);
    setSuggestions([]);
  }, [])

  useEffect(function _handleOnChangeParent() {
    onChange({
      target: {
        name: typeAheadRef.current.name,
        type: typeAheadRef.current.type,
        value: currentValue
      }
    })
  }, [onChange, currentValue]);

  const suggestionItems = useMemo(() => {
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <ul>
        {suggestions.map(suggestion => (
          <li key={`suggestion-${suggestion}`} onClick={() => handleSelectSuggestion(suggestion)}>
            {suggestion}
          </li>))}
      </ul>
    )
  }, [suggestions, handleSelectSuggestion]);

  return (
    <div className="TypeAheadDropDown" >
      <input
        ref={typeAheadRef}
        onChange={onTextChange}
        placeholder={placeholder}
        name={name}
        value={value}
        type="text"
        autoComplete="off" />
      <ul className="dd-suggestions">
        {suggestionItems}
      </ul>
    </div >
  );

}

TypeAheadDropDown.defaultProps = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  onChange: PropTypes.func.isRequired
}

TypeAheadDropDown.defaultProps = {
  placeholder: "",
  name: "typeahead-input-field",
  onChange: (event) => console.debug("onChange not supplied", event)
}

export default TypeAheadDropDown;
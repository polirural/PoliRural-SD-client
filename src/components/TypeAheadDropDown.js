// TypeAheadDropDown.js
import './TypeAheadDropDown.css'
import React from 'react';
import PropTypes from 'prop-types';


class TypeAheadDropDown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      text: ''
    }
  }

  onTextChange = (e) => {
    const { items, name } = this.props;
    let suggestions = [];
    const value = e.target.value;
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, `i`);
      suggestions = items.sort().filter(v => regex.test(v));
    }


    this.setState(() => ({
      suggestions,
      text: value,
      name: name
    }));
  }


  suggestionSelected = (value) => {
    console.log(value);
    this.setState(() => ({
      text: value,
      suggestions: []
    }))
  }

  renderSuggestions = () => {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <ul>
        {suggestions.map(suggestion => <li key={`suggestion-${suggestion}`} onClick={(e) => this.suggestionSelected(suggestion)}>{suggestion}</li>)}
      </ul>
    )
  }


  render() {    
    const { text } = this.state
    const {placeholder, name} = this.props;

    return (
      <div className="TypeAheadDropDown">
        <input onChange={this.onTextChange} placeholder={placeholder} name={name} value={text} type="text" autoComplete="off" />
        {this.renderSuggestions()}
      </div>
    );
  }

}

TypeAheadDropDown.defaultProps = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.any).isRequired
}

TypeAheadDropDown.defaultProps = {
  placeholder:"...",
  name: "typeahead-input-field"
}

export default TypeAheadDropDown;
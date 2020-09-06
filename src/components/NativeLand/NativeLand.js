import React, { Component } from 'react';
import { userLocation } from '../../util/maps';
import css from './NativeLand.css';
import { func } from 'prop-types';

const getQueryParamName = queryParamNames => {
  return Array.isArray(queryParamNames) ? queryParamNames[0] : queryParamNames;
};

class NativeLand extends Component {
  constructor(props) {
    super(props);
    this.selectOption = this.selectOption.bind(this);
    
  }

  selectOption(option, e) {
    console.log(option);
    const { queryParamNames } = this.props.filterConfig;
    const onSelect = this.props.getHandleChangedValueFn(true);
    const queryParamName = getQueryParamName(queryParamNames);
    onSelect({ [queryParamName]: option });

    // blur event target if event is passed
    if (e && e.currentTarget) {
      e.currentTarget.blur();
    }
  }

  render() {
    const tribes = this.props.tribes;
    let landInfo;
    let landPhrase;
    if (tribes.length > 0) {
      landPhrase = <h3>You are on this tribe's land: </h3>
      if (tribes.length > 1) {
        landPhrase = <h3>You are on these tribe's land: </h3>
      } 
      landInfo =
        <div className={css.nativeLand}>
          {landPhrase}
          {tribes.map(t => {
            return(
            <button className={css.button}   
            key={t.properties.Name}            
            onClick={() => this.selectOption(t.properties.Slug)}>
            <h3> {t.properties.Name} </h3>
            </button>
          )})}
          <h5>Click on a tribe's name to search for vendors from that tribe</h5>
        </div>
    }

    return (
      <div>{landInfo}</div>
    );
  }
}

export default NativeLand;

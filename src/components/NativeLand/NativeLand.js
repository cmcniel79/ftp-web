import React, { Component } from 'react';
import { userLocation } from '../../util/maps';
import css from './NativeLand.css';
import { func } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';

const getQueryParamName = queryParamNames => {
  return Array.isArray(queryParamNames) ? queryParamNames[0] : queryParamNames;
};

class NativeLand extends Component {
  constructor(props) {
    super(props);
    this.selectOption = this.selectOption.bind(this);

  }

  selectOption(option, e) {
    const { queryParamNames } = this.props.filterConfig;
    const onSelect = this.props.getHandleChangedValueFn(true);
    const queryParamName = getQueryParamName(queryParamNames);
    console.log(queryParamName);
    onSelect({ [queryParamName]: option });

    // blur event target if event is passed
    if (e && e.currentTarget) {
      e.currentTarget.blur();
    }
  }

  render() {
    const { tribes, initialValues } = this.props;
    const { queryParamNames } = this.props.filterConfig;
    const queryParamName = getQueryParamName(queryParamNames);
    const initialValue = initialValues(queryParamNames);
    const info = tribes.length > 0 ? (
      <div className={css.nativeLandInfo}>
        <div className={css.half}></div>
        <h2 className={css.nativeLandHeader}>
          You Are On Native Land
        </h2>
        {tribes.map(t => {
          return (
            <button className={t.properties.Slug == initialValue[queryParamName] ?
              css.buttonSelected : css.button
            }
              key={t.properties.Name}
              onClick={() => this.selectOption(t.properties.Slug)}>
              <h4 className={css.buttonText}> {t.properties.Name} </h4>
            </button>
          )
        })}
        <button className={css.clearButton} onClick={e => this.selectOption(null, e)}>
          <FormattedMessage id={'SelectSingleFilter.plainClear'} />
        </button>
        <h5>Click on a Tribe's name to search for artists from that tribe</h5>
      </div>
    ) : null;
    return (info);
  }
}

export default NativeLand;

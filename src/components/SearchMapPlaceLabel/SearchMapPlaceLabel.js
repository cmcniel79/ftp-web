import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { ensureUser } from '../../util/data';
import navigateIcon from '../../assets/navigate.svg';
import {
  ExternalLink,
} from '../../components';

import css from './SearchMapPlaceLabel.module.css';

class SearchMapPlaceLabel extends Component {

  constructor(props) {
    super(props);
    this.state = { isShown: false };
    this.setIsShown = this.setIsShown.bind(this);
  }


  setIsShown(bool) {
    this.setState({ isShown: bool });
  }

  render() {
    const { className, rootClassName, event, coordinates } = this.props;
    const classes = classNames(rootClassName || css.root, className);

    const fullCard = (
      <div className={classes}>
        <div className={css.topContainer}>
          <div className={css.titleContainer}>
            <h3 className={css.popupTitle}>{event.features[0].properties.nativeName}</h3>
            <p className={css.popupSubtitle}>Diné Bizaad</p>
          </div>
          <ExternalLink
            className={css.popupLink}
            href={"https://www.google.com/maps/search/?api=1&query=" + coordinates[1] + "," + coordinates[0]}
          >
            <img className={css.linkIcon} src={navigateIcon} alt="Navigate" />
          </ExternalLink>
        </div>
        <div className={css.popupCard}>
          <img
            className={css.popupImage}
            alt="Logo"
            src={"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Navajo_flag.svg/1920px-Navajo_flag.svg.png"}
          />
          <div className={css.popupTextContainer}>
            <p className={css.popupText}>
              A Navajo Nation chapter house named after a Mexican man who settled near there. English name is&nbsp;
            {event.features[0].properties.englishName}.
            </p>
          </div>
        </div>
      </div>
    );

    return (
      this.state.isShown ?
        fullCard : (
          <button
            className={classes}
            onClick={() => this.setState({ isShown: true })}
          >
            Click Here!
          </button>
        )
    );
  }
};

SearchMapPlaceLabel.defaultProps = {
  className: null,
  rootClassName: null,
};

const { func, string } = PropTypes;

SearchMapPlaceLabel.propTypes = {
  className: string,
  rootClassName: string,
};

export default SearchMapPlaceLabel;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import navigateIcon from '../../assets/navigate.svg';
import { ExternalLink } from '../../components';

import css from './SearchMapPlaceLabel.module.css';

const IMGIX_DOMAIN = 'https://nativeplaces.imgix.net/';

class SearchMapPlaceLabel extends Component {

  constructor(props) {
    super(props);
    this.state = { isShown: props.isTouchEvent ? true : false };
    this.setIsShown = this.setIsShown.bind(this);
  }


  setIsShown(bool) {
    this.setState({ isShown: bool });
  }

  render() {
    const { className, rootClassName, event, coordinates } = this.props;
    console.log(event);
    const classes = classNames(rootClassName || css.root, className, this.state.isShown ? css.card : css.label);
    const eventExists = event && event.features && event.features[0];
    const translation = eventExists && event.features[0].properties.translation;
    const background = eventExists && event.features[0].properties.background;

    const popupText = !translation && !background ? (
      <p className={css.popupText}>
        This entry has no translation or background info.
        You can help by submitting information for this location through our&nbsp;
        <ExternalLink href="https://www.fromthepeople.co/contact">Contact Page</ExternalLink>
      </p>
    ) : (
      <div>
        {translation ? (
          <p className={css.popupText}>
            <b>
              Translation:&nbsp;
            </b>
            {translation}
          </p>
        ) : null}
        <p className={css.popupText}>
          {background}
        </p>
      </div>
    );

    const fullCard = eventExists ? (
      <div className={classes} onClick={() => !this.props.isTouchEvent ? this.setState({ isShown: false }) : null}>
        <div className={css.topContainer}>
          <div className={css.titleContainer}>
            <h3 className={css.popupTitle}>{event.features[0].properties.nativeName}</h3>
            <p className={css.popupSubtitle}>{event.features[0].properties.language}</p>
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
            src={IMGIX_DOMAIN + event.features[0].properties.imageId}
          />
          <div className={css.popupTextContainer}>
            {popupText}
          </div>
        </div>
      </div>
    ) : null;

    return (
      eventExists && this.state.isShown ? fullCard
        : eventExists ? (
          <button
            className={classes}
            onClick={() => this.setState({ isShown: true })}
          >
            <h3 className={css.popupTitle}>{event.features[0].properties.nativeName}</h3>
            <p className={css.popupText}>{event.features[0].properties.type}</p>
          </button>
        ) : null
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

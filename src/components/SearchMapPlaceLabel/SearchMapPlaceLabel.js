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

    const eventExists = event && event.features && event.features[0];
    const nativeName = eventExists && event.features[0].properties.nativeName;
    const englishName = eventExists && event.features[0].properties.englishName;
    const language = eventExists && event.features[0].properties.language;
    const translation = eventExists && event.features[0].properties.translation;
    const background = eventExists && event.features[0].properties.background;
    const type = eventExists && event.features[0].properties.type;
    const imageId = eventExists && event.features[0].properties.imageId;
    const showNav = eventExists && event.features[0].properties.showNav;

    const popupClasses = classNames(rootClassName || css.root, className, this.state.isShown ? css.card : css.label);
    const popupCardClasses = imageId ? css.cardHasImage : css.cardNoImage;
    const popupTitle = nativeName ? nativeName : englishName;

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
        {background ? (
          <p className={css.popupText}>
            {background}
          </p>
        ) : null}
      </div>
    );

    const fullCard = eventExists ? (
      <div className={popupClasses} onClick={() => !this.props.isTouchEvent ? this.setState({ isShown: false }) : null}>
        <div className={css.topContainer}>
          <div className={css.titleContainer}>
            <h3 className={css.popupTitle}>{popupTitle}</h3>
            {language ? (
              <p className={css.popupSubtitle}>{language}</p>
            ) : null}
          </div>
          {showNav ? (
            <ExternalLink
              className={css.popupLink}
              href={"https://www.google.com/maps/search/?api=1&query=" + coordinates[1] + "," + coordinates[0]}
            >
              <img className={css.linkIcon} src={navigateIcon} alt="Navigate" />
            </ExternalLink>
          ) : null}
        </div>
        <div className={popupCardClasses}>
          {imageId ? (
            <img
              className={css.popupImage}
              alt={englishName}
              src={IMGIX_DOMAIN + imageId}
            />
          ) : null}
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
            className={popupClasses}
            onClick={() => this.setState({ isShown: true })}
          >
            <h3 className={css.popupTitle}>{popupTitle}</h3>
            {type ? (
              <p className={css.labelText}>{type}</p>
            ) : null}
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

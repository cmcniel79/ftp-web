import React, { Component } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { string } from 'prop-types';
import { ExternalLink, InlineTextButton } from '../../components';
import truncate from 'lodash/truncate';
import navigateIcon from '../../assets/navigate.svg';
import shareIcon from '../../assets/share.svg';
import exitIcon from '../../assets/exit.svg';

import css from './SingleEventPage.module.css';

// Approximated collapsed size so that there are ~three lines of text
// in the desktop layout in the host section of the ListingPage.
const BIO_COLLAPSED_LENGTH = 160;

const truncated = s => {
  return truncate(s, {
    length: BIO_COLLAPSED_LENGTH,

    // Allow truncated text end only in specific characters. This will
    // make the truncated text shorter than the length if the original
    // text has to be shortened and the substring ends in a separator.
    //
    // This ensures that the final text doesn't get cut in the middle
    // of a word.
    separator: /\s|,|\.|:|;/,
    omission: '',
  });
};


class ExpandableBio extends Component {
  constructor(props) {
    super(props);
    this.state = { expand: false };
  }
  render() {
    const { expand } = this.state;
    const { className, bio } = this.props;
    const truncatedBio = truncated(bio);

    const handleShowMoreClick = () => {
      this.setState({ expand: true });
    };
    const handleShowLessClick = () => {
      this.setState({ expand: false });
    };
    const showMore = (
      <InlineTextButton rootClassName={css.showMore} onClick={handleShowMoreClick}>
        <FormattedMessage id="UserCard.showFullBioLink" />
      </InlineTextButton>
    );
    const showLess = (
      <InlineTextButton rootClassName={css.showMore} onClick={handleShowLessClick}>
        <FormattedMessage id="UserCard.showLessBioLink" />
      </InlineTextButton>
    );
    return (
      <p className={className}>
        {expand ? bio : truncatedBio}
        &nbsp;
        {bio !== truncatedBio && !expand ? showMore : bio && bio.length > BIO_COLLAPSED_LENGTH ? showLess : null}
      </p>
    );
  }
}

ExpandableBio.defaultProps = { className: null };

ExpandableBio.propTypes = {
  className: string,
  bio: string.isRequired,
};

const shareButtonClick = urlToProfile => {
  if (navigator.share) {
    navigator.share({
      text: 'Check out this awesome event on From The People!',
      url: urlToProfile
    })
      .catch(() => {
        console.log('Could not share link');
      });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(urlToProfile)
      .then(() => {
        console.log("Copy was successful");
      })
      .catch(() => {
        console.log('Could not share link');
      });
  }
  // https://medium.com/@feargswalsh/copying-to-the-clipboard-in-react-81bb956963ec
};

const SectionHost = props => {
  const {
    className,
    eventName,
    eventDescription,
    eventWebsite,
    eventType,
    imageUUID,
    dateString,
    optionalData,
    eventAddress
  } = props;

  const buttonRowClasses = eventAddress && eventWebsite ? css.buttonRowThree :
    (!eventAddress && eventWebsite) || (eventAddress && !eventWebsite) ? css.buttonRowTwo : css.buttonRowOne;

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURI(eventAddress);

  const mc = optionalData && optionalData.mc;
  const arenaDirector = optionalData && optionalData.arenaDirector;
  const hostDrums = optionalData && optionalData.hostDrums;
  const powwowOptionalData = eventType === "powwow" ? (
    <div className={css.optionalData}>
      { mc ? <p><b><FormattedMessage id="SingleEventPage.mc" /></b> {mc} </p> : null}
      { hostDrums ? <p><b><FormattedMessage id="SingleEventPage.hostDrums" /></b> {hostDrums} </p> : null }
      { arenaDirector ? <p><b><FormattedMessage id="SingleEventPage.arenaDirector" /></b> {arenaDirector} </p> : null }
    </div>
  ) : null;

  const pageTitle = (
    <div className={css.titleContainer} >
      <h1 className={css.pageTitle}>
        <FormattedMessage id="SingleEventPage.heading" values={{ eventName }} />
      </h1>
      <h3 className={css.pageSubtitleDesktop}>
        {dateString}
        {eventAddress ?
          <div className={css.subtitleOptionalData}>
            <span className={css.separator}>•</span>
            {eventAddress}
          </div>
          : null}
      </h3>
      <h3 className={css.pageSubtitleMobile}>
        <span>{dateString}</span>
        <span>{eventAddress}</span>
      </h3>
    </div> );
   
   const eventImage = imageUUID ? "https://ftpevents.imgix.net/" + imageUUID : "https://ftpevents.imgix.net/EventsLogo2.png";

  return (
    <div className={className}>
      <div className={css.mobileTitle}>
        {pageTitle}
      </div>
      <div className={css.hostImageWrapper}>
        <img className={css.hostImage} src={eventImage} alt="stanford" />
        <div className={buttonRowClasses} >
          {eventAddress &&
            <ExternalLink
              className={css.linkButton}
              href={googleMapsUrl}
            >
              <img className={css.linkIcon} src={navigateIcon} alt="Navigate" />
              <FormattedMessage id="SingleEventPage.navigateButton" />
            </ExternalLink>}
          {eventWebsite &&
            <ExternalLink
              className={css.linkButton}
              href={eventWebsite}
            >
              <img className={css.linkIcon} src={exitIcon} alt="Link" />
              <FormattedMessage id="SingleEventPage.websiteButton" />
            </ExternalLink>}
          <button
            className={css.shareButton}
            onClick={() => shareButtonClick(window.location.href)}
          >
            <img className={css.shareIcon} src={shareIcon} alt="Share" />
            <FormattedMessage id="SingleEventPage.shareButton" />
          </button>
        </div>
      </div>
      <div className={css.hostInfo}>
        <div className={css.desktopTitle}>
          {pageTitle}
        </div>
        <h2 className={css.sectionHeading}>
          <FormattedMessage id="SingleEventPage.hostHeading" />
        </h2>
        <div className={css.desktopBio}>
          <p>
            {eventDescription}
          </p>
        </div>
        <ExpandableBio className={css.mobileBio} bio={eventDescription} />
        {powwowOptionalData}
      </div >
    </div >
  );
};

export default SectionHost;

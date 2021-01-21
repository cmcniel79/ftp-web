import React, { Component } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { string } from 'prop-types';
import stanfordImage from '../../assets/stanford-bg.jpg';
import { ExternalLink, InlineTextButton } from '../../components';
import truncate from 'lodash/truncate';
import navigateIcon from '../../assets/navigate.svg';
import shareIcon from '../../assets/share.svg';
import exitIcon from '../../assets/exit.svg';

import css from './SingleEventPage.css';

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


const SectionHost = props => {
  const {
    eventDescription,
    eventWebsite,
    className
  } = props;

  const website = "http://powwow.stanford.edu/";
  const eventAddress = "410 Terry Ave, North Seattle, United States";
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURI(eventAddress);
  return (
    <div className={className}>
      <div className={css.hostImageWrapper}>
        <img className={css.hostImage} src={stanfordImage} alt="stanford" />
      </div>
      <div className={css.hostInfo}>
        <div className={css.buttonRow} >
          {eventAddress &&
            <ExternalLink
              className={css.linkButton}
              href={googleMapsUrl}
            >
              <img className={css.linkIcon} src={navigateIcon} alt="Navigate" />
              <FormattedMessage id="SingleEventPage.navigateButton" />
            </ExternalLink>}
          {website &&
            <ExternalLink
              className={css.linkButton}
              href={website}
            >
              <img className={css.linkIcon} src={exitIcon} alt="Link" />
              <FormattedMessage id="SingleEventPage.websiteButton" />
            </ExternalLink>}
          <button
            className={css.shareButton}
            onClick={() => this.shareButtonClick(window.location.href)}
          >
            <img className={css.shareIcon} src={shareIcon} alt="Share" />
            <FormattedMessage id="SingleEventPage.shareButton" />
          </button>
        </div>
        <ExpandableBio className={css.mobileBio} bio={eventDescription} />
      </div >
    </div >
  );
};

export default SectionHost;

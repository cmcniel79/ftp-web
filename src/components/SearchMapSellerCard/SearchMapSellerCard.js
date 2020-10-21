import React, { Component } from 'react';
import { arrayOf, bool, func, string } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import { propTypes } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { ensureUser } from '../../util/data';
import { Button, ResponsiveImage, NamedLink, ExternalLink, UserCard, InlineTextButton, UserSocialMedia } from '../../components';
import truncate from 'lodash/truncate';

import css from './SearchMapSellerCard.css';

// Approximated collapsed size so that there are ~three lines of text
// in the desktop layout in the host section of the ListingPage.
const BIO_COLLAPSED_LENGTH = 60;
const AVATAR_IMAGE_VARIANTS = [
  // 40x40
  'square-xsmall',

  // 80x80
  'square-xsmall2x',

  // 240x240
  'square-small',

  // 480x480
  'square-small2x',
];

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
        <FormattedMessage id="SellerCard.showFullBioLink" />
      </InlineTextButton>
    );
    const showLess = (
      <InlineTextButton rootClassName={css.showLess} onClick={handleShowLessClick}>
        <FormattedMessage id="SellerCard.showLessBioLink" />
      </InlineTextButton>
    );
    return (
      <p className={className}>
        {/* <FormattedMessage className={css.heading} id="SellerCard.companyBio" /> */}
        {expand ? bio : truncatedBio}
        {bio !== truncatedBio && !expand ? showMore : showLess}
      </p>
    );
  }
}

ExpandableBio.defaultProps = { className: null };

ExpandableBio.propTypes = {
  className: string,
  bio: string.isRequired,
};

function shareButtonClick(params) {
  if (navigator.share) {
    navigator.share({
      title: 'My awesome post!',
      text: 'This post may or may not contain the answer to the universe',
      url: 'https://www.google.com/'
    }).then(() => {
      console.log('Thanks for sharing!');
    })
      .catch(err => {
        console.log(`Couldn't share because of`, err.message);
      });
  } else {
    console.log('web share not supported');
  }
}

const SellerCard = props => {
  const { urlToProfile, user } = props;
  const { displayName, bio } = user.attributes.profile;

  // Gather custom data fields from seller's account
  const companyWebsite = user.attributes.profile.publicData.companyWebsite ?
    user.attributes.profile.publicData.companyWebsite : null;
  const companyName = user.attributes.profile.publicData.companyName ?
    user.attributes.profile.publicData.companyName : null;
  const companyAddress = user.attributes.profile.publicData.companyLocation ?
    user.attributes.profile.publicData.companyLocation.location.selectedPlace.address : null;
  const companyLatLng = user.attributes.profile.publicData.companyLocation ?
    user.attributes.profile.publicData.companyLocation.location.selectedPlace.origin : null;
  const companyBuilding = user.attributes.profile.publicData.companyLocation ?
    user.attributes.profile.publicData.companyLocation.building : null;
  const socialMedia = user.attributes.profile.publicData.socialMedia ?
    user.attributes.profile.publicData.socialMedia : null;
  const tribe = user.attributes.profile.publicData.tribe ?
    user.attributes.profile.publicData.tribe : null;
  const industry = user.attributes.profile.publicData.industry ?
    user.attributes.profile.publicData.industry : "Other";

  const hasBio = !!bio;

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + companyLatLng.lat + "," + companyLatLng.lng;

  const links = companyLatLng ? (
    <p className={css.link}>
      <ExternalLink className={css.link} href={googleMapsUrl}>
        <FormattedMessage id="SellerCard.getDirections" />
      </ExternalLink>
      {companyWebsite &&
        <span>
          <span className={css.separator}>•</span>
          <ExternalLink href={companyWebsite}>
            <FormattedMessage id="SellerCard.companyWebsite" />
          </ExternalLink>
        </span>
      }
    </p>
  ) : null;

  const subHeading = tribe ? (
    <p className={css.subHeading}>
      {tribe}
    </p>
  ) : null;

  return (
    <div className={css.card}>
      <div className={css.content}>
        <ResponsiveImage
          rootClassName={css.premiumAvatar}
          alt="Logo"
          image={user.profileImage}
          variants={AVATAR_IMAGE_VARIANTS}
        />
        <div className={css.info}>
          <h3 className={css.heading}>
            {companyName ?
              <FormattedMessage id="SellerCard.heading" values={{ name: companyName }} />
              :
              <FormattedMessage id="SellerCard.heading" values={{ name: displayName }} />
            }
          </h3>
          {subHeading}
          <UserSocialMedia socialMedia={socialMedia} />
        </div>
      </div>
      {links}
      <Button
      onClick={shareButtonClick()}>
        ShareButton
      </Button>
        {hasBio &&
        <div className={css.addressSection}>
          <ExpandableBio className={css.bio} bio={bio} />
        </div>
        }
    </div>
  );
};

SellerCard.defaultProps = {
        user: null,
};

SellerCard.propTypes = {
        user: propTypes.user.isRequired,
};

class SearchMapSellerCard extends Component {
        constructor(props) {
        super(props);
    this.state = { currentUserIndex: 0 };
  }

  render() {
    const {
        className,
        rootClassName,
        users,
        createURLToProfile,
    } = this.props;
    console.log(users);
    const currentSeller = ensureUser(users[this.state.currentUserIndex]);
    const classes = classNames(rootClassName || css.root, className);
    return (
      <div className={classes}>
        <div className={css.caretShadow} />
        <SellerCard
          urlToProfile={createURLToProfile(currentSeller)}
          user={currentSeller}
        />
        <div className={css.caret} />
      </div>
    );
  }
}

SearchMapSellerCard.defaultProps = {
        className: null,
  rootClassName: null,
};

SearchMapSellerCard.propTypes = {
        className: string,
  rootClassName: string,
  users: arrayOf(propTypes.user).isRequired,
  onUserInfoCardClicked: func.isRequired,
  createURLToProfile: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default compose(injectIntl)(SearchMapSellerCard);

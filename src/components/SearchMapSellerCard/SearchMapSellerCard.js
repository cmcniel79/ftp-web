import React, { Component } from 'react';
import { arrayOf, func, string } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { ensureUser } from '../../util/data';
import { ResponsiveImage, ExternalLink } from '../../components';
import navigateIcon from './Images/navigate.svg';
import shareIcon from './Images/share.svg';
import exitIcon from '../../assets/exit.svg';
import { userAbbreviatedName } from '../../util/data';

import css from './SearchMapSellerCard.css';
// import { txHasBeenDelivered } from '../../util/transaction';

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

const SellerCard = props => {
  const { urlToProfile, user, shareButtonClick, wasCopySuccessful } = props;
  const { displayName, publicData } = user.attributes.profile;

  const abbreviatedName = userAbbreviatedName(user, "");
  // Gather custom data fields from seller's account
  const companyWebsite = publicData.companyWebsite ? user.attributes.profile.publicData.companyWebsite : null;
  const companyLatLng = publicData.companyLocation ? publicData.companyLocation.location.selectedPlace.origin : null;
  const companyName = publicData.companyName ? publicData.companyName : null;
  const tribe = publicData.tribe ? publicData.tribe : null;
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + companyLatLng.lat + "," + companyLatLng.lng;
  const profileTitle = companyName ? companyName : displayName;
  return (
    <div className={css.card}>
      <div className={css.content}>
        {user.profileImage && user.profileImage.id ?
          <ResponsiveImage
            rootClassName={css.premiumAvatar}
            alt="Logo"
            image={user.profileImage}
            variants={AVATAR_IMAGE_VARIANTS}
          />
          :
          <span className={css.initials}>{abbreviatedName}</span>
        }
        <div className={css.info}>
          <h2 className={css.heading}>
            <FormattedMessage id="SellerCard.heading" values={{ name: profileTitle }} />
          </h2>
          {tribe &&
            <p className={css.subHeading}>
              {tribe}
            </p>
          }
          <p className={css.subHeading}>
            <ExternalLink href={urlToProfile}>
              <FormattedMessage id="SellerCard.visitProfile" />
            </ExternalLink>
          </p>
        </div>
      </div>
      <div className={css.buttonRow} >
        {companyLatLng &&
          <ExternalLink
            className={css.linkButton}
            href={googleMapsUrl}
          >
            <img className={css.linkIcon} src={navigateIcon} alt="Navigate"/>
            <FormattedMessage id="SellerCard.navigateButton" />
          </ExternalLink>
        }
        {companyWebsite &&
          <ExternalLink
            className={css.linkButton}
            href={companyWebsite}
          >
            <img className={css.linkIcon} src={exitIcon} alt="Link"/>
            <FormattedMessage id="SellerCard.websiteButton" />
          </ExternalLink>
        }
        <button
          className={css.shareButton}
          onClick={() => shareButtonClick(urlToProfile)}
        >
          <img className={css.shareIcon} src={shareIcon} alt="Share"/>
          <FormattedMessage id="SellerCard.shareButton" />
        </button>
      </div>
      {wasCopySuccessful === true ?
        <p className={css.copyStatus}>
          <FormattedMessage id="SellerCard.copySuccess" values={{ profileTitle }} />
        </p>
        : wasCopySuccessful === false ?
          <p className={css.copyStatus}>
            <FormattedMessage id="SellerCard.copyFailure" values={{ profileTitle }} />
          </p> : null
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
    this.state = { currentUserIndex: 0, wasCopySuccessful: null };
    this.shareButtonClick = this.shareButtonClick.bind(this);
  }

  shareButtonClick(urlToProfile) {
    if (navigator.share) {
      navigator.share({
        text: 'Check out this awesome profile on From The People!',
        url: urlToProfile
      })
        .catch(() => {
          console.log('Could not share link');
        });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(urlToProfile)
        .then(() => {
          this.setState({ wasCopySuccessful: true })
        })
        .catch(() => {
          console.log('Could not share link');
        });
    }
    // https://medium.com/@feargswalsh/copying-to-the-clipboard-in-react-81bb956963ec
  }

  render() {
    const {
      className,
      rootClassName,
      users,
      createURLToProfile,
    } = this.props;
    const currentSeller = ensureUser(users[this.state.currentUserIndex]);
    const classes = classNames(rootClassName || css.root, className);
    const urlToProfile = createURLToProfile(currentSeller);

    return (
      <div className={classes}>
        <div className={css.caretShadow} />
        <SellerCard
          urlToProfile={urlToProfile}
          shareButtonClick={this.shareButtonClick}
          user={currentSeller}
          wasCopySuccessful={this.state.wasCopySuccessful}
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

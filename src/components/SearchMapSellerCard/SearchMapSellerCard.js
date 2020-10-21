import React, { Component, Clipboard } from 'react';
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
import navigateIcon from './Images/navigate.svg';
import shareIcon from './Images/share.svg';
import exitIcon from '../../assets/exit.svg';

import css from './SearchMapSellerCard.css';

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

function shareButtonClick(urlToProfile) {
  if (navigator.share) {
    navigator.share({
      text: 'Check out this awesome profile on From The People!',
      url: urlToProfile
    })
      .then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(err => {
        console.log(`Couldn't share because of`, err.message);
      });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(urlToProfile)
    .then(() => {
        console.log("copy success");
      })
    .catch(err => {
       console.log(`Couldn't copy because of`, err.message);
      });
  } else {
    console.log("could not copy");
  }
  // https://medium.com/@feargswalsh/copying-to-the-clipboard-in-react-81bb956963ec
}

const SellerCard = props => {
  const { urlToProfile, user } = props;
  const { displayName, publicData } = user.attributes.profile;

  // Gather custom data fields from seller's account
  const companyWebsite = publicData.companyWebsite ? user.attributes.profile.publicData.companyWebsite : null;
  const companyLatLng = publicData.companyLocation ? publicData.companyLocation.location.selectedPlace.origin : null;
  const companyName = publicData.companyName ? publicData.companyName : null;
  const tribe = publicData.tribe ? publicData.tribe : null;
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + companyLatLng.lat + "," + companyLatLng.lng;
  
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
          <h2 className={css.heading}>
            {companyName ?
              <FormattedMessage id="SellerCard.heading" values={{ name: companyName }} />
              :
              <FormattedMessage id="SellerCard.heading" values={{ name: displayName }} />
            }
          </h2>
          {tribe &&
            <p className={css.subHeading}>
              {tribe}
            </p>
          }
          <p className={css.subHeading}>
            <a href={urlToProfile}>
              <FormattedMessage id="SellerCard.visitProfile" />
            </a>
          </p>
        </div>
      </div>
      <div className={css.buttonRow} >
        {companyLatLng &&
          <ExternalLink
            className={css.linkButton}
            href={googleMapsUrl}
          >
            <img className={css.linkIcon} src={navigateIcon} />
            <FormattedMessage id="SellerCard.navigateButton" />
          </ExternalLink>
        }
        {companyWebsite &&
          <ExternalLink
            className={css.linkButton}
            href={companyWebsite}
          >
            <img className={css.linkIcon} src={exitIcon} />
            <FormattedMessage id="SellerCard.websiteButton" />
          </ExternalLink>
        }
        <button
          className={css.shareButton}
          onClick={shareButtonClick(urlToProfile)}
        >
          <img className={css.shareIcon} src={shareIcon} />
          <FormattedMessage id="SellerCard.shareButton" />
        </button>
      </div>
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

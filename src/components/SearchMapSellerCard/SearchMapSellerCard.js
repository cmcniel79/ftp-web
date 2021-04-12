import React, { Component } from 'react';
import { arrayOf, func, string } from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { ensureUser } from '../../util/data';
import { ResponsiveImage, ExternalLink } from '../../components';
import navigateIcon from '../../assets/navigate.svg';
import shareIcon from '../../assets/share.svg';
import exitIcon from '../../assets/exit.svg';
import { userAbbreviatedName } from '../../util/data';
import { IconChevronBack, IconChevronForward } from '../../components';


import css from './SearchMapSellerCard.module.css';
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
  const { urlToProfile, user, shareButtonClick, wasCopySuccessful, showButtons, changeUser } = props;
  const { displayName, publicData } = user.attributes.profile;

  const abbreviatedName = userAbbreviatedName(user, "");
  // Gather custom data fields from seller's account
  const companyWebsite = publicData && publicData.companyWebsite ? user.attributes.profile.publicData.companyWebsite : null;
  const companyAddress = publicData && publicData.companyLocation ? publicData.companyLocation.location.selectedPlace.address : null;
  const companyName = publicData && publicData.companyName ? publicData.companyName : null;
  const tribe = publicData && publicData.tribe ? publicData.tribe : null;
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURI(companyAddress);
  const profileTitle = companyName ? companyName : displayName;
  const accountType = publicData && publicData.accountType ? publicData.accountType : null;
  const cardClasses = showButtons ? css.cardWithButtons : css.card;
  return (
    <div className={cardClasses}>
      <div className={css.content}>
        {showButtons ?
          <button className={css.backButton} onClick={() => changeUser(false)}>
            <IconChevronBack className={css.chevron} />
          </button> : null}
        {user.profileImage && user.profileImage.id ? (
          <ResponsiveImage
            rootClassName={css.premiumAvatar}
            alt="Logo"
            image={user.profileImage}
            variants={AVATAR_IMAGE_VARIANTS}
          />
        ) : (
          <span className={css.initials}>{abbreviatedName}</span>
        )}
        <div className={css.info}>
          <h2 className={css.heading}>
            <FormattedMessage id="SellerCard.heading" values={{ name: profileTitle }} />
          </h2>
          {tribe &&
            <p className={css.subHeading}>
              {tribe}
            </p>}
          {urlToProfile &&
            <p className={css.subHeading}>
              <ExternalLink href={urlToProfile}>
                <FormattedMessage id="SellerCard.visitProfile" />
              </ExternalLink>
            </p>}
        </div>
        {showButtons ?
          <button className={css.forwardButton} onClick={() => changeUser(true)}>
            <IconChevronForward className={css.chevron} />
          </button> : null}
      </div>
      {accountType !== 'e' ?
        <div className={css.buttonRow} >
          {companyAddress &&
            <ExternalLink
              className={css.linkButton}
              href={googleMapsUrl}
            >
              <img className={css.linkIcon} src={navigateIcon} alt="Navigate" />
              <FormattedMessage id="SellerCard.navigateButton" />
            </ExternalLink>
          }
          {companyWebsite &&
            <ExternalLink
              className={css.linkButton}
              href={companyWebsite}
            >
              <img className={css.linkIcon} src={exitIcon} alt="Link" />
              <FormattedMessage id="SellerCard.websiteButton" />
            </ExternalLink>
          }
          <button
            className={css.shareButton}
            onClick={() => shareButtonClick(urlToProfile)}
          >
            <img className={css.shareIcon} src={shareIcon} alt="Share" />
            <FormattedMessage id="SellerCard.shareButton" />
          </button>
        </div> : null}
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
    this.changeUser = this.changeUser.bind(this);
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

  changeUser(forward) {
    const index = this.state.currentUserIndex;
    const length = this.props.users.length;
    if (forward) {
      if (index >= length - 1) {
        this.setState({ currentUserIndex: 0 });
      } else {
        this.setState({ currentUserIndex: (index + 1) });
      }
    } else {
      if (index === 0) {
        this.setState({ currentUserIndex: (length - 1) });
      } else {
        this.setState({ currentUserIndex: (index - 1) });
      }
    }
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
    const showButtons = users && users.length > 1 ? true : false;

    return (
      <div className={classes}>
        <div className={css.caretShadow} />
        <SellerCard
          urlToProfile={urlToProfile}
          shareButtonClick={this.shareButtonClick}
          user={currentSeller}
          wasCopySuccessful={this.state.wasCopySuccessful}
          showButtons={showButtons}
          changeUser={this.changeUser}
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

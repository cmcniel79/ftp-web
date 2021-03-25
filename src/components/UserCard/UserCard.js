import React, { Component } from 'react';
import { string, oneOfType } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import truncate from 'lodash/truncate';
import classNames from 'classnames';
import { AvatarLarge, NamedLink, InlineTextButton, UserSocialMedia, ExternalLink, FollowButton } from '../../components';
import { ensureUser, ensureCurrentUser } from '../../util/data';
import { propTypes } from '../../util/types';
import exit from '../../assets/exit-white.svg';

import css from './UserCard.module.css';

// Approximated collapsed size so that there are ~three lines of text
// in the desktop layout in the host section of the ListingPage.
const BIO_COLLAPSED_LENGTH = 120;

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

const UserCard = props => {
  const { rootClassName, className, user, currentUser, onContactUser, isFollowed, updateFollowed, isFollowingPage } = props;

  const userIsCurrentUser = user && user.type === 'currentUser';
  const ensuredUser = userIsCurrentUser ? ensureCurrentUser(user) : ensureUser(user);
  const ensuredCurrentUser = ensureCurrentUser(currentUser);
  const isCurrentUser =
    ensuredUser.id && ensuredCurrentUser.id && ensuredUser.id.uuid === ensuredCurrentUser.id.uuid;
  const { displayName, bio } = ensuredUser.attributes.profile;

  // Gather custom data fields from seller's account.
  const accountType = ensuredUser.attributes.profile.publicData && ensuredUser.attributes.profile.publicData.accountType ?
    ensuredUser.attributes.profile.publicData.accountType : null;
  const isPremium = accountType && accountType === "p" ? true : false;
  const isVerified = accountType && accountType === "e" ? true : false;
  const companyWebsite = isPremium && ensuredUser.attributes.profile.publicData && ensuredUser.attributes.profile.publicData.companyWebsite ?
    ensuredUser.attributes.profile.publicData.companyWebsite : null;
  const companyName = isPremium && ensuredUser.attributes.profile.publicData && ensuredUser.attributes.profile.publicData.companyName ?
    ensuredUser.attributes.profile.publicData.companyName : null;
  const socialMedia = ensuredUser.attributes.profile.publicData && ensuredUser.attributes.profile.publicData.socialMedia ?
    ensuredUser.attributes.profile.publicData.socialMedia : null;
  const authorId = ensuredUser && ensuredUser.id && ensuredUser.id.uuid ? ensuredUser.id.uuid : null
  const handleContactUserClick = () => {
    onContactUser(user);
  };

  const hasBio = !!bio;
  const classes = classNames(rootClassName || css.root, className);
  const linkClasses = classNames(css.links, {
    [css.withBioMissingAbove]: !hasBio,
  });

  const contact = !isPremium && !isFollowingPage ? (
    <InlineTextButton
      rootClassName={css.linkButton}
      onClick={handleContactUserClick}
    // enforcePagePreloadFor="SignupPage"
    >
      <FormattedMessage id="UserCard.contactUser" />
    </InlineTextButton>
  ) : isPremium && companyWebsite ? (
    <ExternalLink className={css.linkButton} href={companyWebsite}>
      <FormattedMessage id="UserCard.viewWebsite" />
      <img className={css.externalLinkIcon} src={exit} alt="External Link" />
    </ExternalLink>
  ) : (
    <NamedLink className={css.linkButton} name="ProfilePage" params={{ id: ensuredUser.id.uuid }}>
      <FormattedMessage id="UserCard.viewProfile" />
    </NamedLink>);

  const editProfile = (
    <NamedLink className={css.linkButton} name="ProfileSettingsPage">
      <FormattedMessage id="ListingPage.editProfileLink" />
    </NamedLink>
  );

  const links = ensuredUser.id ? (
    <div className={linkClasses}>
      {!isCurrentUser && currentUser &&
        <FollowButton
          authorId={authorId}
          isFollowed={isFollowed}
          updateFollowed={updateFollowed}
        />}
      <span className={css.editAndContactButtons}>
        {isCurrentUser ? editProfile : contact}
      </span>
    </div>
  ) : null;

  const avatarClassNames = isPremium && !isFollowingPage ? css.premiumAvatar : css.avatar;

  return (
    <div className={classes}>
      <div className={css.content}>
        <AvatarLarge className={avatarClassNames} user={user} enrolled={isVerified} companyWebsite={companyWebsite} />
        <div className={css.info}>
          <div className={css.headingRow}>
            <h3 className={css.heading}>
              {isPremium && companyName && companyWebsite ?
                <ExternalLink className={css.headingLink} href={companyWebsite}>
                  <FormattedMessage id="UserCard.heading" values={{ name: companyName }} />
                </ExternalLink>
                : isPremium && companyName ?
                  <NamedLink className={css.headingLink} name="ProfilePage" params={{ id: ensuredUser.id.uuid }}>
                    <FormattedMessage id="UserCard.heading" values={{ name: companyName }} />
                  </NamedLink>
                  :
                  <NamedLink className={css.headingLink} name="ProfilePage" params={{ id: ensuredUser.id.uuid }}>
                    <FormattedMessage id="UserCard.heading" values={{ name: displayName }} />
                  </NamedLink>}
            </h3>
          </div>
          <UserSocialMedia socialMedia={socialMedia} />
          {links}
        </div>
        {isFollowingPage ?
          <div className={css.sideBioContainer}>
            <h2 className={css.sideBioTitle}>
              <FormattedMessage id="UserCard.sideBioTitle" />
            </h2>
            <ExpandableBio className={css.desktopBio} bio={bio} />
          </div> : null}
      </div>
      {isPremium && hasBio !== null && !isFollowingPage ?
        <div>
          <h2 className={css.bioTitle}>
            <FormattedMessage id="UserCard.bioTitle" />
          </h2>
          <ExpandableBio className={css.desktopBio} bio={bio} />
          <ExpandableBio className={css.mobileBio} bio={bio} />
        </div>
        : null}
    </div>
  );
};

UserCard.defaultProps = {
  rootClassName: null,
  className: null,
  user: null,
  currentUser: null,
};

UserCard.propTypes = {
  rootClassName: string,
  className: string,
  user: oneOfType([propTypes.user, propTypes.currentUser]),
  currentUser: propTypes.currentUser,
  // onContactUser: func.isRequired || null,
};

export default UserCard;

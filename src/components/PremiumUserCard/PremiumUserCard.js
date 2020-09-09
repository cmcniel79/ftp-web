import React, { Component } from 'react';
import { string, func, oneOfType } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import truncate from 'lodash/truncate';
import classNames from 'classnames';
import { AvatarLarge, NamedLink, InlineTextButton, ExternalLink, UserSocialMedia } from '..';
import { ensureUser, ensureCurrentUser } from '../../util/data';
import { propTypes } from '../../util/types';

import css from './PremiumUserCard.css';

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
    omission: '…',
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

const PremiumUserCard = props => {
  const { rootClassName, className, user, currentUser, onContactUser } = props;

  const userIsCurrentUser = user && user.type === 'currentUser';
  const ensuredUser = userIsCurrentUser ? ensureCurrentUser(user) : ensureUser(user);

  const ensuredCurrentUser = ensureCurrentUser(currentUser);
  const isCurrentUser =
    ensuredUser.id && ensuredCurrentUser.id && ensuredUser.id.uuid === ensuredCurrentUser.id.uuid;
  const bio = ensuredUser.attributes.profile.bio;
  const companyName = ensuredUser.attributes.profile.publicData.companyName ? 
    ensuredUser.attributes.profile.publicData.companyName : "Urban Native Era";
  const socialMedia = ensuredUser.attributes.profile.publicData.socialMedia ? 
  ensuredUser.attributes.profile.publicData.socialMedia : null;

  const hasBio = !!bio;
  const classes = classNames(rootClassName || css.root, className);
  const linkClasses = classNames(css.links, {
    [css.withBioMissingAbove]: !hasBio,
  });

  const editProfile = (
    <span className={css.editProfile}>
      <span className={css.linkSeparator}>•</span>
      <NamedLink name="ProfileSettingsPage">
        <FormattedMessage id="ListingPage.editProfileLink" />
      </NamedLink>
    </span>
  );



  const links = ensuredUser.id ? (
    <p className={linkClasses}>
      <ExternalLink className={css.link} href="https://cookiesandyou.com">
        <FormattedMessage id="PremiumUserCard.websiteLink" />
      </ExternalLink>
      {isCurrentUser ? editProfile : null}
    </p>
  ) : null;

  return (
    <div className={classes}>
      <div className={css.content}>
        <AvatarLarge className={css.avatar} user={user} externalLink={"https://cookiesandyou.com"}/>
        <div className={css.info}>
          <div className={css.headingRow}>
            <h3 className={css.heading}>
              <FormattedMessage id="PremiumUserCard.heading" values={{ name: companyName }} />
            </h3>
          </div>
          {/* {hasBio ? <ExpandableBio className={css.desktopBio} bio={bio} /> : null} */}
          <UserSocialMedia socialMedia={socialMedia} />
          {links}
        </div>
      </div>
      {hasBio ? <ExpandableBio className={css.desktopBio} bio={bio} /> : null}
      {hasBio ? <ExpandableBio className={css.mobileBio} bio={bio} /> : null}
    </div>
  );
};

PremiumUserCard.defaultProps = {
  rootClassName: null,
  className: null,
  user: null,
  currentUser: null,
};

PremiumUserCard.propTypes = {
  rootClassName: string,
  className: string,
  user: oneOfType([propTypes.user, propTypes.currentUser]),
  currentUser: propTypes.currentUser,
};

export default PremiumUserCard;

/**
 *  TopbarMobileMenu prints the menu content for authenticated user or
 * shows login actions for those who are not authenticated.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
// import { ACCOUNT_SETTINGS_PAGES } from '../../routeConfiguration';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { twitterPageURL } from '../../util/urlHelpers';
import config from '../../config';

import {
  AvatarLarge,
  InlineTextButton,
  NamedLink,
  NotificationBadge,
  IconSocialMediaFacebook,
  IconSocialMediaInstagram,
  IconSocialMediaTwitter,
  ExternalLink,
} from '../../components';

import css from './TopbarMobileMenu.module.css';

const renderSocialMediaLinks = () => {
  const { siteFacebookPage, siteInstagramPage, siteTwitterHandle } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  const fbLink = siteFacebookPage ? (
    <ExternalLink key="linkToFacebook"
      href={siteFacebookPage}
      className={css.icon}
      title={"Go to Facebook"}
    >
      <IconSocialMediaFacebook />
    </ExternalLink>
  ) : null;

  const twitterLink = siteTwitterPage ? (
    <ExternalLink
      key="linkToTwitter"
      href={siteTwitterPage}
      className={css.icon}
      title={"Go to Facebook"}
    >
      <IconSocialMediaTwitter />
    </ExternalLink>
  ) : null;

  const instragramLink = siteInstagramPage ? (
    <ExternalLink
      key="linkToInstagram"
      href={siteInstagramPage}
      className={css.icon}
      title={"Go to Facebook"}
    >
      <IconSocialMediaInstagram />
    </ExternalLink>
  ) : null;

  return [fbLink, twitterLink, instragramLink].filter(v => v != null);
};

const TopbarMobileMenu = props => {
  const {
    isAuthenticated,
    // currentPage,
    currentUserHasListings,
    currentUser,
    notificationCount,
    onLogout,
  } = props;

  const user = ensureCurrentUser(currentUser);
  const socialMediaLinks = renderSocialMediaLinks();
  const regularLinksClasses = isAuthenticated ? css.regularLinks : css.regularLinksLarge;
  const accountType = user && user.attributes.profile.publicData && user.attributes.profile.publicData.accountType ?
    user.attributes.profile.publicData.accountType : null;
  const isEventHost = currentUser && currentUser.attributes.profile.metadata && currentUser.attributes.profile.metadata.eventHost;

  const regularLinks =
    <div className={regularLinksClasses}>
      <NamedLink name="SearchPage" className={css.regularLink}>
        <FormattedMessage id="TopbarMobileMenu.shopLink" />
      </NamedLink>
      <NamedLink name="MapPage" className={css.regularLink}>
        <FormattedMessage id="TopbarMobileMenu.mapLink" />
      </NamedLink>
      <NamedLink name="EventsPage" className={css.regularLink}>
        <FormattedMessage id="TopbarMobileMenu.eventsLink" />
      </NamedLink>
      <NamedLink name="FAQPage" className={css.regularLink}>
        <FormattedMessage id="TopbarMobileMenu.faqLink" />
      </NamedLink>
      <NamedLink name="ContactPage" className={css.regularLink}>
        <FormattedMessage id="TopbarMobileMenu.contactLink" />
      </NamedLink>
      {isAuthenticated &&
        <NamedLink
          className={css.regularLink}
          name="LikedListingsPage"
        >
          <FormattedMessage id="TopbarMobileMenu.yourLikedListingsLink" />
        </NamedLink>
      }
      {isAuthenticated &&
        <NamedLink
          className={css.regularLink}
          name="FollowingPage"
        >
          <FormattedMessage id="TopbarMobileMenu.yourFollowedArtistsLink" />
        </NamedLink>
      }
      {isAuthenticated &&
        <NamedLink
          className={css.regularLink}
          name="ManageListingsPage"
        >
          <FormattedMessage id="TopbarMobileMenu.yourListingsLink" />
        </NamedLink>
      }
      {isEventHost &&
        <NamedLink
          className={css.regularLink}
          name="EventDetailsPage"
        >
          <FormattedMessage id="TopbarMobileMenu.yourEventLink" />
        </NamedLink>
      }
    </div>

  if (!isAuthenticated) {
    const signup = (
      <NamedLink name="SignupPage" className={css.signupLink}>
        <FormattedMessage id="TopbarMobileMenu.signupLink" />
      </NamedLink>
    );

    const login = (
      <NamedLink name="LoginPage" className={css.loginLink}>
        <FormattedMessage id="TopbarMobileMenu.loginLink" />
      </NamedLink>
    );

    const signupOrLogin = (
      <span className={css.authenticationLinks}>
        <FormattedMessage id="TopbarMobileMenu.signupOrLogin" values={{ signup, login }} />
      </span>
    );
    return (
      <div className={css.root}>
        <div className={css.content}>
          <div className={css.socialMedia}>
            {socialMediaLinks}
          </div>
          <div className={css.authenticationGreeting}>
            <FormattedMessage
              id="TopbarMobileMenu.unauthorizedGreeting"
              values={{ lineBreak: <br />, signupOrLogin }}
            />
          </div>
        </div>
        {regularLinks}
      </div>
    );
  }

  const notificationCountBadge =
    notificationCount > 0 ? (
      <NotificationBadge className={css.notificationBadge} count={notificationCount} />
    ) : null;

  // No idea where below code was supposed to go but I like how it looks now
  // const currentPageClass = page => {
  //   const isAccountSettingsPage =
  //     page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
  //   return currentPage === page || isAccountSettingsPage ? css.currentPage : null;
  // };

  return (
    <div className={css.root}>
      <div className={css.content}>
        <div className={css.socialMedia}>
          {socialMediaLinks}
        </div>
        <div className={css.accountSection}>
          <div className={css.accountLinks}>
            <NamedLink
              className={css.accountLink}
              name="InboxPage"
              params={{ tab: currentUserHasListings ? 'sales' : 'orders' }}
            >
              <FormattedMessage id="TopbarMobileMenu.inboxLink" />
              {notificationCountBadge}
            </NamedLink>
            <NamedLink
              className={css.accountLink}
              name="ProfileSettingsPage"
            >
              <FormattedMessage id="TopbarMobileMenu.profileSettingsLink" />
            </NamedLink>
            <NamedLink
              className={css.accountLink}
              name="AccountSettingsPage"
            >
              <FormattedMessage id="TopbarMobileMenu.accountSettingsLink" />
            </NamedLink>
            <InlineTextButton rootClassName={css.logoutButton} onClick={onLogout}>
              <FormattedMessage id="TopbarMobileMenu.logoutLink" />
            </InlineTextButton>
          </div>
          <AvatarLarge className={css.avatar} user={currentUser} />
        </div>
        {regularLinks}
      </div>
      <div className={css.footer}>
        {accountType && accountType !== '' ? (
          <NamedLink className={css.createNewListingLink} name="NewListingPage">
            <FormattedMessage id="TopbarMobileMenu.newListingLink" />
          </NamedLink>
        ) : (
            <ExternalLink className={css.createNewListingLink} href="https://www.fromthepeople.co/faq#become-a-seller">
              <span className={css.createListing}>
                <FormattedMessage id="TopbarDesktop.becomeSeller" />
              </span>
            </ExternalLink>)}
      </div>
    </div>
  );
};

TopbarMobileMenu.defaultProps = { currentUser: null, notificationCount: 0, currentPage: null };

const { bool, func, number, string } = PropTypes;

TopbarMobileMenu.propTypes = {
  isAuthenticated: bool.isRequired,
  currentUserHasListings: bool.isRequired,
  currentUser: propTypes.currentUser,
  currentPage: string,
  notificationCount: number,
  onLogout: func.isRequired,
};

export default TopbarMobileMenu;

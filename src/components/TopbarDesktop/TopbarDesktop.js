import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { ACCOUNT_SETTINGS_PAGES } from '../../routeConfiguration';
import { propTypes } from '../../util/types';
import {
  Avatar,
  InlineTextButton,
  Logo,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  NamedLink,
  ExternalLink,
} from '../../components';
import { TopbarSearchForm } from '../../forms';

import css from './TopbarDesktop.module.css';

const TopbarDesktop = props => {
  const {
    className,
    currentUser,
    currentPage,
    rootClassName,
    currentUserHasListings,
    notificationCount,
    intl,
    isAuthenticated,
    onLogout,
    onSearchSubmit,
    initialSearchFormValues,
  } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const authenticatedOnClientSide = mounted && isAuthenticated;
  const isAuthenticatedOrJustHydrated = isAuthenticated || !mounted;

  const classes = classNames(rootClassName || css.root, className);
  const accountType = currentUser && currentUser.attributes.profile.publicData && currentUser.attributes.profile.publicData.accountType ?
    currentUser.attributes.profile.publicData.accountType : null;
  const isEventHost = currentUser && currentUser.attributes.profile.metadata && currentUser.attributes.profile.metadata.eventHost;
  const search = (
    <TopbarSearchForm
      className={css.searchLink}
      desktopInputRoot={css.topbarSearchWithLeftPadding}
      onSubmit={onSearchSubmit}
      initialValues={initialSearchFormValues}
    />
  );

  const notificationDot = notificationCount > 0 ? <div className={css.notificationDot} /> : null;

  const inboxLink = authenticatedOnClientSide ? (
    <NamedLink
      className={css.customLink}
      name="InboxPage"
      params={{ tab: currentUserHasListings ? 'sales' : 'orders' }}
    >
      <span className={css.custom}>
        <FormattedMessage id="TopbarDesktop.inbox" />
        {notificationDot}
      </span>
    </NamedLink>
  ) : null;

  const currentPageClass = page => {
    const isAccountSettingsPage =
      page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
    return currentPage === page || isAccountSettingsPage ? css.currentPage : null;
  };

  const profileMenu = authenticatedOnClientSide ? (
    <Menu>
      <MenuLabel className={css.profileMenuLabel} isOpenClassName={css.profileMenuIsOpen}>
        <Avatar className={css.avatar} user={currentUser} disableProfileLink />
      </MenuLabel>
      <MenuContent className={css.profileMenuContent}>
        <MenuItem key="EventDetailsPage">
          {isEventHost ? (
            <NamedLink
              className={classNames(css.yourListingsLink, currentPageClass('EventDetailsPage'))}
              name="EventDetailsPage"
            >
              <span className={css.menuItemBorder} />
              <FormattedMessage id="TopbarDesktop.yourEventLink" />
            </NamedLink>
          ) : "" }
        </MenuItem>
        <MenuItem key="ManageListingsPage">
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass('ManageListingsPage'))}
            name="ManageListingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.yourListingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="LikedListingsPage">
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass('LikedListingsPage'))}
            name="LikedListingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.yourLikedListingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="FollowingPage">
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass('FollowingPage'))}
            name="FollowingPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.yourFollowedArtistsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="ProfileSettingsPage">
          <NamedLink
            className={classNames(css.profileSettingsLink, currentPageClass('ProfileSettingsPage'))}
            name="ProfileSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.profileSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="AccountSettingsPage">
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass('AccountSettingsPage'))}
            name="AccountSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.accountSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="logout">
          <InlineTextButton rootClassName={css.logoutButton} onClick={onLogout}>
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.logout" />
          </InlineTextButton>
        </MenuItem>
      </MenuContent>
    </Menu>
  ) : null;

  const shopLink =
    <NamedLink className={css.customLink} name="SearchPage" to={{ search: '' }}>
      <span className={css.custom}>
        <FormattedMessage id="TopbarDesktop.searchPage" />
      </span>
    </NamedLink>;

  const faqLink =
    <NamedLink className={css.customLink} name="FAQPage">
      <span className={css.custom}>
        <FormattedMessage id="TopbarDesktop.faqPage" />
      </span>
    </NamedLink>;

  const mapLink =
    <NamedLink className={css.customLink} name="MapPage">
      <span className={css.custom}>
        <FormattedMessage id="TopbarDesktop.mapPage" />
      </span>
    </NamedLink>;

  const eventsLink =
    <NamedLink className={css.customLink} name="EventsPage">
      <span className={css.custom}>
        <FormattedMessage id="TopbarDesktop.eventsPage" />
      </span>
    </NamedLink>;

  const contactLink =
    <NamedLink className={css.customLink} name="ContactPage">
      <span className={css.custom}>
        <FormattedMessage id="TopbarDesktop.contactPage" />
      </span>
    </NamedLink>;

  const newListingLink = accountType && accountType !== '' ? (
    <NamedLink className={css.createListingLink} name="NewListingPage">
      <span className={css.createListing}>
        <FormattedMessage id="TopbarDesktop.createListing" />
      </span>
    </NamedLink>
  ) : (
      <ExternalLink className={css.createListingLink} href="https://www.fromthepeople.co/faq#become-a-seller">
        <span className={css.createListing}>
          <FormattedMessage id="TopbarDesktop.becomeSeller" />
        </span>
      </ExternalLink>);

  const signupLink = isAuthenticatedOrJustHydrated ? null : (
    <NamedLink name="SignupPage" className={css.signupLink}>
      <span className={css.signup}>
        <FormattedMessage id="TopbarDesktop.signup" />
      </span>
    </NamedLink>
  );

  const loginLink = isAuthenticatedOrJustHydrated ? null : (
    <NamedLink name="LoginPage" className={css.loginLink}>
      <span className={css.login}>
        <FormattedMessage id="TopbarDesktop.login" />
      </span>
    </NamedLink>
  );


  return (
    <nav className={classes}>
      <NamedLink className={css.logoLink} name="LandingPage">
        <Logo
          format="desktop"
          className={css.logo}
          alt={intl.formatMessage({ id: 'TopbarDesktop.logo' })}
        />
      </NamedLink>
      {search}
      {shopLink}
      {mapLink}
      {eventsLink}
      {faqLink}
      {contactLink}
      {newListingLink}
      {inboxLink}
      {profileMenu}
      {signupLink}
      {loginLink}
    </nav>
  );
};

const { bool, func, object, number, string } = PropTypes;

TopbarDesktop.defaultProps = {
  rootClassName: null,
  className: null,
  currentUser: null,
  currentPage: null,
  notificationCount: 0,
  initialSearchFormValues: {},
};

TopbarDesktop.propTypes = {
  rootClassName: string,
  className: string,
  currentUserHasListings: bool.isRequired,
  currentUser: propTypes.currentUser,
  currentPage: string,
  isAuthenticated: bool.isRequired,
  onLogout: func.isRequired,
  notificationCount: number,
  onSearchSubmit: func.isRequired,
  initialSearchFormValues: object,
  intl: intlShape.isRequired,
};

export default TopbarDesktop;

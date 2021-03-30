/**
 * Export reducers from ducks modules of different containers (i.e. default export)
 * We are following Ducks module proposition:
 * https://github.com/erikras/ducks-modular-redux
 */
import CheckoutPage from './CheckoutPage/CheckoutPage.duck';
import ContactDetailsPage from './ContactDetailsPage/ContactDetailsPage.duck';
import ContactPage from './ContactPage/ContactPage.duck';
import EditListingPage from './EditListingPage/EditListingPage.duck';
import EventHostPage from './EventHostPage/EventHostPage.duck';
import EventsPage from './EventsPage/EventsPage.duck';
import EventTypePage from './EventTypePage/EventTypePage.duck';
import FollowingPage from './FollowingPage/FollowingPage.duck';
import InboxPage from './InboxPage/InboxPage.duck';
import LandingPage from './LandingPage/LandingPage.duck';
import ListingPage from './ListingPage/ListingPage.duck';
import LikedListingsPage from './LikedListingsPage/LikedListingsPage.duck';
import MapPage from './MapPage/MapPage.duck';
import ManageListingsPage from './ManageListingsPage/ManageListingsPage.duck';
import PasswordChangePage from './PasswordChangePage/PasswordChangePage.duck';
import PasswordRecoveryPage from './PasswordRecoveryPage/PasswordRecoveryPage.duck';
import PasswordResetPage from './PasswordResetPage/PasswordResetPage.duck';
import PaymentMethodsPage from './PaymentMethodsPage/PaymentMethodsPage.duck';
import ProfilePage from './ProfilePage/ProfilePage.duck';
import ProfileSettingsPage from './ProfileSettingsPage/ProfileSettingsPage.duck';
import SingleEventPage from './SingleEventPage/SingleEventPage.duck';
import SearchPage from './SearchPage/SearchPage.duck';
import StripePayoutPage from './StripePayoutPage/StripePayoutPage.duck';
import TransactionPage from './TransactionPage/TransactionPage.duck';

export {
  CheckoutPage,
  ContactDetailsPage,
  ContactPage,
  EditListingPage,
  EventHostPage,
  EventsPage,
  EventTypePage,
  FollowingPage,
  InboxPage,
  LandingPage,
  ListingPage,
  LikedListingsPage,
  MapPage,
  ManageListingsPage,
  PasswordChangePage,
  PasswordRecoveryPage,
  PasswordResetPage,
  PaymentMethodsPage,
  ProfilePage,
  ProfileSettingsPage,
  SingleEventPage,
  SearchPage,
  StripePayoutPage,
  TransactionPage,
};

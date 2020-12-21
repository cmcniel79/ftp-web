import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import {
  Page,
  UserNav,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  NamedLink,
  ExternalLink,
  LinkTabNavHorizontal,
} from '../../components';
import { EventDetailsForm, EventPhotosForm, EventSellersForm } from '../../forms';
import { TopbarContainer } from '..';

import { updateProfile, uploadImage, updateDatabase } from './EventHostPage.duck';
import EventSellersListMaybe from './EventSellersListMaybe';
import css from './EventHostPage.css';

const onImageUploadHandler = (values, fn) => {
  const { id, imageId, file } = values;
  if (file) {
    fn({ id, imageId, file });
  }
};

export class EventHostPageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { email: 'jhfajkdhk' };
    this.addAnother = this.addAnother.bind(this);
  }

  addAnother(){
    console.log("Hello There");
    this.setState({
      email: '',
    });
  }

  render() {
    const {
      currentUser,
      scrollingDisabled,
      intl,
      tab
    } = this.props;

    const sellers = ["chase@fromthepeople.co", "mcniel26@gmail.com", "isabella@fromthepeople.co"];
    const user = ensureCurrentUser(currentUser);

    const eventDetailsForm = (
      <EventDetailsForm onSubmit={(values) => console.log(values)} />
    );

    const eventPhotosForm = (
    <EventPhotosForm onSubmit={(values) => console.log(values)} />
    );

    const eventSellersForm = (
      <div className={css.sellersContainer}>
        <EventSellersForm value={this.state.email} onSubmit={() => this.addAnother()} />
        <EventSellersListMaybe sellersList={sellers} />
      </div>
    );

    const title = intl.formatMessage({ id: 'EventHostPage.title' });

    const tabs = [
      {
        text: (
          <h1 className={css.tab}>
            <FormattedMessage id="EventHostPage.eventDetailsLinkText" />
          </h1>
        ),
        selected: tab === 'details',
        linkProps: {
          name: 'EventDetailsPage',
        },
      },
      {
        text: (
          <h1 className={css.tab}>
            <FormattedMessage id="EventHostPage.eventPhotosLinkText" />
          </h1>
        ),
        selected: tab === 'photos',
        linkProps: {
          name: 'EventPhotosPage',
        },
      },
      {
        text: (
          <h1 className={css.tab}>
            <FormattedMessage id="EventHostPage.eventSellersLinkText" />
          </h1>
        ),
        selected: tab === 'sellers',
        linkProps: {
          name: 'EventSellersPage',
        },
      },
    ];
    console.log(tab);
    return (
      <Page className={css.root} title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer currentPage="EventHostPage" />
            <UserNav selectedPageName="EventHostPage" />
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            <div className={css.content}>
              <LinkTabNavHorizontal className={css.tabs} tabs={tabs} />
              {tab === 'details' ? eventDetailsForm : null}
              {tab === 'photos' ? eventPhotosForm : null}
              {tab === 'sellers' ? eventSellersForm : null}
            </div>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
}

EventHostPageComponent.defaultProps = {
  currentUser: null,
  uploadImageError: null,
  updateProfileError: null,
  image: null,
};

const { bool, func, object, shape, string } = PropTypes;

EventHostPageComponent.propTypes = {
  currentUser: propTypes.currentUser,
  image: shape({
    id: string,
    imageId: propTypes.uuid,
    file: object,
    uploadedImage: propTypes.image,
  }),
  onImageUpload: func.isRequired,
  onUpdateProfile: func.isRequired,
  scrollingDisabled: bool.isRequired,
  updateInProgress: bool.isRequired,
  updateProfileError: propTypes.error,
  uploadImageError: propTypes.error,
  uploadInProgress: bool.isRequired,
  onUpdateDatabase: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const {
    image,
    uploadImageError,
    uploadInProgress,
    updateInProgress,
    updateProfileError,
  } = state.ProfileSettingsPage;
  return {
    currentUser,
    image,
    scrollingDisabled: isScrollingDisabled(state),
    updateInProgress,
    updateProfileError,
    uploadImageError,
    uploadInProgress,
  };
};

const mapDispatchToProps = dispatch => ({
  onImageUpload: data => dispatch(uploadImage(data)),
  onUpdateProfile: data => dispatch(updateProfile(data)),
  onUpdateDatabase: data => dispatch(updateDatabase(data)),
});

const EventHostPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(EventHostPageComponent);

export default EventHostPage;

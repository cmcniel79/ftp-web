import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import isEqual from 'lodash/isEqual';
import {
  Button,
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
import { EventDetailsForm, EventPhotosForm } from '../../forms';
import { TopbarContainer } from '..';

import { loadData, updateDetails, uploadImage, updateSellers } from './EventHostPage.duck';
import EventSellersListMaybe from './EventSellersListMaybe';
import css from './EventHostPage.css';

export class EventHostPageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '' };
    this.submittedValues = null;
    this.sendUpdatedSellers = this.sendUpdatedSellers.bind(this);
    this.submitDetails = this.submitDetails.bind(this);
    this.onImageUploadHandler = this.onImageUploadHandler.bind(this);
  }

  onImageUploadHandler = (values, fn) => {
    const { id, file } = values;
    if (file && id && file.type) {
      fn({ id, file, fileType: file.type });
    }
  };

  submitDetails(values) {
    const { eventDuration, datesRange, startDate, mc, arenaDirector, hostDrums, location, lot, ...rest } = values;
    const startDateObject = (eventDuration === "multi" && datesRange && datesRange.startDate) ? datesRange.startDate :
      (startDate && startDate.date) ? startDate.date : null;
    const endDateObject = (eventDuration === "multi" && datesRange && datesRange.endDate) ? datesRange.endDate : null;
    const payload = {
      ...rest,
      hostUUID: this.props.hostUUID,
      hostName: this.props.hostName,
      hostEmail: this.props.hostEmail,
      startDate: startDateObject ? startDateObject.toJSON().slice(0, 10) : null,
      endDate: endDateObject ? endDateObject.toJSON().slice(0, 10) : null,
      optionalData: {
        location,
        lot,
        mc,
        arenaDirector,
        hostDrums
      }
    }
    this.props.onUpdateDetails(payload);
  }

  sendUpdatedSellers(removedEmail) {
    if (removedEmail) {
      this.props.onUpdateSellers({ email: removedEmail, eventName: "Test of Frontend 69", add: false });
    } else {
      const newEmail = this.state.email;
      this.props.onUpdateSellers({ email: newEmail, eventName: "Test of Frontend 69", add: true });
      this.submittedValues = newEmail;
      this.setState({ email: '' });
    }
  }

  componentDidMount() {
    if (window) {
      this.props.onLoadData();
    }
  }

  render() {
    const {
      hostUUID,
      scrollingDisabled,
      image,
      intl,
      tab,
      onImageUpload,
      eventInfoInProgress,
      eventDetails,
      uploadInProgress,
      updateSellersInProgress,
      updateSellersError,
      updateSellersResponseAdd,
      updateSellersResponseRemove
    } = this.props;

    const sellers = ["chase@fromthepeople.co", "mcniel26@gmail.com", "isabella@fromthepeople.co"];

    // Initial Values for EventDetailsForm
    const eventName = eventDetails && eventDetails.eventName;
    const eventType = eventDetails && eventDetails.eventType;
    const eventWebsite = eventDetails && eventDetails.eventWebsite;
    const eventDescription = eventDetails && eventDetails.eventDescription;
    // const datesRange = eventDetails && eventDetails.datesRange;
    const startDate = eventDetails && eventDetails.startDate;
    const endDate = eventDetails && eventDetails.endDate;
    const startTime = eventDetails && eventDetails.startTime;
    const meridiem = eventDetails && eventDetails.meridiem;
    // Optional Info just for Powwows
    const mc = eventDetails && eventDetails.optional && eventDetails.optional.mc;
    const arenaDirector = eventDetails && eventDetails.optional && eventDetails.optional.arenaDirector;
    const hostDrums = eventDetails && eventDetails.optional && eventDetails.optional.hostDrums;
    const location = eventDetails && eventDetails.location && eventDetails.optional.location;
    const lot = eventDetails && eventDetails.lot && eventDetails.optional.lot;
    const datesRange = { startDate: new Date("2020-12-24"), endDate: new Date("2020-12-31") };
    const eventDuration = startDate && endDate ? "multi" : "single";

    //Labels and stuff for eventSellers form
    const sellerInputLabel = intl.formatMessage({ id: 'EventSellersForm.sellerInputLabel' });
    const sellerInputPlaceholder = intl.formatMessage({ id: 'EventSellersForm.sellerInputPlaceholder' });

    const sellerInput = document.getElementById("sellerInput");
    var validity;
    var inputValue;
    if (sellerInput) {
      validity = sellerInput.validity.valid;
      inputValue = sellerInput.value;
    }

    const submittedOnce = this.submittedValues && this.submittedValues !== null;
    const pristineSinceLastSubmit = submittedOnce && isEqual(inputValue, this.submittedValues);

    const submitDisabled =
      !validity || inputValue === '' || pristineSinceLastSubmit || uploadInProgress;

    const submitError = updateSellersError ? (
      <div className={css.error}>
        {updateSellersError}
      </div>
    ) : null;
    const submitSuccess = updateSellersResponseAdd ? (
      <div className={css.success}>
        {updateSellersResponseAdd}
      </div>
    ) : null;


    const eventSellersForm = (
      <div className={css.sellersContainer}>
        <div className={css.sellerInput}>
          <h3 className={css.sectionTitle}>
            <FormattedMessage id="EventSellersForm.eventSellersInfo" />
          </h3>
          <label htmlFor="sellerInput">{sellerInputLabel}</label>
          <input
            className={css.eventField}
            type="email"
            id="sellerInput"
            label={sellerInputLabel}
            placeholder={sellerInputPlaceholder}
            maxLength={30}
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
          />
        </div>
        {submitError}
        {submitSuccess}
        <Button
          className={css.submitButton}
          // type="submit"
          inProgress={updateSellersInProgress}
          disabled={submitDisabled}
          ready={pristineSinceLastSubmit}
          onClick={this.sendUpdatedSellers}
        >
          <FormattedMessage id="EventSellersForm.addSeller" />
        </Button>
        <EventSellersListMaybe
          sellersList={sellers}
          updateSellers={(values) => this.sendUpdatedSellers(values)}
          inProgress={updateSellersInProgress}
          response={updateSellersResponseRemove}
        />
      </div>
    );

    const eventDetailsForm = (
      <EventDetailsForm
        onSubmit={(values) => this.submitDetails(values)}
        eventInfoInProgress={eventInfoInProgress}
        initialValues={{
          eventName, eventType, eventWebsite, eventDescription, eventDuration, datesRange, startDate, endDate,
          startTime, meridiem, mc, arenaDirector, hostDrums, location, lot
        }}
      />
    );

    const eventPhotosForm = (
      <EventPhotosForm
        hostUUID={hostUUID}
        eventImage={image}
        onImageUpload={(e) => this.onImageUploadHandler(e, onImageUpload)}
        onSubmit={(values) => console.log(values)}
        uploadInProgress={uploadInProgress}
      />
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
  // currentUser: propTypes.currentUser,
  // image: shape({
  //   id: string,
  //   file: object,
  //   uploadedImage: propTypes.image,
  // }),
  // onImageUpload: func.isRequired,
  // onUpdateProfile: func.isRequired,
  // scrollingDisabled: bool.isRequired,
  // updateInProgress: bool.isRequired,
  // updateProfileError: propTypes.error,
  // uploadImageError: propTypes.error,
  // uploadInProgress: bool.isRequired,
  // onUpdateDatabase: func.isRequired,

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
    eventInfoInProgress,
    eventDetails,
    updateSellersInProgress,
    updateSellersError,
    updateSellersResponseAdd,
    updateSellersResponseRemove
  } = state.EventHostPage;
  const hostUUID = currentUser && currentUser.id ? currentUser.id.uuid : null;
  const hostName = currentUser && currentUser.attributes ? currentUser.attributes.profile.displayName : null;
  const hostEmail = currentUser && currentUser.attributes ? currentUser.attributes.email : null;

  // const hostEmail = cu
  return {
    hostUUID,
    hostName,
    hostEmail,
    currentUser,
    image,
    scrollingDisabled: isScrollingDisabled(state),
    updateInProgress,
    updateProfileError,
    uploadImageError,
    uploadInProgress,
    eventInfoInProgress,
    eventDetails,
    updateSellersInProgress,
    updateSellersError,
    updateSellersResponseAdd,
    updateSellersResponseRemove
  };
};

const mapDispatchToProps = dispatch => ({
  onLoadData: () => dispatch(loadData()),
  onUpdateDetails: details => dispatch(updateDetails(details)),
  onImageUpload: data => dispatch(uploadImage(data)),
  onUpdateSellers: data => dispatch(updateSellers(data)),
});

const EventHostPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(EventHostPageComponent);

export default EventHostPage;

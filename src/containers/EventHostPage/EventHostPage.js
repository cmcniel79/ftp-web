import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import { parseDateFromISO8601 } from '../../util/dates';
import { EventDetailsForm, EventPhotosForm } from '../../forms';
import { TopbarContainer } from '..';
import { loadData, updateEventDetails, uploadImage, updateSellers, updateImage } from './EventHostPage.duck';
import EventSellersListMaybe from './EventSellersListMaybe';
import {
  Button,
  Page,
  UserNav,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  LinkTabNavHorizontal,
} from '../../components';

import css from './EventHostPage.css';
const cdnDomain = "https://ftpevents.imgix.net/";
const cdnParams = "?h=533&w=800&fit=crop&crop=focalpoint&fp-x=.5&fp-y=.0";

export class EventHostPageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '' };
    this.submittedValues = null;
    this.sendUpdatedSellers = this.sendUpdatedSellers.bind(this);
    this.submitDetails = this.submitDetails.bind(this);
    this.onImageUploadHandler = this.onImageUploadHandler.bind(this);
    this.submitImage = this.submitImage.bind(this);
  }

  onImageUploadHandler = (values, fn) => {
    const { id, file } = values;
    if (file && id && file.type) {
      fn({ id, file, fileType: file.type });
    }
  };

  submitImage(values) {
    const { id } = values;
    const payload = {
      hostUUID: this.props.hostUUID,
      imageUUID: id,
    }
    this.props.onUpdateImage(payload);
  }

  submitDetails(values) {
    const { eventDuration, datesRange, startDate, mc, arenaDirector, hostDrums, location, state, ...rest } = values;
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
      state: state,
      optionalData: {
        location,
        mc,
        arenaDirector,
        hostDrums
      }
    }
    this.props.onUpdateDetails(payload);
  }

  sendUpdatedSellers(removedEmail) {
    if (removedEmail) {
      this.props.onUpdateSellers({ sellerEmail: removedEmail, eventName: "Test of Frontend 69", add: false, hostUUID: this.props.hostUUID });
    } else {
      const newEmail = this.state.email;
      this.props.onUpdateSellers({ sellerEmail: newEmail, eventName: "MYSQL test", add: true, hostUUID: this.props.hostUUID });
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
      tab,
      intl,
      onImageUpload,
      hostUUID,
      eventDetails,
      eventDetailsUpdate,
      eventDetailsInProgress,
      eventDetailsError,
      imageId,
      uploadInProgress,
      uploadImageError,
      eventSellers,
      updateSellersResponse,
      updateSellersInProgress,
      updateSellersError,
    } = this.props;

    // Initial Values for EventDetailsForm
    const eventName = eventDetails && eventDetails.eventName;
    const eventType = eventDetails && eventDetails.eventType;
    const eventWebsite = eventDetails && eventDetails.eventWebsite;
    const eventDescription = eventDetails && eventDetails.eventDescription;

    // Image Stuff
    const imageUUID = imageId ? imageId : eventDetails && eventDetails.imageUUID ? eventDetails.imageUUID : null; 
    const imageSrc = imageUUID ? cdnDomain + imageUUID + cdnParams : null;
    const eventImage = { id: imageUUID, src: imageSrc };
    const isNewImage = eventDetails && imageId && (imageId !== eventDetails.imageUUID);

    const startDate = eventDetails && eventDetails.startDate ? parseDateFromISO8601(eventDetails.startDate.slice(0, 10)) : null;
    const endDate = eventDetails && eventDetails.endDate ? parseDateFromISO8601(eventDetails.endDate.slice(0, 10)) : null;

    // Optional Info just for Powwows. State is not stored in optional data however, 
    // because it needs to be called quickly from EventCard
    const state = eventDetails && eventDetails.state;
    const parsedData = eventDetails && eventDetails.optionalData ? JSON.parse(eventDetails.optionalData) : null
    const mc = parsedData && parsedData.mc && parsedData.mc;
    const arenaDirector = parsedData && parsedData.arenaDirector;
    const hostDrums = parsedData && parsedData.hostDrums;
    const location = parsedData && parsedData.location;
    const datesRange = { startDate, endDate };
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
    const submitSuccess = updateSellersResponse ? (
      <div className={css.success}>
        {updateSellersResponse}
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
          inProgress={updateSellersInProgress}
          disabled={submitDisabled}
          ready={pristineSinceLastSubmit}
          onClick={() => this.sendUpdatedSellers(null)}
        >
          <FormattedMessage id="EventSellersForm.addSeller" />
        </Button>
        <EventSellersListMaybe
          sellers={eventSellers}
          updateSellers={(values) => this.sendUpdatedSellers(values)}
          inProgress={updateSellersInProgress}
          response={updateSellersResponse}
        />
      </div>
    );

    const eventDetailsForm = (
      <EventDetailsForm
        onSubmit={(values) => this.submitDetails(values)}
        eventDetailsUpdate={eventDetailsUpdate}
        eventDetailsInProgress={eventDetailsInProgress}
        eventDetailsError={eventDetailsError}
        hostUUID={hostUUID}
        initialValues={{
          eventName, eventType, eventWebsite, eventDescription, eventDuration, datesRange, startDate: {date: startDate},
          mc, arenaDirector, hostDrums, location, state
        }}
      />
    );

    const eventPhotosForm = (
      <EventPhotosForm
        hostUUID={hostUUID}
        initialValues={eventImage}
        eventImage={eventImage}
        onImageUpload={(e) => this.onImageUploadHandler(e, onImageUpload)}
        onSubmit={(values) => this.submitImage(values)}
        uploadInProgress={uploadInProgress}
        uploadImageError={uploadImageError}
        isNewImage={isNewImage}
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
      <Page className={css.root} title={title} scrollingDisabled={false}>
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

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const {
    eventDetails,
    eventDetailsUpdate,
    eventDetailsInProgress,
    eventDetailsError,
    imageId,
    uploadInProgress,
    uploadImageError,
    eventSellers,
    updateSellersResponse,
    updateSellersInProgress,
    updateSellersError,
  } = state.EventHostPage;
 
  const hostUUID = currentUser && currentUser.id ? currentUser.id.uuid : null;
  const hostName = currentUser && currentUser.attributes ? currentUser.attributes.profile.displayName : null;
  const hostEmail = currentUser && currentUser.attributes ? currentUser.attributes.email : null;

  return {
    hostUUID,
    hostName,
    hostEmail,
    currentUser,
    eventDetails,
    eventDetailsUpdate,
    eventDetailsInProgress,
    eventDetailsError,
    imageId,
    uploadInProgress,
    uploadImageError,
    eventSellers,
    updateSellersResponse,
    updateSellersInProgress,
    updateSellersError,
  };
};

const mapDispatchToProps = dispatch => ({
  onLoadData: () => dispatch(loadData()),
  onUpdateDetails: details => dispatch(updateEventDetails(details)),
  onUpdateImage: imageDetails => dispatch(updateImage(imageDetails)),
  onImageUpload: image => dispatch(uploadImage(image)),
  onUpdateSellers: seller => dispatch(updateSellers(seller)),
});

const EventHostPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(EventHostPageComponent);

export default EventHostPage;

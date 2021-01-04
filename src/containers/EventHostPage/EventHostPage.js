import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import moment from 'moment';
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

import { loadData, updateDetails, uploadImage, updateSellers } from './EventHostPage.duck';
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
    this.submitDetails = this.submitDetails.bind(this);
  }

  submitDetails(values) {
    const { eventDuration, datesRange, startDate, mc, arenaDirector, hostDrums, location, lot, ...rest} = values; 
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
    console.log(payload);
    this.props.onUpdateDetails(payload);
  }

  addAnother(){
    console.log("Hello There");
    this.setState({
      email: '',
    });
  }

  componentDidMount() {
    if (window) {
      this.props.onLoadData();
      // this.loadInitialData();
    }
  }

  render() {
    const {
      currentUser,
      scrollingDisabled,
      intl,
      tab,
      onImageUpload,
      eventInfoInProgress,
      eventDetails,
    } = this.props;

    const sellers = ["chase@fromthepeople.co", "mcniel26@gmail.com", "isabella@fromthepeople.co"];
    const user = ensureCurrentUser(currentUser);

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
    const datesRange = {startDate: new Date("2020-12-24"), endDate: new Date("2020-12-31")};
    
    const eventDuration = startDate && endDate ? "multi" : "single";

    const eventDetailsForm = (
      <EventDetailsForm 
      onSubmit={(values) => this.submitDetails(values)} 
      eventInfoInProgress={eventInfoInProgress}
      initialValues = {{ eventName, eventType, eventWebsite, eventDescription, eventDuration, datesRange, startDate, endDate,
        startTime, meridiem, mc, arenaDirector, hostDrums, location, lot}}
      />
    );

    const eventPhotosForm = (
    <EventPhotosForm onImageUpload={onImageUpload} onSubmit={(values) => console.log(values)} />
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
    eventInfoInProgress,
    eventDetails,
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
    eventDetails
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

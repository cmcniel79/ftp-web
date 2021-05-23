import React, { Component } from 'react';
import { TopbarContainer } from '..';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { injectIntl } from '../../util/reactIntl';
import { getListingsById } from '../../ducks/marketplaceData.duck';
import { getEventDateString, parseDateFromISO8601 } from '../../util/dates';
import { FormattedMessage } from '../../util/reactIntl';
import { loadData, searchListings } from './SingleEventPage.duck';
import { parse, createSlug } from '../../util/urlHelpers';
import SectionHost from './SectionHost';
import SectionListings from './SectionListings';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  Page
} from '../../components';

import css from './SingleEventPage.module.css';

export class SingleEventPageComponent extends Component {

  render() {
    const {
      eventInfoInProgress,
      eventDetails,
      eventInfoError,
      searchListingsInProgress,
      searchListingsError,
      pagination,
      listings,
    } = this.props;

    // Get basic Event info from eventDetails 
    const hostUUID = eventDetails && eventDetails.hostUUID ? eventDetails.hostUUID : null;
    const eventName = eventDetails && eventDetails.eventName ? eventDetails.eventName : null;
    const eventDescription = eventDetails && eventDetails.eventDescription ? eventDetails.eventDescription : null;
    const eventWebsite = eventDetails && eventDetails.eventWebsite ? eventDetails.eventWebsite : null;
    const eventType = eventDetails && eventDetails.eventType ? eventDetails.eventType : null;
    const imageUUID = eventDetails && eventDetails.imageUUID ? eventDetails.imageUUID : null;
    const parsedData = eventDetails && eventDetails.optionalData ? JSON.parse(eventDetails.optionalData) : null
    const eventAddress = parsedData && parsedData.location && parsedData.location.selectedPlace ? parsedData.location.selectedPlace.address : null;

    const startDate = eventDetails && eventDetails.startDate ? parseDateFromISO8601(eventDetails.startDate.slice(0, 10)) : null;
    const endDate = eventDetails && eventDetails.endDate ? parseDateFromISO8601(eventDetails.endDate.slice(0, 10)) : null;
    const dateString = getEventDateString(startDate, endDate);

    const pageTitle = eventDetails && eventDetails.eventName ? eventDetails.eventName : "Loading Event...";

    const eventInfo = eventDetails && !eventInfoInProgress ? (
      <div className={css.eventInfo}>
        <SectionHost
          className={css.sectionHost}
          eventName={eventName}
          eventDescription={eventDescription}
          eventWebsite={eventWebsite}
          eventType={eventType}
          imageUUID={imageUUID}
          dateString={dateString}
          optionalData={parsedData}
          eventAddress={eventAddress}
        />
        {listings && listings.length > 0 ?
          <SectionListings
            className={css.sectionListings}
            listings={listings}
            pagination={pagination}
            searchListingsInProgress={searchListingsInProgress}
            searchListingsError={searchListingsError}
            pageName="SingleEventPage"
            pagePathParams={{ eventType: eventType, slug: createSlug(eventName), id: hostUUID }}
          /> : null}
      </div>
    ) : null;

    const eventLoadingMessages =
      !eventDetails && eventInfoInProgress ? <FormattedMessage id="SingleEventPage.loadingEvent" />
        : !eventDetails && !eventInfoInProgress ? <FormattedMessage id="SingleEventPage.noEvent" />
          : eventInfoError && !eventInfoInProgress ? <FormattedMessage id="SingleEventPage.eventError" />
            : null;

    return (
      <Page className={css.root} title={pageTitle} scrollingDisabled={false}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>
          <LayoutWrapperMain className={css.staticPageWrapper}>
            {eventInfo}
            <h2>
              {eventLoadingMessages}
            </h2>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
};

const mapStateToProps = state => {
  const {
    eventInfoInProgress,
    eventDetails,
    eventInfoError,
    searchListingsInProgress,
    searchListingsError,
    currentPageResultIds,
    pagination,
  } = state.SingleEventPage;
  const pageListings = getListingsById(state, currentPageResultIds);
  return {
    eventInfoInProgress,
    eventDetails,
    eventInfoError,
    searchListingsInProgress,
    searchListingsError,
    pagination,
    listings: pageListings,
  };
};

const mapDispatchToProps = dispatch => ({
});

const SingleEventPage = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(SingleEventPageComponent);

export default SingleEventPage;

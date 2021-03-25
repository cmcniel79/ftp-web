import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { TopbarContainer } from '..';
import { FormattedMessage } from '../../util/reactIntl';
import { loadData } from './EventsPage.duck';
import EventSection from './EventSection';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  NamedLink,
  Page
} from '../../components';

import css from './EventsPage.module.css';

export class EventsPageComponent extends Component {

  componentDidMount() {
    if (window) {
      this.props.onLoadData();
    }
  }

  render() {
    const {
      exampleEvents,
      requestInProgress,
      requestError,
    } = this.props;

    const eventsSection = exampleEvents && !requestInProgress ? (
      <div className={css.eventSections}>
        <EventSection events={exampleEvents.filter(e => e.eventType === "powwow")} eventType="powwow" />
        <EventSection events={exampleEvents.filter(e => e.eventType === "virtual")} eventType="virtual" />
      </div>
    ) : null;

    const eventsMessage =
      requestInProgress ? <FormattedMessage id="EventsPage.loadingEvents" />
        : requestError ? <FormattedMessage id="EventsPage.loadingError" />
          : exampleEvents && exampleEvents.length === 0 ? <FormattedMessage id="EventsPage.noEvents" />
            : null;

    const contactPageLink = (
      <NamedLink name="ContactPage">
        <FormattedMessage id="EventsPage.contactLink" />
      </NamedLink>);

    const addAnEventInfo = !requestInProgress ? (
      <h3 className={css.addEvent}>
        <FormattedMessage id="EventsPage.addAnEvent" values={{ link: contactPageLink }} />
      </h3>
    ) : null;

    return (
      <Page className={css.root} title="Events Page" scrollingDisabled={false}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>
          <LayoutWrapperMain className={css.staticPageWrapper}>
            {eventsSection}
            {eventsMessage}
            {addAnEventInfo}
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
    exampleEvents,
    requestInProgress,
    requestError,
  } = state.EventsPage;
  return {
    exampleEvents,
    requestInProgress,
    requestError,
  };
};

const mapDispatchToProps = dispatch => ({
  onLoadData: () => dispatch(loadData()),
});

const EventsPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EventsPageComponent);

export default EventsPage;

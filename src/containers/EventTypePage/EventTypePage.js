import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { TopbarContainer } from '..';
import { FormattedMessage } from '../../util/reactIntl';
import { StateSelectionForm } from '../../forms';
import { loadData } from './EventTypePage.duck';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  EventCard,
  Footer,
  NamedLink,
  Page,
} from '../../components';

import css from './EventTypePage.css';

export class EventTypePageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stateSelected: null,
      length: null,
    };
    this.selectState = this.selectState.bind(this);
  }

  componentDidMount() {
    if (window) {
      this.props.onLoadData(this.props.params.type);
    }
  }

  selectState(value) {
    this.setState({ stateSelected: value && value.state && value.state !== "all" ? value.state : null });
  }


  render() {
    const {
      events,
      requestInProgress,
      requestError,
    } = this.props;

    const eventType = this.props.params.type;
    const pageTitle = eventType === "powwow" ? "Powwows" : "Virtual Events";
    const contactPageLink = (
      <NamedLink name="ContactPage">
        <FormattedMessage id="EventsPage.contactLink" />
      </NamedLink>);

    const length = events && this.state.stateSelected ?
      events.filter(e => e.state === this.state.stateSelected).length : events ? events.length : 0;

    var heading;
    if (eventType && eventType === 'powwow') {
      heading = <FormattedMessage id="EventTypePage.powwowHeading" values={{ total: length }} />;
    } else {
      heading = <FormattedMessage id="EventTypePage.virtualHeading" values={{ total: length }} />;
    };

    const eventsMessage =
      requestInProgress ? <FormattedMessage id="EventsTypePage.loadingEvents" />
        : requestError ? <FormattedMessage id="EventsTypePage.loadingError" />
          : events && events.length === 0 ? <FormattedMessage id="EventsTypePage.noEvents" />
            : null;

    const eventsPanel = events && events.length > 0 && !requestInProgress ? (
      <div className={css.container}>
        <div className={css.panel}>
          <h2 className={css.sectionTitle}>
            {heading} {this.state.stateSelected ? "in " + this.state.stateSelected : null}
          </h2>
          <StateSelectionForm onSubmit={(value) => this.selectState(value)} initialValues={{ state: this.state.stateSelected }} />
          <div className={css.half}></div>
          <h3 className={css.addEventInfo}>
            <FormattedMessage id="EventTypePage.addAnEvent" values={{ link: contactPageLink }} />
          </h3>
        </div>
        <div className={css.eventsGrid} >
          {events && events.filter(e => 
          this.state.stateSelected !== null ? e.state === this.state.stateSelected : e)
          .map(event => {
            const pageName = eventType === "powwwows" ? "PowwowPage" : "PowwowPage";
            return (
              <div className={css.eventCardWrapper} key={event.eventName}>
                <EventCard event={event} pageName={pageName} />
              </div>
            )
          }
          )}
        </div>
      </div>) : null;

    return (
      <Page className={css.root} title={pageTitle} scrollingDisabled={false}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>

          <LayoutWrapperMain className={css.staticPageWrapper}>
            {eventsPanel}
            <h2>
              {eventsMessage}
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
    events,
    requestInProgress,
    requestError,
  } = state.EventTypePage;
  return {
    events,
    requestInProgress,
    requestError,
  };
};

const mapDispatchToProps = dispatch => ({
  onLoadData: (type) => dispatch(loadData(type)),
});

const EventTypePage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EventTypePageComponent);

export default EventTypePage;

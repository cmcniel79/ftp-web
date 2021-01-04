import React, { Component } from 'react';
import { compose } from 'redux';
import { TopbarContainer } from '..';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  EventCard,
  Footer,
  // ExternalLink,
  Modal,
  NamedLink,
  SelectSingleFilter,
  Page,
  FieldSelect
} from '../../components';
import {
  FormattedMessage,
} from '../../util/reactIntl';
import { StateSelectionForm } from '../../forms';
import stanfordImage from '../../assets/stanford-bg.jpg';
import bed from '../../assets/bed.svg';
import people from '../../assets/people.svg';
import fitness from '../../assets/fitness.svg';

import css from './EventTypePage.css';

export class EventTypePageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobileModalOpen: false,
      state: null,
      length: null,
    };
    this.selectState = this.selectState.bind(this);
    this.onOpenMobileModal = this.onOpenMobileModal.bind(this);
    this.onCloseMobileModal = this.onCloseMobileModal.bind(this);
  }

  selectState(value) {
    this.setState({ state: value && value.state && value.state !== "all" ? value.state : null });
  }

  // Invoked when a modal is opened from a child component,
  // for example when a filter modal is opened in mobile view
  onOpenMobileModal() {
    this.setState({ isMobileModalOpen: true });
  }

  // Invoked when a modal is closed from a child component,
  // for example when a filter modal is opened in mobile view
  onCloseMobileModal() {
    this.setState({ isMobileModalOpen: false });
  }

  render() {
    const eventType = this.props.params.type;
    const pageTitle = eventType === "powwows" ? "Powwows" : "Virtual Events";

    const contactPageLink = <NamedLink name="ContactPage">
      <FormattedMessage id="EventsPage.contactLink" />
    </NamedLink>;

    const events = [
      { eventName: "Stanford Powwow", eventType: "powwwow", image: stanfordImage, state: "NM" },
      { eventName: "Oakland Powwow", eventType: "powwwow", image: bed, state: "CA" },
      { eventName: "Gathering of Nations", eventType: "powwwow", image: people, state: "TX" },
      { eventName: "UNM Powwow", eventType: "powwwow", image: fitness, state: "AZ" },
      { eventName: "Stanford Powwow", eventType: "powwwow", image: stanfordImage, state: "FL" },
      { eventName: "Oakland Powwow", eventType: "powwwow", image: bed, state: "NM" },
      { eventName: "Gathering of Nations", eventType: "powwwow", image: people, state: "CA" },
      { eventName: "UNM Powwow", eventType: "powwwow", image: fitness, state: "TX" },
      { eventName: "Stanford Powwow", eventType: "powwwow", image: stanfordImage, state: "CA" },
      { eventName: "Oakland Powwow", eventType: "powwwow", image: bed, state: "AZ" },
      { eventName: "Gathering of Nations", eventType: "powwwow", image: people, state: "TX" },
    ];

    const length = this.state.state ?
      events.filter(e => e.state === this.state.state).length : events.length;

    var title;
    if (eventType && eventType === 'powwows') {
      title = <FormattedMessage id="EventTypePage.powwows" values={{ total: length }} />;
    } else {
      title = <FormattedMessage id="EventTypePage.virtual" values={{ total: length }} />;
    }

    return (
      <Page className={css.root} title={pageTitle} scrollingDisabled={false}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>

          <LayoutWrapperMain className={css.staticPageWrapper}>
            <div className={css.container}>
              <div className={css.panel}>
                <h2 className={css.sectionTitle}>
                  {title} {this.state.state ? "in " + this.state.state : null}
                </h2>
                <StateSelectionForm onSubmit={(value) => this.selectState(value)} initialValues={{ state: this.state.state }} />
                <div className={css.half}></div>
                <h3 className={css.addEventInfo}>
                  <FormattedMessage id="EventTypePage.addAnEvent" values={{ link: contactPageLink }} />
                </h3>
              </div>
              <div className={css.eventsGrid} >
                {events.filter(e =>
                  this.state.state !== null ? e.state === this.state.state : e
                ).map(event => {
                  const pageName = eventType === "powwwows" ? "PowwowPage" : "PowwowPage";
                  return (
                    <div className={css.eventCardWrapper} key={event.eventName}>
                      <EventCard event={event} pageName={pageName} />
                    </div>
                  )
                }
                )}
              </div>
            </div>

          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
};

const EventTypePage = compose(
)(EventTypePageComponent);

export default EventTypePage;

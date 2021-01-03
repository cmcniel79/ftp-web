import React, { Component } from 'react';
import { compose } from 'redux';
import { TopbarContainer } from '..';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  // ExternalLink,
  NamedLink,
  Page
} from '../../components';
import {
  FormattedMessage,
} from '../../util/reactIntl';
import stanfordImage from '../../assets/stanford-bg.jpg';
import css from './EventsPage.css';
import EventSection from './EventSection';
import bed from '../../assets/bed.svg';
import people from '../../assets/people.svg';
import fitness from '../../assets/fitness.svg';

export class EventsPageComponent extends Component {

  render() {

    const contactPageLink = <NamedLink name="ContactPage">
      <FormattedMessage id="EventsPage.contactLink" />
    </NamedLink>;

    const powwows = [
    {eventName: "Stanford Powwow", eventType: "powwwow", image: stanfordImage}, 
    {eventName: "Oakland Powwow", eventType: "powwwow", image: bed},
    {eventName: "Gathering of Nations", eventType: "powwwow", image: people}, 
    // {eventName: "UNM Powwow", eventType: "powwwow", image: fitness}
  ];
    // I do not know why the length of the events list in section carousel is only 2,
    // so I am passing in the length here
    return (
      <Page className={css.root} title="Events Page" scrollingDisabled={false}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>

          <LayoutWrapperMain className={css.staticPageWrapper}>
              <EventSection eventList={powwows} eventType="powwow" />
              <EventSection eventList={powwows} eventType="virtual"/>

            <div className={css.addEvent}>
              <h3 className={css.addEventInfo}>
                <FormattedMessage id="EventsPage.addAnEvent" values={{ link: contactPageLink }}/>
              </h3>
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

const EventsPage = compose(
)(EventsPageComponent);

export default EventsPage;

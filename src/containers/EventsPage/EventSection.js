import React from 'react';
import {
  EventCard,
  NamedLink,
} from '../../components';
import {
  FormattedMessage,
} from '../../util/reactIntl';
import arrow from '../../assets/arrow-forward-outline.svg';

import css from './EventsPage.css';

export const EventSection = props => {

  const { eventList, eventType } = props;

  var title;
  var link;
  if (eventType && eventType === 'powwow') {
    title = <FormattedMessage id="EventsPage.powwows" />;
    link = (
      <NamedLink name="EventTypePage" params={{ type: "powwows" }}>
        <FormattedMessage id="EventsPage.powwowsLink" />
      </NamedLink>
    );
  } else {
    title = <FormattedMessage id="EventsPage.virtual" />;
    link = (
      <NamedLink name="EventTypePage" params={{ type: "virtual-events" }}>
        <FormattedMessage id="EventsPage.virtualLink" />
      </NamedLink>
    );
  }

  return (eventList ? (
    <div className={css.sectionContainer}>
      <div className={css.titleContainer}>
      <h1 className={css.sectionTitle}>
        {title}
      </h1>
      <h3 className={css.eventPageLink} >
        {link}
        <img className={css.arrow} src={arrow} alt="arrow" />
      </h3>
      </div>
      <div className={css.eventSection}>
        {eventList.map(event => {
          const pageName = eventType === "powwwow" ? "PowwowPage" : "PowwowPage";
          return (
            <EventCard event={event} pageName={pageName} className={css.card}/>
          )}
        )}
      </div>
    </div>
  ) : null
  )
};

export default EventSection;
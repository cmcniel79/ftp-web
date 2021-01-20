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

  const { events, eventType } = props;


  const specificText = eventType === 'powwow' ? 'Powwows' : eventType === 'virtual' ? 'Virtual Events' : null;
  const title = <FormattedMessage id="EventsPage.sectionTitle" values={{ type: specificText }} />;
  const link = (
    <NamedLink name="EventTypePage" params={{ type: eventType }}>
      <FormattedMessage id="EventsPage.sectionLink" values={{ type: specificText }} />
    </NamedLink>
  );
    console.log(events);
  return (
    events ? (
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
        {events.map(event => {
          const pageName = eventType === "powwwow" ? "PowwowPage" : "PowwowPage";
          return (
            <EventCard key={event.hostUUID} event={event} pageName={pageName} className={css.card} />
          )
        }
        )}
      </div>
    </div>
  ) : null
  )
};

export default EventSection;
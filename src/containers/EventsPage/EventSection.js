import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import arrow from '../../assets/arrow-forward-outline.svg';
import {
  EventCard,
  NamedLink,
} from '../../components';

import css from './EventsPage.module.css';

export const EventSection = props => {

  const { events, eventType } = props;

  const specificText = eventType === 'powwow' ? 'Powwows' : eventType === 'virtual' ? 'Virtual Events' : null;
  const title = <FormattedMessage id="EventsPage.sectionTitle" values={{ type: specificText }} />;
  const link = (
    <NamedLink name="EventTypePage" params={{ type: eventType }}>
      <FormattedMessage id="EventsPage.sectionLink" values={{ type: specificText }} />
    </NamedLink>
  );

  const eventSection = events && events.length > 0 ? (
    <div className={css.sectionContainer}>
      <div className={css.titleContainer}>
        <h1 className={css.sectionTitle}>
          {title}
        </h1>
        {events.length > 2 ? (
        <h3 className={css.eventPageLink} >
          {link}
          <img className={css.arrow} src={arrow} alt="arrow" />
        </h3> ) : null}
      </div>
      <div className={css.eventSection}>
        {events.map(event => { 
          return <EventCard key={event.hostUUID} event={event} className={css.card} />
        })}
      </div>
    </div>
  ) : null;

  return eventSection;
};

export default EventSection;
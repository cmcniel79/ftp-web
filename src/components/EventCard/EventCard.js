import React from 'react';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import { createSlug } from '../../util/urlHelpers';
import { parseDateFromISO8601 } from '../../util/dates';
import { NamedLink } from '..';

import css from './EventCard.css';

export const EventCardComponent = props => {
  const { event, className } = props;
  const classes = classNames(css.eventCard, className);
  const eventSlug = createSlug(event.eventName);
  const dateObject = parseDateFromISO8601(event.startDate.slice(0, 10));
  const dateString = dateObject.toDateString().slice(3, 10);
  const eventType = event && event.eventType === 'powwow' ? 'powwows'
    : event && event.eventType === 'virtual' ? 'virtual-events' : null;

  return (
    <div className={classes}>
      <div className={css.eventImageWrapper}>
        <NamedLink className={css.eventLink} name="SingleEventPage" params={{ eventType, slug: eventSlug, id: event.hostUUID }}>
          <img className={css.eventImage} src={"https://ftpevents.imgix.net/5f99bfd4-f237-4d5d-afea-445aacef888f?ar=1:1&fit=crop"} alt={event.eventName} />
        </NamedLink>
      </div>
      <div className={css.eventSubtitle}>
        <FormattedMessage id="EventCard.eventCardInfo" values={{ eventName: event.eventName, date: dateString }} />
      </div>
    </div>
  );
};

export default injectIntl(EventCardComponent);

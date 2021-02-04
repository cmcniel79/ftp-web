import React from 'react';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import { createSlug } from '../../util/urlHelpers';
import { getEventDateString, parseDateFromISO8601 } from '../../util/dates';
import { NamedLink } from '..';

import css from './EventCard.css';

export const EventCardComponent = props => {
  const {
    rootClassName,
    event,
    className
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const eventSlug = event && event.eventName ? createSlug(event.eventName) : null;
  const eventType = event && event.eventType ? event.eventType : null;

  const startDate = event && event.startDate ? parseDateFromISO8601(event.startDate.slice(0, 10)) : null;
  const endDate = event && event.endDate ? parseDateFromISO8601(event.endDate.slice(0, 10)) : null;
  const dateString = !endDate ? startDate.toDateString().slice(3, 10) : getEventDateString(startDate, endDate).slice(0, -6);

  const imageUrl = event && event.imageUUID ? "https://ftpevents.imgix.net/" + event.imageUUID
    : "https://ftpevents.imgix.net/EventsLogo2.png";
  const cropEnd = "?h=533&w=800&fit=crop&crop=focalpoint&fp-x=.5&fp-y=.0";

  const card = (
    <div className={classes}>
      <div className={css.squareWrapper}>
        <div className={css.eventImageWrapper}>
          {event && eventType && eventSlug &&
            <NamedLink className={css.eventLink} name="SingleEventPage" params={{ eventType: eventType, slug: eventSlug, id: event.hostUUID }}>
              <img className={css.eventImage} src={imageUrl + cropEnd} alt={event.eventName} />
            </NamedLink>
          }
        </div>
      </div>
      <div className={css.eventSubtitle}>
        <FormattedMessage id="EventCard.eventCardInfo" values={{ eventName: event.eventName, date: dateString }} />
      </div>
    </div>
  );

  return card;
};

export default injectIntl(EventCardComponent);

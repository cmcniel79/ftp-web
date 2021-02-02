import React from 'react';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import { createSlug } from '../../util/urlHelpers';
import { parseDateFromISO8601 } from '../../util/dates';
import { NamedLink } from '..';

import css from './EventCard.css';

export const EventCardComponent = props => {
  const {
    rootClassName,
    event,
    className
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const eventSlug = createSlug(event.eventName);
  const dateObject = parseDateFromISO8601(event.startDate.slice(0, 10));
  const dateString = dateObject.toDateString().slice(3, 10);
  const eventType = event && event.eventType === 'powwow' ? 'powwows'
    : event && event.eventType === 'virtual' ? 'virtual-events' : null;
  const imageUrl = event && event.imageUUID ? "https://ftpevents.imgix.net/" + event.imageUUID
    : "https://ftpevents.imgix.net/test-powwow.jpg";
  const cropEnd = "?h=533&w=800&fit=crop&crop=focalpoint&fp-x=.5&fp-y=.0"

  return (
    <div className={classes}>
      <div className={css.squareWrapper}>
        <div className={css.eventImageWrapper}>
          <NamedLink className={css.eventLink} name="SingleEventPage" params={{ eventType, slug: eventSlug, id: event.hostUUID }}>
            <img className={css.eventImage} src={imageUrl + cropEnd} alt={event.eventName} />
          </NamedLink>
        </div>
      </div>
      <div className={css.eventSubtitle}>
        <FormattedMessage id="EventCard.eventCardInfo" values={{ eventName: event.eventName, date: dateString }} />
      </div>
    </div>
  );
};

export default injectIntl(EventCardComponent);

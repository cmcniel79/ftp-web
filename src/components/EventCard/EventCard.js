import React  from 'react';
import { string, func } from 'prop-types';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { 
  NamedLink, 
} from '..';
import css from './EventCard.css';

export const EventCardComponent = props => {
  const { event, pageName, className } = props;
  const classes = classNames(css.eventCard, className);
  const slug = encodeURI(event.eventName);
  const dateObject = new Date(event.startDate.slice(0,10));
  const dateString = dateObject.toDateString().slice(3, 10);
  return (
    <div className={classes} key={event.hostUUID}>
    <div className={css.eventImageWrapper}>
      <NamedLink className={css.eventLink} name="SingleEventPage" params={{ eventName: slug, id: event.hostUUID }}>
        <img className={css.eventImage} src={"https://ftpevents.imgix.net/5f99bfd4-f237-4d5d-afea-445aacef888f"} alt={event.eventName} />
      </NamedLink>
    </div>
    <div className={css.eventSubtitle}>
      <FormattedMessage id="EventCard.eventCardInfo" values={{ eventName: event.eventName, date: dateString }} />
    </div>
  </div>
  );
};

EventCardComponent.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
};

EventCardComponent.propTypes = {
  className: string,
  rootClassName: string,
  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
};

export default injectIntl(EventCardComponent);

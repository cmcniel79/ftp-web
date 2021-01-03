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
  return (
    <div className={classes} key={event.eventName}>
    <div className={css.eventImageWrapper}>
      <NamedLink className={css.eventLink} name={pageName} params={{ eventName: slug }}>
        <img className={css.eventImage} src={event.image} alt={event.eventName} />
      </NamedLink>
    </div>
    <div className={css.eventSubtitle}>
      <FormattedMessage id="EventCard.eventCardInfo" values={{ eventName: event.eventName, date: "May 5th-7th" }} />
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

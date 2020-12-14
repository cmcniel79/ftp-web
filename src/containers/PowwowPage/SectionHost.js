import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import stanfordImage from '../../assets/stanford-bg.jpg';
import { ExternalLink } from '../../components';
import css from './PowwowPage.css';

const SectionHost = props => {
  const {
    host
  } = props;
  const address = "Stanford CA";
  const dates = "May 5th - 6th";
  const contact = "powwow@stanford.edu";
  const website = "http://powwow.stanford.edu/";

  return (
    <div id="seller" className={css.sectionSeller}>
      <div className={css.hostImageWrapper}>
        <img className={css.hostImage} src={stanfordImage} alt="stanford" />
      </div>
      <div className={css.hostInfo}>
        <div className={css.hostInfoRow}>
          <FormattedMessage id="PowwowPage.host" />
          {host}
        </div>
        <div className={css.hostInfoRow}>
          <FormattedMessage id="PowwowPage.address" />
          {address}
        </div>
        <div className={css.hostInfoRow}>
          <FormattedMessage id="PowwowPage.dates" />
          {dates}
        </div >
        <div className={css.hostInfoRow}>
          <FormattedMessage id="PowwowPage.contact" />
          {contact}
        </div >
        <div className={css.hostInfoRow}>
          <FormattedMessage id="PowwowPage.website" />
          <ExternalLink href={website}>
            {website}
          </ExternalLink>
        </div >
      </div >
    </div >
  );
};

export default SectionHost;

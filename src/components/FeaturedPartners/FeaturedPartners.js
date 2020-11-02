import React from 'react';
import { ResponsiveImage, NamedLink } from '..';
import { ensureUser } from '../../util/data';
import css from './FeaturedPartners.css';
import { propTypes } from '../../util/types';
import { FormattedMessage } from '../../util/reactIntl';

const AVATAR_IMAGE_VARIANTS = [
  // 480x480
  'square-small2x',
];

const FeaturedPartners = props => {
  const user = props;
  const ensuredUser = ensureUser(user.user);
  const { displayName, publicData, bio } = ensuredUser.attributes.profile;
  const companyName = publicData.companyName ? publicData.companyName : null;
  const cardTitle = companyName ? companyName : displayName;
  const image =
      <NamedLink name="ProfilePage" params={{ id: ensuredUser.id.uuid }}>
        <ResponsiveImage
          rootClassName={css.image}
          alt="Logo"
          image={ensuredUser.profileImage}
          variants={AVATAR_IMAGE_VARIANTS}
        />
      </NamedLink>;

  return (
    <div>
      <h2 className={css.heading}>
        <FormattedMessage id={"FeaturedPartners.header"} />
      </h2>
      <div className={css.partnerCard}>
        <div className={css.mobileImageWrapper}>
          {image}
        </div>
        <div className={css.partnerText}>
          <h3 className={css.subHeading}>
            {cardTitle}
          </h3>
          <div className={css.text}>{bio}</div>
          <NamedLink name="ProfilePage" params={{ id: ensuredUser.id.uuid }}>
            <FormattedMessage id={"FeaturedPartners.viewProfile"} values={{ cardTitle }} />
          </NamedLink>
        </div>
        <div className={css.imageWrapper}>
          {image}
        </div>
      </div>
    </div>
  );
};

FeaturedPartners.defaultProps = {
  user: null,
};

FeaturedPartners.propTypes = {
  user: propTypes.user.isRequired,
};

export default FeaturedPartners;
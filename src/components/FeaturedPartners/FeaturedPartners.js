import React, { Component } from 'react';
import { ResponsiveImage, NamedLink } from '..';
import { ensureUser } from '../../util/data';
import css from './FeaturedPartners.module.css';
import { propTypes } from '../../util/types';
import { FormattedMessage } from '../../util/reactIntl';
import { arrayOf } from 'prop-types';
import { IconChevronBack, IconChevronForward } from '../../components';

const AVATAR_IMAGE_VARIANTS = [
  // 480x480
  'square-small2x',
];

class FeaturedPartners extends Component {
  constructor(props) {
    super(props);
    this.state = { shownUser: this.props.users[0] };
    this.changeUser = this.changeUser.bind(this);
  }

  changeUser(forward) {
    const shownUser = this.state.shownUser;
    const index = this.props.users.findIndex((user) => user.id.uuid === shownUser.id.uuid);
    const length = this.props.users.length;
    if (forward) {
      if (index >= length - 1) {
        this.setState({ shownUser: this.props.users[0] });
      } else {
        this.setState({ shownUser: this.props.users[index + 1] });
      }
    } else {
      if (index === 0) {
        this.setState({ shownUser: this.props.users[length - 1] });
      } else {
        this.setState({ shownUser: this.props.users[index - 1] });
      }
    }
  }

  render() {
    const ensuredUser = ensureUser(this.state.shownUser);
    const { displayName, publicData, bio } = ensuredUser.attributes.profile;
    const companyName = publicData && publicData.companyName ? publicData.companyName : null;
    const cardTitle = companyName ? companyName : displayName;
    const userId = ensuredUser && ensuredUser.id && ensuredUser.id.uuid ? ensuredUser.id.uuid : null;
    const image = ensuredUser && ensuredUser.id ? (
      <NamedLink name="ProfilePage" params={{ id: ensuredUser.id.uuid }}>
        <ResponsiveImage
          rootClassName={css.image}
          alt="Logo"
          image={ensuredUser.profileImage}
          variants={AVATAR_IMAGE_VARIANTS}
        />
      </NamedLink>
    ) : null;

    return (
      <div>
        <h2 className={css.heading}>
          <FormattedMessage id={"FeaturedPartners.header"} />
        </h2>
        <div className={css.partnerCard}>
          {this.props.users && this.props.users.length > 1 ?
            <button className={css.backButtonDesktop} onClick={() => this.changeUser(false)}>
              <IconChevronBack className={css.chevron} />
            </button> : null}
          <div className={css.mobileImageWrapper}>
            {this.props.users && this.props.users.length > 1 ?
              <button className={css.backButton} onClick={() => this.changeUser(false)}>
                <IconChevronBack className={css.chevron} />
              </button> : null}
            {image}
            {this.props.users && this.props.users.length > 1 ?
              <button className={css.forwardButton} onClick={() => this.changeUser(true)}>
                <IconChevronForward className={css.chevron} />
              </button> : null}
          </div>
          <div className={css.partnerText}>
            <h3 className={css.subHeading}>
              {cardTitle}
            </h3>
            <div className={css.text}>{bio}</div>
            {userId ?
              <NamedLink name="ProfilePage" params={{ id: userId }}>
                <FormattedMessage id={"FeaturedPartners.viewProfile"} values={{ cardTitle }} />
              </NamedLink> : null}
          </div>
          <div className={css.imageWrapper}>
            {image}
          </div>
          {this.props.users && this.props.users.length > 1 ?
            <button className={css.forwardButtonDesktop} onClick={() => this.changeUser(true)}>
              <IconChevronForward className={css.chevron} />
            </button> : null}
        </div>
      </div>
    );
  }
};

FeaturedPartners.defaultProps = {
  users: null,
};

FeaturedPartners.propTypes = {
  users: arrayOf(propTypes.user).isRequired,
};

export default FeaturedPartners;
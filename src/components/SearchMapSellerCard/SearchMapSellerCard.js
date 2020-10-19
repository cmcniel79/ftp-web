import React, { Component } from 'react';
import { arrayOf, bool, func, string } from 'prop-types';
import { compose } from 'redux';
import { injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import { propTypes } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { ensureUser } from '../../util/data';
import { ResponsiveImage, NamedLink } from '../../components';

import css from './SearchMapSellerCard.css';

// SellerCard is the listing info without overlayview or carousel controls
const SellerCard = props => {
  const { className, clickHandler, intl, isInCarousel, user, urlToProfile  } = props;
  const title = user.attributes.profile.publicData.companyName;
  const profileImage = user.profileImage ? user.profileImage : null;

  const profileLink = user.id.uuid ?
    <NamedLink className={css.link} name="ProfilePage" params={{ id: user.id.uuid }}>
    </NamedLink> 
    : null;

  // listing card anchor needs sometimes inherited border radius.
  const classes = classNames(
    css.anchor,
    css.borderRadiusInheritTop,
    { [css.borderRadiusInheritBottom]: !isInCarousel },
    className
  );

  return (
    <a
      alt={title}
      className={classes}
      href={profileLink}
      onClick={e => {
        e.preventDefault();
        // Use clickHandler from props to call internal router
        clickHandler(user);
      }}
    >
      <div
        className={classNames(css.card, css.borderRadiusInheritTop, {
          [css.borderRadiusInheritBottom]: !isInCarousel,
        })}
      >
        <div className={classNames(css.threeToTwoWrapper, css.borderRadiusInheritTop)}>
          <div className={classNames(css.aspectWrapper, css.borderRadiusInheritTop)}>
            <ResponsiveImage
              rootClassName={classNames(css.rootForImage, css.borderRadiusInheritTop)}
              alt={title}
              noImageMessage={intl.formatMessage({ id: 'SearchMapInfoCard.noImage' })}
              image={profileImage}
              variants={['square-small', 'square-small2x']}
              sizes="250px"
            />
          </div>
        </div>
        <div className={classNames(css.info, { [css.borderRadiusInheritBottom]: !isInCarousel })}>
          <div className={css.price}> </div>
          <div className={css.name}>{title}</div>
        </div>
      </div>
    </a>
  );
};

SellerCard.defaultProps = {
  className: null,
};

SellerCard.propTypes = {
  className: string,
  listing: propTypes.user.isRequired,
  clickHandler: func.isRequired,
  intl: intlShape.isRequired,
  isInCarousel: bool.isRequired,
};

class SearchMapSellerCard extends Component {
  constructor(props) {
    super(props);

    this.state = { currentUserIndex: 0 };
  }

  render() {
    const {
      className,
      rootClassName,
      intl,
      users,
      createURLToProfile,
      onUserInfoCardClicked,
    } = this.props;
    console.log(users[0]);
    const currentSeller = ensureUser(users[this.state.currentUserIndex]);
    const hasCarousel = users.length > 1;
    const pagination = hasCarousel ? (
      <div className={classNames(css.paginationInfo, css.borderRadiusInheritBottom)}>
        <button
          className={css.paginationPrev}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            this.setState(prevState => ({
              currentUserIndex:
                (prevState.currentUserIndex + users.length - 1) % users.length,
            }));
          }}
        />
        <div className={css.paginationPage}>
          {`${this.state.currentUserIndex + 1}/${users.length}`}
        </div>
        <button
          className={css.paginationNext}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            this.setState(prevState => ({
              currentUserIndex:
                (prevState.currentUserIndex + users.length + 1) % users.length,
            }));
          }}
        />
      </div>
    ) : null;

    const classes = classNames(rootClassName || css.root, className);
    const caretClass = classNames(css.caret, { [css.caretWithCarousel]: hasCarousel });
    console.log(currentSeller);
    return (
      <div className={classes}>
        <div className={css.caretShadow} />
        <SellerCard
          clickHandler={onUserInfoCardClicked}
          urlToProfile={createURLToProfile(currentSeller)}
          user={currentSeller}
          intl={intl}
          isInCarousel={hasCarousel}
        />
        {pagination}
        <div className={caretClass} />
      </div>
    );
  }
}

SearchMapSellerCard.defaultProps = {
  className: null,
  rootClassName: null,
};

SearchMapSellerCard.propTypes = {
  className: string,
  rootClassName: string,
  users: arrayOf(propTypes.user).isRequired,
  onUserInfoCardClicked: func.isRequired,
  createURLToProfile: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default compose(injectIntl)(SearchMapSellerCard);

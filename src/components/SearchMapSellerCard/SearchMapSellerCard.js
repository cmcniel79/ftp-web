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

// UserCard is the listing info without overlayview or carousel controls
const UserCard = props => {
  const { className, clickHandler, intl, isInCarousel, listing, urlToListing  } = props;
  const title = listing.attributes.profile.publicData.companyName;
  const firstImage = listing.profileImage ? listing.profileImage : null;

  const profileLink = listing.id.uuid ?
    <NamedLink className={css.link} name="ProfilePage" params={{ id: listing.id.uuid }}>
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
        clickHandler(listing);
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
              image={firstImage}
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

UserCard.defaultProps = {
  className: null,
};

UserCard.propTypes = {
  className: string,
  listing: propTypes.user.isRequired,
  clickHandler: func.isRequired,
  intl: intlShape.isRequired,
  isInCarousel: bool.isRequired,
};

class SearchMapInfoCard extends Component {
  constructor(props) {
    super(props);

    this.state = { currentListingIndex: 0 };
  }

  render() {
    const {
      className,
      rootClassName,
      intl,
      listings,
      createURLToListing,
      onListingInfoCardClicked,
    } = this.props;
    const currentListing = ensureUser(listings[this.state.currentListingIndex]);
    const hasCarousel = listings.length > 1;
    const pagination = hasCarousel ? (
      <div className={classNames(css.paginationInfo, css.borderRadiusInheritBottom)}>
        <button
          className={css.paginationPrev}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            this.setState(prevState => ({
              currentListingIndex:
                (prevState.currentListingIndex + listings.length - 1) % listings.length,
            }));
          }}
        />
        <div className={css.paginationPage}>
          {`${this.state.currentListingIndex + 1}/${listings.length}`}
        </div>
        <button
          className={css.paginationNext}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            this.setState(prevState => ({
              currentListingIndex:
                (prevState.currentListingIndex + listings.length + 1) % listings.length,
            }));
          }}
        />
      </div>
    ) : null;

    const classes = classNames(rootClassName || css.root, className);
    const caretClass = classNames(css.caret, { [css.caretWithCarousel]: hasCarousel });
    return (
      <div className={classes}>
        <div className={css.caretShadow} />
        <UserCard
          clickHandler={onListingInfoCardClicked}
          urlToListing={createURLToListing(currentListing)}
          listing={currentListing}
          intl={intl}
          isInCarousel={hasCarousel}
        />
        {pagination}
        <div className={caretClass} />
      </div>
    );
  }
}

SearchMapInfoCard.defaultProps = {
  className: null,
  rootClassName: null,
};

SearchMapInfoCard.propTypes = {
  className: string,
  rootClassName: string,
  listings: arrayOf(propTypes.user).isRequired,
  onListingInfoCardClicked: func.isRequired,
  createURLToListing: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default compose(injectIntl)(SearchMapInfoCard);

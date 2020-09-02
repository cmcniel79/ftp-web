import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import { LINE_ITEM_DAY, LINE_ITEM_NIGHT, propTypes } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { ensureListing, ensureUser } from '../../util/data';
import { richText } from '../../util/richText';
import { createSlug } from '../../util/urlHelpers';
import config from '../../config';
import { LikeButton, NamedLink, ResponsiveImage } from '../../components';
import verifiedImage from '../../assets/checkmark-circle.svg';

import css from './ListingCard.css';

const MIN_LENGTH_FOR_LONG_WORDS = 10;

const priceData = (price, intl) => {
  if (price && price.currency === config.currency) {
    const formattedPrice = formatMoney(intl, price);
    return { formattedPrice, priceTitle: formattedPrice };
  } else if (price) {
    return {
      formattedPrice: intl.formatMessage(
        { id: 'ListingCard.unsupportedPrice' },
        { currency: price.currency }
      ),
      priceTitle: intl.formatMessage(
        { id: 'ListingCard.unsupportedPriceTitle' },
        { currency: price.currency }
      ),
    };
  }
  return {};
};

class ListingImage extends Component {
  render() {
    return <ResponsiveImage {...this.props} />;
  }
}
const LazyImage = lazyLoadWithDimensions(ListingImage, { loadAfterInitialRendering: 3000 });

export const ListingCardComponent = props => {
  const { className, rootClassName, intl, listing, renderSizes, setActiveListing, currentUser } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', price, metadata } = currentListing.attributes;
  const slug = createSlug(title);
  const author = ensureUser(listing.author);
  const enrolled = author.attributes.profile.publicData.enrolled ? true : false;
  const firstImage =
    currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;

  const { formattedPrice, priceTitle } = priceData(price, intl);

  const authorAvailable = currentListing && currentListing.author;
  const userAndListingAuthorAvailable = !!(currentUser && authorAvailable);
  const isOwnListing =
    userAndListingAuthorAvailable && currentListing.author.id.uuid === currentUser.id.uuid;
  const likedListings = currentUser.publicData && currentUser.publicData.likedListings ? 
    currentUser.publicData.likedListings : null;

  return (
    <div className={classes}>
      <div
        className={css.threeToTwoWrapper}
        onMouseEnter={() => setActiveListing(currentListing.id)}
        onMouseLeave={() => setActiveListing(null)}
      >
        <div className={css.aspectWrapper}>
          <NamedLink name="ListingPage" params={{ id, slug }}>
            <LazyImage
              rootClassName={css.rootForImage}
              alt={title}
              image={firstImage}
              variants={['landscape-crop', 'landscape-crop2x']}
              sizes={renderSizes}
            />
            {enrolled &&
              <img className={css.verifiedImage} src={verifiedImage} alt="image sourced from Freepik.com" />
            }
          </NamedLink>
        </div>
      </div>
      <div className={css.info}>
        <div className={css.price}>
          <div className={css.priceValue} title={priceTitle}>
            {formattedPrice}
          </div>
          {currentUser && !isOwnListing &&
            <LikeButton 
            currentListing={currentListing}
            likedListings={likedListings}
            />
          }
        </div>
        <NamedLink className={css.link} name="ListingPage" params={{ id, slug }}>
          <div className={css.mainInfo}>
            <div className={css.title}>
              {richText(title, {
                longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
                longWordClass: css.longWord,
              })}
            </div>
          </div>
        </NamedLink>
      </div>
    </div>
  );
};

ListingCardComponent.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
  setActiveListing: () => null,
};

ListingCardComponent.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  listing: propTypes.listing.isRequired,

  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
};

export default injectIntl(ListingCardComponent);

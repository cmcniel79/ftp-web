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
import ExternalLink from '../ExternalLink/ExternalLink';

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

const checkAccountCode = (letter) => {
  if (letter == "e" || letter == "p" || letter == "a" || letter == "n") {
    return letter;
  }
  return null;
}

class ListingImage extends Component {
  render() {
    return <ResponsiveImage {...this.props} />;
  }
}
const LazyImage = lazyLoadWithDimensions(ListingImage, { loadAfterInitialRendering: 3000 });

export const ListingCardComponent = props => {
  const { className, rootClassName, intl, listing, renderSizes, setActiveListing, currentUser, onUpdateLikedListings } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', price, metadata } = currentListing.attributes;
  const slug = createSlug(title);

  const author = ensureUser(listing.author);
  const accountType = author && author.attributes.profile.publicData &&
    author.attributes.profile.publicData.account ? author.attributes.profile.publicData.account : null;
  const validAccountType = checkAccountCode(accountType);

  const firstImage =
    currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;

  const { formattedPrice, priceTitle } = priceData(price, intl);

  const likedListings = currentUser && currentUser.attributes.profile.privateData && currentUser.attributes.profile.privateData.likedListings ?
    Object.values(currentUser.attributes.profile.privateData.likedListings) : [];

  let imagesAndLinks;

  switch (validAccountType) {
    case "" || null:
      imagesAndLinks =
        <NamedLink name="ListingPage" params={{ id, slug }}>
          <LazyImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={['landscape-crop', 'landscape-crop2x']}
            sizes={renderSizes}
          />
        </NamedLink>;
      break;
    case "e":
      imagesAndLinks =
        <NamedLink name="ListingPage" params={{ id, slug }}>
          <LazyImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={['landscape-crop', 'landscape-crop2x']}
            sizes={renderSizes}
          />
          <img className={css.verifiedImage} src={verifiedImage} alt="image sourced from Freepik.com" />
        </NamedLink>;
      break;
    case "p":
      imagesAndLinks =
      <NamedLink name="PremiumPage" params={{ id, slug }}>
      <LazyImage
        rootClassName={css.rootForImage}
        alt={title}
        image={firstImage}
        variants={['landscape-crop', 'landscape-crop2x']}
        sizes={renderSizes}
      />
      <span className={css.premiumTag}> Premium </span>
      </NamedLink>;
      break;
    case "a":
      imagesAndLinks =
      <ExternalLink href="">
        <LazyImage
          rootClassName={css.rootForImage}
          alt={title}
          image={firstImage}
          variants={['landscape-crop', 'landscape-crop2x']}
          sizes={renderSizes}
        />
        <span className={css.adTag}> Ad </span>
      </ExternalLink>;
      break;
      case "n":
        imagesAndLinks =
        <ExternalLink href="">
          <LazyImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={['landscape-crop', 'landscape-crop2x']}
            sizes={renderSizes}
          />
          <span className={css.nonProfitTag}> Non-Profit </span>
        </ExternalLink>;
        break;
  }

  return (
    <div className={classes}>
      <div
        className={css.threeToTwoWrapper}
        onMouseEnter={() => setActiveListing(currentListing.id)}
        onMouseLeave={() => setActiveListing(null)}
      >
        <div className={css.aspectWrapper}>
          {imagesAndLinks}
          {currentUser &&
            <LikeButton
              onUpdateLikedListings={onUpdateLikedListings}
              currentListingID={id}
              likedListings={likedListings}
            />
          }
        </div>
      </div>
      <div className={css.info}>
        {accountType == "p" ? (
          <NamedLink className={css.link} name="PremiumPage" params={{ id, slug }}>
              {/* <div className={css.title}> */}
                {title}
                {/* {richText(title, {
                  longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
                  longWordClass: css.longWord,
                })} */}
              {/* </div> */}
          </NamedLink>
        ) : (
            <NamedLink className={css.link} name="ListingPage" params={{ id, slug }}>
                {/* <div className={css.title}> */}
                  {title}
                  {/* {richText(title, {
                    longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
                    longWordClass: css.longWord,
                  })} */}
                {/* </div> */}
            </NamedLink>)}
      </div>
      {accountType != "a" && accountType != "n" &&
      <div className={css.price}>
        <div className={css.priceValue}>
          {formattedPrice}
        </div>
        <div className={css.ratings}>
          • No Reviews Yet
          </div>
      </div>
    }
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

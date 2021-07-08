import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import { propTypes } from '../../util/types';
import { formatMoney } from '../../util/currency';
import { ensureListing, ensureUser } from '../../util/data';
import { createSlug } from '../../util/urlHelpers';
import config from '../../config';
import {
  IconVerified,
  LikeButton,
  NamedLink,
  RankingUpdateButton,
  ResponsiveImage
} from '../../components';
import ExternalLink from '../ExternalLink/ExternalLink';

import css from './ListingCard.module.css';

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
  if (letter === "e" || letter === "p" || letter === "a" || letter === "n") {
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
  const { className,
    rootClassName,
    intl,
    listing,
    renderSizes,
    currentUser,
    isLiked,
    updateLikes,
    isAdmin,
    updateRanking
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const listingUUID = currentListing.id.uuid;
  const { title = '', price } = currentListing.attributes;
  const slug = createSlug(title);

  const author = ensureUser(listing.author);
  const firstImage =
    currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;
  const { formattedPrice } = priceData(price, intl); // Took out priceTitle, might be used in the future

  const accountType = author && author.attributes.profile.publicData &&
    author.attributes.profile.publicData.accountType ? author.attributes.profile.publicData.accountType : null;
  const validAccountType = checkAccountCode(accountType);

  const externalLink = currentListing && currentListing.attributes.publicData &&
    currentListing.attributes.publicData.websiteLink ? currentListing.attributes.publicData.websiteLink : null;
  const category = currentListing && currentListing.attributes.publicData &&
    currentListing.attributes.publicData.category ? currentListing.attributes.publicData.category : null;
  const tribe = author.attributes.profile.publicData && author.attributes.profile.publicData.tribe ?
    author.attributes.profile.publicData.tribe : null;
  const companyName = author.attributes.profile.publicData && author.attributes.profile.publicData.companyName ?
    author.attributes.profile.publicData.companyName : null;
  const companyIndustry = author.attributes.profile.publicData && author.attributes.profile.publicData.companyIndustry ?
    author.attributes.profile.publicData.companyIndustry : null;
  
  const userUUID = currentUser && currentUser.id && currentUser.id.uuid ? currentUser.id.uuid : null;

  // Text above the listing title will need to change based on the account type.
  // Standard, enrolled and premium accounts will have listing price and the listing category and the tribe associated
  // with the company/user. Ad and non-profit accounts will have their company name and a longer title.
  // Ad and non-profit accounts need a longer title because that's all they get as they do not link to a listing page.
  const optionalText = accountType !== "a" && accountType !== "n" ?
    <div className={css.optionalText}>
      <div className={css.priceValue}>
        {formattedPrice}
      </div>
      <div className={css.categoryAndTribe}>
        {category}
        {tribe ?
          " • " + tribe
          :
          null
        }
      </div>
    </div>
    :
    <div className={css.optionalText}>
      <div className={css.priceValue}>
        {companyName}
      </div>
      <div className={css.categoryAndTribe}>
        {companyIndustry}
        {tribe && companyIndustry ?
          " • " + tribe
          : tribe ? tribe
            : null
        }
      </div>
    </div>;

  // Link associated with listing card image will need to change based on the account type.
  // Standard and enrolled accounts will be taken to the normal listing page. Premium accounts
  // will have their accounts take to the premium listing page. Ad and non-profit accounts will
  // have links that take them away from the website entirely. Switch statement also adds different
  // tags onto listing image based on the account type.
  let imagesAndLinks;
  switch (validAccountType) {
    // Default case used for sellers without any accountType. This should not happen as they should have 'u' 
    // for their accountType as they are unverified. Default will still pick them up however.
    default:
      imagesAndLinks =
        <NamedLink name="ListingPage" params={{ id: listingUUID, slug }}>
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
        <NamedLink name="ListingPage" params={{ id: listingUUID, slug }}>
          <LazyImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={['landscape-crop', 'landscape-crop2x']}
            sizes={renderSizes}
          />
          <IconVerified className={css.verifiedImage} isFilled={true} />
        </NamedLink>;
      break;
    case "p":
      imagesAndLinks =
        <NamedLink name="ListingPage" params={{ id: listingUUID, slug }}>
          <LazyImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={['landscape-crop', 'landscape-crop2x']}
            sizes={renderSizes}
          />
          <span className={css.premiumTag}>
            <FormattedMessage id="ListingCard.premiumTag" />
          </span>
        </NamedLink>;
      break;
    case "a":
      imagesAndLinks =
        <ExternalLink href={externalLink}>
          <LazyImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={['landscape-crop', 'landscape-crop2x']}
            sizes={renderSizes}
          />
          <span className={css.adTag}>
            <FormattedMessage id="ListingCard.adTag" />
          </span>
        </ExternalLink>;
      break;
    case "n":
      imagesAndLinks =
        <ExternalLink href={externalLink}>
          <LazyImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={['landscape-crop', 'landscape-crop2x']}
            sizes={renderSizes}
          />
          <span className={css.nonProfitTag}>
            <FormattedMessage id="ListingCard.nonProfitTag" />
          </span>
        </ExternalLink>;
      break;
  }

  return (
    <div className={classes}>
      <div className={css.threeToTwoWrapper}>
        <div className={css.aspectWrapper}>
          {imagesAndLinks}
          {currentUser ? (
            <LikeButton
              listingUUID={listingUUID}
              isLiked={isLiked}
              updateLikes={updateLikes}
            />
          ) : null}
          {isAdmin && userUUID ? (
            <RankingUpdateButton
              listingUUID={listingUUID}
              updateRanking={updateRanking}
              userUUID={userUUID}
            />
          ) : null}
        </div>
      </div>
      <div className={css.cardText}>
        {accountType === "a" || accountType === "n" ? (
          <ExternalLink className={css.adLink} href={externalLink}>
            {optionalText}
            {title}
          </ExternalLink>
        ) : (
          <NamedLink className={css.link} name="ListingPage" params={{ id: listingUUID, slug }}>
            {optionalText}
            {title}
          </NamedLink>
        )}
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

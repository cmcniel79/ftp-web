/**
 * By default, React DOM escapes any values embedded in JSX before rendering them,
 * but sometimes it is necessary to sanitize the user-generated content of received entities.
 * If you use this data in component props without any sanitization or encoding,
 * it might create XSS vulnerabilities.
 *
 * You should especially consider how you are using extended data inside the app.
 */

const ESCAPE_TEXT_REGEXP = /[<>]/g;
const ESCAPE_TEXT_REPLACEMENTS = {
  //fullwidth lesser-than character
  '<': '\uff1c',
  //fullwidth greater-than character
  '>': '\uff1e',
};

// An example how you could sanitize text content.
// This swaps some coding related characters to less dangerous ones
const sanitizeText = str =>
  str == null ? str
    : typeof str === 'string' ? str.replace(ESCAPE_TEXT_REGEXP, ch => ESCAPE_TEXT_REPLACEMENTS[ch])
      : ''
  ;

const sanitizeNumber = nbr =>
  nbr == null ? nbr
    : typeof nbr === 'number' ? nbr
      : 0
  ;

  const sanitizeBool = bool =>
  bool == null ? bool
    : typeof bool === 'boolean' ? bool
      : null
  ;

const sanitizeStringArray = array => {
  var sanitizedArray = [];
  if (array && array.length > 0) {
    for (var i = 0; i < array.length; i++) {
      sanitizedArray.push(sanitizeText(array[i]));
    }
  } else {
    return [];
  }
  return sanitizedArray;
};

export const sanitizeProtectedData = protectedData => {
  const shippingAddress = protectedData && protectedData.shippingAddress ? protectedData.shippingAddress : {};
  const { addressLine1, addressLine2, country, city, state, postal } = shippingAddress || {};

  const addressLine1Maybe = addressLine1 ? { addressLine1: sanitizeText(addressLine1) } : {};
  const addressLine2Maybe = addressLine2 ? { addressLine2: sanitizeText(addressLine2) } : {};
  const countryMaybe = country ? { country: sanitizeText(country) } : {};
  const cityMaybe = city ? { city: sanitizeText(city) } : {};
  const stateMaybe = state ? { state: sanitizeText(state) } : {};
  const postalMaybe = postal ? { postal: sanitizeText(postal) } : {};

  return protectedData ? {
    protectedData: {
      shippingAddress: {
        ...addressLine1Maybe, ...addressLine2Maybe, ...countryMaybe, ...cityMaybe, ...stateMaybe, ...postalMaybe
      }
    }
  } : {};
};

/**
 * Sanitize user entity.
 * If you add public data, you should probably sanitize it here.
 * By default, React DOM escapes any values embedded in JSX before rendering them,
 * but if you use this data on props, it might create XSS vulnerabilities
 * E.g. you should sanitize and encode URI if you are creating links from public data.
 */
export const sanitizeUser = entity => {
  const { attributes, ...restEntity } = entity || {};
  const { profile, ...restAttributes } = attributes || {};
  const { bio, displayName, abbreviatedName, publicData, metadata } = profile || {};

  const sanitizeLocation = companyLocation => {
    const { building, location } = companyLocation || {};
    const selectedPlace = location && location.selectedPlace ? location.selectedPlace : {};
    const buildingMaybe = building ? { building: sanitizeText(building) } : {};
    const locationMaybe = location ? {
      location: {
        selectedPlace: {
          address: sanitizeText(selectedPlace.address),
          origin: {
            lat: sanitizeNumber(selectedPlace.origin.lat),
            lng: sanitizeNumber(selectedPlace.origin.lng),
          }
        }
      }
    } : {};

    return { ...buildingMaybe, ...locationMaybe };
  };

  const sanitizePublicData = publicData => {
    const {
      country,
      accountType,
      accountLimit,
      companyIndustry,
      companyLocation,
      companyName,
      companyWebsite,
      nativeLands,
      tribe,
      socialMedia
    } = publicData || {};

    const countryMaybe = country ? { country: sanitizeText(country) } : {};
    const accoutTypeMaybe = accountType ? { accountType: sanitizeText(accountType) } : {};
    const accountLimitMaybe = accountLimit ? { accountLimit: sanitizeNumber(accountLimit) } : {};

    const companyIndustryMaybe = companyIndustry ? { companyIndustry: sanitizeText(companyIndustry) } : {};
    const companyLocationMaybe = companyLocation ? { companyLocation: sanitizeLocation(companyLocation) } : {};
    const companyNameMaybe = companyName ? { companyName: sanitizeText(companyName) } : {};
    const companyWebsiteMaybe = companyWebsite ? { companyWebsite: sanitizeText(companyWebsite) } : {};

    const nativeLandsMaybe = nativeLands ? { nativeLands: sanitizeText(nativeLands) } : {};
    const tribeMaybe = tribe ? { tribe: sanitizeText(tribe) } : {};

    const { facebook, twitter, insta, tiktok } = socialMedia || {};
    const facebookMaybe = facebook ? { facebook: sanitizeText(facebook) } : {};
    const twitterMaybe = twitter ? { twitter: sanitizeText(twitter) } : {};
    const instaMaybe = insta ? { insta: sanitizeText(insta) } : {};
    const tiktokMaybe = tiktok ? { tiktok: sanitizeText(tiktok) } : {};
    const socialMediaMaybe = { socialMedia: { ...facebookMaybe, ...twitterMaybe, ...instaMaybe, ...tiktokMaybe } };

    return publicData ? {
      publicData: {
        ...countryMaybe,
        ...accoutTypeMaybe,
        ...accountLimitMaybe,
        ...companyIndustryMaybe,
        ...companyLocationMaybe,
        ...companyNameMaybe,
        ...companyWebsiteMaybe,
        ...nativeLandsMaybe,
        ...tribeMaybe,
        ...socialMediaMaybe
      }
    } : {};
  };

  const sanitizeMetadata = metadata => {
    const {
      events,
      eventHost,
      likes,
      follows
    } = metadata || {};

    const eventsMaybe = events ? { events: sanitizeStringArray(events) } : {};
    const isEventHostMaybe = eventHost === true ? { eventHost: true } : eventHost === false ? {eventHost: false } : {};
    const likesMaybe = likes ? { likes: sanitizeNumber(likes) } : {};
    const followsMaybe = follows ? { follows: sanitizeNumber(follows) } : {};

    return metadata ? {
      metadata: {
        ...eventsMaybe,
        ...isEventHostMaybe,
        ...likesMaybe,
        ...followsMaybe
      }
    } : {};
  };

  const profileMaybe = profile
    ? {
      profile: {
        abbreviatedName: sanitizeText(abbreviatedName),
        displayName: sanitizeText(displayName),
        bio: sanitizeText(bio),
        ...sanitizePublicData(publicData),
        ...sanitizeMetadata(metadata),
      },
    }
    : {};

  const attributesMaybe = attributes ? { attributes: { ...profileMaybe, ...restAttributes } } : {};

  return {
    ...attributesMaybe,
    ...restEntity
  };
};

/**
 * Sanitize listing entity.
 * If you add public data, you should probably sanitize it here.
 * By default, React DOM escapes any values embedded in JSX before rendering them,
 * but if you use this data on props, it might create XSS vulnerabilities
 * E.g. you should sanitize and encode URI if you are creating links from public data.
 */
export const sanitizeListing = entity => {
  const { attributes, ...restEntity } = entity;
  const { title, description, publicData, metadata, ...restAttributes } = attributes || {};

  const sanitizePublicData = publicData => {
    const {
      country,
      category,
      subCategory,
      verifiedSellers,
      customOrders,
      websiteLink,
      region,
      sizes,
      style,
      material,
      shippingFee,
      internationalFee,
      allowsInternationalOrders,
      allowsBarter,
      barter,
      maxQuantity,
    } = publicData || {};
    const countryMaybe = country ? { country: sanitizeText(country) } : {};

    const categoryMaybe = category ? { category: sanitizeText(category) } : {};
    const subCategoryMaybe = subCategory ? { subCategory: sanitizeText(subCategory) } : {};

    const verifiedSellersMaybe = verifiedSellers ? { verifiedSellers: sanitizeText(verifiedSellers) } : {};
    const customOrdersMaybe = customOrders ? { customOrders: sanitizeText(customOrders) } : {};
    const websiteLinkMaybe = websiteLink ? { websiteLink: sanitizeText(websiteLink) } : {};

    const regionMaybe = region ? { region: sanitizeText(region) } : {};
    const sizesMaybe = sizes ? { sizes: sanitizeText(sizes) } : {};
    const styleMaybe = style ? { style: sanitizeText(style) } : {};
    const materialMaybe = material ? { material: material } : {};

    const shippingFeeMaybe = shippingFee ? {
      shippingFee: {
        amount: sanitizeNumber(shippingFee.amount),
        currency: sanitizeText(shippingFee.currency)
      }
    } : {};

    const internationalFeeMaybe = internationalFee ? {
      internationalFee: {
        amount: sanitizeNumber(internationalFee.amount),
        currency: sanitizeText(internationalFee.currency)
      }
    } : {};

    const allowsInternationalOrdersMaybe = allowsInternationalOrders ? {
      allowsInternationalOrders: sanitizeBool(allowsInternationalOrders)
    } : {};

    const allowsBarterMaybe = allowsBarter ? {
      allowsBarter: sanitizeBool(allowsBarter)
    } : {};

    const barterMaybe = barter ? {
      barter: sanitizeText(barter)
    } : {};

    const maxQuantityMaybe = maxQuantity ? {
      maxQuantity: sanitizeNumber(maxQuantity)
    } : {};

    return publicData ? {
      publicData: {
        ...countryMaybe,
        ...categoryMaybe,
        ...subCategoryMaybe,
        ...verifiedSellersMaybe,
        ...customOrdersMaybe,
        ...websiteLinkMaybe,
        ...regionMaybe,
        ...sizesMaybe,
        ...styleMaybe,
        ...materialMaybe,
        ...shippingFeeMaybe,
        ...internationalFeeMaybe,
        ...allowsInternationalOrdersMaybe,
        ...allowsBarterMaybe,
        ...barterMaybe,
        ...maxQuantityMaybe,
      }
    } : {};
  };

  const sanitizeMetadata = metadata => {
    const {
      events,
      ranking,
    } = metadata || {};

    const eventsMaybe = events ? { events: sanitizeStringArray(events) } : {};
    const rankingMaybe = ranking ? { ranking: sanitizeNumber(ranking) } : {};

    return metadata ? {
      metadata: {
        ...eventsMaybe,
        ...rankingMaybe,
      }
    } : {};
  }

  const attributesMaybe = attributes
    ? {
      attributes: {
        title: sanitizeText(title),
        description: sanitizeText(description),
        ...sanitizePublicData(publicData),
        // ...sanitizeMetadata(metadata),
        ...restAttributes,
      },
    }
    : {};

  return { ...attributesMaybe, ...restEntity };
};

/**
 * Sanitize entities if needed.
 * Remember to add your own sanitization rules for your extended data
 */
export const sanitizeEntity = entity => {
  const { type } = entity;
  switch (type) {
    case 'listing':
      return sanitizeListing(entity);
    case 'user':
      return sanitizeUser(entity);
    default:
      return entity;
  }
};

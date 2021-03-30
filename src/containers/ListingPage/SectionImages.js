import React from 'react';
import { ResponsiveImage, } from '../../components';
import ActionBarMaybe from './ActionBarMaybe';

import css from './ListingPage.module.css';

const SectionImages = props => {
  const {
    title,
    listing,
    isOwnListing,
    editParams,
  } = props;

  const hasImages = listing.images && listing.images.length > 0;
  const images = hasImages ? listing.images : null;

  // Action bar is wrapped with a div that prevents the click events
  // to the parent that would otherwise open the image carousel
  const actionBar = listing.id ? (
    <div onClick={e => e.stopPropagation()}>
      <ActionBarMaybe isOwnListing={isOwnListing} listing={listing} editParams={editParams} />
    </div>
  ) : null;
  // Took out all code for imageCarousel, see original Sharetribe code to 
  // put back in: https://github.com/sharetribe/ftw-daily/blob/master/src/components/ImageCarousel/ImageCarousel.js
  return (
    <div className={css.sectionImages}>
      {actionBar}
      {images.map(i => (
        <ResponsiveImage
          key={i.id.uuid}
          className={css.images}
          alt={title}
          image={i}
          variants={[
            'landscape-crop2x',
          ]}
        />
      ))}
    </div>
  );
};

export default SectionImages;

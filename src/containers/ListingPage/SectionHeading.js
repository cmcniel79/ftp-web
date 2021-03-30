import React from 'react';

import css from './ListingPage.module.css';

const SectionHeading = props => {
  const {
    richTitle,
    subTitle
  } = props;


  return (
    <div className={css.sectionHeading}>
      <div className={css.heading}>
        <h3 className={css.title}>{richTitle}</h3>
      </div>
      {subTitle}
    </div>
  );
};

export default SectionHeading;

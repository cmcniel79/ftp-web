import React from 'react';
import css from './ListingPage.css';

const SectionHeading = props => {
  const {
    richTitle,
  } = props;


  return (
    <div className={css.sectionHeading}>
      <div className={css.heading}>
        <h3 className={css.title}>{richTitle}</h3>
      </div>
    </div>
  );
};

export default SectionHeading;

import React from 'react';
import css from './PremiumPage.css';

const PremiumHeading = props => {
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

export default PremiumHeading;

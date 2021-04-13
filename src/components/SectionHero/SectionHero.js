import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import {
  IconChevronForward,
  NamedLink
} from '../../components';
import earrings from './Assets/earrings.jpg';
import balms from './Assets/balms.jpg';
import bracelets from './Assets/bracelets.jpg';
import prints from './Assets/prints.jpg';
import shirts from './Assets/shirts.png';
import supplies from './Assets/supplies.jpg';


import css from './SectionHero.module.css';

const SectionHero = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  const sections = [
    {
      title: "Earrings",
      img: earrings,
      search: "pub_subCategory=earrings"
    },
    {
      title: "Bracelets",
      img: bracelets,
      search: "pub_subCategory=bracelets"
    },
    {
      title: "Prints",
      img: prints,
      search: "pub_subCategory=prints"
    },
    {
      title: "Shirts",
      img: shirts,
      search: "pub_subCategory=tops"
    },
    {
      title: "Skin Care",
      img: balms,
      search: "pub_subCategory=skincare"
    },
    {
      title: "Supplies",
      img: supplies,
      search: "pub_subCategory=beading"
    },
  ];

  return (
    <div className={classes}>
      <div className={css.heroContent}>
        <h1 className={css.heroMainTitle}>
          <FormattedMessage id="SectionHero.title" />
        </h1>
        <div className={css.imagesContainer} >
          {sections.map(s => {
            return (
              <div key={s.title} className={css.imageSections}>
                <NamedLink
                  name="SearchPage"
                  to={{ search: s.search }}
                >
                  <img className={css.image} src={s.img}>
                  </img>
                </NamedLink>
                <p className={css.imageText}>
                  {s.title}
                  <IconChevronForward className={css.chevron} />
                </p>
              </div>
            )
          })}
        </div>
        <NamedLink
          name="SearchPage"
          to={{
            search:
              '',
          }}
          className={css.heroButton}
        >
          <FormattedMessage id="SectionHero.browseButton" />
        </NamedLink>
      </div>
    </div>
  );
};

SectionHero.defaultProps = { rootClassName: null, className: null };

SectionHero.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionHero;

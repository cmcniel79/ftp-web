import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { ensureListing } from '../../util/data';
import bed from './Images/bed.svg';
import bedFilled from './Images/bed-filled.svg';
import dining from './Images/dining.svg';
import diningFilled from './Images/dining-filled.svg';
import fitness from './Images/fitness.svg';
import fitnessFilled from './Images/fitness-filled.svg';
import other from './Images/other.svg';
import otherFilled from './Images/other-filled.svg';
import people from './Images/people.svg';
import peopleFilled from './Images/people-filled.svg';
import retail from './Images/shopping.svg';
import retailFilled from './Images/shopping-filled.svg';
import work from './Images/work.svg';
import workFilled from './Images/work-filled.svg';

import config from '../../config';

import css from './SearchMapSellerLabel.css';

class SearchMapPriceLabel extends Component {
  // shouldComponentUpdate(nextProps) {
  //   const currentListing = ensureListing(this.props.listing);
  //   const nextListing = ensureListing(nextProps.listing);
  //   const isSameListing = currentListing.id.uuid === nextListing.id.uuid;
  //   const hasSamePrice = currentListing.attributes.price === nextListing.attributes.price;
  //   const hasSameActiveStatus = this.props.isActive === nextProps.isActive;
  //   const hasSameRefreshToken =
  //     this.props.mapComponentRefreshToken === nextProps.mapComponentRefreshToken;

  //   return !(isSameListing && hasSamePrice && hasSameActiveStatus && hasSameRefreshToken);
  // }

  constructor(props) {
    super(props);
    this.state = { isShown: false };
    this.setIsShown = this.setIsShown.bind(this);
  }


  setIsShown(bool) {
    this.setState({ isShown: bool });
  }

  render() {
    const { className, rootClassName, intl, listing, onListingClicked } = this.props;
    const currentListing = ensureListing(listing);
    const formattedName = currentListing.attributes.profile.publicData && currentListing.attributes.profile.publicData.companyName ?
      currentListing.attributes.profile.publicData.companyName : currentListing.attributes.profile.displayName;
    const industry = currentListing.attributes.profile.publicData && currentListing.attributes.profile.publicData.industry ?
      currentListing.attributes.profile.publicData.industry : null;
    const classes = classNames(rootClassName || css.root, className);

    var imageOutline;
    var imageFilled;
    switch (industry) {
      case ("retail"):
        imageOutline = <img className={css.image} src={retail} alt="icon" />;
        imageFilled = <img className={css.image} src={retailFilled} alt="iconFilled" />;
        break;
      case ("dining"):
        imageOutline = <img className={css.image} src={dining} alt="icon" />;
        imageFilled = <img className={css.image} src={diningFilled} alt="iconFilled" />;
        break;
      case ("professional"):
        imageOutline = <img className={css.image} src={work} alt="icon" />;
        imageFilled = <img className={css.image} src={workFilled} alt="iconFilled" />;
        break;
      case ("hospitality"):
        imageOutline = <img className={css.image} src={bed} alt="icon" />;
        imageFilled = <img className={css.image} src={bedFilled} alt="iconFilled" />;
        break;
      case ("nonprofits"):
        imageOutline = <img className={css.image} src={people} alt="icon" />;
        imageFilled = <img className={css.image} src={peopleFilled} alt="iconFilled" />;
        break;
      case ("beauty"):
        imageOutline = <img className={css.image} src={fitness} alt="icon" />;
        imageFilled = <img className={css.image} src={fitnessFilled} alt="iconFilled" />;
        break;
      default:
        imageOutline = <img className={css.image} src={other} alt="icon" />;
        imageFilled = <img className={css.image} src={otherFilled} alt="iconFilled" />;
        break;
    }

    const image = !this.state.isShown ? imageOutline
      : imageFilled;
    const name = !this.state.isShown ? null
      : <span className={css.name}> {formattedName} </span>;
    return (
      <button
        className={classes}
        onClick={() => onListingClicked(currentListing)}
        onMouseEnter={() => this.setIsShown(true)}
        onMouseLeave={() => this.setIsShown(false)}>
        <div className={css.caretShadow} />
        <div className={css.priceLabel}>
          {image}
          {name}
        </div>
        <div className={css.caret} />
      </button>
    );
  }
}

SearchMapPriceLabel.defaultProps = {
  className: null,
  rootClassName: null,
};

const { func, string } = PropTypes;

SearchMapPriceLabel.propTypes = {
  className: string,
  rootClassName: string,
  listing: propTypes.user.isRequired,
  onListingClicked: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default injectIntl(SearchMapPriceLabel);

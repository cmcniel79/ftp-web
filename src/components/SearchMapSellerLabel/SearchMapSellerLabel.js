import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { ensureUser } from '../../util/data';
import bed from '../../assets/bed.svg';
import bedFilled from '../../assets/bed-filled.svg';
import dining from '../../assets/dining.svg';
import diningFilled from '../../assets/dining-filled.svg';
import fitness from '../../assets/fitness.svg';
import fitnessFilled from '../../assets/fitness-filled.svg';
import other from '../../assets/location.svg';
import otherFilled from '../../assets/location-filled.svg';
import people from '../../assets/people.svg';
import peopleFilled from '../../assets/people-filled.svg';
import retail from '../../assets/shopping.svg';
import retailFilled from '../../assets/shopping-filled.svg';
import work from '../../assets/work.svg';
import workFilled from '../../assets/work-filled.svg';
import art from '../../assets/art.svg';
import artFilled from '../../assets/art-filled.svg';
import verifiedFilled from '../../assets/checkmark-circle.svg';
import verified from '../../assets/checkmark-circle-outline.svg';

import css from './SearchMapSellerLabel.module.css';

class SearchMapSellerLabel extends Component {

  constructor(props) {
    super(props);
    this.state = { isShown: false };
    this.setIsShown = this.setIsShown.bind(this);
  }


  setIsShown(bool) {
    this.setState({ isShown: bool });
  }

  render() {
    const { className, rootClassName, intl, user, onUserClicked } = this.props;
    const currentSeller = ensureUser(user);
    const formattedName = currentSeller.attributes.profile.publicData && currentSeller.attributes.profile.publicData.companyName ?
      currentSeller.attributes.profile.publicData.companyName : currentSeller.attributes.profile.displayName;
    const industry = currentSeller.attributes.profile.publicData && currentSeller.attributes.profile.publicData.companyIndustry ?
      currentSeller.attributes.profile.publicData.companyIndustry : null;
    const classes = classNames(rootClassName || css.root, className);
    const accountType = currentSeller.attributes.profile.publicData && currentSeller.attributes.profile.publicData.accountType ?
      currentSeller.attributes.profile.publicData.accountType : null;

    var imageOutline;
    var imageFilled;
    if (accountType !== 'e') {
      switch (industry) {
        case ("retail"):
          imageOutline = <img className={css.image} src={retail} alt="icon" />;
          imageFilled = <img className={css.image} src={retailFilled} alt="iconFilled" />;
          break;
        case ("dining"):
          imageOutline = <img className={css.image} src={dining} alt="icon" />;
          imageFilled = <img className={css.image} src={diningFilled} alt="iconFilled" />;
          break;
        case ("art"):
          imageOutline = <img className={css.image} src={art} alt="icon" />;
          imageFilled = <img className={css.image} src={artFilled} alt="iconFilled" />;
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
    } else {
      imageOutline = <img className={css.image} src={verified} alt="icon" />;
      imageFilled = <img className={css.image} src={verifiedFilled} alt="iconFilled" />;
    }

    const image = !this.state.isShown ? imageOutline
      : imageFilled;
      
    const name = !this.state.isShown ? null
      : (
        <span className={css.name}>
          {formattedName}
        </span>
      );

    return (
      <button
        className={classes}
        onClick={() => onUserClicked(currentSeller)}
        onMouseEnter={() => this.setIsShown(true)}
        onMouseLeave={() => this.setIsShown(false)}>
        <div className={css.caretShadow} />
        <div className={css.sellerLabel}>
          {image}
          {name}
        </div>
        <div className={css.caret} />
      </button>
    );
  }
}

SearchMapSellerLabel.defaultProps = {
  className: null,
  rootClassName: null,
};

const { func, string } = PropTypes;

SearchMapSellerLabel.propTypes = {
  className: string,
  rootClassName: string,
  user: propTypes.user.isRequired,
  onUserClicked: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

export default injectIntl(SearchMapSellerLabel);

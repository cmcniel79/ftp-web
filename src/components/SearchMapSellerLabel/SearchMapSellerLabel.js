import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { ensureUser } from '../../util/data';
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
    const industry = currentSeller.attributes.profile.publicData && currentSeller.attributes.profile.publicData.industry ?
      currentSeller.attributes.profile.publicData.industry : null;
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

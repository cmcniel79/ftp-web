import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { ensureUser } from '../../util/data';
import {
  IconArt,
  IconBed,
  IconDining,
  IconFitness,
  IconOther,
  IconPeople,
  IconRetail,
  IconVerified,
  IconWork
} from '../../components';

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

    var image;
    if (accountType !== 'e') {
      switch (industry) {
        case ("retail"):
          image = <IconRetail className={css.image} isFilled={this.state.isShown} />
          break;
        case ("dining"):
          image = <IconDining className={css.image} isFilled={this.state.isShown} />;
          break;
        case ("art"):
          image = <IconArt className={css.image} isFilled={this.state.isShown} />;
          break;
        case ("professional"):
          image = <IconWork className={css.image} isFilled={this.state.isShown} />;
          break;
        case ("hospitality"):
          image = <IconBed className={css.image} isFilled={this.state.isShown} />;
          break;
        case ("nonprofits"):
          image = <IconPeople className={css.image} isFilled={this.state.isShown} />;
          break;
        case ("beauty"):
          image = <IconFitness className={css.image} isFilled={this.state.isShown} />;
          break;
        default:
          image = <IconOther className={css.image} isFilled={this.state.isShown} />;
          break;
      }
    } else {
      image = <IconVerified className={css.image} isFilled={this.state.isShown} />;
    }

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

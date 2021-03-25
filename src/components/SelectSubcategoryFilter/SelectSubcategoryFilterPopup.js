import React, { Component } from 'react';
import { arrayOf, func, node, number, object, shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import { Menu, MenuContent, MenuItem, MenuLabel } from '..';
import forward from './Images/chevron-forward-outline.svg';
import back from './Images/chevron-back-outline.svg';
import css from './SelectSubcategoryFilterPopup.module.css';

const optionLabel = (options, key) => {
  const option = options.find(o => o.key === key);
  return option ? option.label : key;
};

// const getQueryParamName = queryParamNames => {
//   return Array.isArray(queryParamNames) ? queryParamNames[0] : queryParamNames;
// };

class SelectSubcategoryFilterPopup extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false, categorySelected: false, subCategory: null };
    this.onToggleActive = this.onToggleActive.bind(this);
    this.selectOption = this.selectOption.bind(this);
  }

  onToggleActive(isOpen) {
    this.setState({ isOpen: isOpen });
  }

  selectOption(queryParamName, option, e) {
    this.setState({ isOpen: false });
    this.props.onSelect({ [queryParamName]: option });

    if (e && e.currentTarget) {
      e.currentTarget.blur();
    }
  }

  selectCategory(option) {
    const sub = option.key !== "other" ? option.subCategories : null;
    if (sub !== null) {
      this.setState({ subCategory: sub });
      this.setState({ categorySelected: true });
    } else if(option.key === 'other') {
      this.selectOption('pub_subCategory', option.key);
    }
  }

  getCategory(options, value) {
    var x;
    var sub;
    for (x in options) {
      for (sub in options[x].subCategories) {
        if (options[x].subCategories[sub].key === value) {
          return options[x].label;
        }
      }
    }
    return null;
  }

  render() {
    const {
      rootClassName,
      className,
      label,
      options,
      initialValues,
      contentPlacementOffset,
    } = this.props;

    // const queryParamName = getQueryParamName(queryParamNames);
    const queryParamName = "pub_subCategory";
    const initialValue =
      initialValues && initialValues[queryParamName] ? initialValues[queryParamName] : null;

    const initialCategory = initialValue && initialValue.length > 1 ? this.getCategory(options, initialValue[0]) : null;

    // resolve menu label text and class
    const menuLabel = initialCategory ? initialCategory : initialValue ? optionLabel(options, initialValue) : label;
    const menuLabelClass = initialValue ? css.menuLabelSelected : css.menuLabel;

    const classes = classNames(rootClassName || css.root, className);

    const content = !this.state.categorySelected ?
      <MenuContent className={css.menuContent}>
        {options.map(option => {
          // check if this option is selected
          const selected = initialValue === option.key;
          // console.log(initialValue);
          // menu item border class
          const menuItemBorderClass = selected ? css.menuItemBorderSelected : css.menuItemBorder;
          return (
            <MenuItem key={option.key}>
              <button
                className={css.menuItem}
                onClick={() => this.selectCategory(option)}
              >
                <span className={menuItemBorderClass} />
                {option.label}
                <img className={css.forward} src={forward} alt="forward" />
              </button>
            </MenuItem>
          );
        })}
      </MenuContent>
      :
      <MenuContent className={css.menuContent}>
        <MenuItem key={'subTitle'}>
          <button
            className={css.backButton}
            onClick={() => this.setState({ categorySelected: false })}
          >
            <img className={css.back} src={back} alt="back" />
            <FormattedMessage id={'SelectSubcategoryFilter.popupBack'} />
          </button>
        </MenuItem>
        {this.state.subCategory.map(sub => {
          // check if this option is selected
          const selected = initialValue === sub.key;
          // menu item border class
          const menuItemBorderClass = selected ? css.menuItemBorderSelected : css.menuItemBorder;
          return (
            <MenuItem key={sub.key}>
              <button
                className={css.menuItem}
                onClick={() => this.selectOption(queryParamName, sub.key)}
              >
                <span className={menuItemBorderClass} />
                {sub.label}
              </button>
            </MenuItem>
          );
        })}
        <MenuItem key={'bottomLinks'}>
          <button
            className={css.searchAllMenuItem}
            onClick={() => this.selectOption(queryParamName, this.state.subCategory.map(s => s.key))}
          >
            <FormattedMessage id={'SelectSubcategoryFilter.popupSearchAll'} />
          </button>
          <button
            className={css.clearMenuItem}
            onClick={(e) => this.selectOption(queryParamName, null, e)}
          >
            <FormattedMessage id={'SelectSubcategoryFilter.popupClear'} />
          </button>
        </MenuItem>
      </MenuContent>

    return (
      <div className={css.panel}>
        <Menu
          className={classes}
          useArrow={false}
          contentPlacementOffset={contentPlacementOffset}
          onToggleActive={this.onToggleActive}
          isOpen={this.state.isOpen}
        >
          <MenuLabel className={menuLabelClass}>{menuLabel}</MenuLabel>
          {content}
        </Menu>
      </div>
    );
  }
}

SelectSubcategoryFilterPopup.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  contentPlacementOffset: 0,
};

SelectSubcategoryFilterPopup.propTypes = {
  rootClassName: string,
  className: string,
  queryParamNames: arrayOf(string).isRequired,
  label: node.isRequired,
  onSelect: func.isRequired,
  options: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ).isRequired,
  initialValues: object,
  contentPlacementOffset: number,
};

export default SelectSubcategoryFilterPopup;

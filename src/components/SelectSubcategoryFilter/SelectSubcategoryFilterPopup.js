import React, { Component } from 'react';
import { arrayOf, func, node, number, object, shape, string } from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';

import { Menu, MenuContent, MenuItem, MenuLabel } from '..';
import css from './SelectSubcategoryFilterPopup.css';

const optionLabel = (options, key) => {
  const option = options.find(o => o.key === key);
  return option ? option.label : key;
};

const getQueryParamName = queryParamNames => {
  return Array.isArray(queryParamNames) ? queryParamNames[0] : queryParamNames;
};

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

  selectOption(queryParamName, option) {
    console.log(option);
    this.setState({ isOpen: false });
    this.props.onSelect({ [queryParamName]: option });
  }

  selectCategory(option) {
    const sub = option.key !== "other" ? option.subCategories : null;
    if (sub !== null) {
      this.setState({ subCategory: sub });
      this.setState({ categorySelected: true });
    }
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
    const queryParamName = "pub_subcategory";
    const initialValue =
      initialValues && initialValues[queryParamName] ? initialValues[queryParamName] : null;

    // resolve menu label text and class
    const menuLabel = initialValue ? optionLabel(options, initialValue) : label;
    const menuLabelClass = initialValue ? css.menuLabelSelected : css.menuLabel;

    const classes = classNames(rootClassName || css.root, className);

    const content = !this.state.categorySelected ?
      <MenuContent className={css.menuContent}>
        {options.map(option => {
          // check if this option is selected
          const selected = initialValue === option.key;
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
                <span style={{color: "#D40000", float: "right"}}>˃</span>
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
            ˂ Back to Main Categories
          </button>
        </MenuItem>
        {this.state.subCategory.map(sub => {
          // check if this option is selected
          // const selected = initialValue === option.key;
          // menu item border class
          // const menuItemBorderClass = selected ? css.menuItemBorderSelected : css.menuItemBorder;
          return (
            <MenuItem key={sub.key}>
              <button
                className={css.menuItem}
                onClick={() => this.selectOption(queryParamName, sub.key)}
              >
                <span className={css.menuItemBorder} />
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
            Search All
          </button>
          <button
            className={css.clearMenuItem}
            onClick={() => this.selectOption(queryParamName, null)}
          >
            <FormattedMessage id={'SelectSingleFilter.popupClear'} />
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

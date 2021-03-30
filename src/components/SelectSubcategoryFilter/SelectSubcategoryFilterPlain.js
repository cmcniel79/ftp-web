import React, { Component } from 'react';
import { arrayOf, bool, func, node, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';

import css from './SelectSubcategoryFilterPlain.module.css';

class SelectSubcategoryFilterPlain extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: true, categorySelected: false, subCategory: null };
    this.selectOption = this.selectOption.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
  }

  selectOption(queryParamName, option, e) {
    const { onSelect } = this.props;
    // console.log(queryParamNames);
    // const queryParamName = getQueryParamName(queryParamNames);
    onSelect({ [queryParamName]: option });

    // blur event target if event is passed
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

  toggleIsOpen() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const {
      rootClassName,
      className,
      label,
      options,
      initialValues,
      twoColumns,
      useBullets,
    } = this.props;

    const queryParamName = "pub_subCategory";
    const initialValue =
      initialValues && initialValues[queryParamName] ? initialValues[queryParamName] : null;
    const labelClass = initialValue ? css.filterLabelSelected : css.filterLabel;

    const hasBullets = useBullets || twoColumns;
    const optionsContainerClass = classNames({
      [css.optionsContainerOpen]: this.state.isOpen,
      [css.optionsContainerClosed]: !this.state.isOpen,
      [css.hasBullets]: hasBullets,
      [css.twoColumns]: twoColumns,
    });

    const classes = classNames(rootClassName || css.root, className);

    const bottomLinks = !this.state.categorySelected ?
      <div className={css.bottomLinks}>
        <button className={css.clearButton} onClick={e => this.selectOption(queryParamName, null, e)}>
        <FormattedMessage id={'SelectSubcategoryFilter.plainClear'} />
        </button>
      </div>
      :
      <div className={css.bottomLinks}>
        <button className={css.searchAllButton} onClick={() => this.selectOption(queryParamName, this.state.subCategory.map(s => s.key))}
        >
        <FormattedMessage id={'SelectSubcategoryFilter.plainSearchAll'} />
  </button>
        <button className={css.clearButton} onClick={(e) => this.selectOption(queryParamName, null, e)}>
        <FormattedMessage id={'SelectSubcategoryFilter.plainClear'} />
        </button>
      </div>

    const content = !this.state.categorySelected ?
      <div className={optionsContainerClass}>
        {options.map(option => {
          // check if this option is selected
          const selected = initialValue === option.key;
          const optionClass = hasBullets && selected ? css.optionSelected : css.option;
          // menu item selected bullet or border class
          const optionBorderClass = hasBullets
            ? classNames({
              [css.optionBulletSelected]: selected,
              [css.optionBullet]: !selected,
            })
            : classNames({
              [css.optionBorderSelected]: selected,
              [css.optionBorder]: !selected,
            });
          return (
            <button
              key={option.key}
              className={optionClass}
              onClick={() => this.selectCategory(option)}
            >
              <span className={optionBorderClass} />
              {option.label}
            </button>
          );
        })}
        {bottomLinks}
      </div>
      :
      <div className={optionsContainerClass}>
        <button
          className={css.option}
          onClick={() => this.setState({ categorySelected: false })}
        >
          <FormattedMessage id={'SelectSubcategoryFilter.plainBack'} />
          </button>
        {this.state.subCategory.map(sub => {
          // check if this option is selected
          const selected = initialValue === sub.key;
          const optionClass = selected ? css.optionSelected : css.option;
          // menu item selected bullet or border class
          const optionBorderClass = hasBullets
            ? classNames({
              [css.optionBulletSelected]: selected,
              [css.optionBullet]: !selected,
            })
            : classNames({
              [css.optionBorderSelected]: selected,
              [css.optionBorder]: !selected,
            });
          return (
            <button
              key={sub.key}
              className={optionClass}
              onClick={() => this.selectOption(queryParamName, sub.key)}
            >
              <span className={optionBorderClass} />
              {sub.label}
            </button>
          );
        })}
        {bottomLinks}
      </div>;


    return (
      <div className={classes} >
        <div className={labelClass}>
          <span className={labelClass}>{label}</span>
          <button className={css.collapseButton} onClick={this.toggleIsOpen}>
            <span className={css.collapseFont}>Collapse</span>
          </button>
        </div>
        { content}
      </div>
    );
  }
}

SelectSubcategoryFilterPlain.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  twoColumns: false,
  useBullets: false,
};

SelectSubcategoryFilterPlain.propTypes = {
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
  twoColumns: bool,
  useBullets: bool,
};

export default SelectSubcategoryFilterPlain;

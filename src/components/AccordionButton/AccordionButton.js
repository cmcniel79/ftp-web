import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './AccordionButton.module.css';
import { iconChevronDown } from '../../components';
import IconChevronDown from '../IconChevronDown/IconChevronDown';

class AccordionButton extends Component {
  static propTypes = {
    title: PropTypes.string
  };

  static defaultProps = {
    title: 'TITLE'
  };

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.mounted = true;
  }

  onClick = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const panelClassNames = this.state.isOpen ? css.panelOpened : css.panelClosed;
    const chevronClasses = this.state.isOpen ?  css.chevronDown: css.chevronUp;

    return (
      <div className={css.accordionItem}>
        <button className={css.title} onClick={this.onClick}>
          {this.props.title}
          <span className={css.arrow}>
          <IconChevronDown className={chevronClasses} />
          </span>
        </button>
        <div className={panelClassNames}> {this.props.children}</div>
      </div>
    );
  }
}

export default AccordionButton;
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import css from './AccordionButton.css';
import chevron from './Images/chevron-down-outline.svg';

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
          <img className={chevronClasses} src={chevron} alt="image sourced from Freepik.com" />
          </span>
        </button>
        <div className={panelClassNames}> {this.props.children}</div>
      </div>
    );
  }
}

export default AccordionButton;
import React, { Component } from 'react';
import cloudFilled from './Images/cloud-done-filled.svg';
import chevronDown from './Images/chevron-down-circle-outline.svg';
import chevronUp from './Images/chevron-up-circle-outline.svg';
import doubleChevronDown from './Images/double-chevron-down-circle-outline.svg';
import doubleChevronUp from './Images/double-chevron-up-circle-outline.svg';


import css from './RankingUpdateButton.module.css';


class updateButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doubleUpClicked: false,
            upClicked: false,
            downClicked: false,
            doubleDownClicked: false,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (isSuper, isMoveUp) => {
        const { updateRanking, listingUUID, userUUID } = this.props;

        if (isSuper && isMoveUp) {
            this.setState({ doubleUpClicked: true });
        } else if (!isSuper && isMoveUp) {
            this.setState({ upClicked: true });
        } else if (!isSuper && !isMoveUp) {
            this.setState({ downClicked: true });
        } else {
            this.setState({ doubleDownClicked: true });
        };

        const requestBody = {
            listingUUID,
            userUUID,
            isSuper,
            isMoveUp
        };
        updateRanking(requestBody);
    };

    render() {
        const doubleUp = this.state.doubleUpClicked ? cloudFilled : doubleChevronUp;
        return (
            <div className={css.buttonRow}>
                <button
                    disabled={this.state.doubleUpClicked}
                    className={css.updateButton}
                    onClick={() => this.handleClick(true, true)}>
                    <img
                        src={doubleUp}
                        className={css.buttonImage}
                        alt="Ranking Button 1"
                    />
                </button>
                <button
                    className={this.state.upClicked ? css.updateButtonClicked : css.updateButton}
                    onClick={() => this.handleClick(false, true)}
                    onAnimationEnd={() => this.setState({ upClicked: false })}
                >
                    <img
                        src={chevronUp}
                        className={css.buttonImage}
                        alt="Ranking Button 2"
                    />
                </button>
                <button
                    className={this.state.downClicked ? css.updateButtonClicked : css.updateButton}
                    onClick={() => this.handleClick(false, false)}
                    onAnimationEnd={() => this.setState({ downClicked: false })}
                >
                    <img
                        src={chevronDown}
                        className={css.buttonImage}
                        alt="Ranking Button 3"
                    />
                </button>
                <button
                    className={this.state.doubleDownClicked ? css.updateButtonClicked : css.updateButton}
                    onClick={() => this.handleClick(true, false)}
                    onAnimationEnd={() => this.setState({ doubleDownClicked: false })}
                >
                    <img
                        src={doubleChevronDown}
                        className={css.buttonImage}
                        alt="Ranking Button 4"
                    />
                </button>
            </div>
        );
    }
}

export default updateButton;
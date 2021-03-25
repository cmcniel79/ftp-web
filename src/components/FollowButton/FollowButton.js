import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import css from './FollowButton.module.css';

class FollowButton extends Component {
    constructor(props) {
        super(props);
        const { authorId, isFollowed } = props;
        this.state = {
            followed: isFollowed(authorId) > -1? true : false,
            isMouseInside: false,
        };
    }

    handleClick = () => {
        this.setState({ followed: !this.state.followed });
        this.props.updateFollowed(this.props.authorId);
    };

    mouseEnter = () => {
        this.setState({ isMouseInside: true });
    }
    mouseLeave = () => {
        this.setState({ isMouseInside: false });
    }

    render() {
        const followButtonClasses = this.state.followed && !this.state.isMouseInside ? css.followButton :
            this.state.followed && this.state.isMouseInside ? css.unfollowButton : css.followButton;
        const buttonLabel = this.state.followed && !this.state.isMouseInside ? "FollowButton.followingArtist" :
            this.state.followed && this.state.isMouseInside ? "FollowButton.unfollowArtist" : "FollowButton.followArtist";
        return (
            <button className={followButtonClasses} onClick={() => this.handleClick()} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                <FormattedMessage
                    id={buttonLabel}>
                </FormattedMessage>
            </button>
        )
    }
}

export default injectIntl(FollowButton);
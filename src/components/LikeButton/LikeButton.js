import React, { Component } from 'react';
import css from './LikeButton.css';
import heartOutline from './Images/heart-outline.svg';
import heartFilled from './Images/heart-filled.svg';

class LikeButton extends Component {
    constructor(props) {
        super(props);
        const { listingId, isLiked } = props;
        this.state = {
            liked: isLiked(listingId) > -1 ? true : false,
        };
    }

    handleClick = () => {
        this.setState({ liked: !this.state.liked });
        this.props.updateLikes(this.props.listingId);
    };

    render() {
        const image = this.state.liked ? heartFilled : heartOutline;
        return <button className={css.likeButton} onClick={this.handleClick}>
            <img src={image} className={css.heartImage} alt="Like Button"/>
        </button>
    }
}

export default LikeButton;
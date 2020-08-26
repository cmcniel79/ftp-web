import React, { Component } from 'react';
import css from './LikeButton.css';
import heartOutline from './Images/heart-outline.svg';
import heartFilled from './Images/heart-filled.svg';

class LikeButton extends Component {
    constructor(props) {
        super(props);
    
    this.state = {
        ifLiked: false,
        likes: props.likes
    };
}

    addLike = () => {
        let newCount;
        if(this.state.ifLiked){
            newCount = this.state.likes - 1;
        } else {
            newCount = this.state.likes + 1;
        }
        this.setState({
            ifLiked: !this.state.ifLiked,
            likes: newCount
        });
    };

    render() {
        const image = this.state.ifLiked ? heartFilled: heartOutline;
        return <button className={css.likeButton} onClick={this.addLike}>
            <img src={image} className={css.heart}/>
            Like
            </button>
    }
}

export default LikeButton;

import React, { Component } from 'react';
import css from './LikeButton.css';
import heartOutline from './Images/heart-outline.svg';
import heartFilled from './Images/heart-filled.svg';

class LikeButton extends Component {
    // Took out code for counting number of likes. Don't really like how it looks righ now. May add that back in
    // in the future.
    constructor(props) {
        super(props);
        console.log(props);
        const { currentListing, likedListings } = props;
        const listingIsLiked = currentListing && likedListings && likedListings.includes(currentListing) ? true : false; 
    
    this.state = {
        ifLiked: listingIsLiked,
        // likes: props.likes
    };
}

    addLike = () => {
        // let newCount;
        // if(this.state.ifLiked){
        //     newCount = this.state.likes - 1;
        // } else {
        //     newCount = this.state.likes + 1;
        // }
        this.setState({
            ifLiked: !this.state.ifLiked,
            // likes: newCount
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

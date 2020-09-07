import React, { Component } from 'react';
import css from './LikeButton.css';
import heartOutline from './Images/heart-outline.svg';
import heartFilled from './Images/heart-filled.svg';

class LikeButton extends Component {
    // Took out code for counting number of likes. Don't really like how it looks righ now. May add that back in
    // in the future.
    constructor(props) {
        super(props);
        const { currentListingID, likedListings } = props;
        const listingIsLiked = currentListingID && likedListings && likedListings.uuid && likedListings.uuid.includes(currentListingID) ? true : false;
        this.state = {
            ifLiked: listingIsLiked,
            // likes: props.likes
        };
    }

    removeListing() {
        const index = this.props.likedListings.indexOf(this.props.currentListingID);
        if (index > -1) {
            this.props.likedListings.splice(index, 1);
        }
    }

    addLike = () => {
        // let newCount;
        // if(this.state.ifLiked){
        //     newCount = this.state.likes - 1;
        // } else {
        //     newCount = this.state.likes + 1;
        // }
        if (this.state.ifLiked) {
            this.removeListing();
        } else {
            this.props.likedListings.push({ uuid: this.props.currentListingID });
        };
        this.setState({
            ifLiked: !this.state.ifLiked,
            // likes: newCount
        });

        const updatedLikes = {
            privateData: {
                likedListings: this.props.likedListings
            }
        };
        console.log(this.props.likedListings);
        console.log(updatedLikes);
        this.props.onUpdateLikedListings(updatedLikes);
    };

    render() {
        const image = this.state.ifLiked ? heartFilled : heartOutline;
        return <button className={css.likeButton} onClick={this.addLike}>
            <img src={image}/>
            <a href=""></a>
        </button>
    }
}

export default LikeButton;

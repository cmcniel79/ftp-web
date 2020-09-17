import React, { Component } from 'react';
import css from './LikeButton.css';
import heartOutline from './Images/heart-outline.svg';
import heartFilled from './Images/heart-filled.svg';

class LikeButton extends Component {
    // Took out code for counting number of likes. Don't really like how it looks righ now. May add that back in
    // in the future.
    constructor(props) {
        super(props);
        const { currentListingID, isListingLiked } = props;
        const listingIsLiked = isListingLiked({ uuid: currentListingID }) ? true : false;
        this.state = {
            ifLiked: listingIsLiked,
        };
    }

    addLike = () => {
        if (!this.state.ifLiked) {
            this.props.onUpdateLikedListings({ uuid: this.props.currentListingID });
        } else {
            this.props.removeListing({ uuid: this.props.currentListingID })
        }
        this.setState({
            ifLiked: !this.state.ifLiked,
        });

        // const updatedLikes = {
        //     privateData: {
        //         likedListings: this.props.likedListings
        //     }
        // };
    };

    render() {
        // const likedStatus = this.props.isListingLiked({ uuid: this.props.currentListingID });
        // this.setState( {ifLiked: likedStatus} )
        const image = this.state.ifLiked ? heartFilled : heartOutline;
        return <button className={css.likeButton} onClick={this.addLike}>
            <img src={image} className={css.heartImage} />
            <a href=""></a>
        </button>
    }
}

export default LikeButton;



        // let newCount;
        // if(this.state.ifLiked){
        //     newCount = this.state.likes - 1;
        // } else {
        //     newCount = this.state.likes + 1;
        // }
        // if (this.state.ifLiked) {
        //     this.removeListing();
        // } else {
        //     this.props.likedListings.push({ uuid: this.props.currentListingID });
        // };
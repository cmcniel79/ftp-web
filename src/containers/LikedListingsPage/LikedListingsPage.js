import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import {
  ListingCard,
  Page,
  UserNav,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
} from '../../components';
import { TopbarContainer } from '../../containers';
import {
  callLikeAPI,
  sendUpdatedLikes
} from './LikedListingsPage.duck';
import css from './LikedListingsPage.module.css';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';

export class LikedListingsPageComponent extends Component {
  constructor(props) {
    super(props);

    this.likes = [];
    this.isLiked = this.isLiked.bind(this);
    this.updateLikes = this.updateLikes.bind(this);
    this.sendLikes = this.sendLikes.bind(this);
  }

  isLiked(listingId) {
    return this.likes && this.likes.length > 0 ? this.likes.findIndex(x => x === listingId) : -1;
  }

  updateLikes(listingId) {
    const index = this.isLiked(listingId);
    var likeBool;
    if (index > -1) {
      // Remove listing from likes list
      this.likes.splice(index, 1);
      likeBool = false;
    } else {
      // Add listing to likes list
      this.likes.push(listingId);
      likeBool = true;
    }
    this.sendLikes();
    const apiPayload = {
      uuid: listingId,
      isListing: true,
      add: likeBool
    };
    callLikeAPI(apiPayload);
  }

  sendLikes() {
    const updatedLikes = {
      privateData: {
        likes: this.likes
      }
    };
    this.props.onSendUpdatedLikes(updatedLikes);
  }

  render() {
    const {
      queryInProgress,
      queryListingsError,
      scrollingDisabled,
      intl,
      listings,
      currentUser
    } = this.props;

    const isEventHost = currentUser && currentUser.attributes.profile.metadata && currentUser.attributes.profile.metadata.eventHost;

    const listingsAreLoaded = !queryInProgress;

    this.likes = currentUser && currentUser.attributes.profile.privateData && currentUser.attributes.profile.privateData.likes ? 
      currentUser.attributes.profile.privateData.likes : [];

    const loadingResults =  (
      <h2>
        <FormattedMessage id="LikedListingsPage.loadingOwnListings" />
      </h2>
    );

    const queryError = (
      <h2 className={css.error}>
        <FormattedMessage id="LikedListingsPage.queryError" />
      </h2>
    );

    const noResults =
      listingsAreLoaded && ((listings && listings.length === 0) || (!listings)) ? (
        <h1 className={css.title}>
          <FormattedMessage id="LikedListingsPage.noResults" />
        </h1>
      ) : null;

    const heading =
      listingsAreLoaded && listings && listings.length > 0 ? (
        <h1 className={css.title}>
          <FormattedMessage
            id="LikedListingsPage.youHaveListings"
            values={{ count: listings.length }}
          />
        </h1>
      ) : ( noResults );

    const title = intl.formatMessage({ id: 'LikedListingsPage.title' });

    const panelWidth = 62.5;
    // Render hints for responsive image
    const renderSizes = [
      `(max-width: 767px) 100vw`,
      `(max-width: 1920px) ${panelWidth / 2}vw`,
      `${panelWidth / 3}vw`,
    ].join(', ');

    return (
      <Page title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer currentPage="LikedListingsPage" />
            <UserNav selectedPageName="LikedListingsPage" isEventHost={isEventHost}/>
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            {queryInProgress ? loadingResults : null}
            {queryListingsError ? queryError : null}
            <div className={css.listingPanel}>
              {heading}
              <div className={css.listingCards}>
                {listings && listings.length > 0 ? listings.map(l => (
                  <ListingCard
                    className={css.listingCard}
                    key={l.id.uuid}
                    listing={l}
                    renderSizes={renderSizes}
                    isLiked={this.isLiked}
                    updateLikes={this.updateLikes}
                    currentUser={currentUser}
                  />
                )) : null}
              </div>
            </div>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
}

LikedListingsPageComponent.defaultProps = {
  listings: [],
};

const { arrayOf, bool } = PropTypes;

LikedListingsPageComponent.propTypes = {
  listings: arrayOf(propTypes.listing),
  scrollingDisabled: bool.isRequired,
  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const {
    queryInProgress,
    queryListingsError,
    likedIds,
  } = state.LikedListingsPage;
  
  const { currentUser } = state.user;
  const listings = !queryInProgress && likedIds && likedIds.length > 0 ? getMarketplaceEntities(state, likedIds) : null;

  return {
    scrollingDisabled: isScrollingDisabled(state),
    listings,
    queryInProgress,
    queryListingsError,
    currentUser
  };
};

const mapDispatchToProps = dispatch => ({
  onSendUpdatedLikes: data => dispatch(sendUpdatedLikes(data)),
});

const LikedListingsPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(LikedListingsPageComponent);

export default LikedListingsPage;

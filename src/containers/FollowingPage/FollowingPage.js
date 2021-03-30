import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import {
  Page,
  UserNav,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  UserCard
} from '../../components';
import { TopbarContainer } from '..';
import {
  sendUpdatedFollowed,
  callFollowAPI
} from './FollowingPage.duck';
import css from './FollowingPage.module.css';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';

export class FollowingPageComponent extends Component {
  constructor(props) {
    super(props);

    this.followed = [];
    this.isFollowed = this.isFollowed.bind(this);
    this.updateFollowed = this.updateFollowed.bind(this);
    this.sendFollowed = this.sendFollowed.bind(this);
  }

  isFollowed(sellerId) {
    return this.followed && this.followed.length > 0 ? this.followed.findIndex(x => x === sellerId) : -1;
  }

  updateFollowed(sellerId) {
    const index = this.isFollowed(sellerId);
    var followBool;
    if (this.isFollowed(sellerId) > -1) {
      // Remove seller from followed list
      this.followed.splice(index, 1);
      followBool = false;
    } else {
      // Add seller to followed
      this.followed.push(sellerId);
      followBool = true;
    }
    this.sendFollowed();
    const apiPayload = {
      uuid: sellerId,
      isListing: false,
      add: followBool
    };
    callFollowAPI(apiPayload);
  }

  sendFollowed() {
    const updatedFollowed = {
      privateData: {
        followed: this.followed
      }
    };
    this.props.onSendUpdatedFollowed(updatedFollowed);
  }

  render() {
    const {
      queryInProgress,
      queryListingsError,
      scrollingDisabled,
      intl,
      users,
      currentUser,
    } = this.props;
    
    const isEventHost = currentUser && currentUser.attributes.profile.metadata && currentUser.attributes.profile.metadata.eventHost;

    this.followed = currentUser && currentUser.attributes.profile.privateData && currentUser.attributes.profile.privateData.followed ?
      currentUser.attributes.profile.privateData.followed : [];

    const listingsAreLoaded = !queryInProgress;
    const loadingResults = (
      <h2>
        <FormattedMessage id="FollowingPage.loadingFollows" />
      </h2>
    );

    const queryError = (
      <h2 className={css.error}>
        <FormattedMessage id="FollowingPage.queryError" />
      </h2>
    );

    const noResults = !queryInProgress && ((users && users.length === 0) || (!users)) ? (
      <h1 className={css.title}>
        <FormattedMessage id="FollowingPage.noResults" />
      </h1>
    ) : null;

    const heading = listingsAreLoaded && users && users.length > 0 ? (
      <h1 className={css.title}>
        <FormattedMessage
          id="FollowingPage.youAreFollowing"
          values={{ count: users.length }}
        />
      </h1>
    ) : (
        noResults
      );

    const title = intl.formatMessage({ id: 'FollowingPage.title' });

    return (
      <Page title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer currentPage="FollowingPage" />
            <UserNav selectedPageName="FollowingPage" isEventHost={isEventHost}/>
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            {queryInProgress ? loadingResults : null}
            {queryListingsError ? queryError : null}
            <div className={css.userPanel}>
              {heading}
              <div className={css.users}>
                {users && users.map(u => (
                  <div className={css.userCardWrapper} key={u.id.uuid}>
                    <UserCard
                      user={u}
                      currentUser={currentUser}
                      onContactUser={null}
                      isFollowed={this.isFollowed}
                      updateFollowed={this.updateFollowed}
                      isFollowingPage={true}
                    />
                  </div>
                ))}
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

FollowingPageComponent.defaultProps = {
  listings: [],
  pagination: null,
};

const { arrayOf, bool } = PropTypes;

FollowingPageComponent.propTypes = {
  listings: arrayOf(propTypes.listing),
  pagination: propTypes.pagination,
  scrollingDisabled: bool.isRequired,
  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const {
    followedIds,
    queryInProgress,
    queryListingsError,
  } = state.FollowingPage;
  
  const { currentUser } = state.user;
  const users = followedIds && followedIds.length > 0 ? getMarketplaceEntities(state, followedIds) : null;

  return {
    scrollingDisabled: isScrollingDisabled(state),
    users,
    currentUser,
    queryInProgress,
    queryListingsError
  };
};

const mapDispatchToProps = dispatch => ({
  onSendUpdatedFollowed: (data) => dispatch(sendUpdatedFollowed(data))
});

const FollowingPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(FollowingPageComponent);

export default FollowingPage;

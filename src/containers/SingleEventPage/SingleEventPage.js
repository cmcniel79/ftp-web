import React, { Component } from 'react';
import { TopbarContainer } from '..';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
  Page
} from '../../components';
import { loadData } from './SingleEventPage.duck';
import { injectIntl } from '../../util/reactIntl';
import { getMarketplaceEntities, getListingsById } from '../../ducks/marketplaceData.duck';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import SectionSellers from './SectionSellers';
import SectionHost from './SectionHost';
import SectionListings from './SectionListings';
import {
  FormattedMessage,
} from '../../util/reactIntl';

import css from './SingleEventPage.css';

export class SingleEventPageComponent extends Component {
  constructor(props) {
    super(props);
    this.shareButtonClick = this.shareButtonClick.bind(this);
  }

  componentDidMount() {
    if (window) {
      this.props.onLoadData(this.props.params.id);
    }
  }

  shareButtonClick = urlToProfile => {
    if (navigator.share) {
      navigator.share({
        text: 'Check out this awesome profile on From The People!',
        url: urlToProfile
      })
        .catch(() => {
          console.log('Could not share link');
        });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(urlToProfile)
        .then(() => {
          this.setState({ wasCopySuccessful: true })
        })
        .catch(() => {
          console.log('Could not share link');
        });
    }
    // https://medium.com/@feargswalsh/copying-to-the-clipboard-in-react-81bb956963ec
  };

  render() {
    const { users, currentUser, eventDetails, eventInfoInProgress, listings } = this.props;
    const eventName = eventDetails && eventDetails.eventName ? eventDetails.eventName : null;
    const eventDescription = eventDetails && eventDetails.eventDescription ? eventDetails.eventDescription : null;
    const eventAddress = "410 Terry Ave, North Seattle, United States";
    const dates = "May 15-17th 2021";
    return (
      <Page className={css.root} title="Powwow Page" scrollingDisabled={false}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>

          <LayoutWrapperMain className={css.staticPageWrapper}>
           {eventDetails && !eventInfoInProgress ?
           <div>
           <div className={css.titleContainer} >
              <h1 className={css.pageTitle}>
                <FormattedMessage id="SingleEventPage.heading" values={{ eventName }} />
              </h1>
              <h3 className={css.pageSubtitleDesktop}>
                {dates} 
                <span className={css.separator}>•</span>
                {eventAddress}
              </h3>
              <h3 className={css.pageSubtitleMobile}>
                <span>{dates}</span> 
                <span>{eventAddress}</span>
              </h3>
            </div>
            <div className={css.splitScreen}>
              <SectionSellers className={css.sectionSellers} users={users} currentUser={currentUser} />
              <SectionHost className={css.sectionHost} eventDescription={eventDescription}/>
            </div>
            <SectionListings listings={listings}/>
            </div> 
            : !eventDetails && eventInfoInProgress ?
            <div>
              <h3>
                Loading Event Info....
              </h3>
            </div>
            : <div>
              <h3>
                No Event
              </h3>
              </div>}
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
};

const mapStateToProps = state => {
  const {
    searchParams,
    userIds,
    eventDetails,
    eventInfoInProgress,
    currentPageResultIds,
    pagination,
    searchInProgress,
    searchListingsError,
  } = state.SingleEventPage;
  const pageListings = currentPageResultIds ? getListingsById(state, currentPageResultIds) : null;
  const { currentUser } = state.user;
  const users = userIds && userIds.length > 0 ? getMarketplaceEntities(state, userIds) : null;
  return {
    listings: pageListings,
    users: users,
    scrollingDisabled: isScrollingDisabled(state),
    searchParams,
    currentUser,
    eventDetails,
    eventInfoInProgress,
    currentPageResultIds,
    pagination,
    searchInProgress,
    searchListingsError,
  };
};

const mapDispatchToProps = dispatch => ({
  onLoadData: (id) => dispatch(loadData(id)),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671

const SingleEventPage = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(SingleEventPageComponent);

export default SingleEventPage;

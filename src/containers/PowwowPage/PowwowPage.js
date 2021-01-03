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
import { loadData } from './PowwowPage.duck';
import { injectIntl } from '../../util/reactIntl';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import SectionSellers from './SectionSellers';
import SectionHost from './SectionHost';
import {
  FormattedMessage,
} from '../../util/reactIntl';
import navigateIcon from '../../assets/navigate.svg';
import shareIcon from '../../assets/share.svg';
import exitIcon from '../../assets/exit.svg';

import css from './PowwowPage.css';

export class PowwowPageComponent extends Component {
  constructor(props) {
    super(props);
    this.shareButtonClick = this.shareButtonClick.bind(this);
  }

  componentDidMount() {
    if (window) {
      this.props.onLoadData();
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
    const { users, currentUser } = this.props;
    const host = "Stanford Powwow";
    const website = "http://powwow.stanford.edu/";
    const eventAddress = "410 Terry Ave, North Seattle, United States";
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURI(eventAddress);
    return (
      <Page className={css.root} title="Powwow Page" scrollingDisabled={false}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>

          <LayoutWrapperMain className={css.staticPageWrapper}>
            <div className={css.titleContainer} >
              <h1 className={css.pageTitle}>
                <FormattedMessage id="PowwowPage.heading" values={{ host }} />
              </h1>
              <div className={css.buttonRow} >
                {eventAddress &&
                  <ExternalLink
                    className={css.linkButton}
                    href={googleMapsUrl}
                  >
                    <img className={css.linkIcon} src={navigateIcon} alt="Navigate" />
                    <FormattedMessage id="SellerCard.navigateButton" />
                  </ExternalLink>
                }
                {website &&
                  <ExternalLink
                    className={css.linkButton}
                    href={website}
                  >
                    <img className={css.linkIcon} src={exitIcon} alt="Link" />
                    <FormattedMessage id="SellerCard.websiteButton" />
                  </ExternalLink>
                }
                <button
                  className={css.shareButton}
                  onClick={() => this.shareButtonClick(window.location.href)}
                >
                  <img className={css.shareIcon} src={shareIcon} alt="Share" />
                  <FormattedMessage id="SellerCard.shareButton" />
                </button>
              </div>
            </div>
            <div className={css.splitScreen}>
              <SectionSellers className={css.sectionSellers} users={users} currentUser={currentUser} />
              <SectionHost className={css.sectionHost} host={host} />
            </div>
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
    pagination,
    searchInProgress,
    searchListingsError,
    searchParams,
    userIds,
  } = state.PowwowPage;
  const { currentUser } = state.user;
  const users = userIds && userIds.length > 0 ? getMarketplaceEntities(state, userIds) : null;
  return {
    users: users,
    pagination,
    scrollingDisabled: isScrollingDisabled(state),
    searchInProgress,
    searchListingsError,
    searchParams,
    currentUser
  };
};

const mapDispatchToProps = dispatch => ({
  onLoadData: () => dispatch(loadData()),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671

const PowwowPage = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(PowwowPageComponent);

export default PowwowPage;

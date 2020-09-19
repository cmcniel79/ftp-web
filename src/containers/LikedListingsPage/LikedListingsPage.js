import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { parse } from '../../util/urlHelpers';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import {
  ListingCard,
  Page,
  PaginationLinks,
  UserNav,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
} from '../../components';
import { TopbarContainer } from '../../containers';
import {
  queryLikedListings,
} from './LikedListingsPage.duck';
import css from './LikedListingsPage.css';
import { getListingsById } from '../../ducks/marketplaceData.duck';
import { ensureListing } from '../../util/data';


// Pagination page size might need to be dynamic on responsive page layouts
// Current design has max 3 columns 42 is divisible by 2 and 3
// So, there's enough cards to fill all columns on full pagination pages
const RESULT_PAGE_SIZE = 42;

export class LikedListingsPageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { listingMenuOpen: null };
    this.onToggleMenu = this.onToggleMenu.bind(this);
  }

  onToggleMenu(listing) {
    this.setState({ listingMenuOpen: listing });
  }

  render() {
    const {
      pagination,
      queryInProgress,
      queryListingsError,
      queryParams,
      scrollingDisabled,
      intl,
      listings
    } = this.props;

    listings.map(l => ensureListing(l));

    const hasPaginationInfo = !!pagination && pagination.totalItems != null;
    const listingsAreLoaded = !queryInProgress && hasPaginationInfo;


    const loadingResults = (
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
      listingsAreLoaded && pagination.totalItems === 0 ? (
        <h1 className={css.title}>
          <FormattedMessage id="LikedListingsPage.noResults" />
        </h1>
      ) : null;

    const heading =
      listingsAreLoaded && pagination.totalItems > 0 ? (
        <h1 className={css.title}>
          <FormattedMessage
            id="LikedListingsPage.youHaveListings"
            values={{ count: pagination.totalItems }}
          />
        </h1>
      ) : (
          noResults
        );

    const page = queryParams ? queryParams.page : 1;
    const paginationLinks =
      listingsAreLoaded && pagination && pagination.totalPages > 1 ? (
        <PaginationLinks
          className={css.pagination}
          pageName="LikedListingsPage"
          pageSearchParams={{ page }}
          pagination={pagination}
        />
      ) : null;

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
            <UserNav selectedPageName="LikedListingsPage" />
          </LayoutWrapperTopbar>
          <LayoutWrapperMain>
            {queryInProgress ? loadingResults : null}
            {queryListingsError ? queryError : null}
            <div className={css.listingPanel}>
              {heading}
              {listings && <div className={css.listingCards}>
                {listings.map(l => (
                  <ListingCard
                    className={css.listingCard}
                    key={l.id.uuid}
                    listing={l}
                    renderSizes={renderSizes}
                  />
                ))}
              </div>
              }
              {paginationLinks}
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
  pagination: null,
};

const { arrayOf, bool } = PropTypes;

LikedListingsPageComponent.propTypes = {
  listings: arrayOf(propTypes.listing),
  pagination: propTypes.pagination,
  scrollingDisabled: bool.isRequired,
  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const {
    // pagination,
    currentPageResultIds,
  } = state.LikedListingsPage;
  const listings = getListingsById(state, currentPageResultIds); 
  return {
    // pagination,
    scrollingDisabled: isScrollingDisabled(state),
    listings
  };
};

const LikedListingsPage = compose(
  connect(
    mapStateToProps
  ),
  injectIntl
)(LikedListingsPageComponent);

LikedListingsPage.loadData = (params, search) => {
  const queryParams = parse(search);
  const page = queryParams.page || 1;
  return queryLikedListings({
    ...queryParams,
    page,
    perPage: RESULT_PAGE_SIZE,
    include: ['images'],
    'fields.image': ['variants.landscape-crop', 'variants.landscape-crop2x'],
    'limit.images': 1,
  });
};

export default LikedListingsPage;

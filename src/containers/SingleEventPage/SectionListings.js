import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { SearchResultsPanel } from '../../components';

import css from './SingleEventPage.module.css';

export const SectionListings = props => {

    const {
        className,
        listings,
        pagination,
        searchListingsInProgress,
        searchListingsError,
        pageName,
        pagePathParams
    } = props;

    const heading =
        <h2 className={css.sectionHeading}>
            <FormattedMessage id="SingleEventPage.listingsHeading" />
        </h2>;

    const listingsMessage =
        searchListingsInProgress ? <FormattedMessage id="SingleEventPage.listingsLoading" />
            : !listings && !searchListingsInProgress ? <FormattedMessage id="SingleEventPage.noEventListings" />
                : searchListingsError ? <FormattedMessage id="SingleEventPage.listingsError" /> : null;

    const panel = listings ?
        <SearchResultsPanel
            className={css.searchListingsPanel}
            listings={listings}
            pagination={pagination}
            pageName={pageName}
            pagePathParams={pagePathParams}
        /> : null;

    return (
        <div className={className}>
            {heading}
            {panel}
            <h3>
                {listingsMessage}
            </h3>
        </div>
    );
}

export default SectionListings;
import React, { Component } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { SearchResultsPanel } from '../../components';

import css from './SingleEventPage.css';

class SectionListings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, listings, pagination } = this.props;
        return (
            <div className={className}>
                {listings ?
                    <SearchResultsPanel
                        className={css.searchListingsPanel}
                        listings={listings}
                        pagination={pagination}
                    // search={searchParamsForPagination}
                    // setActiveListing={onActivateListing}
                    // currentUser={currentUser}
                    // isLiked={isLiked}
                    // updateLikes={updateLikes}
                    /> : null}
            </div>
        );
    }
}

SectionListings.defaultProps = {
};

SectionListings.propTypes = {
};

export default SectionListings;
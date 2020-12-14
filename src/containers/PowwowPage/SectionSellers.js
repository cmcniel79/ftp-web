import React, { Component } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { UserCard } from '../../components';

import css from './PowwowPage.css';

const Seller = props => {
    const {
        listing,
        onContactUser,
        currentUser,
        isPremium
    } = props;

    if (!listing.author) {
        return null;
    }

    const sellerHeading = isPremium ?
        <h2 className={css.premiumSellerHeading}>
            <FormattedMessage id="ListingPage.premiumPartnerHeading" />
        </h2>
        :
        <h2 className={css.featuresHeading}>
            <FormattedMessage id="ListingPage.yourSellerHeading" />
        </h2>;

    return (
        <div id="seller" className={css.sectionSeller}>
            {sellerHeading}
            <UserCard user={listing.author} currentUser={currentUser} onContactUser={onContactUser} />
        </div>
    );
};

Seller.defaultProps = {
    user: null,
};

Seller.propTypes = {
};

class SectionSellers extends Component {
    constructor(props) {
        super(props);
        this.state = { currentUserIndex: 0, wasCopySuccessful: null };
    }

    render() {
        const { users } = this.props;
        return (
            <div>
                <h2>
                    Sellers
            </h2>
                {users && users.map(user => {
                    console.log(user);
                    return(
                    <h2>
                        {user.attributes.profile.displayName}
                    </h2>
                    )}
                )}
            </div>
        );
    }
}

SectionSellers.defaultProps = {
};

SectionSellers.propTypes = {
};

export default SectionSellers;
import React, { Component } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { UserCard } from '../../components';

import css from './SingleEventPage.css';

class SectionSellers extends Component {
    constructor(props) {
        super(props);
        this.state = { currentUserIndex: 0, wasCopySuccessful: null };
    }

    render() {
        const { users, currentUser, className } = this.props;
        return (
            <div className={className}>
                <h2 className={css.sellersHeading}>
                    <FormattedMessage id="SingleEventPage.sellersHeading" />
                </h2>
                {users && users.map(u => (
                    <div className={css.userCardWrapper} key={u.id.uuid}>
                        <UserCard
                            user={u}
                            currentUser={currentUser}
                            onContactUser={null}
                            isFollowed={() => console.log("Followed")}
                            updateFollowed={() => console.log("Update Followed")}
                            isFollowingPage={false}
                        />
                    </div>
                ))}
            </div>
        );
    }
}

SectionSellers.defaultProps = {
};

SectionSellers.propTypes = {
};

export default SectionSellers;
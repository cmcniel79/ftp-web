import React, { Component } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { UserCard } from '../../components';

import css from './PowwowPage.css';

class SectionSellers extends Component {
    constructor(props) {
        super(props);
        this.state = { currentUserIndex: 0, wasCopySuccessful: null };
    }

    render() {
        const { users, currentUser } = this.props;
        return (
            <div>
                <h2>
                <FormattedMessage id="PowwowPage.sellersHeading"/>
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
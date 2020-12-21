import { map } from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { InlineTextButton } from '../../components';


import css from './EventHostPage.css';

class EventSellersListMaybe extends Component {
  constructor(props) {
    super(props);
    const { sellersList } = props;
    this.sellers = sellersList;
    this.removeSeller = this.removeSeller.bind(this);
  }

  removeSeller(sellerEmail) {
    const index = this.sellers.findIndex(x => x === sellerEmail);
    this.sellers = index > 1 ? this.sellers.splice(index, 1) : null;
  }

  // updateSellers(sellerEmail) {
  //   const index = this.isFollowed(sellerId);
  //   var followBool;
  //   if (this.isFollowed(sellerId) > -1) {
  //     // Remove seller from followed list
  //     this.followed.splice(index, 1);
  //     followBool = false;
  //   } else {
  //     // Add seller to followed
  //     this.followed.push(sellerId);
  //     followBool = true;
  //   }
  //   this.sendFollowed();
  //   const apiPayload = {
  //     uuid: sellerId,
  //     isListing: false,
  //     add: followBool
  //   };
  //   callFollowAPI(apiPayload);
  // }

  // sendFollowed() {
  //   const updatedFollowed = {
  //     privateData: {
  //       followed: this.followed
  //     }
  //   };
  //   this.props.onSendUpdatedFollowed(updatedFollowed);
  // }

  render() {
    return (
      <div className={css.sectionSellersList}>
        {this.sellers && this.sellers.length > 0 ? (
          <div>
            <h3 className={css.sectionTitle}>
              <FormattedMessage id="EventHostPage.sellersListHeading" values={{ count: this.sellers.length }} />
            </h3>
            {this.sellers.map(s => {
              return (
                <div className={css.sellerItem} key={s}>
                  <h3 className={css.sellerName}>
                    {s}
                  </h3>
                  <InlineTextButton className={css.removeButton} onClick={() => this.removeSeller(s)}>
                    <FormattedMessage id="EventHostPage.removeSeller" />
                  </InlineTextButton>
                </div>
              )}
            )}
          </div>
        ) : (
            <h2 className={css.featuresHeading}>
              <FormattedMessage id="EventHostPage.noSellers" />
            </h2>)}
      </div>
    )
  }
};

export default EventSellersListMaybe;
import { map } from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { InlineTextButton } from '../../components';


import css from './EventHostPage.css';

class EventSellersListMaybe extends Component {
  constructor(props) {
    super(props);
    this.removeSeller = this.removeSeller.bind(this);
  }

  removeSeller(deletedEmail) {
    this.props.updateSellers(deletedEmail);
  }

  render() {
    const { inProgress, response, sellers } = this.props;
    const submitResponse = response ? (
      <div className={css.success}>
        {response}
      </div>
    ) : null;
    return (
      <div className={css.sectionSellersList}>
        {submitResponse}
        {sellers && sellers.length > 0 && !inProgress ? (
          <div>
            <h3 className={css.sectionTitle}>
              <FormattedMessage id="EventHostPage.sellersListHeading" values={{ count: sellers.length }} />
            </h3>
            <ul>
              {sellers.map(s => {
                return (
                  <li className={css.sellerItem} key={s.sellerUUID} value={s.sellerEmail}>
                    <h3 className={css.sellerName}>
                      {s.sellerEmail}
                    </h3>
                    <InlineTextButton className={css.removeButton} onClick={() => this.removeSeller(s.sellerEmail)}>
                      <FormattedMessage id="EventHostPage.removeSeller" />
                    </InlineTextButton>
                  </li>
                )
              }
              )}
            </ul>
          </div>
        ) : inProgress ? (
          <h2 className={css.featuresHeading}>
            <FormattedMessage id="EventHostPage.loadingSellers" />
          </h2>
        ) : (<h2 className={css.featuresHeading}>
          <FormattedMessage id="EventHostPage.noSellers" />
        </h2>
            )}
      </div>
    )
  }
};

export default EventSellersListMaybe;
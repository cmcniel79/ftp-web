import { map } from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { InlineTextButton } from '../../components';


import css from './EventHostPage.css';

class EventSellersListMaybe extends Component {
  constructor(props) {
    super(props);
    const { sellersList } = props;
    this.state = { sellers: sellersList };
    this.removeSeller = this.removeSeller.bind(this);
  }

  removeSeller(deletedEmail) {
    this.setState(prevState => ({ sellers: prevState.sellers.filter(e => e != deletedEmail) }));
    this.props.updateSellers(deletedEmail);
  }

  render() {
    const { inProgress, response } = this.props;
    const submitResponse = response ? (
      <div className={css.success}>
        {response}
      </div>
    ) : null;
    return (
      <div className={css.sectionSellersList}>
        {submitResponse}
        {this.state.sellers && this.state.sellers.length > 0 && !inProgress ? (
          <div>
            <h3 className={css.sectionTitle}>
              <FormattedMessage id="EventHostPage.sellersListHeading" values={{ count: this.state.sellers.length }} />
            </h3>
            <ul>
              {this.state.sellers.map(s => {
                return (
                  <li className={css.sellerItem} key={s} value={s}>
                    <h3 className={css.sellerName}>
                      {s}
                    </h3>
                    <InlineTextButton className={css.removeButton} onClick={() => this.removeSeller(s)}>
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
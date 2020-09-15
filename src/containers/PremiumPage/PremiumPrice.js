import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import {
    Button,
    ExternalLink
} from '../../components';

import css from './PremiumPage.css';
import { string } from 'prop-types';

const PremiumPrice = props => {
    const { price, websiteLink } = props;
    console.log(websiteLink);
    return (
        <div className={css.sectionPrice}>
            <h2 className={css.price}>
                Price: {price}
            </h2>
            <ExternalLink href={websiteLink} className={css.partnerLink}>
                <Button
                    className={css.buyButton}
                >
                    <FormattedMessage id="PremiumPage.buyButtonMessage" />
                </Button>
            </ExternalLink>
        </div>
    )
};

PremiumPrice.defaultProps = { price: null, websiteLink: null };

PremiumPrice.propTypes = {
  price: string,
  websiteLink: string,
};

export default PremiumPrice;

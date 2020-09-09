import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { richText } from '../../util/richText';
import {
    Button,
    ExternalLink
} from '../../components';

import css from './PremiumPage.css';

const PremiumDescriptionMaybe = props => {
    const { price, websiteLink } = props;
    return (
        <div className={css.sectionPrice}>
            <h2 className={css.price}>
                Price:
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

export default PremiumDescriptionMaybe;

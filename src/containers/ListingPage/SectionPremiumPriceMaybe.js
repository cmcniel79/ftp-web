import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import {
    Button,
    ExternalLink
} from '../../components';
import exit from '../../assets/exit-white.svg';
import css from './ListingPage.css';
import { string } from 'prop-types';

const SectionPremiumPriceMaybe = props => {
    const { price, websiteLink } = props;
    return (
        <div className={css.sectionPrice}>
            <h2 className={css.price}>
                Price: {price}
            </h2>
            <ExternalLink href={websiteLink} className={css.partnerLink}>
                <Button
                    className={css.buyButton}
                >
                    <FormattedMessage id="ListingPage.buyButtonMessage" />
                    <img className={css.externalLinkIcon} src={exit} alt="External Link" />
                </Button>
            </ExternalLink>
        </div>
    )
};

SectionPremiumPriceMaybe.defaultProps = { price: null, websiteLink: null };

SectionPremiumPriceMaybe.propTypes = {
  price: string,
  websiteLink: string,
};

export default SectionPremiumPriceMaybe;

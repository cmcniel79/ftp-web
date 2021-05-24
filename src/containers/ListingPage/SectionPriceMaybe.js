import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import {
    Button,
    ExternalLink,
    NamedRedirect,
} from '../../components';
import exit from '../../assets/exit-white.svg';
import css from './ListingPage.module.css';
import { string } from 'prop-types';

const SectionPriceMaybe = props => {
    const { currentUser, isPremium, price, websiteLink, onSubmit } = props;
    return (
        <div className={css.sectionPrice}>
            <h2 className={css.price}>
                Price: {price}
            </h2>
            {isPremium ? (
                <ExternalLink href={websiteLink} className={css.partnerLink}>
                    <Button className={css.buyButton}>
                        <FormattedMessage id="ListingPage.buyButtonMessage" />
                        <img className={css.externalLinkIcon} src={exit} alt="External Link" />
                    </Button>
                </ExternalLink>
            ) : !currentUser ? (
                <Button className={css.buyButton} onClick={() => { return <NamedRedirect name="LoginPage" /> }}>
                    <FormattedMessage id="ListingPage.buyButtonMessage" />
                </Button>
            ) : (
                <Button className={css.buyButton} onClick={() => onSubmit()}>
                    <FormattedMessage id="ListingPage.buyButtonMessage" />
                </Button>
            )}
        </div>
    )
};

SectionPriceMaybe.defaultProps = { price: null, websiteLink: null };

SectionPriceMaybe.propTypes = {
    price: string,
    websiteLink: string,
};

export default SectionPriceMaybe;

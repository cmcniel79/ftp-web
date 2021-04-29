import React from 'react';
import { intlShape } from '../../util/reactIntl';
import { bool, string } from 'prop-types';
import config from '../../config';
import * as validators from '../../util/validators';
import getCountryCodes from '../../translations/countryCodes';
import { FieldTextInput, FieldSelect } from '../../components';

import css from './ShippingAddress.module.css';

const ShippingAddress = props => {
    const { className, intl, formId, isCheckoutPage, country } = props;

    const addressLine1Label = intl.formatMessage({ id: 'ShippingAddress.addressLine1Label' });
    const addressLine1Placeholder = intl.formatMessage({ id: 'ShippingAddress.addressLine1Placeholder' });
    const addressLine1Required = validators.required(intl.formatMessage({ id: 'ShippingAddress.addressLine1Required' }));

    const addressLine2Label = intl.formatMessage({ id: 'ShippingAddress.addressLine2Label' });
    const addressLine2Placeholder = intl.formatMessage({ id: 'ShippingAddress.addressLine2Placeholder' });

    const postalCodeLabel = intl.formatMessage({ id: 'ShippingAddress.postalCodeLabel' });
    const postalCodePlaceholder = intl.formatMessage({ id: 'ShippingAddress.postalCodePlaceholder' });
    const postalCodeRequired = validators.required(intl.formatMessage({ id: 'ShippingAddress.postalCodeRequired' }));

    const cityLabel = intl.formatMessage({ id: 'ShippingAddress.cityLabel' });
    const cityPlaceholder = intl.formatMessage({ id: 'ShippingAddress.cityPlaceholder' });
    const cityRequired = validators.required(intl.formatMessage({ id: 'ShippingAddress.cityRequired' }));

    const stateLabel = intl.formatMessage({ id: 'ShippingAddress.stateLabel' },);
    const statePlaceholder = intl.formatMessage({ id: 'ShippingAddress.statePlaceholder' });
    const stateRequired = validators.required(intl.formatMessage({ id: 'ShippingAddress.stateRequired' }));

    const countryLabel = intl.formatMessage({ id: 'ShippingAddress.countryLabel' });
    const countryPlaceholder = intl.formatMessage({ id: 'ShippingAddress.countryPlaceholder' });
    const countryRequired = validators.required(intl.formatMessage({ id: 'ShippingAddress.countryRequired' }));

    // Use tha language set in config.locale to get the correct translations of the country names
    const countryCodes = getCountryCodes(config.locale);

    const countrySection = isCheckoutPage && isCheckoutPage === true ? (
        <div className={css.field}>
            <p className={css.countryLabel}>
                {intl.formatMessage({ id: "ShippingAddress.countryHardCodedLabel" })}
            </p>
            <p className={css.countryValue}>
                {country}
            </p>
        </div>
    ) : (
        <FieldSelect
            id={`${formId}.country`}
            name="shippingAddress.country"
            className={css.field}
            label={countryLabel}
            validate={countryRequired}
        >
            <option disabled value="">
                {countryPlaceholder}
            </option>
            {countryCodes.map(country => {
                return (
                    <option key={country.code} value={country.name}>
                        {country.name}
                    </option>
                );
            })}
        </FieldSelect>
    );

    return (
        <div className={className ? className : css.address}>
            <div className={css.formRow}>
                <FieldTextInput
                    id={`${formId}.addressLine1`}
                    name="shippingAddress.addressLine1"
                    className={css.field}
                    type="text"
                    autoComplete="billing address-line1"
                    label={addressLine1Label}
                    placeholder={addressLine1Placeholder}
                    validate={addressLine1Required}
                />
                <FieldTextInput
                    id={`${formId}.addressLine2`}
                    name="shippingAddress.addressLine2"
                    className={css.field}
                    type="text"
                    autoComplete="billing address-line2"
                    label={addressLine2Label}
                    placeholder={addressLine2Placeholder}
                />
            </div>
            <div className={css.formRow}>
                <FieldTextInput
                    id={`${formId}.postalCode`}
                    name="shippingAddress.postal"
                    className={css.field}
                    type="text"
                    autoComplete="billing postal-code"
                    label={postalCodeLabel}
                    placeholder={postalCodePlaceholder}
                    validate={postalCodeRequired}
                />

                <FieldTextInput
                    id={`${formId}.city`}
                    name="shippingAddress.city"
                    className={css.field}
                    type="text"
                    autoComplete="billing address-level2"
                    label={cityLabel}
                    placeholder={cityPlaceholder}
                    validate={cityRequired}
                />
            </div>
            <div className={css.formRow}>
                <FieldTextInput
                    id={`${formId}.state`}
                    name="shippingAddress.state"
                    className={css.field}
                    type="text"
                    autoComplete="billing address-level1"
                    label={stateLabel}
                    placeholder={statePlaceholder}
                    validate={stateRequired}
                />
                {countrySection}
            </div>
        </div>
    );
};

ShippingAddress.defaultProps = {
    disabled: false,
    fieldId: null,
};

ShippingAddress.propTypes = {
    country: string,
    disabled: bool,
    fieldId: string,
    // from injectIntl
    intl: intlShape.isRequired,
};

export default ShippingAddress;

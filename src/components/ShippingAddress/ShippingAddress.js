import React from 'react';
import { intlShape } from '../../util/reactIntl';
import { bool, string } from 'prop-types';
import config from '../../config';
import * as validators from '../../util/validators';
import getCountryCodes from '../../translations/countryCodes';
import { FieldTextInput, FieldSelect } from '../../components';

import css from './ShippingAddress.css';

const ShippingAddress = props => {
    const { className, intl, formId, isCheckoutPage, country } = props;

    const addressLine1Label = intl.formatMessage({ id: 'ContactDetailsForm.addressLine1Label' });
    const addressLine1Placeholder = intl.formatMessage({ id: 'ContactDetailsForm.addressLine1Placeholder' });
    const addressLine1Required = validators.required(
        intl.formatMessage({
            id: 'ContactDetailsForm.addressLine1Required',
        })
    );

    const addressLine2Label = intl.formatMessage({ id: 'ContactDetailsForm.addressLine2Label' });
    const addressLine2Placeholder = intl.formatMessage({ id: 'ContactDetailsForm.addressLine2Placeholder' });

    const postalCodeLabel = intl.formatMessage({ id: 'ContactDetailsForm.postalCodeLabel' });
    const postalCodePlaceholder = intl.formatMessage({ id: 'ContactDetailsForm.postalCodePlaceholder' });
    const postalCodeRequired = validators.required(
        intl.formatMessage({
            id: 'ContactDetailsForm.postalCodeRequired',
        })
    );

    const cityLabel = intl.formatMessage({ id: 'ContactDetailsForm.cityLabel' });
    const cityPlaceholder = intl.formatMessage({ id: 'ContactDetailsForm.cityPlaceholder' });
    const cityRequired = validators.required(
        intl.formatMessage({
            id: 'ContactDetailsForm.cityRequired',
        })
    );

    const stateLabel = intl.formatMessage({ id: 'ContactDetailsForm.stateLabel' },);
    const statePlaceholder = intl.formatMessage({ id: 'ContactDetailsForm.statePlaceholder' });
    const stateRequired = validators.required(
        intl.formatMessage({
            id: 'ContactDetailsForm.stateRequired',
        })
    );

    const countryLabel = intl.formatMessage({ id: 'ContactDetailsForm.countryLabel' });
    const countryPlaceholder = intl.formatMessage({ id: 'ContactDetailsForm.countryPlaceholder' });
    const countryRequired = validators.required(
        intl.formatMessage({
            id: 'ContactDetailsForm.countryRequired',
        })
    );

    // Use tha language set in config.locale to get the correct translations of the country names
    const countryCodes = getCountryCodes(config.locale);

    const countrySection = isCheckoutPage && isCheckoutPage === true ?
        <div className={css.field}>
            <p className={css.countryLabel}>
            {intl.formatMessage({ id: "ShippingAddressComponent.countryHardCodedLabel" })}

    </p>
            <p className={css.countryValue}>
                {country}
            </p>
        </div>
        :
        <FieldSelect
            id={`${formId}.country`}
            name="shippingAddress.country"
            className={css.field}
            label={countryLabel}
            validate={countryRequired}
            disabled={true}
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
        </FieldSelect>;

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

import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import {
    autocompleteSearchRequired,
    autocompletePlaceSelected,
    composeValidators,
} from '../../util/validators';
import { Form, LocationAutocompleteInputField, Button, FieldTextInput } from '../../components';

import css from './ProfileSettingsForm.css';

const identity = v => v;

const CompanyAddressMaybeComponent = props => {
    const {
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        values,
    } = props;

    const titleRequiredMessage = intl.formatMessage({ id: 'ProfileSettingsForm.address' });
    const addressPlaceholderMessage = intl.formatMessage({
        id: 'ProfileSettingsForm.addressPlaceholder',
    });
    const addressNotRecognizedMessage = intl.formatMessage({
        id: 'ProfileSettingsForm.addressNotRecognized',
    });

    const optionalText = intl.formatMessage({
        id: 'ProfileSettingsForm.optionalText',
    });

    const buildingMessage = intl.formatMessage(
        { id: 'ProfileSettingsForm.building' },
        { optionalText: optionalText }
    );
    const buildingPlaceholderMessage = intl.formatMessage({
        id: 'ProfileSettingsForm.buildingPlaceholder',
    });

    const { updateListingError, showListingsError } = fetchErrors || {};
    const errorMessage = updateListingError ? (
        <p className={css.error}>
            <FormattedMessage id="ProfileSettingsForm.updateFailed" />
        </p>
    ) : null;

    const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
            <FormattedMessage id="ProfileSettingsForm.showListingFailed" />
        </p>
    ) : null;

    const classes = classNames(css.root, className);
    const submitReady = (updated && pristine) || ready;
    const submitInProgress = updateInProgress;
    const submitDisabled = invalid || disabled || submitInProgress;

    return (
        <div>
            <LocationAutocompleteInputField
                className={css.companyField}
                validClassName={css.validLocation}
                invalidClassName={css.invalidLocation}
                name="location"
                label={titleRequiredMessage}
                placeholder={addressPlaceholderMessage}
                useDefaultPredictions={false}
                format={identity}
                // valueFromForm={values.location}
                validate={composeValidators(
                    autocompletePlaceSelected(addressNotRecognizedMessage)
                )}
                showImage={false}
            />

            <FieldTextInput
                className={css.companyField}
                type="text"
                name="building"
                id="building"
                label={buildingMessage}
                placeholder={buildingPlaceholderMessage}
            />
        </div>
    );
}

CompanyAddressMaybeComponent.defaultProps = {
    selectedPlace: null,
    fetchErrors: null,
};

CompanyAddressMaybeComponent.propTypes = {
    intl: intlShape.isRequired,
    selectedPlace: propTypes.place,
    fetchErrors: shape({
        showListingsError: propTypes.error,
        updateListingError: propTypes.error,
    }),
};

export default compose(injectIntl)(CompanyAddressMaybeComponent);
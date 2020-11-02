import React from 'react';
import { compose } from 'redux';
import { intlShape, injectIntl } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { autocompletePlaceSelected } from '../../util/validators';
import { LocationAutocompleteInputField, FieldTextInput, FieldCheckbox } from '../../components';

import css from './ProfileSettingsForm.css';

const identity = v => v;

const CompanyAddressMaybeComponent = props => {
    const {
        intl,
        initialValue
    } = props;

    const addressLabel = intl.formatMessage({ id: 'ProfileSettingsForm.address' });
    const addressPlaceholderMessage = intl.formatMessage({ id: 'ProfileSettingsForm.addressPlaceholder' });
    const addressNotRecognizedMessage = intl.formatMessage({ id: 'ProfileSettingsForm.addressNotRecognized' });
    const buildingMessage = intl.formatMessage({ id: 'ProfileSettingsForm.building' });
    const buildingPlaceholderMessage = intl.formatMessage({ id: 'ProfileSettingsForm.buildingPlaceholder' });

    let showLocationInput;
    const checkbox = document.getElementById('locationCheckbox');

    if (checkbox) {
        if (checkbox.checked) {
            showLocationInput = true;
        } else {
            showLocationInput = false;
        }
    };

    if (initialValue) {
        showLocationInput = true;
    }

    return (
        <div>
            {!initialValue &&
                <div className={css.companyField}>
                    <FieldCheckbox
                        id="locationCheckbox"
                        name="locationCheckbox"
                        label="Would you like to display your location on our Map?"
                        value="true"
                    />
                </div>}
            {showLocationInput ?
                <div>
                    <LocationAutocompleteInputField
                        className={css.companyField}
                        validClassName={css.validLocation}
                        invalidClassName={css.invalidLocation}
                        name="location"
                        label={addressLabel}
                        placeholder={addressPlaceholderMessage}
                        useDefaultPredictions={false}
                        format={identity}
                        validate={autocompletePlaceSelected(addressNotRecognizedMessage)}
                        showImage={false}
                    />
                    <FieldTextInput
                        className={css.companyField}
                        type="text"
                        name="building"
                        id="building"
                        label={buildingMessage}
                        placeholder={buildingPlaceholderMessage}
                        maxLength={30}
                    />
                </div> : null}
        </div>
    );
}

CompanyAddressMaybeComponent.defaultProps = {
    selectedPlace: null,
};

CompanyAddressMaybeComponent.propTypes = {
    intl: intlShape.isRequired,
    selectedPlace: propTypes.place,
};

export default compose(injectIntl)(CompanyAddressMaybeComponent);
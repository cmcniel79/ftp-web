import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { findOptionsForSelectFilter } from '../../util/search';
import { propTypes } from '../../util/types';
import config from '../../config';
import { Button, Form, FieldRadioButton, EditListingSubCategory } from '../../components';

import css from './EditListingCategoryForm.css';
import { composeValidators, required } from '../../util/validators';

const EditListingCategoryFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        disabled,
        ready,
        rootClassName,
        className,
        name,
        intl,
        invalid,
        handleSubmit,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        filterConfig,
      } = formRenderProps;

      const classes = classNames(rootClassName || css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      const { updateListingError, showListingsError } = fetchErrors || {};
      const errorMessage = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingCategoryForm.updateFailed" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingCategoryForm.showListingFailed" />
        </p>
      ) : null;

      const selectionRequiredMessage = intl.formatMessage({ id: 'EditListingCategoryForm.selectionRequired' });
      const options = findOptionsForSelectFilter('categories', filterConfig);


      var option = options[1];
      var sub_options = option.subCategories;

      function onClick(option) {
        console.log("Hello");
      };

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessage}
          {errorMessageShowListing}

          <div className={css.categories}>
            <div className={css.mainCategories}>
              <h2>
                Main Categories
              </h2>
              {options.map(option => (
                <div className={css.radioColumn} key={option.key} onClick={onClick(option)}>
                  <FieldRadioButton
                    id={option.key}
                    name="categories"
                    value={option.key}
                    label={option.label}
                    showAsRequired={pristine}
                    // validate={composeValidators(required(selectionRequiredMessage))}
                  />
                </div>
              ))}
            </div>

            <div className={css.subCategories}>
              <h2>
                Sub-Categories
              </h2>
              {sub_options.map(sub_option => (
                <div className={css.radioColumn} key={sub_option.key}>
                  <FieldRadioButton
                    id={sub_option.key}
                    name="categories"
                    value={sub_option.key}
                    label={sub_option.label}
                    showAsRequired={pristine}
                    validate={composeValidators(required(selectionRequiredMessage))}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form >
      );
    }}
  />
);


EditListingCategoryFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

EditListingCategoryFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  name: string.isRequired,
  onSubmit: func.isRequired,
  intl: intlShape.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  filterConfig: propTypes.filterConfig,
};

const EditListingCategoryForm = EditListingCategoryFormComponent;

export default compose(injectIntl)(EditListingCategoryForm);

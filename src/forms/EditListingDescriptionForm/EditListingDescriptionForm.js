import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { maxLength, required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput, FieldRadioButton, FieldCheckboxGroup, FieldBoolean, FieldSelect } from '../../components';
import { findOptionsForSelectFilter } from '../../util/search';
import config from '../../config';
import arrayMutators from 'final-form-arrays';

import css from './EditListingDescriptionForm.css';

const TITLE_MAX_LENGTH = 46;
var subcategories = [];
var hasInitialized = false;

function getSubcategories(categories, selectedCategory) {
  const keys = categories.map(s => s.key);
  const index = keys.indexOf(selectedCategory);
  return (categories[index].subcategories);
}

const EditListingDescriptionFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        categories,
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
        filterConfig,
        accountType,
        initialValues
      } = formRenderProps;

      const titleMessage = intl.formatMessage({ id: 'EditListingDescriptionForm.title' });
      const titlePlaceholderMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.titlePlaceholder',
      });
      const titleRequiredMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.titleRequired',
      });
      const maxLengthMessage = intl.formatMessage(
        { id: 'EditListingDescriptionForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );

      const descriptionMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.description',
      });
      const descriptionPlaceholderMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.descriptionPlaceholder',
      });
      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);
      const descriptionRequiredMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.descriptionRequired',
      });

      const websiteMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.website',
      });
      const websitePlaceholderMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.websitePlaceholder',
      });
      const websiteRequiredMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.websiteRequired',
      });

      const categoryLabel = intl.formatMessage({
        id: 'EditListingDescriptionForm.categoryLabel',
      });
      const categoryPlaceholder = intl.formatMessage({
        id: 'EditListingDescriptionForm.categoryPlaceholder',
      });
      const categoryRequired = required(
        intl.formatMessage({
          id: 'EditListingDescriptionForm.categoryRequired',
        })
      );

      const subCategoryLabel = intl.formatMessage({
        id: 'EditListingDescriptionForm.subCategoryLabel',
      });
      const subCategoryPlaceholder = intl.formatMessage({
        id: 'EditListingDescriptionForm.subCategoryPlaceholder',
      });
      const subCategoryRequired = required(
        intl.formatMessage({
          id: 'EditListingDescriptionForm.subCategoryRequired',
        })
      );

      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const style_options = findOptionsForSelectFilter('style', filterConfig);
      const region_options = findOptionsForSelectFilter('region', filterConfig);
      const material_options = findOptionsForSelectFilter('material', filterConfig);

      // Logic used to change sub-category selections based on category. User needs to pick a category
      // before any sub-categories show up in the field.
      const category = initialValues && initialValues.category ? initialValues.category : null;
      if (category && !hasInitialized) {
        subcategories = getSubcategories(categories, category);
        hasInitialized = true;
      }

      const cat = document.getElementById('category');
      if (cat) {
        cat.addEventListener('change', () => {
          subcategories = getSubcategories(categories, cat.value);
        })
      }

      // Special account users need to provide a link for their items. These can be either ad accounts,
      // non-profit accounts, or premium account users. The link will be used in the ListingCard componenent.
      // Use accountType prop to check which type of account they have.
      const websiteLink = accountType && (accountType == "p" || accountType == "a" || accountType == "n") ?
        <FieldTextInput
          id="websiteLink"
          name="websiteLink"
          className={css.title}
          type="text"
          label={websiteMessage}
          placeholder={websitePlaceholderMessage}
          validate={composeValidators(required(websiteRequiredMessage))}
          autoFocus
        /> : null;
      
      // Ad account and non-profit account users are not selling physical products and do not need to 
      // fill in the optional fields category. They will not even have a listing page.
      // Use accountType prop to check which type of account they have. "n" for non-profits and "a" for ad accounts.
      const physicalItemFields = (accountType != "a" && accountType != "n") ?
        <div className={css.physicalItemFields}>
          <div className={css.midSection}>
            <div className={css.categories}>
              <FieldSelect
                className={css.category}
                name="category"
                id="category"
                label={categoryLabel}
                validate={categoryRequired}
              >
                {<option disabled value="">
                  {categoryPlaceholder}
                </option>}
                {categories.map(c => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </FieldSelect>
              <FieldSelect
                className={css.category}
                name="subcategory"
                id="subcategory"
                label={subCategoryLabel}
                validate={subCategoryRequired}
              >
                {<option disabled value="">
                  {subCategoryPlaceholder}
                </option>}
                {subcategories.map(s => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </FieldSelect>
            </div>
          </div>
          <h2 className={css.optionalHeader}>Optional Fields</h2>
          <div className={css.checkBoxes}>
            <div className={css.region}>
              <h2 className={css.checkTitle}>Region</h2>
              <h4>Please pick a region associated with your listing</h4>
              {region_options.map(option => (
                <div key={option.key}>
                  <FieldRadioButton
                    id={option.key}
                    name="region"
                    value={option.key}
                    label={option.label}
                    showAsRequired={pristine}
                  />
                </div>
              ))}
            </div>
            <div className={css.material}>
              <h2 className={css.checkTitle}>Material</h2>
              <h4>Please pick material(s) used in your listing</h4>
              <FieldCheckboxGroup
                id="material"
                name="material"
                options={material_options}
              />
            </div>
            <div className={css.style}>
              <h2 className={css.checkTitle}>Style</h2>
              <h4>Please pick a style for your listing</h4>
              {style_options.map(option => (
                <div key={option.key}>
                  <FieldRadioButton
                    id={option.key}
                    name="style"
                    value={option.key}
                    label={option.label}
                    showAsRequired={pristine}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={css.custom}>
            <h2 className={css.checkTitle}>Custom Orders</h2>
            <FieldBoolean
              id="customOrders"
              name="customOrders"
              label="Are custom orders available for this listing?"
              placeholder="Choose yes or no"
            />
          </div>
        </div>
        : null;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}
          <FieldTextInput
            id="title"
            name="title"
            className={css.title}
            type="text"
            label={titleMessage}
            placeholder={titlePlaceholderMessage}
            maxLength={TITLE_MAX_LENGTH}
            validate={composeValidators(required(titleRequiredMessage), maxLength60Message)}
            autoFocus
          />

          <FieldTextInput
            id="description"
            name="description"
            className={css.description}
            type="textarea"
            label={descriptionMessage}
            placeholder={descriptionPlaceholderMessage}
            validate={composeValidators(required(descriptionRequiredMessage))}
          />

          {websiteLink}
          {physicalItemFields}

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingDescriptionFormComponent.defaultProps = { className: null, fetchErrors: null, filterConfig: config.custom.filters, };

EditListingDescriptionFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  filterConfig: propTypes.filterConfig,
  // categories: arrayOf(
  //   shape({
  //     key: string.isRequired,
  //     label: string.isRequired,
  //   })
  // ),
};

export default compose(injectIntl)(EditListingDescriptionFormComponent);

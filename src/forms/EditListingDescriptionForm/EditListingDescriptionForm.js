import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { maxLength, required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput, FieldRadioButton, FieldCheckboxGroup, FieldBoolean, FieldSelect, FieldCheckbox } from '../../components';
import { findOptionsForSelectFilter } from '../../util/search';
import config from '../../config';
import arrayMutators from 'final-form-arrays';

import css from './EditListingDescriptionForm.module.css';

const TITLE_MAX_LENGTH = 60;
var subCategories = [];
var hasInitialized = false;

function getSubcategories(categories, selectedCategory) {
  const keys = categories.map(s => s.key);
  const index = keys.indexOf(selectedCategory);
  return (categories[index].subCategories);
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
        // allowsCustomOrders,
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

      const descriptionMessage = (accountType === 'a' || accountType === 'n') ? intl.formatMessage({
        id: 'EditListingDescriptionForm.descriptionAd'
      })
        : intl.formatMessage({
          id: 'EditListingDescriptionForm.description'
        });
      const descriptionPlaceholderMessage = (accountType === 'a' || accountType === 'n') ? intl.formatMessage({
        id: 'EditListingDescriptionForm.descriptionAdPlaceholder'
      })
        : intl.formatMessage({
          id: 'EditListingDescriptionForm.descriptionPlaceholder'
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

      const barterCheckboxLabel = intl.formatMessage({
        id: 'EditListingDescriptionForm.barterCheckboxLabel',
      });
      const barterMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.barterInputMessage',
      });
      const barterPlaceholderMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.barterPlaceholder',
      });
      const barterRequiredMessage = required(
        intl.formatMessage({
          id: 'EditListingDescriptionForm.barterRequired',
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

      const styleOptions = findOptionsForSelectFilter('style', filterConfig);
      const regionOptions = findOptionsForSelectFilter('region', filterConfig);
      const materialOptions = findOptionsForSelectFilter('material', filterConfig);

      // Logic used to change sub-category selections based on category. User needs to pick a category
      // before any sub-categories show up in the field. I'm not sure why, but the hasInitalized variable is 
      // needed for sub-categories to change when editing an already existing listing. 
      const category = initialValues && initialValues.category ? initialValues.category : null;
      if (category && !hasInitialized) {
        subCategories = getSubcategories(categories, category);
        hasInitialized = true;
      }
      // Code below works when editing an existing listing but subcategories will not update without the hasInitalized 
      // variable in the code above.
      const cat = document.getElementById('category');
      if (cat) {
        cat.addEventListener('change', () => {
          subCategories = getSubcategories(categories, cat.value);
        })
      }

      let showBarterBox;
      const checkbox = document.getElementById('allowsBarter');

      if (checkbox) {
        if (checkbox.checked) {
          showBarterBox = true;
        } else {
          showBarterBox = false;
        }
      };

      // Special account users need to provide a link for their items. These can be either ad accounts,
      // non-profit accounts, or premium account users. The link will be used in the ListingCard componenent.
      // ListingCards for ad and non-profit accounts will link directly to this link and premium accounts will have a listing page.
      // Use accountType prop to check which type of account they have. "p" for premium, "n" for non-profits and "a" for ad accounts.
      // TODO: add accountType for authors here
      const websiteLink = accountType && (accountType === "p" || accountType === "a" || accountType === "n") ?
        <FieldTextInput
          id="websiteLink"
          name="websiteLink"
          className={css.title}
          type="text"
          label={websiteMessage}
          placeholder={websitePlaceholderMessage}
          validate={composeValidators(required(websiteRequiredMessage))}
        /> : null;

      // Ad account and non-profit account users are not selling physical products and do not need to 
      // fill in the optional fields category. They will not even have a listing page.
      // Use accountType prop to check which type of account they have. "n" for non-profits and "a" for ad accounts.
      const physicalItemFields = (accountType !== "a" && accountType !== "n") ?
        <div className={css.physicalItemFields}>
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
              name="subCategory"
              id="subCategory"
              label={subCategoryLabel}
              validate={subCategoryRequired}
            >
              {<option disabled value="">
                {subCategoryPlaceholder}
              </option>}
              {subCategories.map(s => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </FieldSelect>
          </div>
          <h2 className={css.optionalHeader}>
            <FormattedMessage id="EditListingDescriptionForm.optionalFields" />
          </h2>
          <div className={css.checkBoxes}>
            <div className={css.region}>
              <h2 className={css.checkTitle}>
                <FormattedMessage id="EditListingDescriptionForm.regionTitle" />
              </h2>
              <h4>
                <FormattedMessage id="EditListingDescriptionForm.regionSubtitle" />
              </h4>
              {regionOptions.map(option => (
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
              <h2 className={css.checkTitle}>
                <FormattedMessage id="EditListingDescriptionForm.materialTitle" />
              </h2>
              <h4>
                <FormattedMessage id="EditListingDescriptionForm.materialSubtitle" />
              </h4>
              <FieldCheckboxGroup
                id="material"
                name="material"
                options={materialOptions}
              />
            </div>
            <div className={css.style}>
              <h2 className={css.checkTitle}>
                <FormattedMessage id="EditListingDescriptionForm.styleTitle" />
              </h2>
              <h4>
                <FormattedMessage id="EditListingDescriptionForm.styleSubtitle" />
              </h4>
              {styleOptions.map(option => (
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
          <div className={css.sizesAndCustom}>
            <div className={css.lastRow} >
              <h2 className={css.checkTitle}>
                <FormattedMessage id="EditListingDescriptionForm.sizesTitle" />
              </h2>
              <FieldTextInput
                id="sizes"
                name="sizes"
                type="text"
                label="What sizes are available for purchase?"
                placeholder="eg. S, M, L, XL..."
                maxLength={TITLE_MAX_LENGTH}
              />
            </div>
            <div className={css.lastRow} >
              <h2 className={css.checkTitle}>
                <FormattedMessage id="EditListingDescriptionForm.customOrdersTitle" />
              </h2>
              <FieldBoolean
                id="customOrders"
                name="customOrders"
                label="Can customers contact you about custom orders?"
                placeholder="Choose yes/no"
              />
            </div>
          </div>
          {accountType === 'e' ? (
            <div className={css.barterSection}>
              <h2 className={css.checkTitle}>
                <FormattedMessage id="EditListingDescriptionForm.barterTitle" />
              </h2>
              <FieldCheckbox
                id="allowsBarter"
                name="allowsBarter"
                label={barterCheckboxLabel}
                value="hasBarter"
                className={css.barterCheckbox}
              />
              {showBarterBox ?
                <FieldTextInput
                  id="barter"
                  name="barter"
                  className={css.barter}
                  type="textarea"
                  label={barterMessage}
                  placeholder={barterPlaceholderMessage}
                  validate={barterRequiredMessage}
                /> : null}
            </div>) : null}
        </div>
        : (
          <div className={css.physicalItemFields}>
            <h2 className={css.optionalHeader}>
              <FormattedMessage id="EditListingDescriptionForm.optionalFields" />
            </h2>
            <div className={css.checkBoxes}>
              <div className={css.region}>
                <h2 className={css.checkTitle}>
                  <FormattedMessage id="EditListingDescriptionForm.regionTitle" />
                </h2>
                <h4>
                  <FormattedMessage id="EditListingDescriptionForm.regionSubtitle" />
                </h4>
                {regionOptions.map(option => (
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
            </div>
          </div>
        );


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
            maxLength={400}
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

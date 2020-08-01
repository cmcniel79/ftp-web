import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';

import css from './EditListingDescriptionForm.css';
import { pick } from 'lodash';

const CustomCategorySelectFieldMaybe = props => {
  const { name, id, categories, intl } = props;
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

  var subCat = [];
  var validateSub = subCategoryRequired;
  const cat = document.getElementById('category');
  const subs = document.getElementById('subCategory');

  if (cat != null) {                                  // on change eventlistener is attached
    cat.addEventListener('change', () => {            // getting value
      if(subs.options.length > 1){
      for(var k = subs.options.length-1; k > 0; k--){
        subs.options[k] = null;
      }
    }
      var val = cat.value;
      if (val != "Other") {
        for (var i = 0; i < categories.length - 1; i++) {
          if (categories[i].label == val) {
            subCat = categories[i].subCategories;
            for (var j = 0; j < subCat.length; j++) {
              subs.options[j + 1] = new Option(subCat[j].label, subCat[j].key);
            }
          }
        }
      } else {
          subs.options[1] = new Option("No Subcategory");
      }
    })
  }
  

  return categories ? (
    <div>
      <FieldSelect
        className={css.category}
        name={name}
        id={id}
        label={categoryLabel}
        validate={categoryRequired}
      >
        {<option disabled value="">
          {categoryPlaceholder}
        </option>}
        {categories.map(c => (
          <option key={c.key} value={c.value}>
            {c.label}
          </option>
        ))}
      </FieldSelect>
      <FieldSelect
        className={css.category}
        name="subCategory"
        id="subCategory"
        label={subCategoryLabel}
        validate={validateSub}
      >
        {<option disabled value="">
          {subCategoryPlaceholder}
        </option>}
      </FieldSelect>
    </div>
  ) : null;
};

export default CustomCategorySelectFieldMaybe;

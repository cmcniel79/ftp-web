import React from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { Form, FieldSelect, PrimaryButton } from '../../components';

import css from './StateSelectionForm.css';

const stateOptions = [
  { key: "AL", label: "Alabama" },
  { key: "AK", label: "Alaska" },
  { key: "AZ", label: "Arizona" },
  { key: "AR", label: "Arkansas" },
  { key: "CA", label: "California" },
  { key: "CO", label: "Colorado" },
  { key: "CT", label: "Connecticut" },
  { key: "DE", label: "Delaware" },
  { key: "FL", label: "Florida" },
  { key: "GA", label: "Georgia" },
  { key: "HI", label: "Hawaii" },
  { key: "ID", label: "Idaho" },
  { key: "IL", label: "Illinois" },
  { key: "IN", label: "Indiana" },
  { key: "IA", label: "Iowa" },
  { key: "KS", label: "Kansas" },
  { key: "KY", label: "Kentucky" },
  { key: "LA", label: "Louisiana" },
  { key: "ME", label: "Maine" },
  { key: "MD", label: "Maryland" },
  { key: "MA", label: "Massachusetts" },
  { key: "MI", label: "Michigan" },
  { key: "MN", label: "Minnesota" },
  { key: "MS", label: "Mississippi" },
  { key: "MO", label: "Missouri" },
  { key: "MT", label: "Montana" },
  { key: "NE", label: "Nebraska" },
  { key: "NV", label: "Nevada" },
  { key: "NH", label: "New Hampshire" },
  { key: "NJ", label: "New Jersey" },
  { key: "NM", label: "New Mexico" },
  { key: "NY", label: "New York" },
  { key: "NC", label: "North Carolina" },
  { key: "ND", label: "North Dakota" },
  { key: "OH", label: "Ohio" },
  { key: "OK", label: "Oklahoma" },
  { key: "OR", label: "Oregon" },
  { key: "PA", label: "Pennsylvania" },
  { key: "RI", label: "Rhode Island" },
  { key: "SC", label: "South Carolina" },
  { key: "SD", label: "South Dakota" },
  { key: "TN", label: "Tennessee" },
  { key: "TX", label: "Texas" },
  { key: "UT", label: "Utah" },
  { key: "VT", label: "Vermont" },
  { key: "VA", label: "Virgina" },
  { key: "WA", label: "Washington" },
  { key: "WV", label: "West Virgina" },
  { key: "WI", label: "Wisconsin" },
  { key: "WY", label: "Wyoming" },
];

const StateSelectionFormComponent = props => (
      <FinalForm
        {...props}
        render={formRenderProps => {
          const { rootClassName, className, handleSubmit } = formRenderProps;
          const classes = classNames(rootClassName, className);

          return (
            <Form className={classes} onChange={handleSubmit}>
              <FieldSelect
                id="state"
                name="state"
                className={css.field}
                label="State/Province"
              >
                <option disabled value="">
                  Select a state
                </option>
                {stateOptions.map(s => {
                  return (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  );
                })}
              </FieldSelect>
            </Form>
          );
        }}
      />
    );

const { func, string, bool } = PropTypes;

StateSelectionFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
};

StateSelectionFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  onSubmit: func.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const StateSelectionForm = injectIntl(StateSelectionFormComponent);

export default StateSelectionForm;
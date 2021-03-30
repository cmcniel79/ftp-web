import React from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { Form, FieldSelect } from '../../components';
import getStateCodes from '../../translations/stateCodes';

import css from './StateSelectionForm.module.css';

const StateSelectionFormComponent = props => (
      <FinalForm
        {...props}
        render={formRenderProps => {
          const { 
            rootClassName, 
            className, 
            handleSubmit, 
            intl,
            showLocationFilter
           } = formRenderProps;
          const classes = classNames(rootClassName, className);
          const allStatesOption = intl.formatMessage({ id:'StateSelectionForm.allStates' });
          const allDatesOption = intl.formatMessage({ id:'StateSelectionForm.allDates' });
          const stateOptions = getStateCodes();
          const monthOptions = [
            { key: "01", label: "January" },
            { key: "02", label: "February" },
            { key: "03", label: "March" },
            { key: "04", label: "April" },
            { key: "05", label: "May" },
            { key: "06", label: "June" },
            { key: "07", label: "July" },
            { key: "08", label: "August" },
            { key: "09", label: "September" },
            { key: "10", label: "October" },
            { key: "11", label: "November" },
            { key: "12", label: "December" },
          ];
          return (
            <Form className={classes} onChange={handleSubmit}>
              {showLocationFilter ? (
              <FieldSelect
                id="state"
                name="state"
                className={css.field}
                label="State/Province"
              >
                <option value="all">
                  {allStatesOption}
                </option>
                {stateOptions.map(s => {
                  return (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  );
                })}
              </FieldSelect>
              ) : null }
              <FieldSelect
                id="month"
                name="month"
                className={css.field}
                label="Month"
              >
                <option value="all">
                  {allDatesOption}
                </option>
                {monthOptions.map(s => {
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

const { func, string } = PropTypes;

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
import React from 'react';
import PropTypes from 'prop-types';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { Form, FieldSelect } from '../../components';
import getStateCodes from '../../translations/stateCodes';

import css from './StateSelectionForm.css';

const StateSelectionFormComponent = props => (
      <FinalForm
        {...props}
        render={formRenderProps => {
          const { rootClassName, className, handleSubmit, intl } = formRenderProps;
          const classes = classNames(rootClassName, className);
          const allEventsOption = intl.formatMessage({ id:'StateSelectionForm.allEvents' });
          const stateOptions = getStateCodes();

          return (
            <Form className={classes} onChange={handleSubmit}>
              <FieldSelect
                id="state"
                name="state"
                className={css.field}
                label="State/Province"
              >
                <option value="all">
                  {allEventsOption}
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
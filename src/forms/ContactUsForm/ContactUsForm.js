import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Form as FinalForm } from 'react-final-form';
import { composeValidators, required, emailFormatValid } from '../../util/validators';
import { Form, PrimaryButton, FieldTextInput, FieldSelect } from '../../components';


import css from './ContactUsForm.css';

class ContactUsFormComponent extends Component {
    constructor(props) {
        super(props);
        this.submittedValues = {};
    }

    render() {
        return (
            <FinalForm
                {...this.props}
                render={fieldRenderProps => {
                    const {
                        className,
                        formId,
                        // handleSubmit,
                        inProgress,
                        intl,
                        disabled,
                        ready,
                        values,
                        invalid,
                        pristine,
                        updated,
                    } = fieldRenderProps;

                    // email
                    const emailLabel = intl.formatMessage({ id: 'ContactUsForm.emailLabel' });
                    const emailPlaceholder = intl.formatMessage({ id: 'ContactUsForm.emailPlaceholder' });
                    const emailRequiredMessage = intl.formatMessage({ id: 'ContactUsForm.emailRequired' });
                    const emailRequired = required(emailRequiredMessage);
                    const emailInvalidMessage = intl.formatMessage({ id: 'ContactUsForm.emailInvalid' });
                    const emailValid = emailFormatValid(emailInvalidMessage);

                    // firstName
                    const firstNameLabel = intl.formatMessage({ id: 'ContactUsForm.firstNameLabel' });
                    const firstNamePlaceholder = intl.formatMessage({ id: 'ContactUsForm.firstNamePlaceholder' });
                    const firstNameRequiredMessage = intl.formatMessage({ id: 'ContactUsForm.firstNameRequired' });
                    const firstNameRequired = required(firstNameRequiredMessage);

                    // lastName
                    const lastNameLabel = intl.formatMessage({ id: 'ContactUsForm.lastNameLabel' });
                    const lastNamePlaceholder = intl.formatMessage({ id: 'ContactUsForm.lastNamePlaceholder' });
                    const lastNameRequiredMessage = intl.formatMessage({ id: 'ContactUsForm.lastNameRequired' });
                    const lastNameRequired = required(lastNameRequiredMessage);

                    // message
                    const messageLabel = intl.formatMessage({ id: 'ContactUsForm.messageLabel' });
                    const messagePlaceholder = intl.formatMessage({ id: 'ContactUsForm.messagePlaceholder' });
                    const messageRequiredMessage = intl.formatMessage({ id: 'ContactUsForm.messageRequired' });
                    const messageRequired = required(messageRequiredMessage);

                    //subject
                    const subjectLabel = intl.formatMessage({ id: 'ContactUsForm.subjectLabel' });
                    const subjectPlaceholder = intl.formatMessage({ id: 'ContactUsForm.subjectPlaceholder' });
                    const subjectRequiredMessage = intl.formatMessage({ id: 'ContactUsForm.subjectRequired' });
                    const subjectRequired = required(subjectRequiredMessage);
                    const subjectOptions = [
                        { key: "seller", label: "Apply for a Seller account" },
                        { key: "premium", label: "Apply for a Premium, Non-Profit or Ad account" },
                        { key: "verify", label: "Begin tribal enrollment verification" },
                        { key: "question", label: "General Questions" },
                        { key: "feedback", label: "Website Feedback" },
                    ];

                    const submitDisabled = invalid || disabled;
                    const submitReady = (updated && pristine) || ready;

                    return (
                        <Form
                            onSubmit={e => {
                                this.submittedValues = values;
                                console.log(e);
                                // handleSubmit(e);
                            }}
                        >
                            <div className={css.inputSection}>
                                <div className={css.formRow}>
                                    <FieldTextInput
                                        id="firstName"
                                        name="firstName"
                                        className={css.firstName}
                                        type="textarea"
                                        label={firstNameLabel}
                                        placeholder={firstNamePlaceholder}
                                        validate={firstNameRequired}
                                    />
                                    <FieldTextInput
                                        id="lastName"
                                        name="lastName"
                                        className={css.lastName}
                                        type="textarea"
                                        label={lastNameLabel}
                                        placeholder={lastNamePlaceholder}
                                        validate={lastNameRequired}
                                    />
                                </div>
                                <FieldTextInput
                                    id="email"
                                    name="email"
                                    className={css.field}
                                    type="textarea"
                                    label={emailLabel}
                                    placeholder={emailPlaceholder}
                                    validate={composeValidators(emailRequired, emailValid)}
                                />
                                <FieldSelect
                                    className={css.field}
                                    name="subject"
                                    id="subject"
                                    label={subjectLabel}
                                    validate={subjectRequired}
                                >
                                    {<option disabled value="">
                                        {subjectPlaceholder}
                                    </option>}
                                    {subjectOptions.map(c => (
                                        <option key={c.key} value={c.key}>
                                            {c.label}
                                        </option>
                                    ))}
                                </FieldSelect>
                                <FieldTextInput
                                    id="message"
                                    name="message"
                                    className={css.field}
                                    type="textarea"
                                    label={messageLabel}
                                    placeholder={messagePlaceholder}
                                    validate={messageRequired}
                                />
                            </div>

                            <div className={css.bottomWrapper}>
                                <PrimaryButton
                                    type="submit"
                                    className={css.submitButton}
            disabled={submitDisabled}
            ready={submitReady}

                                >
                                    <FormattedMessage id="ContactUsForm.sendMessage" />
                                </PrimaryButton>
                            </div>
                        </Form>
                    );
                }}
            />
        );
    }
}

ContactUsFormComponent.defaultProps = {
    rootClassName: null,
    className: null,
    formId: null,
};

const { bool, func, string } = PropTypes;

ContactUsFormComponent.propTypes = {
    rootClassName: string,
    className: string,
    formId: string,
    intl: intlShape.isRequired,

};

const ContactUsForm = compose(injectIntl)(ContactUsFormComponent);

ContactUsForm.displayName = 'ContactUsForm';

export default ContactUsForm;

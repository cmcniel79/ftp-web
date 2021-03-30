import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { Form as FinalForm } from 'react-final-form';
import { composeValidators, required, emailFormatValid } from '../../util/validators';
import { Form, PrimaryButton, FieldTextInput, FieldSelect } from '../../components';


import css from './ContactUsForm.module.css';

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
                        handleSubmit,
                        intl,
                        disabled,
                        ready,
                        values,
                        invalid,
                        pristine,
                        updated,
                        sendingInProgress
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
                        { key: "selling", label: "Apply for a Seller, Premium, Non-Profit or Ad account" },
                        { key: "event hosting", label: "Hosting your event on From The People" },
                        { key: "native maps", label: "Submit Native language information for a Map location" },
                        { key: "refunds", label: "Request a refund" },
                        { key: "reporting", label: "Report an Indian Arts and Crafts Act Violation" },
                        { key: "website feedback", label: "Website Feedback and General Questions" },
                    ];

                    const submitDisabled = invalid || disabled || sendingInProgress;
                    const submitReady = (updated && pristine) || ready;

                    return (
                        <Form
                            onSubmit={e => {
                                this.submittedValues = values;
                                handleSubmit(e);
                            }}
                        >
                            <div className={css.inputs}>
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
                                    inProgress={sendingInProgress}
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

const { 
    // bool, 
    // func, 
    string 
} = PropTypes;

ContactUsFormComponent.propTypes = {
    rootClassName: string,
    className: string,
    formId: string,
    intl: intlShape.isRequired,

};

const ContactUsForm = compose(injectIntl)(ContactUsFormComponent);

ContactUsForm.displayName = 'ContactUsForm';

export default ContactUsForm;

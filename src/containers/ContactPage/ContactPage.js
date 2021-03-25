import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { TopbarContainer } from '..';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  // ExternalLink,
  Page
} from '../../components';
import { ContactUsForm } from '../../forms';
import { 
  FormattedMessage, 
  injectIntl, 
  // intlShape 
} from '../../util/reactIntl';
import { sendEmail } from './ContactPage.duck';

import css from './ContactPage.module.css';

export class ContactPageComponent extends Component {

  render() {
    const {
      currentUser,
      sendingInProgress,
      sendingEmailError,
      onSendEmail,
      sendingSuccess
    } = this.props;

    const handleSubmit = (values) => {
      const payload = {
        isCurrentUser: currentUser ? true : false,
        ...values
      };
      onSendEmail(payload);
    }

    return (
      <Page className={css.root} title="Contact Page" scrollingDisabled={false}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>

          <LayoutWrapperMain className={css.staticPageWrapper}>
            <div className={css.formSection}>
              <h1 className={css.pageTitle}>
                <FormattedMessage id="ContactPage.heading" />
              </h1>
              {!sendingSuccess && !sendingEmailError ?
                <div>
                  <h3>
                    <FormattedMessage id="ContactPage.subheading" />
                  </h3>
                  <ContactUsForm
                    onSubmit={handleSubmit}
                    sendingInProgress={sendingInProgress}
                  />
                </div>
                : sendingSuccess && !sendingEmailError ?
                  <div>
                    <h3>
                      <FormattedMessage id="ContactPage.submitSuccess" />
                    </h3>
                  </div>
                  : !sendingSuccess && sendingEmailError ?
                    <div>
                      <h3>
                        <FormattedMessage id="ContactPage.submitFail" />
                      </h3>
                    </div>
                    : <div>
                      <h3>
                        <FormattedMessage id="ContactPage.submitFail" />
                      </h3>
                    </div>}
            </div>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const {
    sendingInProgress,
    sendingEmailError,
    sendingSuccess
  } = state.ContactPage;
  return {
    currentUser,
    sendingInProgress,
    sendingEmailError,
    sendingSuccess,
  };
};

const mapDispatchToProps = dispatch => ({
  onSendEmail: data => dispatch(sendEmail(data)),
});

const ContactPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(ContactPageComponent);

export default ContactPage;

import React, { Component } from 'react';
import { compose } from 'redux';
import { TopbarContainer } from '..';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  // ExternalLink,
  NamedLink,
  Page
} from '../../components';
import css from './EventsPage.css';

export class EventsPageComponent extends Component {

  render() {
    return (
      <Page className={css.root} title="Events Page" scrollingDisabled={false}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>

          <LayoutWrapperMain className={css.staticPageWrapper}>
              <h1 className={css.pageTitle}>
                {/* <FormattedMessage id="ContactPage.heading" /> */}
                Events
              </h1>
              <NamedLink name="PowwowPage" params={{host:"stanford"}}>
                Go to stanford powwow
                </NamedLink>
          </LayoutWrapperMain>
          <LayoutWrapperFooter>
            <Footer />
          </LayoutWrapperFooter>
        </LayoutSingleColumn>
      </Page>
    );
  }
};

// const mapStateToProps = state => {
//   const { currentUser } = state.user;
//   const {
//     sendingInProgress,
//     sendingEmailError,
//     sendingSuccess
//   } = state.ContactPage;
//   return {
//     currentUser,
//     sendingInProgress,
//     sendingEmailError,
//     sendingSuccess,
//   };
// };

// const mapDispatchToProps = dispatch => ({
//   onSendEmail: data => dispatch(sendEmail(data)),
// });

const EventsPage = compose(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   ),
//   injectIntl
)(EventsPageComponent);

export default EventsPage;

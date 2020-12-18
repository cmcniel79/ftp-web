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
import {
  FormattedMessage,
} from '../../util/reactIntl';
import stanfordImage from '../../assets/stanford-bg.jpg';
import forward from '../../assets/forward.svg';
import back from '../../assets/back.svg';
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
            <h1 className={css.pageSectionTitle}>
              <FormattedMessage id="EventsPage.powwows"/>
            </h1>

            <div className={css.powwowSection}>
              <button className={css.backButtonDesktop}>
                <img className={css.chevron} src={back} alt="chevron" />
              </button>
              <div className={css.powwowCard}>
                <div className={css.powwowImageWrapper}>
                  <NamedLink className={css.powwowLink} name="PowwowPage" params={{ host: "stanford" }}>
                    <img className={css.powwowImage} src={stanfordImage} alt="stanford" />
                    <div className={css.powwowTitle}>
                      <FormattedMessage id="EventsPage.stanfordPowwow" />
                    </div>
                  </NamedLink>
                </div>
                <div className={css.powwowSubtitle}>
                  <FormattedMessage id="EventsPage.powwowCardInfo" values={{ eventName: "Stanford Powwow", date: "May 5th-7th" }}/>
                </div>
              </div>
              <button className={css.forwardButtonDesktop}>
                <img className={css.chevron} src={forward} alt="chevron" />
              </button>
            </div>

            <h1 className={css.pageSectionTitle}>
              <FormattedMessage id="EventsPage.virtual" />
            </h1>
            <div className={css.powwowSection}>
              <button className={css.backButtonDesktop}>
                <img className={css.chevron} src={back} alt="chevron" />
              </button>
              <button className={css.forwardButtonDesktop}>
                <img className={css.chevron} src={forward} alt="chevron" />
              </button>
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

const EventsPage = compose(
)(EventsPageComponent);

export default EventsPage;

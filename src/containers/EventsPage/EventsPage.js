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
  NamedLink,
  Page
} from '../../components';
import {
  FormattedMessage,
} from '../../util/reactIntl';
import stanfordImage from '../../assets/stanford-bg.jpg';
import css from './EventsPage.css';
import EventSection from './EventSection';
import bed from '../../assets/bed.svg';
import people from '../../assets/people.svg';
import fitness from '../../assets/fitness.svg';
import { loadData } from './EventsPage.duck';

export class EventsPageComponent extends Component {

  componentDidMount() {
    if (window) {
      this.props.onLoadData();
    }
  }

  render() {
    const {
      exampleEvents,
    } = this.props;
    console.log(exampleEvents);
    const contactPageLink = <NamedLink name="ContactPage">
      <FormattedMessage id="EventsPage.contactLink" />
    </NamedLink>;

    // I do not know why the length of the events list in section carousel is only 2,
    // so I am passing in the length here
    return (
      <Page className={css.root} title="Events Page" scrollingDisabled={false}>
        <LayoutSingleColumn>
          <LayoutWrapperTopbar>
            <TopbarContainer />
          </LayoutWrapperTopbar>

          <LayoutWrapperMain className={css.staticPageWrapper}>
            {exampleEvents ?
              <div>
                <EventSection events={exampleEvents.filter(e => e.eventType === "powwow")} eventType="powwow" />
                <EventSection events={exampleEvents.filter(e => e.eventType === "virtual")} eventType="virtual" />
              </div>
              : null}
            <div className={css.addEvent}>
              <h3 className={css.addEventInfo}>
                <FormattedMessage id="EventsPage.addAnEvent" values={{ link: contactPageLink }} />
              </h3>
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
  const {
    exampleEvents,
  } = state.EventsPage;
  return {
    exampleEvents
  };
};

const mapDispatchToProps = dispatch => ({
  onLoadData: () => dispatch(loadData()),
});

const EventsPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EventsPageComponent);

export default EventsPage;

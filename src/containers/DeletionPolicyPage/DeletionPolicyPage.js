import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import { TopbarContainer } from '..';
import {
  Page,
  LayoutSideNavigation,
  LayoutWrapperMain,
  LayoutWrapperSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperFooter,
  Footer,
  NamedLink,
} from '../../components';
import config from '../../config';

import css from './DeletionPolicyPage.module.css';

const DeletionPolicyPageComponent = props => {
  const { scrollingDisabled, intl } = props;

  const tabs = [
    {
      text: intl.formatMessage({ id: 'DeletionPolicyPage.privacyTabTitle' }),
      selected: false,
      linkProps: {
        name: 'PrivacyPolicyPage',
      },
    },
    {
      text: intl.formatMessage({ id: 'DeletionPolicyPage.tosTabTitle' }),
      selected: false,
      linkProps: {
        name: 'TermsOfServicePage',
      },
    },
    {
      text: intl.formatMessage({ id: 'DeletionPolicyPage.deletionTabTitle' }),
      selected: true,
      linkProps: {
        name: 'DeletionPolicyPage',
      },
    },
  ];

  const siteTitle = config.siteTitle;
  const schemaTitle = intl.formatMessage({ id: 'DeletionPolicyPage.schemaTitle' }, { siteTitle });
  const schema = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    name: schemaTitle,
  };
  const contactPageLink = (
    <NamedLink name="ContactPage">
      <FormattedMessage id="DeletionPolicyPage.contactLink" />
    </NamedLink>
  );

  return (
    <Page title={schemaTitle} scrollingDisabled={scrollingDisabled} schema={schema}>
      <LayoutSideNavigation>
        <LayoutWrapperTopbar>
          <TopbarContainer currentPage="DeletionPolicyPage" />
        </LayoutWrapperTopbar>
        <LayoutWrapperSideNav tabs={tabs} />
        <LayoutWrapperMain>
          <div className={css.content}>
            <h1 className={css.heading}>
              <FormattedMessage id="DeletionPolicyPage.heading" />
            </h1>
            <p>
              <FormattedMessage id="DeletionPolicyPage.updateDate" />
            </p>
            <p>
              <FormattedMessage id="DeletionPolicyPage.deletionInstructions" values={{ link: contactPageLink }}/>
            </p>
          </div>
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSideNavigation>
    </Page>
  );
};

const { bool } = PropTypes;

DeletionPolicyPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  return {
    scrollingDisabled: isScrollingDisabled(state),
  };
};

const DeletionPolicyPage = compose(
  connect(mapStateToProps),
  injectIntl
)(DeletionPolicyPageComponent);

export default DeletionPolicyPage;

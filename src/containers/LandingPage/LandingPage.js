import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import { FormattedMessage } from '../../util/reactIntl';
import config from '../../config';
import {
  Page,
  SectionHero,
  SectionHowItWorks,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  SectionThumbnailLinks,
  ExternalLink
} from '../../components';
import { TopbarContainer } from '../../containers';
import facebookImage from '../../assets/SocialMedia-791x791.png';
import twitterImage from '../../assets/SocialMedia-791x791.png';
import jewelryImage from './images/jewelry.jpg';
import artImage from './images/art.jpg';
import apparelImage from './images/apparel.jpg';
import traditionalImage from './images/traditional.jpg';

import css from './LandingPage.css';

import { createListing, fakeIntl } from '../../util/test-data';
import { ListingCardComponent } from '../../components/ListingCard/ListingCard';

export const LandingPageComponent = props => {
  const { history, intl, location, scrollingDisabled } = props;

  // Schema for search engines (helps them to understand what this page is about)
  // http://schema.org
  // We are using JSON-LD format
  const siteTitle = config.siteTitle;
  const schemaTitle = intl.formatMessage({ id: 'LandingPage.schemaTitle' }, { siteTitle });
  const schemaDescription = intl.formatMessage({ id: 'LandingPage.schemaDescription' });
  const schemaImage = `${config.canonicalRootURL}${facebookImage}`;

  return (
    <Page
      className={css.root}
      scrollingDisabled={scrollingDisabled}
      contentType="website"
      description={schemaDescription}
      title={schemaTitle}
      facebookImages={[{ url: facebookImage, width: 1200, height: 630 }]}
      twitterImages={[
        { url: `${config.canonicalRootURL}${twitterImage}`, width: 600, height: 314 },
      ]}
      schema={{
        '@context': 'http://schema.org',
        '@type': 'WebPage',
        description: schemaDescription,
        name: schemaTitle,
        image: [schemaImage],
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>
        <LayoutWrapperMain>
          <div className={css.heroContainer}>
            <SectionHero className={css.hero} history={history} location={location} />
          </div>
          <ul className={css.sections}>

            <li className={css.section}>
              <div className={css.sectionContent}>
                <SectionThumbnailLinks
                  linksPerRow={2}
                  links={[
                    {
                      imageUrl: jewelryImage,
                      imageAltText: 'Link 1',
                      linkProps: { type: 'ExternalLink', href: 'http://example.com/1' },
                      text: 'Jewelry',
                    },
                    {
                      imageUrl: artImage,
                      imageAltText: 'Link 2',
                      linkProps: { type: 'ExternalLink', href: 'http://example.com/2' },
                      text: 'Art',
                    },
                    {
                      imageUrl: apparelImage,
                      imageAltText: 'Link 3',
                      linkProps: { type: 'ExternalLink', href: 'http://example.com/3' },
                      text: 'Apparel',
                    },
                    {
                      imageUrl: traditionalImage,
                      imageAltText: 'Link 4',
                      linkProps: { type: 'ExternalLink', href: 'http://example.com/3' },
                      text: 'Traditional',
                    },
                  ]}
                  heading='Featured Categories'
                  subHeading=' '
                />
              </div>
            </li>

            <li className={css.section}>
              <div className={css.sectionContent}>
                <h2 className={css.featuredListingsTitle}>
                  Featured Listings
                </h2>
                <div className={css.featuredListings}>
                  <ListingCardComponent className={css.listingCard}
                    intl={fakeIntl}
                    listing={createListing('featuredList1', { title: "Test 1" }, {})}
                  />
                  <ListingCardComponent className={css.listingCard}
                    intl={fakeIntl}
                    listing={createListing('featuredList2', { title: "Test 2" }, {})}
                  />
                  <ListingCardComponent className={css.listingCard}
                    intl={fakeIntl}
                    listing={createListing('featuredList3', { title: "Test 3" }, {})}
                  />
                  <ListingCardComponent className={css.listingCard}
                    intl={fakeIntl}
                    listing={createListing('featuredList4', { title: "Test 4" }, {})}
                  />
                  <ListingCardComponent className={css.listingCard}
                    intl={fakeIntl}
                    listing={createListing('featuredList5', { title: "Test 5" }, {})}
                  />
                  <ListingCardComponent className={css.listingCard}
                    intl={fakeIntl}
                    listing={createListing('featuredList6', { title: "Test 6" }, {})}
                  />
                </div>
              </div>
            </li>

            <li className={css.section}>
              <div className={css.sectionContent}>
                <h2 className={css.donateTitle}>
                  From The People is Committed to Representing Indigenous Peoples and Supporting Our Movements
                  </h2>
                <div className={css.donateText}>
                  <div className={css.donateSubText}>
                    <h2>
                      Coronavirus Relief Efforts
                      </h2>
                    <p>
                      For the next three months From The People will be donating all profits
                      to help tribes fight COVID-19 in Indian Country
                      </p>
                    <button className={css.donateButton}>
                      <ExternalLink
                        target="https://www.firstnations.org/covid-19-emergency-response-fund/"
                        className={css.buttonText}>
                        <FormattedMessage id="LandingPage.covidButton" />
                      </ExternalLink>
                    </button>
                  </div>

                  <div className={css.donateSubText}>
                    <h2>
                      Missing and Murdered Indigenous Womxn, Girls and Two Spirit
                      </h2>
                    <p>
                      After providing COVID-19 relief to tribes, From The People will be
                      donating a percentage of our profits to the Coalition to Stop
                      Violence Against Native Women.
                      </p>
                    <button className={css.donateButton}>
                      <ExternalLink 
                        target="https://www.csvanw.org/mmiw/"
                        className={css.buttonText}>
                        <FormattedMessage id="LandingPage.mmiwButton" />
                      </ExternalLink>
                    </button>
                  </div>
                </div>
              </div>
            </li>


            <li className={css.section}>
              <div className={css.sectionContent}>
                <SectionHowItWorks />
              </div>
            </li>


          </ul>
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </Page>
  );
};

const { bool, object } = PropTypes;

LandingPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,

  // from withRouter
  history: object.isRequired,
  location: object.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  return {
    scrollingDisabled: isScrollingDisabled(state),
  };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const LandingPage = compose(
  withRouter,
  connect(mapStateToProps),
  injectIntl
)(LandingPageComponent);

export default LandingPage;

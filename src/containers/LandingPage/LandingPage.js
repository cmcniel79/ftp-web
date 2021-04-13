import React from 'react';
import PropTypes, { array } from 'prop-types';
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
  FeaturedPartners,
  Footer,
  SectionThumbnailLinks,
  ExternalLink,
  ListingCard
} from '../../components';
import { TopbarContainer } from '../../containers';
import facebookImage from '../../assets/square_400x400.png';
import twitterImage from '../../assets/square_400x400.png';
import jewelryImage from './images/jewelry.png';
import artImage from './images/art.png';
import apparelImage from './images/apparel.png';
import traditionalImage from './images/traditional.png';
import { getListingsById, getMarketplaceEntities } from '../../ducks/marketplaceData.duck';

import css from './LandingPage.module.css';

export const LandingPageComponent = props => {

  const { history, intl, location, scrollingDisabled, listings, users } = props;
  // Schema for search engines (helps them to understand what this page is about)
  // http://schema.org
  // We are using JSON-LD format
  const siteTitle = config.siteTitle;
  const schemaTitle = intl.formatMessage({ id: 'LandingPage.schemaTitle' }, { siteTitle });
  const schemaDescription = intl.formatMessage({ id: 'LandingPage.schemaDescription' });
  const schemaImage = `${config.canonicalRootURL}${facebookImage}`;

  // Only want to show featured listings if we have 6
  const hasListings = props.listings && props.listings.length === 6;

  // Only want Featured Users with full profiles
  const completeUsers = users && users.length > 0 ?
    users.filter(user => user.profileImage && user.profileImage.id && !user.attributes.banned && !user.attributes.deleted &&
      user.attributes.profile.bio && user.attributes.profile.bio.length > 150) : null;

  return (
    <Page
      className={css.root}
      scrollingDisabled={scrollingDisabled}
      contentType="website"
      description={schemaDescription}
      title={schemaTitle}
      facebookImages={[{ url: facebookImage, width: 300, height: 300 }]}
      twitterImages={[
        { url: `${config.canonicalRootURL}${twitterImage}`, width: 300, height: 300 },
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
          <SectionHero className={css.hero} history={history} location={location} />
          <ul className={css.sections}>
            <li className={css.section}>
              <div className={css.sectionContent}>
                <SectionThumbnailLinks
                  linksPerRow={2}
                  links={[
                    {
                      imageUrl: jewelryImage,
                      imageAltText: 'Jewelry',
                      linkProps: {
                        type: 'NamedLink', name: 'SearchPage', to: {
                          search: '?pub_subCategory=necklaces&pub_subCategory=earrings&pub_subCategory=rings&pub_subCategory=bracelets&pub_subCategory=anklets'
                        }
                      },
                      text: 'Jewelry',
                    },
                    {
                      imageUrl: artImage,
                      imageAltText: 'Art',
                      linkProps: {
                        type: 'NamedLink', name: 'SearchPage', to: {
                          search: '?pub_subCategory=paintings&pub_subCategory=beadwork&pub_subCategory=photo&pub_subCategory=prints&pub_subCategory=stickers&pub_subCategory=carvings&pub_subCategory=baskets&pub_subCategory=rugs'
                        }
                      },
                      text: 'Art',
                    },
                    {
                      imageUrl: traditionalImage,
                      imageAltText: 'Traditional',
                      linkProps: {
                        type: 'NamedLink', name: 'SearchPage', to: {
                          search: '?pub_subCategory=botanicals&pub_subCategory=regalia'
                        }
                      },
                      text: 'Traditional Assortments',
                    },
                    {
                      imageUrl: apparelImage,
                      imageAltText: 'Apparel',
                      linkProps: {
                        type: 'NamedLink', name: 'SearchPage', to: {
                          search: '?pub_subCategory=tops&pub_subCategory=bottoms&pub_subCategory=dresses&pub_subCategory=shoes'
                        }
                      },
                      text: 'Apparel',
                    },
                  ]}
                  heading='Popular Categories'
                />
              </div>
            </li>
            {completeUsers && completeUsers.length > 0 ?
              <li className={css.section} id="featured-partners">
                <div className={css.sectionContent}>
                  <FeaturedPartners
                    users={completeUsers}
                  />
                </div>
              </li> : null}
            {hasListings ? (
              <li className={css.section}>
                <div className={css.sectionContent}>
                  <h2 className={css.customSectionTitle}>
                    <FormattedMessage id="LandingPage.listingsTitle" />
                  </h2>
                  <div className={css.featuredListings}>
                    {listings.map(l => (
                      <ListingCard className={css.listingCard} listing={l} key={l.id.uuid} />
                    ))}
                  </div>
                </div>
              </li>
            ) : null}
            <li className={css.section}>
              <div className={css.sectionContent}>
                <h2 className={css.customSectionTitle}>
                  <FormattedMessage id="LandingPage.donationTitle" />
                </h2>

                <div className={css.donateContainer}>
                  <div className={css.donateSection}>
                    <h2 className={css.donateTitle}>
                      <FormattedMessage id="LandingPage.covidTitle" />
                    </h2>
                    <p>
                      <FormattedMessage id="LandingPage.covidText" />
                    </p>
                    <ExternalLink
                      href="https://www.firstnations.org/covid-19-emergency-response-fund/"
                      className={css.donateButton}>
                      <FormattedMessage id="LandingPage.covidButton" />
                    </ExternalLink>
                  </div>

                  <div className={css.donateSection}>
                    <h2 className={css.donateTitle}>
                      <FormattedMessage id="LandingPage.mmiwTitle" />
                    </h2>
                    <p>
                      <FormattedMessage id="LandingPage.mmiwText" />
                    </p>
                    <ExternalLink
                      href="https://www.csvanw.org/mmiw/"
                      className={css.donateButton}>
                      <FormattedMessage id="LandingPage.mmiwButton" />
                    </ExternalLink>
                  </div>

                  <div className={css.donateSection}>
                    <h2 className={css.donateTitle}>
                      <FormattedMessage id="LandingPage.blmTitle" />
                    </h2>
                    <p>
                      <FormattedMessage id="LandingPage.blmText" />
                    </p>
                    <ExternalLink
                      href="https://nymag.com/strategist/article/where-to-donate-for-black-lives-matter.html"
                      className={css.donateButton}>
                      <FormattedMessage id="LandingPage.blmButton" />
                    </ExternalLink>
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

  listings: array.isRequired,
};

const mapStateToProps = state => {
  const {
    userIds,
    promotedListingRefs,
  } = state.LandingPage;
  const listings = getListingsById(state, promotedListingRefs);
  const userMatches = userIds && userIds.length > 0 ? getMarketplaceEntities(state, userIds) : null
  return {
    users: userMatches,
    scrollingDisabled: isScrollingDisabled(state),
    listings,
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

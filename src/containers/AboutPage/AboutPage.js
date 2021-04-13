import React from 'react';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
} from '../../components';

import css from './AboutPage.module.css';
import desktopImage from './about-us.jpg';

const AboutPage = () => {
  const { siteTwitterHandle, siteFacebookPage, siteInstagramPage } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  // prettier-ignore
  return (
    <StaticPage
      title="About Us"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'AboutPage',
        description: 'About From The People',
        name: 'About page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <h1 className={css.pageTitle}>Your Indigenous Marketplace and Community</h1>
          <img className={css.coverImage} src={desktopImage} alt="Chase and Isabella" />

          <div className={css.contentWrapper}>
            <div className={css.contentSide}>
              <p>From The People was founded in May of 2020, as a way to help Indigenous Peoples during the COVID-19 Pandemic</p>
            </div>

            <div className={css.contentMain}>
              <h2>
              From the People is a Native-owned and operated business. The co-founders of From The People, 
              Isabella Johnson and Chase McNiel, believe in Natives supporting Natives.
              </h2>

              <p>
              Isabella (she/her) is a member of the Coquille (Kō’ Kwel) Indian Tribe and is currently an undergraduate 
              at Stanford University. After completing her bachelor’s degree, she hopes to continue her 
              education in law school and specialize in Federal Indian Law. Chase (he/him) is a member of the Navajo Nation 
              and a recent Stanford University graduate with a bachelor’s in mechanical engineering. 
              Chase has worked in the aerospace industry for the past several years.
              <br/>
              <br/>
              Together, Chase and Isabella have created From The People as a way to 
              help Native peoples regain some of their lost income in the wake of powwows and flea markets 
              shutting down because of the COVID-19 pandemic.
              </p>

              <h3 className={css.subtitle}>We are dedicated to promoting the growth of 
              Indigenous businesses like yours!
              </h3>

              <p>
              From The People is an inclusive decolonized space committed to serving as an online Indigenous 
              Marketplace and Community. Our hope is that From The People will foster Pan-Indian collaboration 
              among our artists, activists, and vendors. Additionally, with Native-made traditional assortments 
              made available to shoppers, we hope to boost our Native vendors sales while preventing non-Native 
              sellers from appropriating Indigenous cultures. There is no cultural appropriation here! 
              Only cultural appreciation! 
              <br/>
              <br/>
              We welcome Native American vendors from any of the 573+ federally recognized Tribes in the U.S. 
              as well as members of Tribes still seeking federal recognition, First Nations Peoples, and other 
              Indigenous Peoples around the world to join our site! We want From The People to reflect the rich
               and unique cultural heritage of all Indigenous Peoples. 
              </p>

              <h2 className={css.subtitle}>
              Compliance with The Indian Arts and Crafts Act of 1990
              </h2>
              <p>
              If you suspect a seller has misrepresented themselves in regards to Native American heritage or 
              falsely suggests their product is Indian produced, an Indian product, or the product of a particular 
              Indian or Indian tribe or Indian arts and crafts organization, please email us at customersupport@fromthepeople.co or  
              through our site Contact Page. We will investigate all allegations and contact the appropriate authorities.

              For a first time violation of the Act, an individual can face civil or criminal penalties up to a $250,000 fine or a 
              5-year prison term, or both. To learn more about the Indian Arts and Crafts Act and compliance, visit{' '} 
              <ExternalLink href="https://www.doi.gov/iacb/act">here</ExternalLink> and 
              {' '} 
              <ExternalLink href="https://www.doi.gov/sites/doi.gov/files/uploads/iacb_know_the_law_brochure_2019_final_web.pdf">here.</ExternalLink>
              </p>
              <p>
                <br/>
                You can also checkout our{' '}
                <ExternalLink href={siteInstagramPage}>Instagram</ExternalLink>, {' '}
                <ExternalLink href={siteFacebookPage}>Facebook</ExternalLink> and{' '}
                <ExternalLink href={siteTwitterPage}>Twitter</ExternalLink>.
              </p>
            </div>
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

export default AboutPage;

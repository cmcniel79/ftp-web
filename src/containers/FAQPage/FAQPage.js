import React from 'react';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  Accordion,
  AccordionButton,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  NamedLink,
  ExternalLink,
} from '../../components';

import css from './FAQPage.css';

const FAQPage = () => {
  return (
    <StaticPage
      className={css.root}
      title="FAQ"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'FAQPage',
        description: 'Description of this page',
        name: 'FAQ page',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>
        <LayoutWrapperMain className={css.faq}>
          <h1 className={css.faqTitle}>Frequently Asked Questions</h1>

          <div className={css.accordion}>
            <h2>Creating an Account</h2>
            <Accordion className={css.accordion} atomic={true}>
              <AccordionButton title="Can I Still Create An Account If I'm Not Native American or Indigenous?">
                <p>
                  Yes! From The People encourages both Natives and non-Natives alike to sign up for an account with us.
                  Non-Natives are able to buy and sell on our site. If you are a non-Native trader of Native American
                  products and you plan on selling items that are marketed as Native American and/or American Indian
                  Made on our site, you will need to provide us with verification that your products were created by a
                  Tribal Member or Certified Indian Artisan.
                  </p>
              </AccordionButton>
              <AccordionButton title="How do I set up an account?">
                <p>
                  Sign up for an account on our Sign Up Page. You can sign up with your Facebook or Google account or email address.
                  You will then be able to personalize your account by uploading a profile picture and filling in any information you
                  would like other From The People users to know about you. After signing up you will not immediately have the ability
                  to post items to sell. To begin selling items you will need to follow the steps of our verification process, outlined here.
                </p>
              </AccordionButton>
            </Accordion>
          </div>

          <div className={css.accordion}>
            <h2>How To Become a Seller</h2>
            <Accordion className={css.accordion} atomic={true}>
              <AccordionButton title="Can I become a seller if I am not part of a federally or state recognized tribe?">
                <p>
                  Yes of course! But there are requirements for your postings that you must meet in order to sell.
                  You may not describe any of your items as being “Indian Made”, “Native American Made” or affiliated with any federally or
                  state recognized tribe. You must list your tribal affiliation as “Unaffiliated”. If you are First Nations or part of a
                  Indigenous group outside of the U.S., then you can list your tribal or group affiliation but please include your country of origin.
                  For example, if you are enrolled in a Canadian Cree tribe, you would list your tribal affiliation as “Cree (Canada)”.
                  </p>
              </AccordionButton>
              <AccordionButton title="How do I post my items to sell?">
                <p>
                  Press the “Post a new listing button” at the top of the website to begin listing your items. If you are not verified yet,
                  you need to contact the From The People Admin team. Once you’re verified, the process is simple. Fill out the information
                  about your item. Some information, like Tribal Affiliation, is mandatory. Make sure to post great pics!
                </p>
              </AccordionButton>
              <AccordionButton title="Why does From The People verify tribal enrollment for sellers?">
                <p>
                  From The People requires all vendors to be compliant with the Indian Arts and Crafts Act of 1990 (P.L. 101-644),
                  a truth-in-advertising law which prohibits misrepresentation in marketing American Indian or Alaska Native arts and
                  crafts products within the United States.It is illegal to offer or display for sale, or sell any art or craft product
                  in a manner that falsely suggests it is Indian produced, an Indian product, or the product of a particular Indian or
                  Indian Tribe or Indian arts and crafts organization, resident within the United States.To ensure our vendors are compliant
                  with the Indian Arts and Crafts Act (P.L. 101-644), From The People must verify our vendors tribal enrollment status.
                  If any vendor on our site is found to have falsified their credentials or falsely claim their products are “American Indian made,”
                  From The People is obligated to report them to the Indian Arts and Crafts Board. For a first time violation of the Act, an
                  individual can face civil or criminal penalties up to a $250,000 fine or a 5-year prison term, or both. To learn more about
                  the Indian Arts and Crafts Act and compliance, visit here and here.

                  </p>
              </AccordionButton>
              <AccordionButton title="How do I become a seller?">
                <p>
                  Before you can begin selling you will first need to create an account with From The People and complete the following
                  steps to become a verified seller.
                  <br />
                  1. After creating an account, go to our Contact Us page and please send us a message
                  about yourself, your tribal affiliation and the types of products you plan on selling.
                  <br />
                  2. You will receive an email shortly after applying for Seller status. If you do not see our reply email, be sure to check your spam or junk folders!
                  <br />
                  3. This email will be accompanied by a standard vendor contract about the Indian Arts and Crafts Act for you to agree to. From The People requires all vendors be compliant with the Act.
                  More information regarding the importance of the Indian Arts and Crafts Act can be found in this brochure.
                  <br />
                  4. If you plan on selling items that are marketed as Native American and/or American Indian, made you will need to provide us with
                  verification that your products were made by Tribal Members or by a Certified Indian Artisan.
                  This can be accomplished by sending us any document proving your tribal enrollment status, such as your tribal ID or certificate of Indian blood (C.I.B),
                  through our secure file transfer service. We will provide a link for you to upload your files to.
                </p>
              </AccordionButton>
            </Accordion>
          </div>

          <div className={css.accordion}>
            <h2>Indigenous Allyship</h2>
            <Accordion className={css.accordion} atomic={true}>
              <AccordionButton title="What is cultural appropriation vs cultural appreciation?">
                <DummyContent />
              </AccordionButton>
              <AccordionButton title="I am a non-Native ally, how can I support?">
                <DummyContent />
              </AccordionButton>
            </Accordion>
          </div>


          <div className={css.accordion}>
            <h2>Marketplace Rules</h2>
            <Accordion className={css.accordion} atomic={true}>
              <AccordionButton title="Compliance with the Indian Arts and Crafts Act of 1990">
                <p>
                  If you suspect a seller has misrepresented themselves in regards to Native American heritage or falsely suggests their product is Indian produced,
                  an Indian product, or the product of a particular Indian or Indian tribe or Indian arts and crafts organization, please email us at
                  customersupport@fromthepeople.co or through our site Contact Page. We will investigate all allegations and contact the appropriate authorities.
                  For a first time violation of the Act, an individual can face civil or criminal penalties up to a $250,000 fine or a 5-year prison term, or both.
                  To learn more about the Indian Arts and Crafts Act and compliance, visit here and here.

                  </p>
              </AccordionButton>
              <AccordionButton title="Prohibited Items">
                <p>
                  The following list includes products vendors are prohibited from selling on our site: Firearms, Explosives, Drugs, any Illegal products within
                  the U.S. or elsewhere, Meat Products, Eagle Feathers, Products with Hate Speech and/or Indigenous Slurs. This list is not exhaustive, and
                  From The People reserves the right to add any product category to the Prohibited Items list in the future. If your account is found to be selling
                  any prohibited items, we will immediately close your account with us and contact the appropriate authorities.

                </p>
              </AccordionButton>
            </Accordion>
          </div>


          <div className={css.accordion}>
            <h2>Payment Process</h2>
            <Accordion className={css.accordion} atomic={true}>
              <AccordionButton title="What is the payment process like?">
                <p>
                  Buyers can use either PayPal or their credit card to make a purchase. After payment, the seller needs to accept the transaction for the payment
                  to be transferred. If the seller does not accept the transaction within 3 days or before the end date (whatever comes first), the transaction is
                  canceled and no money is transferred. Once the transaction is accepted, both users can then discuss freely to agree on details. When the order
                  is completed (seller has provided shipping confirmation, product is delivered…), they can mark the order as completed. Both users can then review
                  each other! Discussions between buyers and sellers can be found in the Inbox section of your account! The payment process also differs slightly
                  based on which payment service you use, either Stripe or Paypal. For more information on the Stripe payment flow, see here:  Stripe Payment Flow.
                  </p>
              </AccordionButton>
              <AccordionButton title="How do I get a refund?">
                <p>
                  In case you need a refund for any reason, please mark the transaction as disputed. A refund request should only be made before a transaction
                  has been marked as completed. Once a transaction has been marked as completed, there is a risk that we may not be able to refund you. Buyers
                  can mark a paid transaction as disputed after the transaction request has been approved and before it is marked as “completed”. The Dispute
                  feature is a way for buyers to clearly communicate to providers that they are not happy with the way the transaction is handled. To resolve
                  a dispute, involvement from admins is required. The admins will investigate the matter and determine if a refund is required. Read more about
                  the Sharetribe dispute process here. If you used PayPal for the transaction, you benefit from PayPals buyer protection program, summarized here:
                  PayPal Protection Program

                </p>
              </AccordionButton>
              <AccordionButton title="What payment service do you use?">
                <p>
                  Users have two payment options when buying items on From The People. Buyers can enter their credit card details (protected with Stripe) or use
                  PayPal for the purchase. For transactions made through Stripe, we charge a 9% transaction fee, and the minimum transaction fee is $0.65. To use
                  Stripe, all you need to do is add your bank account details in the payments section of your user account. Stripe secures and encrypts your
                  sensitive information. For more information on the Stripe payment flow, see here:  Stripe Payment Flow
                  </p>
              </AccordionButton>
            </Accordion>
            <h2 className={css.faqTitle}>Questions Not Covered Here?</h2>
          </div>

        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

const DummyContent = () => (
  <p style={{ padding: '18px' }}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
);

export default FAQPage;
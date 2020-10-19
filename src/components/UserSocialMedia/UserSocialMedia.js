import React from 'react';
import { string } from 'prop-types';
import {
  IconSocialMediaFacebook,
  IconSocialMediaInstagram,
  IconSocialMediaTwitter,
  ExternalLink 
} from '..';
import css from './UserSocialMedia.css';

const UserSocialMedia = props => {
  const { socialMedia, className } = props;

  const fbLink = socialMedia && socialMedia.facebook ? (
    <ExternalLink key="linkToAuthorsFacebook"
      href={socialMedia.facebook}
      title={"Go To Author's Facebook"}
    >
      <IconSocialMediaFacebook />
    </ExternalLink>
  ) : null;

  const twitterLink = socialMedia && socialMedia.twitter ? (
    <ExternalLink
      key="linkToAuthorsTwitter"
      href={socialMedia.twitter}
      title={"Go To Author's Twitter"}
    >
      <IconSocialMediaTwitter />
    </ExternalLink>
  ) : null;

  const instaLink = socialMedia && socialMedia.insta ? (
    <ExternalLink
      key="linkToAuthorsInstagram"
      href={socialMedia.insta}
      title={"Go To Author's Insta"}
    >
      <IconSocialMediaInstagram />
    </ExternalLink>
  ) : null;

  var links = [];

  if(fbLink){
    links.push(fbLink);
  }
  if(twitterLink){
    links.push(twitterLink);
  }
  if(instaLink){
    links.push(instaLink);
  }

  const classNames = className ? className : css.authorSocialMedia;

  return socialMedia && links.length > 0 ? (
    <div className={classNames}>
      {/* <p className={css.text}>      
        <FormattedMessage id="UserSocialMedia.socialAccounts" />
      </p> */}
         {links.map(l => (
           <span key={l.key} className={css.socialMediaIcons}>
             {l}
           </span>
         ))}
    </div>
  ) : null;
}

UserSocialMedia.defaultProps = { className: null, rootClassName: null };

UserSocialMedia.propTypes = {
  className: string,
  rootClassName: string,
  region: string,
};

export default UserSocialMedia;

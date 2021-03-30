import React from 'react';
import { string } from 'prop-types';
import {
  IconSocialMediaFacebook,
  IconSocialMediaInstagram,
  IconSocialMediaTwitter,
  IconSocialMediaTikTok,
  ExternalLink 
} from '..';
import css from './UserSocialMedia.module.css';

const UserSocialMedia = props => {
  const { socialMedia, className } = props;

  // Need to add https:// protocol to all social media links. Values come in as
  // www.facebook.com (www.domain.com) for all links
  const fbLink = socialMedia && socialMedia.facebook ? (
    <ExternalLink key="linkToAuthorsFacebook"
      href={'https://' + socialMedia.facebook}
      title={"Go To Author's Facebook"}
    >
      <IconSocialMediaFacebook />
    </ExternalLink>
  ) : null;

  const twitterLink = socialMedia && socialMedia.twitter ? (
    <ExternalLink
      key="linkToAuthorsTwitter"
      href={'https://' + socialMedia.twitter}
      title={"Go To Author's Twitter"}
    >
      <IconSocialMediaTwitter />
    </ExternalLink>
  ) : null;

  const instaLink = socialMedia && socialMedia.insta ? (
    <ExternalLink
      key="linkToAuthorsInstagram"
      href={'https://' + socialMedia.insta}
      title={"Go To Author's Insta"}
    >
      <IconSocialMediaInstagram />
    </ExternalLink>
  ) : null;

  const tikTokLink = socialMedia && socialMedia.tiktok ? (
    <ExternalLink
      key="linkToAuthorsTikTok"
      href={'https://' + socialMedia.tiktok}
      title={"Go To Author's TikTok"}
    >
      <IconSocialMediaTikTok />
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
  if(tikTokLink){
    links.push(tikTokLink);
  }

  const classNames = className ? className : css.authorSocialMedia;

  return socialMedia && links.length > 0 ? (
    <div className={classNames}>
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

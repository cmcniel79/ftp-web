import React from 'react';

import css from './ListingPage.module.css';

const SectionVideoMaybe = props => {
  const {
    videoData
  } = props;

  return videoData && videoData.type && videoData.url ? (
    <div className={css.sectionVideoMaybe}>
      {videoData.type === "youtube" ? (
        <iframe
          className={css.youtubePlayer}
          id="ytplayer"
          type="text/html"
          // width="640"
          // height="360"
          src="https://www.youtube.com/embed/8bjn-EHPWTA"
          frameborder="0">
        </iframe>
      ) : null}
    </div>
  ) : null;
};

export default SectionVideoMaybe;

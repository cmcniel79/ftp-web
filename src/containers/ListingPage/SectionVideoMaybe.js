import React from 'react';

import css from './ListingPage.module.css';

const SectionVideoMaybe = props => {
  const {
    videoData
  } = props;

  function createMarkup() {
    return {
      __html: '<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@juankatelynturrubiartes/video/6961853751909010694" data-video-id="6961853751909010694" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@juankatelynturrubiartes" href="https://www.tiktok.com/@juankatelynturrubiartes">@juankatelynturrubiartes</a> <p>@ nfl come get your boy 🏃🏾 <a title="repost" target="_blank" href="https://www.tiktok.com/tag/repost">#repost</a> <a title="fypシ" target="_blank" href="https://www.tiktok.com/tag/fyp%E3%82%B7">#fypシ</a></p> <a target="_blank" title="♬ original sound - ." href="https://www.tiktok.com/music/original-sound-6739272387222702853">♬ original sound - .</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>'
    }
  };

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
          frameBorder="0">
        </iframe>
      ) : videoData.type === "tiktok" ? (
        <div dangerouslySetInnerHTML={createMarkup()} />
      ) : null}
    </div>
  ) : null;
};

export default SectionVideoMaybe;

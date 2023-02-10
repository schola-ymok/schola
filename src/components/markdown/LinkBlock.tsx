import { match } from 'assert';

import { Box } from '@mui/material';
import { useEffect } from 'react';
import Embed from 'react-embed';
import { TwitterTweetEmbed } from 'react-twitter-embed';

import GoogleMapBlock from './GoogleMapBlock';
import YoutubeBlock from './YoutubeBlock';

const LinkBlock = ({ href, children }) => {
  useEffect(() => {}, []);

  if (href.startsWith('https://www.youtube.com/watch?v=')) {
    const hrefSplit = href.split('=');
    if (hrefSplit.length > 0) {
      const id = hrefSplit[1];
      return <YoutubeBlock id={id} />;
    }
  } else if (href.startsWith('https://twitter.com/')) {
    const matches = href.match(
      /(https):\/\/(twitter.com)\/([A-Za-z0-9_]*)\/(status|statues)\/(\d+)/,
    );
    if (matches) {
      const tweetId = matches[5];
      return <TwitterTweetEmbed tweetId={tweetId} />;
    }
  } else if (href.startsWith('https://stackblitz.com/')) {
    return <iframe style={{ width: '100%', aspectRatio: '16/9' }} src={href}></iframe>;
  }

  return <a href={href}>{children}</a>;
};

export default LinkBlock;

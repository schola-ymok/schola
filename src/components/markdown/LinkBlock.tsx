import { Box } from '@mui/material';
import { TwitterTweetEmbed } from 'react-twitter-embed';

const TwitterBlock = ({ id }) => <TwitterTweetEmbed tweetId={id} />;

const YoutubeBlock = ({ id }) => (
  <Box sx={{ width: '70%', aspectRatio: '16/9' }}>
    <iframe
      style={{ width: '100%', height: '100%' }}
      width='560'
      height='315'
      src={'https://www.youtube.com/embed/' + id}
      title='YouTube video player'
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowFullScreen
    ></iframe>
  </Box>
);

const LinkBlock = ({ href, children }) => {
  if (href.startsWith('https://www.youtube.com/watch?v=')) {
    const hrefSplit = href.split('=');
    if (hrefSplit.length > 0) {
      const id = hrefSplit[1];
      return <YoutubeBlock id={id} />;
    }
  } else if (href.startsWith('https://twitter.com/')) {
    const match = href.match(/(https):\/\/(twitter.com)\/([A-Za-z0-9_]*)\/(status|statues)\/(\d+)/);

    const tweetId = match[5];
    return <TwitterTweetEmbed tweetId={tweetId} />;
  }

  return <a href={href}>{children}</a>;
};

export default LinkBlock;

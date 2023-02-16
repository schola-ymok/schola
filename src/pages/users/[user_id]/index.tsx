import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import LinkIcon from '@mui/icons-material/Link';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Avatar, Box, Button, Link, useMediaQuery } from '@mui/material';
import htmlParse from 'html-react-parser';
import router, { useRouter } from 'next/router';
import useSWR from 'swr';

import { getUser } from 'api/getUser';
import { getUserTexts } from 'api/getUserTexts';
import AuthorTexts from 'components/AuthorTexts';
import AvatarButton from 'components/AvatarButton';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import ReadMoreText from 'components/ReadMoreText';
import Layout from 'components/layouts/Layout';
import Consts from 'utils/Consts';

const User = () => {
  const router = useRouter();
  const authorId = router.query.user_id;

  const { data: data, error: error } = useSWR(`getUser`, () => getUser(authorId), {
    revalidateOnFocus: false,
  });

  const { data: userTextsData, error: userTextsError } = useSWR(
    `/users/${authorId}/texts`,
    () => getUserTexts(authorId, 0),
    {
      revalidateOnFocus: false,
    },
  );

  if (error || userTextsError) {
    console.log(error);
  }

  const mq = useMediaQuery('(min-width:600px)');

  if (!data || !userTextsData) return <CenterLoadingSpinner />;

  const NumberBox = ({ label, value }) => (
    <Box sx={{ display: 'flex', flexFlow: 'column', mr: 3 }}>
      <Box sx={{ fontWeight: 'bold', fontSize: '0.9em', color: '#999999' }}>{label}</Box>
      <Box sx={{ fontWeight: 'bold', fontSize: '1.5em' }}>{value}</Box>
    </Box>
  );

  const PButton = ({ children, href }) => {
    const sx = {
      border: 'solid 1px #000000',
      mb: 1,
      display: 'flex',
      fontWeight: 'bold',
      height: '40px',
      color: '#000000',
      mx: 'auto',
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: Consts.COLOR.LightPrimarySelected,
      },
    };

    if (mq) {
      sx['mx'] = 'auto';
      sx['width'] = '170px';
    } else {
      sx['fontSize'] = '0.9em';
      sx['width'] = '70%';
    }

    return (
      <Link
        href={href}
        sx={{ textDecoration: 'none', width: '100%', '&:hover': { textDecoration: 'none' } }}
      >
        <Box sx={sx}>
          <Box
            sx={{
              mx: 'auto',
              my: 'auto',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {children}
          </Box>
        </Box>
      </Link>
    );
  };

  const Name = () => {
    let profileMessage = data.profile_message;
    if (!profileMessage) profileMessage = '';
    const html = htmlParse(profileMessage);

    return (
      <>
        <Box sx={{ fontSize: '2.2em', fontWeight: 'bold', wordBreak: 'break-all' }}>
          {data.display_name}
        </Box>
        <Box sx={{ fontWeight: 'bold', wordBreak: 'break-all' }}>{data.majors}</Box>
        <Box sx={{ display: 'flex', mt: 1, mb: 1 }}>
          <NumberBox label='テキストの数' value={data.num_of_texts} />
          <NumberBox label='読者の数' value={data.num_of_sales} />
        </Box>
        <Box sx={{ my: 3 }}>
          <ReadMoreText height='300'>{html}</ReadMoreText>
        </Box>
      </>
    );
  };

  const Texts = () => (
    <>
      <Box fontSize='1.2em' fontWeight='bold'>
        {data.display_name} が執筆したテキスト
      </Box>
      <Box>
        <AuthorTexts data={userTextsData} authorId={authorId} />
      </Box>
    </>
  );

  const Avatar = () => (
    <AvatarButton
      photoId={data.photo_id}
      onClick={() => {
        router.push(`/users/` + data.id);
      }}
      size={100}
    />
  );

  const Buttons = () => {
    const hasWeb = data.web != '' && data.web != null ? true : false;
    const hasTwitter = data.twitter != '' && data.twitter != null ? true : false;
    const hasFacebook = data.facebook != '' && data.facebook != null ? true : false;

    return (
      <>
        {hasWeb && (
          <PButton href={`https://${data.web}`}>
            <LinkIcon sx={{ mb: 0.3, mr: 0.5 }} />
            Webページ
          </PButton>
        )}
        {hasTwitter && (
          <PButton href={`https://twitter.com/${data.twitter}`}>
            <TwitterIcon sx={{ mb: 0.3, mr: 0.5 }} />
            Twitter
          </PButton>
        )}
        {hasFacebook && (
          <PButton href={`https://facebook.com/${data.facebook}`}>
            <FacebookOutlinedIcon sx={{ mb: 0.3, mr: 0.5 }} />
            Facebook
          </PButton>
        )}
      </>
    );
  };

  if (mq) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ maxWidth: '700px', display: 'flex', flexFlow: 'column', ml: 'auto' }}>
          <Name />
          <Texts />
        </Box>
        <Box sx={{ width: '200px', display: 'flex', flexFlow: 'column', mr: 'auto', ml: 1 }}>
          <Box sx={{ mx: 'auto', mb: 3 }}>
            <Avatar />
          </Box>
          <Buttons />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box sx={{ display: 'flex', flexFlow: 'column' }}>
        <Box sx={{ maxWidth: '700px', display: 'flex', flexFlow: 'column', mx: 'auto' }}>
          <Avatar />
          <Name />
          <Box sx={{ display: 'flex', width: '100%', flexFlow: 'column', mb: 2 }}>
            <Buttons />
          </Box>
          <Texts />
        </Box>
      </Box>
    );
  }
};

User.getLayout = (page) => <Layout>{page}</Layout>;
export default User;

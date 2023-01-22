import { Box, Drawer, IconButton, useMediaQuery } from '@mui/material';
import { color } from '@mui/system';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'next/router';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { getPurchasedInfo } from 'api/getPurchasedInfo';
import { getViewText } from 'api/getViewText';
import { AuthContext } from 'components/auth/AuthContext';
import 'katex/dist/katex.min.css';
import 'github-markdown-css/github-markdown.css';

import Logo from 'components/headers/Logo';
import SLogo from 'components/headers/SLogo';
import SideMenuIcon from 'components/headers/SideMenuIcon';
import MenuCloseButton from 'components/sidemenu/MenuCloseButton';
import Consts from 'utils/Consts';
import { extractToc } from 'utils/extractToc';

import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

import type { NextPage } from 'next';

import useSWR, { useSWRConfig } from 'swr';

import CenterLoadingSpinner from 'components/CenterLoadingSpinner';

import Edit from '@mui/icons-material/Edit';

const TextView: NextPage = () => {
  const router = useRouter();
  const { authAxios } = useContext(AuthContext);

  const textId = router.query.text_id;
  const mq = useMediaQuery('(min-width:1000px)');

  const [menuOpen, setMenuOpen] = useState(false);

  const { data, error } = useSWR(`texts/${textId}/view`, () => getViewText(textId, authAxios), {
    revalidateOnFocus: false,
  });

  const { data: dataPurchasedInfo, error: errorPurchasedInfo } = useSWR(
    `texts/${textId}/purchase`,
    () => getPurchasedInfo(textId, authAxios),
    {
      revalidateOnFocus: false,
    },
  );

  if (error || errorPurchasedInfo) console.log('error');
  if (!data || !dataPurchasedInfo) return <CenterLoadingSpinner />;

  if (mq) {
    return (
      <Box sx={{ display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ width: '350px' }}>
          <Toc data={data} />
        </Box>
        <Box
          sx={{
            width: '100vw',
            display: 'flex',
            flexFlow: 'column',
            height: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <ChapterContent data={data} />
        </Box>
      </Box>
    );
  } else {
    return (
      <>
        <Box
          sx={{
            pt: { xs: 0, sm: 1 },
            pb: { xs: 0, sm: 1 },
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '54px',
            whiteSpace: 'nowrap',
            px: { xs: 0.4, sm: 2 },
          }}
        >
          <SideMenuIcon
            onClick={() => {
              setMenuOpen(true);
            }}
          />
          <Box
            sx={{
              pr: 1,
              my: 'auto',
              mx: 'auto',
              fontSize: '0.9em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.title}
          </Box>
        </Box>
        <Drawer
          anchor={'left'}
          open={menuOpen}
          onClose={() => {
            setMenuOpen(false);
          }}
        >
          <Toc
            data={data}
            mobile
            onClose={() => {
              setMenuOpen(false);
            }}
          />
        </Drawer>
        <Box
          sx={{
            width: '100vw',
            display: 'flex',
            flexFlow: 'column',
            height: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <ChapterContent data={data} />
        </Box>
      </>
    );
  }
};

const ChapterContent = ({ data }) => {
  const router = useRouter();
  const textId = router.query.text_id;

  let chapterId;

  if (router.query.cid) {
    chapterId = router.query.cid;
  } else {
    const k = Object.keys(data.chapters);
    if (k.length > 0) {
      chapterId = k[0];
    } else {
      return <>no chapter</>;
    }
  }

  const content = data.chapters[chapterId]?.content;
  const title = data.chapters[chapterId]?.title;

  const PrevButton = ({ id, title }) => (
    <Box
      sx={{
        width: '250px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover .prevButtonInnerText': {
          color: Consts.COLOR.Primary,
          textDecoration: 'underline',
        },
        '&:hover .prevButtonInnerIcon': {
          color: Consts.COLOR.IconDarkGrey,
        },
      }}
      onClick={() => {}}
    >
      <ArrowBackIosOutlinedIcon
        className='prevButtonInnerIcon'
        sx={{ color: '#cccccc', transform: 'scale(1.1)' }}
      />
      <Box
        className='prevButtonInnerText'
        sx={{
          ml: 1,
          mr: 'auto',
          fontWeight: 'bold',
          color: '#888888',
        }}
      >
        {title}
      </Box>
    </Box>
  );

  const NextButton = ({ id, title }) => (
    <Box
      sx={{
        width: '250px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'right',
        cursor: 'pointer',
        '&:hover .nextButtonInnerText': {
          color: Consts.COLOR.Primary,
          textDecoration: 'underline',
        },
        '&:hover .nextButtonInnerIcon': {
          color: Consts.COLOR.IconDarkGrey,
        },
      }}
      onClick={() => {}}
    >
      <Box
        className='nextButtonInnerText'
        sx={{
          ml: 'auto',
          mr: 1,
          fontWeight: 'bold',
          color: '#888888',
        }}
      >
        {title}
      </Box>
      <ArrowForwardIosOutlinedIcon
        className='nextButtonInnerIcon'
        sx={{ color: '#cccccc', transform: 'scale(1.1)' }}
      />
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          backgroundColor: '#f6f8fa',
          height: '200px',
          flexShrink: 0,
        }}
      >
        <IconButton
          type='button'
          sx={{
            position: 'fixed',
            right: '10px',
            top: '10px',
            '&:hover': Consts.SX.IconButtonHover,
          }}
          onClick={() => {
            router.push(`/chapters/${chapterId}/edit`);
          }}
        >
          <Edit sx={{ my: 'auto', transform: 'scale(0.8)' }} />
        </IconButton>

        <Box
          sx={{
            p: 1,
            my: 'auto',
            mx: 'auto',
            width: '100%',
            maxWidth: '760px',
            display: 'flex',
            flexFlow: 'column',
            height: 'fit-content',
          }}
        >
          <Box sx={{ fontWeight: 'bold', fontSize: '2.1em' }}>{title}</Box>
          <Box>更新日: 2022.12212.</Box>
        </Box>
      </Box>

      <Box sx={{ p: 1, my: 4, width: '100%', maxWidth: '760px', mx: 'auto' }}>
        <ReactMarkdown
          className='markdown-body p-3'
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeSlug]}
        >
          {content}
        </ReactMarkdown>
      </Box>

      <Box
        sx={{
          p: 1,
          my: 4,
          width: '760px',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <PrevButton id={'id'} title={'title'} />
        <NextButton id={'id'} title={'title'} />
      </Box>
    </>
  );
};

const Toc = ({ data, mobile, onClose }) => {
  var tocs = {};
  Object.keys(data.chapters).map((id) => {
    const toc = extractToc(data.chapters[id].content);
    tocs[id] = toc;
  });

  const router = useRouter();
  const textId = router.query.text_id;
  const cid = router.query.cid;

  const imageUrl = data.photo_id
    ? Consts.IMAGE_STORE_URL + data.photo_id + '.png'
    : '/cover-default.svg';

  function handleChapterClick(id) {
    router.push(`/texts/${textId}/view?cid=${id}`);
  }

  function handleSectionClick(chapterId, sectionId) {
    router.push(`/texts/${textId}/view?cid=${chapterId}#${sectionId}`);
  }

  const NestItem = ({ item, chapterId }) => {
    const ml = item.depth * 2;
    return (
      <Box
        sx={{
          ml: ml,
          cursor: 'pointer',
          fontSize: '0.8em',
          my: 0.4,
          '&:hover': {
            color: Consts.COLOR.VIEW.Primary,
            textDecoration: 'underline',
          },
        }}
        onClick={() => handleSectionClick(chapterId, item.id)}
      >
        {item.text}
      </Box>
    );
  };

  const sx = mobile
    ? {
        p: 1,
        pb: 0,
        width: '280px',
      }
    : {
        px: 2,
        borderRight: '1px solid #cccccc',
        width: '350px',
        display: 'flex',
        flexFlow: 'column',
      };

  let chapterOrder;
  if (data.chapter_order != null) {
    chapterOrder = JSON.parse(data.chapter_order);
  } else {
    chapterOrder = Object.keys(data.chapters);
  }

  return (
    <>
      <Box sx={sx}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex' }}>
            {mobile && <MenuCloseButton onClick={onClose} />}
            <Box
              component='img'
              sx={{
                display: 'flex',
                width: 'fit-content',
                width: '90px',
                cursor: 'pointer',
                py: 3,
              }}
              src='/logo-s.svg'
              onClick={() => router.push('/')}
            />
          </Box>

          <IconButton
            type='button'
            sx={{
              '&:hover': Consts.SX.IconButtonHover,
            }}
            onClick={() => {
              router.push(`/texts/${textId}/edit`);
            }}
          >
            <Edit sx={{ my: 'auto', transform: 'scale(0.8)' }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            overflowX: 'hidden',
            overflowY: 'auto',
            height: 'calc(100vh - 72px)',
            borderTop: '1px solid #cccccc',
          }}
        >
          <Box sx={{ display: 'flex', flexFlow: 'column' }}>
            <Box sx={{ display: 'flex', my: 3 }}>
              <Box
                component='img'
                sx={{
                  display: 'flex',
                  width: 'fit-content',
                  width: 105,
                  height: 58,
                  cursor: 'pointer',
                }}
                src={imageUrl}
                onClick={() => router.push(`/texts/${textId}`)}
              />
              <Box sx={{ display: 'flex', flexFlow: 'column', ml: 1 }}>
                <Box
                  sx={{ fontSize: '0.9em', cursor: 'pointer' }}
                  onClick={() => router.push(`/texts/${textId}`)}
                >
                  {data.title}
                </Box>
                <Box
                  sx={{
                    fontSize: '0.8em',
                    color: '#888888',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: Consts.COLOR.Primary,
                    },
                  }}
                  onClick={() => router.push(`/texts/${textId}`)}
                >
                  {data.author_display_name}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexFlow: 'column', mb: 3 }}>
            {chapterOrder.map((id) => {
              return (
                <>
                  <Box
                    key={id}
                    sx={{
                      my: 0.4,
                      cursor: 'pointer',
                      fontSize: '0.8em',
                      fontWeight: 'bold',
                      color: '#000000',

                      '&:hover': {
                        color: Consts.COLOR.Primary,
                        textDecoration: 'underline',
                      },
                    }}
                    onClick={() => handleChapterClick(id)}
                  >
                    {data.chapters[id].title}
                  </Box>
                  {tocs[id].map((item) => {
                    return <NestItem item={item} chapterId={id} />;
                  })}
                </>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TextView;

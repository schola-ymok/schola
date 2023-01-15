import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'next/router';
import { useContext, useEffect, useLayoutEffect } from 'react';
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

import Consts from 'utils/Consts';
import { extractToc } from 'utils/extractToc';

import type { NextPage } from 'next';

import useSWR, { useSWRConfig } from 'swr';

import CenterLoadingSpinner from 'components/CenterLoadingSpinner';

import Edit from '@mui/icons-material/Edit';

const TextView: NextPage = () => {
  const router = useRouter();
  const { authAxios } = useContext(AuthContext);

  const textId = router.query.text_id;
  const mq = useMediaQuery('(min-width:1000px)');

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
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '350px' }}>
          <Toc data={data} left={true} />
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexFlow: 'column' }}>
          <ChapterContent data={data} />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box sx={{ display: 'flex', flexFlow: 'column' }}>
        <Box sx={{ width: '100%' }}>
          <Toc data={data} />
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexFlow: 'column' }}>
          <ChapterContent data={data} />
        </Box>
      </Box>
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

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          backgroundColor: '#f1f5f9',
          height: '200px',
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

        <Box sx={{ my: 'auto', display: 'flex', flexFlow: 'column', height: 'fit-content', p: 2 }}>
          <Box sx={{ width: '760px', mx: 'auto', fontWeight: 'bold', fontSize: '2.1em', mb: 1 }}>
            {data.chapters[chapterId]?.title}
          </Box>
          <Box sx={{ width: '760px', mx: 'auto' }}>更新日: 2022.12212.</Box>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ width: '760px', mx: 'auto' }}>
          <ReactMarkdown
            className='markdown-body p-3'
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeSlug]}
          >
            {data.chapters[chapterId]?.content}
          </ReactMarkdown>
        </Box>
      </Box>
    </>
  );
};

const Toc = ({ data, left }) => {
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
    const ml = item.depth * 1.5;
    return (
      <Box
        sx={{
          ml: ml,
          cursor: 'pointer',
          fontSize: '0.9em',
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

  const sx = left
    ? {
        pl: 2,
        pr: 1,
        borderRight: '1px solid #cccccc',
        width: '350px',
        display: 'flex',
        flexFlow: 'column',
      }
    : {
        p: 1,
        pb: 0,
        width: '100%',
      };

  return (
    <>
      <Box sx={sx}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Box
            component='img'
            sx={{ display: 'flex', width: 'fit-content', width: '90px', cursor: 'pointer', py: 3 }}
            src='/logo-s.svg'
            onClick={() => router.push('/')}
          />

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
          sx={{ overflowY: 'auto', height: 'calc(100vh - 72px)', borderTop: '1px solid #cccccc' }}
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
                  sx={{ fontSize: '0.9em', fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => router.push(`/texts/${textId}`)}
                >
                  {data.title}
                </Box>
                <Box
                  sx={{
                    fontSize: '0.8em',
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
            {Object.keys(data.chapters).map((id) => {
              return (
                <>
                  <Box
                    key={id}
                    sx={{
                      my: 0.5,
                      cursor: 'pointer',
                      fontSize: '0.9em',
                      color: '#555555',
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

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import useSWR from 'swr';

import { getPurchasedInfo } from 'api/getPurchasedInfo';
import { getViewText } from 'api/getViewText';
import { AuthContext } from 'components/auth/AuthContext';
import 'katex/dist/katex.min.css';
import 'github-markdown-css/github-markdown.css';

import Consts from 'utils/Consts';
import { extractToc } from 'utils/extractToc';

import type { NextPage } from 'next';

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

  var tocs = {};
  Object.keys(data.chapters).map((id) => {
    const toc = extractToc(data.chapters[id].content);
    tocs[id] = toc;
  });

  if (mq) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '350px' }}>
          <Toc chapters={data.chapters} tocs={tocs} left={true} />
        </Box>
        <Box sx={{ width: '700px' }}>
          <ChapterContent data={data} />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box sx={{ display: 'flex', flexFlow: 'column' }}>
        <Box sx={{ width: '100%' }}>
          <Toc chapters={data.chapters} tocs={tocs} left={false} />
        </Box>
        <Box sx={{ width: '100%' }}>
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
    <Box>
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
        <Edit sx={{ my: 'auto' }} />
      </IconButton>
      <Box sx={{ mt: 1, p: 1 }}>
        <Box sx={{ fontWeight: 'bold', fontSize: '2.1em', mb: 1 }}>
          {data.chapters[chapterId].title}
        </Box>
        <ReactMarkdown
          className='markdown-body p-3'
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeSlug]}
        >
          {data.chapters[chapterId].content}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

const Toc = ({ chapters, tocs, left }) => {
  const router = useRouter();
  const textId = router.query.text_id;
  const cid = router.query.cid;

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
        p: 1,
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        overflowY: 'auto',
        width: '350px',
      }
    : {
        p: 1,
        pb: 0,
        width: '100%',
      };

  return (
    <>
      <Box sx={sx}>
        <Box sx={{ display: 'flex' }}>
          <IconButton
            type='button'
            sx={{
              pr: 0,
              '&:hover': Consts.SX.IconButtonHover,
            }}
            onClick={() => {
              router.back();
            }}
          >
            <ArrowBackIosIcon sx={{ my: 'auto' }} />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexFlow: 'column', p: 0.5 }}>
          {Object.keys(chapters).map((id) => {
            return (
              <>
                <Box
                  key={id}
                  sx={{
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    '&:hover': {
                      color: Consts.COLOR.VIEW.Primary,
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={() => handleChapterClick(id)}
                >
                  {chapters[id].title}
                </Box>
                {tocs[id].map((item) => {
                  return <NestItem item={item} chapterId={id} />;
                })}
              </>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default TextView;

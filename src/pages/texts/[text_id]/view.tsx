import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Box, Button, IconButton } from '@mui/material';
import { slug } from 'github-slugger';
import { Node, toString } from 'hast-util-to-string';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import useSWR from 'swr';
import { visit } from 'unist-util-visit';

import { getPurchasedInfo } from 'api/getPurchasedInfo';
import { getViewText } from 'api/getViewText';
import { AuthContext } from 'components/auth/AuthContext';
import 'katex/dist/katex.min.css';
import 'github-markdown-css/github-markdown.css';

import Consts from 'utils/Consts';

import type { NextPage } from 'next';

const TextView: NextPage = () => {
  const router = useRouter();
  const { authAxios } = useContext(AuthContext);

  const textId = router.query.text_id;

  const { data, error } = useSWR(`texts/${textId}/view`, () => getViewText(textId), {
    revalidateOnFocus: false,
  });

  const { data: dataPurchasedInfo, error: errorPurchasedInfo } = useSWR(
    `texts/${textId}/purchase`,
    () => getPurchasedInfo(textId, authAxios),
    {
      revalidateOnFocus: false,
    },
  );

  const handleWriteReviewClick = () => {
    router.push(`/texts/${textId}/reviews/edit`);
  };

  if (error || errorPurchasedInfo) console.log('error');
  if (!data || !dataPurchasedInfo) return <h1>loading..</h1>;

  console.log(data);

  const extractToc = (body) => {
    var result = [];

    if (body === null) return result;
    const ast = remark().parse(body);

    visit(ast, 'heading', (child) => {
      const text = toString(child as unknown as Node);
      const id = slug(text);
      const depth = child.depth;
      result.push({
        text,
        id,
        depth,
      });
    });

    return result;
  };

  var tocs = {};
  Object.keys(data.chapters).map((id) => {
    const toc = extractToc(data.chapters[id].content);
    tocs[id] = toc;
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ width: '350px' }}>
        <Toc chapters={data.chapters} tocs={tocs} title={data.title} />
      </Box>
      <Box sx={{ width: '600px' }}>
        <ChapterContent data={data} />
      </Box>
    </Box>
  );
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

  console.log(data.chapters[chapterId].content);
  return (
    <Box sx={{ mt: 2 }}>
      <ReactMarkdown
        className='markdown-body p-3'
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeSlug]}
      >
        {data.chapters[chapterId].content}
      </ReactMarkdown>
    </Box>
  );
  //  const markdown = data.chapters.

  /*
  const { authAxios } = useContext(AuthContext);
  const { data, error } = useSWR(`/chapters/${chapterId}`, () => getChapter(chapterId, authAxios), {
    revalidateOnFocus: false,
  });

  if (error) console.log(error);
  if (!data) return <h1>loading..</h1>;

  console.log(data);
  return <Box>{data.content}</Box>;
  */
};

const Toc = ({ chapters, tocs, title }) => {
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

  return (
    <>
      <Box
        sx={{
          p: 1,
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          overflowY: 'auto',
          width: '350px',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <IconButton
            type='button'
            sx={{
              pr: 0,
              '&:hover': Consts.SX.IconButtonHover,
            }}
            onClick={() => {
              router.push(`/texts/${textId}`);
            }}
          >
            <ArrowBackIosIcon sx={{ my: 'auto' }} />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexFlow: 'column', p: 0.5 }}>
          {Object.keys(chapters).map((id) => {
            const fontWeight = cid == id ? 'bold' : 'normal';
            return (
              <>
                <Box
                  key={id}
                  sx={{
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    fontWeight: fontWeight,
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

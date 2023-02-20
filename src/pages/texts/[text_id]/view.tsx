import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import Edit from '@mui/icons-material/Edit';
import { Box, Divider, Drawer, IconButton, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { getChapter } from 'api/getChapter';
import { getPurchasedInfo } from 'api/getPurchasedInfo';
import { getTocs } from 'api/getTocs';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import { AuthContext } from 'components/auth/AuthContext';
import Logo from 'components/headers/Logo';
import SLogo from 'components/headers/SLogo';
import CodeBlock from 'components/markdown/CodeBlock';
import Markdown from 'components/markdown/ScholaMarkdownViewer';
import ScholaMarkdownViewer from 'components/markdown/ScholaMarkdownViewer';
import MenuCloseButton from 'components/sidemenu/MenuCloseButton';
import SideMenuIcon from 'components/sidemenu/SideMenuIcon';
import Consts from 'utils/Consts';
import { extractToc } from 'utils/extractToc';

import type { NextPage } from 'next';

const TextView: NextPage = () => {
  const router = useRouter();
  const { authAxios } = useContext(AuthContext);

  const textId = router.query.text_id;
  const mq = useMediaQuery('(min-width:1000px)');

  const [menuOpen, setMenuOpen] = useState(false);

  const { data: dataTocs, error: errorTocs } = useSWR(
    `texts/${textId}/toc`,
    () => getTocs(textId, authAxios),
    {
      revalidateOnFocus: false,
    },
  );

  const { data: dataPurchasedInfo, error: errorPurchasedInfo } = useSWR(
    `texts/${textId}/purchase`,
    () => getPurchasedInfo(textId, authAxios),
    {
      revalidateOnFocus: false,
    },
  );

  const [chapterOrder, setChapterOrder] = useState(null);

  useEffect(() => {
    if (dataTocs) {
      if (dataTocs.chapter_order != null) {
        setChapterOrder(JSON.parse(dataTocs.chapter_order));
      } else {
        setChapterOrder((chapterOrder = Object.keys(dataTocs.chapters)));
      }
    }
  }, [dataTocs]);

  if (errorTocs || errorPurchasedInfo) console.log('error');
  if (!dataTocs || !dataPurchasedInfo || !chapterOrder) return <CenterLoadingSpinner />;

  const mine = dataPurchasedInfo.yours;

  if (mq) {
    return (
      <Box sx={{ display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ width: '350px', position: 'fixed', top: 0, left: 0 }}>
          <Toc data={dataTocs} chapterOrder={chapterOrder} mine={mine} />
        </Box>
        <Box
          sx={{
            ml: '350px',
            width: '100%',
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          <ChapterContent mine={mine} dataTocs={dataTocs} chapterOrder={chapterOrder} />
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
            px: { xs: 0.4, sm: 2 },
          }}
        >
          <SideMenuIcon
            onClick={() => {
              setMenuOpen(true);
            }}
          />
          <Box
            className='scroll-without-bar'
            sx={{
              my: 'auto',
              mr: 'auto',
              width: '75%',
              fontSize: '0.9em',
              textAlign: 'center',
              overflow: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {dataTocs.title}
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
            data={dataTocs}
            chapterOrder={chapterOrder}
            mobile
            mine={mine}
            onClose={() => {
              setMenuOpen(false);
            }}
          />
        </Drawer>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'column',
            width: '100%',
          }}
        >
          <ChapterContent dataTocs={dataTocs} mine={mine} chapterOrder={chapterOrder} />
        </Box>
      </>
    );
  }
};

const ChapterContent = ({ dataTocs, mine, chapterOrder }) => {
  const { authAxios } = useContext(AuthContext);

  const router = useRouter();

  let chapterId;

  if (router.query.cid) {
    chapterId = router.query.cid;
  } else {
    if (chapterOrder.length > 0) {
      chapterId = chapterOrder[0];
    } else {
      return <>no chapter</>;
    }
  }

  const { data, error } = useSWR(`chapters/${chapterId}`, () => getChapter(chapterId, authAxios), {
    revalidateOnFocus: false,
  });

  if (error) console.log('error');
  if (!data) return <CenterLoadingSpinner />;

  const textId = router.query.text_id;
  const content = data.content;
  const title = data.title;
  const date = data.updated_at;

  let chapterNo = 0;

  chapterOrder.map((id, index) => {
    if (id == chapterId) chapterNo = index;
  });

  let nextChapter = null;
  let prevChapter = null;

  if (chapterNo > 0) {
    const index = chapterNo - 1;
    prevChapter = { id: chapterOrder[index], title: dataTocs.chapters[chapterOrder[index]].title };
  }
  if (chapterNo < chapterOrder.length - 1) {
    const index = chapterNo + 1;
    nextChapter = { id: chapterOrder[index], title: dataTocs.chapters[chapterOrder[index]].title };
  }

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
      onClick={() => {
        router.push(`/texts/${textId}/view?cid=${id}`);
      }}
    >
      <ArrowBackIosOutlinedIcon
        className='prevButtonInnerIcon'
        sx={{ color: '#cccccc', transform: 'scale(0.9)' }}
      />
      <Box
        className='prevButtonInnerText'
        sx={{
          ml: 1,
          mr: 'auto',
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
        ml: 'auto',
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
      onClick={() => {
        router.push(`/texts/${textId}/view?cid=${id}`);
      }}
    >
      <Box
        className='nextButtonInnerText'
        sx={{
          ml: 'auto',
          mr: 1,
          color: '#888888',
        }}
      >
        {title}
      </Box>
      <ArrowForwardIosOutlinedIcon
        className='nextButtonInnerIcon'
        sx={{ color: '#cccccc', transform: 'scale(0.9)' }}
      />
    </Box>
  );

  return (
    <>
      {mine && (
        <IconButton
          type='button'
          sx={{
            position: 'fixed',
            right: '10px',
            top: '10px',
            '&:hover': Consts.SX.IconButtonHover,
          }}
          onClick={() => {
            router.push(`/chapters/${chapterId}/edit?from=v`);
          }}
        >
          <Edit sx={{ my: 'auto', transform: 'scale(0.8)' }} />
        </IconButton>
      )}
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
        <Box
          sx={{
            px: 2,
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
          <Box sx={{ fontSize: '0.8em', color: Consts.COLOR.VIEW.ChapteUpdateDate }}>
            更新日: {new Date(date).toLocaleDateString('ja')}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          px: 2,
          my: 4,
          width: '100%',
          maxWidth: '760px',
          mx: 'auto',
          overflowX: 'hidden',
          overflowY: 'hidden',
        }}
      >
        <ScholaMarkdownViewer>{content}</ScholaMarkdownViewer>
      </Box>

      <Box
        sx={{
          p: 1,
          my: 4,
          width: '100%',
          maxWidth: '760px',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {prevChapter != null && <PrevButton id={prevChapter.id} title={prevChapter.title} />}
        {nextChapter != null && <NextButton id={nextChapter.id} title={nextChapter.title} />}
      </Box>
    </>
  );
};

const Toc = ({ data, mobile, onClose, chapterOrder, mine }) => {
  var tocs = {};
  Object.keys(data.chapters).map((id) => {
    const toc = extractToc(data.chapters[id].content);
    tocs[id] = toc;
  });

  const router = useRouter();
  const textId = router.query.text_id;

  const authorId = data.author_id;

  const imageUrl = data.photo_id
    ? Consts.IMAGE_STORE_URL + data.photo_id + '.png'
    : '/cover-default.svg';

  function handleChapterClick(id) {
    router.push(`/texts/${textId}/view?cid=${id}`);
    onClose();
  }

  const sx = mobile
    ? {
        p: 1,
        pb: 0,
        width: '280px',
        overflowY: 'auto',
        height: '100vh',
      }
    : {
        px: 2,
        borderRight: '1px solid #cccccc',
        width: '350px',
        display: 'flex',
        flexFlow: 'column',
        overflowY: 'auto',
        height: '100vh',
      };

  return (
    <>
      <Box sx={sx}>
        {mobile && <MenuCloseButton onClick={onClose} />}

        <Box sx={{ display: 'flex', flexFlow: 'column' }}>
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Box sx={{ width: 'fit-content', my: 1 }}>
              <Logo sx={{ width: 90 }} />
            </Box>
            {mine && (
              <IconButton
                type='button'
                sx={{
                  '&:hover': Consts.SX.IconButtonHover,
                  width: 'fit-content',
                  ml: 'auto',
                }}
                onClick={() => {
                  router.push(`/texts/${textId}/edit?chp`);
                }}
              >
                <Edit sx={{ my: 'auto', transform: 'scale(0.8)' }} />
              </IconButton>
            )}
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', my: 3 }}>
            <Link href={`/texts/${textId}`}>
              <a className='no-hover'>
                <Box
                  component='img'
                  sx={{
                    display: 'flex',
                    width: 'fit-content',
                    width: 105,
                    height: 58,
                    cursor: 'pointer',
                    '&:hover': {
                      filter: 'brightness(90%)',
                    },
                  }}
                  src={imageUrl}
                />
              </a>
            </Link>
            <Box sx={{ display: 'flex', flexFlow: 'column', ml: 1 }}>
              <Link href={`/texts/${textId}`}>
                <a className='no-hover'>
                  <Box
                    sx={{
                      fontSize: '0.9em',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      color: Consts.COLOR.VIEW.Title,
                      wordBreak: 'break-all',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                    onClick={() => router.push(`/texts/${textId}`)}
                  >
                    {data.title}
                  </Box>
                </a>
              </Link>
              <Link href={`/users/${authorId}`}>
                <a className='no-hover'>
                  <Box
                    sx={{
                      fontSize: '0.8em',
                      color: Consts.COLOR.VIEW.Author,
                      cursor: 'pointer',
                      wordBreak: 'break-all',
                      fontWeight: 'bold',
                      '&:hover': {
                        color: Consts.COLOR.VIEW.AuthorHover,
                      },
                    }}
                  >
                    {data.author_display_name}
                  </Box>
                </a>
              </Link>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexFlow: 'column', mb: 3 }}>
          {chapterOrder.map((id, index) => {
            const color =
              (router.query.cid == undefined && index == 0) || id == router.query.cid
                ? Consts.COLOR.VIEW.TocTitleHover
                : Consts.COLOR.VIEW.TocTitle;
            return (
              <Link href={`/texts/${textId}/view?cid=${id}`}>
                <a style={{ textDecoration: 'none' }}>
                  <Box
                    key={id}
                    sx={{
                      my: 0.9,
                      cursor: 'pointer',
                      fontSize: '0.8em',
                      fontWeight: 'bold',
                      color: color,
                      wordBreak: 'break-all',

                      '&:hover': {
                        color: Consts.COLOR.VIEW.TocTitleHover,
                      },
                    }}
                    onClick={() => handleChapterClick(id)}
                  >
                    {data.chapters[id].title}
                  </Box>
                </a>
              </Link>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default TextView;

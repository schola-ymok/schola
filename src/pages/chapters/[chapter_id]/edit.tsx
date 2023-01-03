import {
  Card,
  Box,
  Button,
  Checkbox,
  Snackbar,
  CardContent,
  Link,
  Slider,
  IconButton,
  Grid,
  TextField,
  Divider,
  Select,
  MenuItem,
  Stack,
  Rating,
  Typography,
  InputBase,
  useMediaQuery,
  AppBar,
  Fab,
} from '@mui/material';
import 'katex/dist/katex.min.css';

import InsertPhotoIcon from '@mui/icons-material/InsertPhotoOutlined';
import AddIcon from '@mui/icons-material/Add';
import Drawer from '@mui/material/Drawer';
import { ref, uploadBytes } from 'firebase/storage';
import router, { useRouter } from 'next/router';
import { useState, useEffect, useContext, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { ReactSortable } from 'react-sortablejs';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import useSWR, { useSWRConfig } from 'swr';

import { createNewChapter } from 'api/createNewChapter';
import { getChapter } from 'api/getChapter';
import { getChapterList } from 'api/getChapterList';
import { getMyText } from 'api/getMyText';
import { releaseText } from 'api/releaseText';
import { updateChapter } from 'api/updateChapter';
import { updateText } from 'api/updateText';
import HomeTextList from 'components/HomeTextList';
import TextCard from 'components/TextCard';
import { AuthContext } from 'components/auth/AuthContext';
import EditChapterHeader from 'components/headers/EditChapterHeader';
import EditChapterLayout from 'components/layouts/EditChapterLayout';
import RootCategory from 'components/sidemenu/RootCategory';
import { storage } from 'libs/firebase/firebase';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import { pagenation } from 'utils/pagenation';

import type { NextPage } from 'next';

const EditChapter: NextPage = () => {
  const router = useRouter();
  const { authAxios } = useContext(AuthContext);

  const chapterId = router.query.chapter_id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const { mutate } = useSWRConfig();

  const mq = useMediaQuery('(min-width:600px)');

  const { data, error } = useSWR(`chapters/${chapterId}`, () => getChapter(chapterId, authAxios), {
    revalidateOnFocus: false,
  });

  const [cursorPosition, setCursorPosition] = useState(0);

  const inputRef = useRef();
  const viewerRef = useRef();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const type = e.target.files[0].type;
        const names = e.target.files[0].name.split('.');
        const imageRef = ref(
          storage,
          'images/chapters/' + chapterId + '-' + genid(8) + '.' + names[1],
        );
        uploadBytes(imageRef, e.target.files[0], { contentType: type }).then((snapshot) => {
          insertText(
            '![](https://storage.googleapis.com/texttest-162b6.appspot.com/' +
              snapshot.metadata.fullPath +
              ')',
          );
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const insertText = (text) => {
    setContent(
      content.substring(0, cursorPosition) +
        text +
        content.substring(cursorPosition, content.length),
    );
  };

  useEffect(() => {
    if (data) {
      if (data.title) setTitle(data.title);
      if (data.content) setContent(data.content);
    }
  }, [data]);

  async function handleSaveClick() {
    const { error } = await updateChapter(chapterId, title, content, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`chapters/${chapterId}`);
    setSnackBarOpen(true);
  }

  if (error) console.log(error);
  if (!data) return <h1>loading..</h1>;

  /*
      <EditChapterHeader
        backPath={`/texts/${data.text_id}/edit`}
        release={data.is_released == 1 ? true : false}
        handleSaveClick={handleSaveClick}
      />
      */
  const handleScroll = (event) => {
    console.log(event.currentTarget.scrollTop);
    const percentage =
      event.currentTarget.scrollTop /
      (event.currentTarget.scrollHeight - event.currentTarget.offsetHeight);
    console.log(percentage);
    viewerRef.current.scrollTo(
      percentage * (event.currentTarget.scrollHeight - event.currentTarget.offsetHeight),
    );
  };
  /*
      <EditChapterHeader />

      <Box
        sx={{
          width: { xs: '98%', md: '100%' },
          mx: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          p: { xs: 0.4, sm: 1 },
          '&:-webkit-scrollbar': {
            width: '10px',
            cursor: 'pointer',
          },
          '&:-webkit-scrollbar-thumb': {
            backgroundColor: '#008080',
          },
        }}
      >
      */

  return (
    <>
      <EditChapterHeader
        handleSaveClick={handleSaveClick}
        handleTitleChange={handleTitleChange}
        title={title}
      />
      <Box
        sx={{
          display: 'flex',
          borderWidth: '2px 0px 2px 0px',
          borderStyle: 'solid',
          borderColor: '#a0a0a0',
        }}
      >
        <Box sx={{ width: '50%' }}>
          <textarea
            placeholder='マークダウンで入力'
            className='mde'
            onChange={handleContentChange}
            onScroll={handleScroll}
            value={content}
          />
        </Box>
        <Box
          ref={viewerRef}
          sx={{
            width: '50%',
            height: 'calc(100vh - 60px)',
            overflowY: 'auto',
            borderWidth: '0px 0px 0px 2px',
            borderStyle: 'dotted',
            borderColor: '#a0a0a0',
            p: 1,
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
            {content}
          </ReactMarkdown>
        </Box>
        <Fab
          sx={{
            position: 'fixed',
            left: '10px',
            bottom: '30px',
            backgroundColor: '#bbbbbb',
            '&:hover': { backgroundColor: '#dddddd' },
          }}
          size='small'
        >
          <IconButton type='button' component='label'>
            <InsertPhotoIcon />
            <input
              type='file'
              accept='image/*'
              onChange={handleSelectFile}
              style={{ display: 'none' }}
            />
          </IconButton>
        </Fab>
      </Box>
    </>
  );
};

/*
          <ContentInput
            content={content}
            handleContentChange={handleContentChange}
            setCursorPosition={setCursorPosition}
            inputRef={inputRef}
          />
          */
const TitleInput = ({ title, handleTitleChange }) => (
  <Box
    sx={{
      p: 1,
      border: '2px solid ' + Consts.COLOR.Grey,
      '&:hover': {
        border: '2px solid ' + Consts.COLOR.Primary,
      },
    }}
  >
    <InputBase
      placeholder='タイトル'
      value={title}
      sx={{ fontSize: '1.3em', fontWeight: 'bold' }}
      variant='outlined'
      fullWidth
      onChange={handleTitleChange}
    />
  </Box>
);

const ContentInput = ({ content, handleContentChange, inputRef, setCursorPosition }) => (
  <InputBase
    placeholder='マークダウンで入力'
    value={content}
    onChange={handleContentChange}
    variant='outlined'
    fullWidth
    multiline
    minRows={10}
    maxRows={25}
    sx={{ border: '2px solid pink' }}
    onSelect={() => {
      setCursorPosition(inputRef.current.selectionStart);
    }}
    inputRef={inputRef}
  />
);

EditChapter.getLayout = (page) => <EditChapterLayout>{page}</EditChapterLayout>;
export default EditChapter;

import {
    AppBar, Box,
    Button, Divider, Fab, InputBase, Snackbar, useMediaQuery
} from '@mui/material';
import 'katex/dist/katex.min.css';

import AddIcon from '@mui/icons-material/Add';
import { ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import useSWR, { useSWRConfig } from 'swr';

import { getChapter } from 'api/getChapter';
import { updateChapter } from 'api/updateChapter';
import { AuthContext } from 'components/auth/AuthContext';
import EditChapterHeader from 'components/headers/EditChapterHeader';
import EditChapterLayout from 'components/layouts/EditChapterLayout';
import { storage } from 'libs/firebase/firebase';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';

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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    const lineHeightMap = buildLineHeightMap(e.target.value, inputRef.current);
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

  return (
    <>
      <AppBar sx={{ backgroundColor: '#ffffff' }} position='fixed'>
        <EditChapterHeader />
        <Divider />
      </AppBar>

      <Box
        sx={{
          mt: 8,
          width: { xs: '98%', md: '100%' },
          mx: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          p: { xs: 0.4, sm: 1 },
        }}
      >
        <Box sx={{ width: '50%' }}>
          <TitleInput title={title} handleTitleChange={handleTitleChange} />
          <ContentInput
            content={content}
            handleContentChange={handleContentChange}
            setCursorPosition={setCursorPosition}
            inputRef={inputRef}
          />
          <Fab color='primary' variant='extended'>
            <AddIcon />
            <AddIcon />
          </Fab>
        </Box>
        <Box sx={{ width: '50%', p: 1 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
            {'# ' + title + '\n' + content}
          </ReactMarkdown>
        </Box>

        <Snackbar
          open={snackBarOpen}
          autoHideDuration={1000}
          message='Saved'
          onClose={() => {
            setSnackBarOpen(false);
          }}
        />
        <Button variant='contained' component='label'>
          upload
          <input
            type='file'
            accept='image/*'
            onChange={handleSelectFile}
            style={{ display: 'none' }}
          />
        </Button>
      </Box>
    </>
  );
};
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
  <Box
    sx={{
      p: 1,
      mt: 1,
      border: '2px solid ' + Consts.COLOR.Grey,
      '&:hover': {
        border: '2px solid ' + Consts.COLOR.Primary,
      },
    }}
  >
    <InputBase
      placeholder='マークダウンで入力'
      value={content}
      onChange={handleContentChange}
      variant='outlined'
      fullWidth
      multiline
      minRows={20}
      sx={{}}
      onSelect={() => {
        setCursorPosition(inputRef.current.selectionStart);
      }}
      inputRef={inputRef}
    />
  </Box>
);

const buildLineHeightMap = (markdown, textarea) => {
  const computedStyle = window.getComputedStyle(textarea);
  console.log(computedStyle);
};

EditChapter.getLayout = (page) => <EditChapterLayout>{page}</EditChapterLayout>;
export default EditChapter;

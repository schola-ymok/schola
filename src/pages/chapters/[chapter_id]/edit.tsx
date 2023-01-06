import { Box, Fab, IconButton, InputBase } from '@mui/material';
import 'katex/dist/katex.min.css';

import InsertPhotoIcon from '@mui/icons-material/InsertPhotoOutlined';
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
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import { AuthContext } from 'components/auth/AuthContext';
import EditChapterHeader from 'components/headers/EditChapterHeader';
import EditChapterLayout from 'components/layouts/EditChapterLayout';
import { storage } from 'libs/firebase/firebase';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';

import type { NextPage } from 'next';
import 'github-markdown-css/github-markdown.css';

const EditChapter: NextPage = () => {
  const router = useRouter();
  const { authAxios } = useContext(AuthContext);

  const chapterId = router.query.chapter_id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  const { mutate } = useSWRConfig();

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
        const fileName = chapterId + '-' + genid(8) + '.' + names[1];
        const imageRef = ref(storage, 'user_upload/' + fileName);
        uploadBytes(imageRef, e.target.files[0], { contentType: type }).then((snapshot) => {
          insertText('![](' + Consts.IMAGE_STORE_URL + fileName + ')');
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
    setIsSaving(true);
    const { error } = await updateChapter(chapterId, title, content, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`chapters/${chapterId}`);
    setIsSaving(false);
  }

  if (error) console.log(error);
  if (!data) return <CenterLoadingSpinner />;

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

  return (
    <>
      <EditChapterHeader
        handleSaveClick={handleSaveClick}
        handleTitleChange={handleTitleChange}
        title={title}
        textId={data.text_id}
        chapterId={chapterId}
        isSaving={isSaving}
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
          <Box sx={{ fontWeight: 'bold', fontSize: '2.1em', mb: 1 }}>{title}</Box>
          <ReactMarkdown
            className='markdown-body p-3'
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
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

EditChapter.getLayout = (page) => <EditChapterLayout>{page}</EditChapterLayout>;
export default EditChapter;

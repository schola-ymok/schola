import { Box, Fab, IconButton, InputBase, Snackbar } from '@mui/material';
import 'katex/dist/katex.min.css';

import { ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { getChapter } from 'api/getChapter';
import { updateChapter } from 'api/updateChapter';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import { AuthContext } from 'components/auth/AuthContext';
import EditChapterHeader from 'components/headers/EditChapterHeader';
import EditChapterLayout from 'components/layouts/EditChapterLayout';
import Markdown from 'components/markdown/ScholaMarkdownViewer';
import ScholaMarkdownViewer from 'components/markdown/ScholaMarkdownViewer';
import { storage } from 'libs/firebase/firebase';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import { useKeybind } from 'utils/useKeybind';

import type { NextPage } from 'next';

const EditChapter: NextPage = () => {
  const router = useRouter();
  const { authAxios } = useContext(AuthContext);

  const chapterId = router.query.chapter_id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState(0);
  const [changed, setChanged] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState({ open: false, message: '' });

  const { mutate } = useSWRConfig();

  const { data, error } = useSWR(`chapters/${chapterId}`, () => getChapter(chapterId, authAxios), {
    revalidateOnFocus: false,
  });

  const [cursorPosition, setCursorPosition] = useState(0);

  const inputRef = useRef();
  const viewerRef = useRef();

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setChanged(true);
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

  useKeybind({
    key: 's',
    ctrlKey: true,
    onKeyDown: () => {
      if (changed) handleSaveClick();
    },
  });

  async function handleSaveClick() {
    setIsSaving(true);
    const { error } = await updateChapter(chapterId, title, content, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    setNotice({
      open: true,
      message: '保存しました',
    });

    setChanged(false);
    mutate(`chapters/${chapterId}`);
    setIsSaving(false);
  }

  if (error) console.log(error);
  if (!data) return <CenterLoadingSpinner />;

  const handleScroll = (event) => {
    //    console.log(event.currentTarget.scrollTop);
    const percentage =
      event.currentTarget.scrollTop /
      (event.currentTarget.scrollHeight - event.currentTarget.offsetHeight);

    viewerRef?.current?.scrollTo(
      0,
      percentage * (viewerRef.current.scrollHeight - viewerRef.current.offsetHeight),
    );
  };

  const handleBackClick = () => {
    if (router.query.from == 'v') {
      router.push(`/texts/${data.text_id}/view?cid=${chapterId}`);
    } else {
      router.push(`/texts/${data.text_id}/edit?chp`);
    }
  };

  const leftWidth = mode == 1 ? '100%' : '50%';
  const rightWidth = mode == 2 ? '100%' : '50%';

  return (
    <>
      <EditChapterHeader
        handleSaveClick={handleSaveClick}
        handleSelectFile={handleSelectFile}
        handleBackClick={handleBackClick}
        handleModeChange={(mode) => {
          setMode(mode);
        }}
        textId={data.text_id}
        chapterId={chapterId}
        isSaving={isSaving}
        changed={changed}
      />
      <Box
        sx={{
          display: 'flex',
          borderWidth: '1px 0px 0px 0px',
          borderStyle: 'solid',
          borderColor: '#a0a0a0',
          height: 'calc(100vh - 40px)',
        }}
      >
        {mode !== 2 && (
          <Box sx={{ width: leftWidth }}>
            <textarea
              placeholder='マークダウンで入力'
              className='mde'
              onChange={handleContentChange}
              onScroll={handleScroll}
              value={content}
            />
          </Box>
        )}
        {mode !== 1 && (
          <Box
            ref={viewerRef}
            sx={{
              width: rightWidth,
              overflowY: 'auto',
              borderWidth: '0px 0px 0px 1px',
              borderStyle: 'dotted',
              borderColor: '#a0a0a0',
              p: 1,
            }}
          >
            <ScholaMarkdownViewer>{content}</ScholaMarkdownViewer>
          </Box>
        )}
      </Box>
      <Snackbar
        open={notice.open}
        message={notice.message}
        autoHideDuration={1000}
        onClose={() => {
          setNotice({ open: false });
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

EditChapter.getLayout = (page) => <EditChapterLayout>{page}</EditChapterLayout>;
export default EditChapter;

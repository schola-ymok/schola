import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import Consts from 'utils/Consts';

const RichTextEditor = dynamic(() => import('react-rte'), { ssr: false });

const RTEditor = ({ placeholder, initialValue, onChange }) => {
  const [editorState, setEditorState] = useState();
  const [init, setInit] = useState(true);

  useEffect(() => {
    const importModule = async () => {
      const module = await import('react-rte');

      if (initialValue) {
        setEditorState(module.createValueFromString(initialValue, 'html'));
      } else {
        setEditorState(module.createEmptyValue());
      }
    };
    importModule();
  }, []);

  const toolbarConfig = {
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
      { label: 'Italic', style: 'ITALIC' },
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: 'UL', style: 'unordered-list-item' },
      { label: 'OL', style: 'ordered-list-item' },
    ],
  };

  const _onChange = (value) => {
    /*
    if (init) {
      setInit(false);
      return;
    }
    */
    setEditorState(value);
    onChange(value.toString('html'));
  };

  const handleBeforeInput = () => {};

  if (!editorState) return null;

  return (
    <>
      <Box
        sx={{
          border: '2px solid #aaaaaa',
          '&:hover': {
            border: '2px solid ' + Consts.COLOR.Primary,
          },
        }}
      >
        <RichTextEditor
          rootStyle={{
            border: '0px',
            fontFamily: [
              'Meiryo',
              '"Helvetica Neue"',
              'sans-serif',
              '"Hiragino Kaku Gothic ProN"',
              '"Hiragino Sans"',
              'Arial',
            ],
          }}
          editorStyle={{
            fontSize: '1em',
          }}
          placeholder={placeholder}
          value={editorState}
          onChange={_onChange}
          handleBeforeInput={handleBeforeInput}
          toolbarConfig={toolbarConfig}
        />
      </Box>
    </>
  );
};

export default RTEditor;

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, IconButton, Menu } from '@mui/material';
import { useState } from 'react';

import ChapterTitleSettingDialog from 'components/ChapterTitleSettingDialog';
import Consts from 'utils/Consts';

import SMenuItem from './SMenuItem';

const ChapterListMenuButton = ({
  item,
  handleDelete,
  handleEdit,
  handleToggleTrialReadingAvailable,
  handleTitleChange,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [chapterNameSettingOpen, setChapterMenuSettingOpen] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <IconButton
          type='button'
          sx={{
            width: '32px',
            height: '32px',
            p: '7px',
            '&:hover': Consts.SX.IconButtonHover,
          }}
          onClick={handleMenu}
        >
          <MoreHorizIcon />
        </IconButton>

        <Menu
          id='menu-appbar'
          anchorEl={anchorEl}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              border: '2px solid #aaaaaa',
              mt: 0.5,
              filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.32))',
              width: 150,
            },
          }}
        >
          <SMenuItem
            onClick={() => {
              handleEdit(item);
              handleClose();
            }}
          >
            編集
          </SMenuItem>
          <SMenuItem
            onClick={() => {
              setChapterMenuSettingOpen(true);
              handleClose();
            }}
          >
            名前の変更
          </SMenuItem>
          <SMenuItem
            onClick={() => {
              handleToggleTrialReadingAvailable(item);
              handleClose();
            }}
          >
            {item.is_trial_reading_available == 1 ? '無料公開を解除' : '無料公開'}
          </SMenuItem>
          <SMenuItem
            onClick={() => {
              handleDelete(item);
              handleClose();
            }}
          >
            削除
          </SMenuItem>
        </Menu>
      </Box>
      <ChapterTitleSettingDialog
        key={item?.id}
        title={item?.title}
        open={chapterNameSettingOpen}
        onChange={handleTitleChange}
        onClose={() => {
          setChapterMenuSettingOpen(false);
        }}
      />
    </>
  );
};

export default ChapterListMenuButton;

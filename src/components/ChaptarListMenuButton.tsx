import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import ChapterTitleSettingDialog from 'components/ChapterTitleSettingDialog';
import Consts from 'utils/Consts';
import SMenuItem from './SMenuItem';

const ChapterListMenuButton = ({ item, handleDelete, handleEdit, handleTitleChange }) => {
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
              setChapterMenuSettingOpen(true);
              handleClose();
            }}
            sx={{
              '&:hover': {
                color: Consts.COLOR.Primary,
              },
            }}
          >
            名前の変更
          </SMenuItem>
          <SMenuItem
            onClick={() => {
              handleEdit();
              handleClose();
            }}
            sx={{
              '&:hover': {
                color: Consts.COLOR.Primary,
              },
            }}
          >
            編集
          </SMenuItem>
          <SMenuItem
            sx={{
              '&:hover': {
                color: Consts.COLOR.Primary,
              },
            }}
            onClick={() => {
              handleEdit();
              handleClose();
            }}
          >
            試し読み可能に
          </SMenuItem>
          <SMenuItem
            sx={{
              '&:hover': {
                color: Consts.COLOR.Primary,
              },
            }}
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
        title={item.title}
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

import {
    Avatar, Box, Divider, IconButton,
    Menu,
    MenuItem,
    Stack
} from '@mui/material';
import router from 'next/router';
import { useContext, useState } from 'react';

import { AppContext } from 'states/store';
import Consts from 'utils/Consts';


const HeaderAvatarButton = () => {
  const { state, dispatch } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton
        type='button'
        sx={{
          p: '7px',
          '&:hover': Consts.SX.IconButtonHover,
        }}
        onClick={handleMenu}
      >
        {state.photoId ? (
          <Avatar
            sx={{ width: 40, height: 40 }}
            src={Consts.IMAGE_STORE_URL + state.photoId + '.png'}
          />
        ) : (
          <Avatar sx={{ width: 40, height: 40 }}>{state.accountName.substring(0, 2)}</Avatar>
        )}
      </IconButton>

      <Menu
        id='menu-appbar'
        anchorEl={anchorEl}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            border: '2px solid #aaaaaa',
            mt: 0.5,
            filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.32))',
            width: 200,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            router.push('/account');
            handleClose();
          }}
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
        >
          <Stack>
            <Box
              sx={{
                fontSize: '0.9em',
                fontWeight: 'bold',
                overflowWrap: 'anywhere',
                whiteSpace: 'normal',
              }}
            >
              {state.displayName}
            </Box>
            <Box sx={{ fontSize: '0.6em', typography: 'subtitle2', color: '#aaaaaa' }}>
              {state.accountName}
            </Box>
          </Stack>
        </MenuItem>
        <Divider />
        <MenuItem
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
          onClick={() => {
            router.push('/dashboard');
            handleClose();
          }}
        >
          ダッシュボード
        </MenuItem>
        <MenuItem
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
          onClick={() => {
            router.push('/account/texts');
            handleClose();
          }}
        >
          購入済みテキスト
        </MenuItem>
        <MenuItem
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
          onClick={() => {
            router.push('/signout');
            handleClose();
          }}
        >
          ログアウト
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HeaderAvatarButton;

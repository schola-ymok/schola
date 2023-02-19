import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import router from 'next/router';
import { useContext, useState } from 'react';

import SMenuItem from 'components/SMenuItem';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';
import { omitstr } from 'utils/omitstr';

const HeaderAvatarButton = () => {
  const { state } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const imageUrl = state.photoId
    ? Consts.IMAGE_STORE_URL + state.photoId + '.png'
    : '/avatar-default.svg';

  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton
        type='button'
        sx={{
          p: '7px',
          '&:hover': {
            backgroundColor: 'inherit',
          },
          '&:hover .child': {
            filter: 'brightness(90%)',
          },
          // Consts.SX.IconButtonHover,
        }}
        onClick={handleMenu}
      >
        <Avatar
          className='child'
          sx={{
            width: 40,
            height: 40,
            //            '&:hover': {
            //              filter: 'brightness(90%)',
            //            },
          }}
          src={imageUrl}
        />
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
        <SMenuItem
          onClick={() => {
            router.push('/account');
            handleClose();
          }}
          height={'50px'}
        >
          <Stack>
            <Box
              className='two-line'
              sx={{
                fontSize: '0.9em',
                fontWeight: 'bold',
                overflowWrap: 'anywhere',
                whiteSpace: 'normal',
                wordBreak: 'break-all',
              }}
            >
              {state.displayName}
            </Box>
            <Box sx={{ fontSize: '0.6em', typography: 'subtitle2', color: '#aaaaaa' }}>
              {state.accountName}
            </Box>
          </Stack>
        </SMenuItem>
        <Divider sx={{ my: 0.5 }} />
        <SMenuItem
          onClick={() => {
            router.push('/account/texts');
            handleClose();
          }}
        >
          購入済みテキスト
        </SMenuItem>
        <SMenuItem
          onClick={() => {
            router.push('/dashboard');
            handleClose();
          }}
        >
          ダッシュボード
        </SMenuItem>
        <SMenuItem
          onClick={() => {
            router.push('/signout');
            handleClose();
          }}
        >
          ログアウト
        </SMenuItem>
      </Menu>
    </Box>
  );
};

export default HeaderAvatarButton;

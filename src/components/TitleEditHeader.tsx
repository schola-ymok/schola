import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  useMediaQuery,
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import Link from 'next/link';
import router from 'next/router';
import { useContext, useState } from 'react';

import { FirebaseSignInForm } from 'components/auth/FirebaseSignInForm';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

const Header = ({ titleEditMode }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { state, dispatch } = useContext(AppContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const LoginButton = () => {
    return (
      <Button
        variant='contained'
        onClick={handleClickOpen}
        sx={{ pr: 2, pl: 2, fontWeight: 'bold' }}
      >
        ログイン
      </Button>
    );
  };

  const AvatarButton = () => {
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
            <Avatar sx={{ width: 40, height: 40 }} onClick={handleMenu}>
              {state.accountName.substring(0, 2)}
            </Avatar>
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
              border: '1px solid #aaaaaa',
              mt: 0.5,
              filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.32))',
              width: 200,
            },
          }}
        >
          <MenuItem onClick={() => router.push('/account')}>
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
          <MenuItem sx={{ fontSize: '0.9em' }} onClick={() => router.push('/dashboard')}>
            ダッシュボード
          </MenuItem>
          <MenuItem sx={{ fontSize: '0.9em' }} onClick={() => router.push('/account/texts')}>
            購入済みテキスト
          </MenuItem>
          <MenuItem
            sx={{ fontSize: '0.9em' }}
            onClick={() => {
              router.push('/signout');
            }}
          >
            ログアウト
          </MenuItem>
        </Menu>
      </Box>
    );
  };

  const handleSearch = () => {};

  const handleNewText = () => {
    router.push('/texts/new');
  };

  const mq = useMediaQuery('(min-width:600px)');

  const TextEditModeItems = () => {
    return <></>;
  };

  const NormalModeItems = () => {
    return (
      <>
        <IconButton
          type='button'
          sx={{
            pr: 1,
            '&:hover': Consts.SX.IconButtonHover,
          }}
          onClick={handleSearch}
        >
          <NotificationsOutlinedIcon sx={{ transform: 'scale(1.2)' }} />
        </IconButton>

        <AvatarButton />

        <Button
          variant='contained'
          onClick={handleNewText}
          sx={{
            ml: 1,
            pr: 3,
            pl: 3,
            height: 40,
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
          }}
        >
          作成
        </Button>
      </>
    );
  };

  const Left = () => {
    if (titleEditMode) {
      return (
        <Box sx={{ fontWeight: 'bold' }}>
          <Link href='/'>
            <a>戻る</a>
          </Link>
        </Box>
      );
    } else {
      return Logo();
    }
  };

  const Logo = () => {
    return (
      <>
        <Link href='/'>
          <a style={{ display: 'flex', alignItems: 'center' }}>
            <img src='/logo.png' />
          </a>
        </Link>
        <Box
          sx={{
            display: { xs: 'none', sm: 'block' },
            ml: 2,
          }}
        >
          <Search
            handleSearch={handleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </Box>
      </>
    );
  };

  return (
    <>
      <Stack sx={{ pt: { xs: 0, sm: 1 }, pb: { xs: 0, sm: 1 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            pl: { xs: 1, sm: 2 },
            pr: { xs: 1, sm: 2 },
          }}
        >
          <Left />

          <Box
            sx={{
              display: 'flex',
              marginLeft: 'auto',
              alignItems: 'center',
            }}
          >
            {state.isLoggedin ? <NormalModeItems /> : <LoginButton />}
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'block', sm: 'none' },
            m: 1,
          }}
        >
          <Search
            fullWidth={true}
            handleSearch={handleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </Box>
      </Stack>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <FirebaseSignInForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const Search = ({ fullWidth, handleSearch, searchQuery, setSearchQuery }) => {
  const width = fullWidth ? '100%' : '260px';
  return (
    <Box
      sx={{
        border: '1px solid #aaaaaa',
        width: { width },
        '&:hover': {
          border: '2px solid #000000',
        },
      }}
    >
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          width: 'calc(100% - 50px)',
        }}
        placeholder='検索'
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            handleSearch();
          }
        }}
      />
      <IconButton
        type='button'
        sx={{
          p: '7px',
          '&:hover': Consts.SX.IconButtonHover,
        }}
        aria-label='search'
        onClick={handleSearch}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default Header;

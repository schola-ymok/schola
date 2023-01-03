import {
  Box, Stack
} from '@mui/material';

import { useContext } from 'react';

import AddNewTextButton from 'components/headers/AddNewTextButton';
import HeaderAvatarButton from 'components/headers/HeaderAvatarButton';
import LoginButton from 'components/headers/LoginButton';
import Logo from 'components/headers/Logo';
import NotificationIcon from 'components/headers/NotificationIcon';
import SearchBox from 'components/headers/SearchBox';
import { AppContext } from 'states/store';

const Header = ({}) => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <>
      <Stack sx={{ pt: { xs: 0, sm: 1 }, pb: { xs: 0, sm: 1 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            px: { xs: 0.4, sm: 2 },
          }}
        >
          <Logo />

          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              ml: 2,
            }}
          >
            <SearchBox />
          </Box>

          <Box
            sx={{
              display: 'flex',
              marginLeft: 'auto',
              alignItems: 'center',
            }}
          >
            {state.isLoggedin ? (
              <>
                <NotificationIcon /> <HeaderAvatarButton /> <AddNewTextButton />
              </>
            ) : (
              <LoginButton />
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'block', sm: 'none' },
            m: 0.4,
          }}
        >
          <SearchBox fullWidth />
        </Box>
      </Stack>
    </>
  );
};

export default Header;

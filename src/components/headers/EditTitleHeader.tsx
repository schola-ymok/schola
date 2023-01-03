import {
    Box
} from '@mui/material';
import { useContext } from 'react';

import { AppContext } from 'states/store';

import BackButton from './BackButton';
import AvatarIcon from './HeaderAvatarButton';
import LoginButton from './LoginButton';

const EditTitleHeader = () => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          pl: { xs: 1, sm: 2 },
          pr: { xs: 0.4, sm: 2 },
        }}
      >
        <BackButton />

        <Box
          sx={{
            display: 'flex',
            marginLeft: 'auto',
            alignItems: 'center',
          }}
        >
          {state.isLoggedin ? (
            <>
              <AvatarIcon />
            </>
          ) : (
            <LoginButton />
          )}
        </Box>
      </Box>
    </>
  );
};

export default EditTitleHeader;

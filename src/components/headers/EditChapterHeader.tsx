import {
  AppBar,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  alpha,
  TextField,
  Avatar,
  useMediaQuery,
  Divider,
  Box,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import router from 'next/router';
import { useState, useContext } from 'react';

import { FirebaseSignInForm } from 'components/auth/FirebaseSignInForm';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

import AddNewTextButton from './AddNewTextButton';
import BackButton from './BackButton';
import EditorButtonImage from './EditorButtonImage';
import EditorButtonList from './EditorButtonList';
import AvatarIcon from './HeaderAvatarButton';
import LoginButton from './LoginButton';
import Logo from './Logo';
import NotificationIcon from './NotificationIcon';
import SearchBox from './SearchBox';

const EditChapterHeader = ({ handleSaveClick, handleTitleChange, title }) => {
  const { state, dispatch } = useContext(AppContext);
  const [toggleViewModeValue, setToggleViewModeValue] = useState('both');
  const [enableSave, setEnableSave] = useState(true);

  const mq = useMediaQuery('(min-width:600px)');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        px: 1,
      }}
    >
      <BackButton />

      <Box sx={{ fontSize: '1.0em', ml: 2, py: 0.5, width: '100%', my: 'auto' }}>
        <InputBase
          placeholder='チャプターのタイトルを入力'
          value={title}
          variant='outlined'
          fullWidth
          onChange={handleTitleChange}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          marginLeft: 'auto',
          alignItems: 'center',
        }}
      >
        <Button
          variant='contained'
          disabled={!enableSave}
          onClick={handleSaveClick}
          sx={{
            ml: 1,
            pr: 3,
            pl: 3,
            height: 30,
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
          }}
        >
          保存
        </Button>
      </Box>
    </Box>
  );
};

export default EditChapterHeader;

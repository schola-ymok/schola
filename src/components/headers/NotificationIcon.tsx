import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { IconButton, Menu, Box } from '@mui/material';
import Badge from '@mui/material/Badge';
import htmlParse from 'html-react-parser';
import { useContext, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { getLatestNotification } from 'api/getLatestNotification';
import { AuthContext } from 'components/auth/AuthContext';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

const LatestNotificationList = () => {
  const { authAxios } = useContext(AuthContext);

  const { data, error } = useSWR(`api/notices?latest`, () => getLatestNotification(authAxios), {
    revalidateOnFocus: false,
  });

  if (error) return <>error</>;
  if (!data) return <>loading</>;

  console.log(error);
  console.log(data);

  return (
    <>
      {data.notices.map((item) => {
        const html = htmlParse('<p><b>線形代数入門</b>の販売申請が承認されました</p>');
        return <NoticeItem onClick={() => {}}>{html}</NoticeItem>;
      })}
    </>
  );
};

const NoticeItem = ({ children, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      p: 1,
      fontSize: '0.9em',
      alignItems: 'center',
      height: '54px',
      '&:hover': {
        backgroundColor: '#efefef',
        cursor: 'pointer',
      },
    }}
  >
    {children}
  </Box>
);

const NotificationIcon = ({}) => {
  const { state } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const _NotificationIcon = () => {
    if (state.noticeCount > 0) {
      return (
        <Badge
          variant='dot'
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#cc0000',
            },
          }}
        >
          <NotificationsOutlinedIcon sx={{ transform: 'scale(1.2)' }} />
        </Badge>
      );
    } else {
      return <NotificationsOutlinedIcon sx={{ transform: 'scale(1.2)' }} />;
    }
  };

  return (
    <>
      <IconButton
        type='button'
        sx={{
          pr: 1,
          '&:hover': Consts.SX.IconButtonHover,
        }}
        onClick={handleMenu}
      >
        <_NotificationIcon />
      </IconButton>

      <Menu
        id='menu-appbar'
        anchorEl={anchorEl}
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
            width: 250,
          },
        }}
      >
        {state.isLoggedin === true && <LatestNotificationList />}
      </Menu>
    </>
  );
};

export default NotificationIcon;

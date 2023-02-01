import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { IconButton, Menu, Box, Divider, Link } from '@mui/material';
import Badge from '@mui/material/Badge';
import htmlParse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { getLatestNotification } from 'api/getLatestNotification';
import { getNotificationCount } from 'api/getNotificationCount';
import { AuthContext } from 'components/auth/AuthContext';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

const LatestNotificationList = ({ setShowBadge, handleClose }) => {
  const { authAxios } = useContext(AuthContext);
  const router = useRouter();

  const { data, error } = useSWR(`api/notices?latest`, () => getLatestNotification(authAxios), {
    revalidateOnFocus: false,
  });

  if (error) return <>error</>;
  if (!data) return <>loading</>;

  setShowBadge(false);

  return (
    <>
      {data.notices.map((item, index) => {
        const html = htmlParse(item.message);
        const date = new Date(item.created_at).toLocaleString('ja');
        return (
          <>
            {index > 0 && <Divider />}
            <NoticeItem
              onClick={() => {
                router.push(item.url);
              }}
            >
              <Box sx={{ fontSize: '0.9em' }}>{html}</Box>
              <Box sx={{ ml: 'auto', fontSize: '0.7em', color: '#999999' }}>{date}</Box>
            </NoticeItem>
          </>
        );
      })}
      {data.total > Consts.NOTICE_MENU_LIST_NUM && (
        <Box sx={{ fontSize: '0.9em', display: 'flex', justifyContent: 'center' }}>
          <Box
            onClick={() => {
              handleClose();
              router.push('/notices');
            }}
            sx={{
              fontSize: '0.9em',
              pt: 0.4,
              '&:hover': {
                color: Consts.COLOR.Primary,
                textDecoration: 'underline',
                cursor: 'pointer',
              },
            }}
          >
            通知一覧を見る
          </Box>
        </Box>
      )}
    </>
  );
};

const NoticeItem = ({ children, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      flexFlow: 'column',
      p: 1,
      alignItems: 'center',
      '&:hover': {
        backgroundColor: '#efefef',
        cursor: 'pointer',
      },
    }}
  >
    {children}
  </Box>
);

const NotificationIcon = () => {
  const { authAxios } = useContext(AuthContext);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (authAxios) {
      (async () => {
        const { data } = await getNotificationCount(authAxios);
        if (data.total > 0) setShowBadge(true);
      })();
    }
  }, [authAxios]);

  const { state } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const _NotificationIcon = () => {
    if (showBadge) {
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
        {state.isLoggedin === true && (
          <LatestNotificationList setShowBadge={setShowBadge} handleClose={handleClose} />
        )}
      </Menu>
    </>
  );
};

export default NotificationIcon;

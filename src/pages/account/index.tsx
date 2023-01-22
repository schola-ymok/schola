import { profile } from 'console';

import { Button, Checkbox, CircularProgress, InputBase, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import { getMyAccount } from 'api/getMyAccount';
import { setNotifyOnPurchase } from 'api/setNotifyOnPurchase';
import { setNotifyOnReview } from 'api/setNotifyOnReview';
import { setProfilePhotoId } from 'api/setProfilePhotoId';
import { updateProfile } from 'api/updateProfile';
import AvatarButton from 'components/AvatarButton';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import DefaultButton from 'components/DefaultButton';
import ImageCropDialog from 'components/ImageCropDialog';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import RTEditor from 'components/rteditor/RTEditor';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import useCropImage from 'utils/useCropImage';

const Account = () => {
  const { authAxios } = useContext(AuthContext);
  const { state, dispatch } = useContext(AppContext);
  const [notifyOnPurchaseCheck, setNotifyOnPurchaseCheck] = useState(false);
  const [notifyOnReviewCheck, setNotifyOnReviewCheck] = useState(false);
  const [tab, setTab] = useState(0);

  const [profile, setProfile] = useState();

  const { data, error } = useSWR(`getMyAccount`, () => getMyAccount(authAxios), {
    revalidateOnFocus: false,
  });

  const firebaseUser = getAuth().currentUser;
  const emailVerified = firebaseUser.emailVerified;

  useEffect(() => {
    if (data) {
      if (data.notifyOnPurchase) setNotifyOnPurchaseCheck(true);
      if (data.notifyOnReview) setNotifyOnReviewCheck(true);

      setProfile({
        displayName: data.displayName,
        profileMessage: data.profileMessage,
        majors: data.majors,
        twitter: data.twitter,
        web: data.web,
        facebook: data.facebook,
      });
    }
  }, [data]);

  if (error) {
    console.log(error);
  }

  if (!data) return <CenterLoadingSpinner />;

  const handleNotifyOnPurchaseChange = (event) => {
    setNotifyOnPurchaseCheck(event.target.checked);
    setNotifyOnPurchase(authAxios, event.target.checked)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNotifyOnReviewChange = (event) => {
    setNotifyOnReviewCheck(event.target.checked);
    setNotifyOnReview(authAxios, event.target.checked)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const handleTabChange = (event, newNumber) => {
    setTab(newNumber);
  };

  const handleSendEmailVerificationClick = () => {
    sendEmailVerification(firebaseUser).then(() => {
      console.log('send');
    });
  };

  const saveProfile = async (profile, onFinish, onError) => {
    try {
      await updateProfile(authAxios, profile);
      onFinish();
    } catch (e) {
      onError();
    }
  };

  return (
    <Container maxWidth='md'>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label={<Box sx={{ fontWeight: 'bold' }}>アカウント</Box>} />
          <Tab label={<Box sx={{ fontWeight: 'bold' }}>プロフィール</Box>} />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <AccountSetting
          accountName={state.accountName}
          email={state.email}
          emailVerified={emailVerified}
          handleSendEmailVerificationClick={handleSendEmailVerificationClick}
          userId={data.userId}
          handleNotifyOnPurchaseChange={handleNotifyOnPurchaseChange}
          notifyOnPurchaseCheck={notifyOnPurchaseCheck}
          handleNotifyOnReviewChange={handleNotifyOnReviewChange}
          notifyOnReviewCheck={notifyOnReviewCheck}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <ProfileSetting profile={profile} setProfile={setProfile} saveProfile={saveProfile} />
      </TabPanel>
    </Container>
  );
};

const AccountSetting = ({
  accountName,
  email,
  emailVerified,
  handleSendEmailVerificationClick,
  userId,
  handleNotifyOnPurchaseChange,
  notifyOnPurchaseCheck,
  handleNotifyOnReviewChange,
  notifyOnReviewCheck,
}) => {
  const emailVerify = emailVerified ? (
    <>確認済み</>
  ) : (
    <>
      <DefaultButton onClick={handleSendEmailVerificationClick}>確認メールを送信</DefaultButton>
    </>
  );

  const Item = ({ label, children }) => {
    return (
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ my: 2, width: '40%', minWidth: '120px', textAlign: 'right' }}>{label}</Box>
        <Box sx={{ ml: 2, my: 'auto', fontWeight: 'bold' }}>{children}</Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', pt: { sx: 0, sm: 3 } }}>
      <Item label='アカウント名'>{accountName}</Item>
      <Item label='アカウントID'>{userId}</Item>
      <Item label='メール'>{email}</Item>
      <Item label='メール確認'>{emailVerify}</Item>
      <Item label='テキストが購入された時に通知'>
        <Checkbox onChange={handleNotifyOnPurchaseChange} checked={notifyOnPurchaseCheck} />
      </Item>
      <Item label='テキストのレビューが投稿された時に通知'>
        <Checkbox onChange={handleNotifyOnReviewChange} checked={notifyOnReviewCheck} />
      </Item>
    </Box>
  );
};

const ProfileSetting = ({ profile, setProfile, saveProfile }) => {
  const { state, dispatch } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const { authAxios } = useContext(AuthContext);

  const photoId = genid(8);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [
    crop,
    setCrop,
    zoom,
    setZoom,
    imageSrc,
    openImageCropDialog,
    setOpenImageCropDialog,
    croppedImageSrc,
    onCropComplete,
    showCroppedImage,
    handleSelectFile,
  ] = useCropImage(
    Consts.IMAGE_STORE_URL + photoId + '.png',
    () => {
      setIsUploadingImage(true);
    },
    () => {
      setProfilePhotoId(authAxios, photoId);
      dispatch({ type: 'SetProfilePhoto', photoId: photoId });
      setIsUploadingImage(false);
    },
  );

  const onError = () => {
    console.log('error');
  };

  return (
    <Box sx={{ width: { xs: '98%', md: '90%' }, pt: { xs: 0, sm: 2 }, mx: 'auto' }}>
      <Box sx={{ width: '128px' }}>
        {isUploadingImage ? (
          <>
            <Box
              sx={{
                width: '128px',
                height: '128px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress
                size={28}
                sx={{ mx: 'auto', my: 'auto', color: Consts.COLOR.Primary }}
              />
            </Box>
            <Box sx={{ textAlign: 'center', width: 128, mt: 1 }}>アップロード中</Box>
          </>
        ) : (
          <>
            <label
              style={{
                cursor: 'pointer',
                display: 'block',
                width: 128,
              }}
            >
              <input
                type='file'
                accept='image/*'
                onChange={handleSelectFile}
                style={{ display: 'none' }}
              />
              <AvatarButton photoId={state.photoId} onClick={() => {}} size={128} />
              <Box sx={{ textAlign: 'center', width: '100%', mx: 'auto', mt: 1 }}>
                <a>画像を変更</a>
              </Box>
            </label>
            <ImageCropDialog
              open={openImageCropDialog}
              setOpen={setOpenImageCropDialog}
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              showCroppedImage={showCroppedImage}
            />
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexFlow: 'column' }}>
        {/* display name */}
        <Box
          sx={{
            fontWeight: 'bold',
            mt: 3,
          }}
        >
          表示名
        </Box>

        <Box
          sx={{
            p: 1,
            width: '100%',
            maxWidth: 800,
            border: '2px solid ' + Consts.COLOR.Grey,
            '&:hover': {
              border: '2px solid ' + Consts.COLOR.Primary,
            },
          }}
        >
          <InputBase
            placeholder='表示名'
            value={profile.displayName}
            sx={{ fontSize: '1.0em' }}
            variant='outlined'
            fullWidth
            onChange={(e) => {
              setProfile({
                ...profile,
                displayName: e.target.value,
              });
            }}
          />
        </Box>

        {/* majors */}
        <Box
          sx={{
            fontWeight: 'bold',
            mt: 3,
          }}
        >
          専門領域、得意分野
        </Box>

        <Box
          sx={{
            p: 1,
            width: '100%',
            maxWidth: 800,
            border: '2px solid ' + Consts.COLOR.Grey,
            '&:hover': {
              border: '2px solid ' + Consts.COLOR.Primary,
            },
          }}
        >
          <InputBase
            placeholder='専門領域'
            value={profile.majors}
            sx={{ fontSize: '1.0em' }}
            variant='outlined'
            fullWidth
            onChange={(e) => {
              setProfile({
                ...profile,
                majors: e.target.value,
              });
            }}
          />
        </Box>

        {/* profile */}
        <Box
          sx={{
            fontWeight: 'bold',
            mt: 3,
          }}
        >
          プロフィール
        </Box>

        <RTEditor
          placeholder='プロフィール'
          initialValue={profile.profileMessage}
          onChange={(value) => {
            setProfile({
              ...profile,
              profileMessage: value,
            });
          }}
        />

        {/* homepage */}
        <Box
          sx={{
            fontWeight: 'bold',
            mt: 3,
          }}
        >
          ホームページ
        </Box>

        <Box
          sx={{
            p: 1,
            width: '100%',
            maxWidth: 500,
            border: '2px solid ' + Consts.COLOR.Grey,
            '&:hover': {
              border: '2px solid ' + Consts.COLOR.Primary,
            },
          }}
        >
          <InputBase
            placeholder='ホームページ'
            value={profile.web}
            sx={{ fontSize: '1.0em' }}
            variant='outlined'
            fullWidth
            onChange={(e) => {
              setProfile({
                ...profile,
                web: e.target.value,
              });
            }}
          />
        </Box>

        {/* twitter */}
        <Box
          sx={{
            fontWeight: 'bold',
            mt: 3,
          }}
        >
          Twitter
        </Box>
        <Box
          sx={{
            p: 1,
            width: '100%',
            maxWidth: 300,
            border: '2px solid ' + Consts.COLOR.Grey,
            '&:hover': {
              border: '2px solid ' + Consts.COLOR.Primary,
            },
          }}
        >
          <InputBase
            placeholder='twitter'
            value={profile.twitter}
            sx={{ fontSize: '1.0em' }}
            variant='outlined'
            fullWidth
            onChange={(e) => {
              setProfile({
                ...profile,
                twitter: e.target.value,
              });
            }}
          />
        </Box>

        {/* facebook */}
        <Box
          sx={{
            fontWeight: 'bold',
            mt: 3,
          }}
        >
          Facebook
        </Box>
        <Box
          sx={{
            p: 1,
            width: '100%',
            maxWidth: 300,
            border: '2px solid ' + Consts.COLOR.Grey,
            '&:hover': {
              border: '2px solid ' + Consts.COLOR.Primary,
            },
          }}
        >
          <InputBase
            placeholder='facebook'
            value={profile.facebook}
            sx={{ fontSize: '1.0em' }}
            variant='outlined'
            fullWidth
            onChange={(e) => {
              setProfile({
                ...profile,
                facebook: e.target.value,
              });
            }}
          />
        </Box>

        <DefaultButton
          disabled={isLoading}
          exSx={{
            width: '150px',
            mt: 4,
          }}
          onClick={() => {
            setIsLoading(true);
            saveProfile(
              profile,
              () => {
                setIsLoading(false);
                setSnackBarOpen(true);
                console.log('done');
              },
              onError,
            );
          }}
        >
          更新
        </DefaultButton>
      </Box>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={1000}
        message='Saved'
        onClose={() => {
          setSnackBarOpen(false);
        }}
      />
    </Box>
  );
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2, px: { xs: 0, sm: 1 } }}>{children}</Box>}
    </div>
  );
}

Account.getLayout = (page) => <Layout>{page}</Layout>;
export default Account;

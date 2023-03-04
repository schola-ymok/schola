import CheckIcon from '@mui/icons-material/Check';
import {
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  InputBase,
  Link,
  Snackbar,
} from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';

import { getMyAccount } from 'api/getMyAccount';
import { setNotifyOnPurchase } from 'api/setNotifyOnPurchase';
import { setNotifyOnReview } from 'api/setNotifyOnReview';
import { setNotifyOnUpdate } from 'api/setNotifyOnUpdate';
import { setProfilePhotoId } from 'api/setProfilePhotoId';
import { updateProfile } from 'api/updateProfile';
import AccountNameSettingDialog from 'components/AccountNameSettingDialog';
import AvatarButton from 'components/AvatarButton';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import ConfirmDialog from 'components/ConfirmDialog';
import DefaultButton from 'components/DefaultButton';
import FormItemLabel from 'components/FormItemLabel';
import FormItemState from 'components/FormItemState';
import FormItemSubLabel from 'components/FormItemSubLabel';
import ImageCropDialog from 'components/ImageCropDialog';
import Title from 'components/Title';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import RTEditor from 'components/rteditor/RTEditor';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import useCropImage from 'utils/useCropImage';
import usePageLeaveConfirm from 'utils/usePageLeaveConfirm';
import { validate } from 'utils/validate';

const Account = () => {
  const router = useRouter();
  let _tab = 0;
  if (router.query.prf !== undefined) _tab = 1;

  const { authAxios } = useContext(AuthContext);
  const { state } = useContext(AppContext);
  const [notifyOnPurchaseWebCheck, setNotifyOnPurchaseWebCheck] = useState(false);
  const [notifyOnReviewWebCheck, setNotifyOnReviewWebCheck] = useState(false);
  const [notifyOnUpdateWebCheck, setNotifyOnUpdateWebCheck] = useState(false);

  const [notifyOnPurchaseMailCheck, setNotifyOnPurchaseMailCheck] = useState(false);
  const [notifyOnReviewMailCheck, setNotifyOnReviewMailCheck] = useState(false);
  const [notifyOnUpdateMailCheck, setNotifyOnUpdateMailCheck] = useState(false);
  const [swrKey] = useState(genid(4));

  const [changed, setChanged] = useState(false);

  const [tab, setTab] = useState(_tab);

  const { data, error } = useSWR(`getMyAccount_${swrKey}`, () => getMyAccount(authAxios), {
    revalidateOnFocus: false,
  });

  const [pageLeaveConfirmDialogOpen, setPageLeaveConfirmDialogOpen] = useState(false);

  const firebaseUser = getAuth().currentUser;
  const emailVerified = firebaseUser.emailVerified;

  useEffect(() => {
    if (data) {
      if (data.notifyOnPurchaseWeb) setNotifyOnPurchaseWebCheck(true);
      if (data.notifyOnReviewWeb) setNotifyOnReviewWebCheck(true);
      if (data.notifyOnUpdateWeb) setNotifyOnUpdateWebCheck(true);
      if (data.notifyOnPurchaseMail) setNotifyOnPurchaseMailCheck(true);
      if (data.notifyOnReviewMail) setNotifyOnReviewMailCheck(true);
      if (data.notifyOnUpdateMail) setNotifyOnUpdateMailCheck(true);
    }
  }, [data]);

  if (error) {
    console.log(error);
  }

  if (!data) return <CenterLoadingSpinner />;

  const handleNotifyOnPurchaseChange = (event, mail) => {
    if (mail) {
      setNotifyOnPurchaseMailCheck(event.target.checked);
    } else {
      setNotifyOnPurchaseWebCheck(event.target.checked);
    }
    setNotifyOnPurchase(authAxios, event.target.checked, mail)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNotifyOnReviewChange = (event, mail) => {
    if (mail) {
      setNotifyOnReviewMailCheck(event.target.checked);
    } else {
      setNotifyOnReviewWebCheck(event.target.checked);
    }
    setNotifyOnReview(authAxios, event.target.checked, mail)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNotifyOnUpdateChange = (event, mail) => {
    if (mail) {
      setNotifyOnUpdateMailCheck(event.target.checked);
    } else {
      setNotifyOnUpdateWebCheck(event.target.checked);
    }
    setNotifyOnUpdate(authAxios, event.target.checked, mail)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const handleTabChange = (event, newNumber) => {
    if (newNumber == 0) {
      if (changed) {
        setPageLeaveConfirmDialogOpen(true);
      } else {
        router.replace(`account`);
        setTab(newNumber);
      }
    } else {
      router.replace(`account?prf`);
      setTab(newNumber);
    }
  };

  const handleSendEmailVerificationClick = () => {
    sendEmailVerification(firebaseUser).then(() => {
      console.log('send');
    });
  };

  return (
    <Container maxWidth='md'>
      <ConfirmDialog
        title={'確認'}
        open={pageLeaveConfirmDialogOpen}
        message={Consts.PAGE_LEAVE_WARNING_MESSGAE}
        onClose={() => {
          setPageLeaveConfirmDialogOpen(false);
        }}
        onOk={() => {
          setPageLeaveConfirmDialogOpen(false);
          router.replace(`account`);
          setTab(0);
        }}
      />
      <Title title={'Schola | アカウントとプロフィール'} />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleTabChange} TabIndicatorProps={{ sx: { top: 'unset' } }}>
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
          handleNotifyOnReviewChange={handleNotifyOnReviewChange}
          handleNotifyOnUpdateChange={handleNotifyOnUpdateChange}
          notifyOnReviewWebCheck={notifyOnReviewWebCheck}
          notifyOnReviewMailCheck={notifyOnReviewMailCheck}
          notifyOnUpdateWebCheck={notifyOnUpdateWebCheck}
          notifyOnUpdateMailCheck={notifyOnUpdateMailCheck}
          notifyOnPurchaseWebCheck={notifyOnPurchaseWebCheck}
          notifyOnPurchaseMailCheck={notifyOnPurchaseMailCheck}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <ProfileSetting
          notifyChanged={(_changed) => {
            setChanged(_changed);
          }}
        />
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
  handleNotifyOnReviewChange,
  handleNotifyOnUpdateChange,
  notifyOnPurchaseWebCheck,
  notifyOnReviewWebCheck,
  notifyOnUpdateWebCheck,
  notifyOnPurchaseMailCheck,
  notifyOnReviewMailCheck,
  notifyOnUpdateMailCheck,
}) => {
  const [accountNameSettingOpen, setAccountNameSettingOpen] = useState(false);

  const emailVerify = emailVerified ? (
    <>確認済み</>
  ) : (
    <>
      <DefaultButton onClick={handleSendEmailVerificationClick}>確認メールを送信</DefaultButton>
    </>
  );

  const ItemLabel = ({ label }) => (
    <Box
      sx={{
        my: 'auto',
        width: { sm: '100%', md: '50%' },
        minWidth: '130px',
        textAlign: { sm: 'left', md: 'right' },
        fontWeight: 'bold',
      }}
    >
      {label}
    </Box>
  );

  const ItemValue = ({ children }) => (
    <Box sx={{ ml: 2, my: 'auto', display: 'flex', mt: { xs: 1, md: 0 } }}>{children}</Box>
  );

  const ItemBox = ({ children, sx }) => (
    <Box sx={{ display: 'flex', mb: 4, flexFlow: { xs: 'column', md: 'unset' }, ...sx }}>
      {children}
    </Box>
  );

  const SimpleCheckbox = ({ checked, onChange }) => (
    <Checkbox disableRipple sx={{ p: 0 }} onChange={onChange} checked={checked} />
  );

  return (
    <>
      <Box sx={{ display: 'flex', flexFlow: 'column', pt: { sx: 0, sm: 3 } }}>
        <ItemBox>
          <ItemLabel label='アカウント名' />
          <ItemValue>
            {accountName}{' '}
            <Box
              onClick={() => {
                setAccountNameSettingOpen(true);
              }}
              sx={{
                ml: 2,
                fontWeight: 'normal',
                color: Consts.COLOR.Primary,
                '&:hover': {
                  cursor: 'pointer',
                  textDecoration: 'underline',
                },
              }}
            >
              変更
            </Box>
          </ItemValue>
        </ItemBox>

        <ItemBox>
          <ItemLabel label='アカウントID' />
          <ItemValue>{userId}</ItemValue>
        </ItemBox>

        <ItemBox>
          <ItemLabel label='メール' />
          <ItemValue>{email}</ItemValue>
        </ItemBox>

        <ItemBox>
          <ItemLabel label='メール確認' />
          <ItemValue>{emailVerify}</ItemValue>
        </ItemBox>

        <ItemBox sx={{ mt: 2 }}>
          <ItemLabel label='購入したテキストが更新された時に通知' />
          <ItemValue>
            <Box sx={{ my: 'auto' }}>メール：</Box>
            <SimpleCheckbox
              onChange={(e) => {
                handleNotifyOnUpdateChange(e, true);
              }}
              checked={notifyOnUpdateMailCheck}
            />
            <Box sx={{ ml: 4, my: 'auto' }}>Web：</Box>
            <SimpleCheckbox
              onChange={(e) => {
                handleNotifyOnUpdateChange(e, false);
              }}
              checked={notifyOnUpdateWebCheck}
            />
          </ItemValue>
        </ItemBox>

        <ItemBox>
          <ItemLabel label='販売中のテキストが売れた時に通知' />
          <ItemValue>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ my: 'auto' }}>メール：</Box>
              <SimpleCheckbox
                onChange={(e) => {
                  handleNotifyOnPurchaseChange(e, true);
                }}
                checked={notifyOnPurchaseMailCheck}
              />
              <Box sx={{ ml: 4, my: 'auto' }}>Web：</Box>
              <SimpleCheckbox
                onChange={(e) => {
                  handleNotifyOnPurchaseChange(e, false);
                }}
                checked={notifyOnPurchaseWebCheck}
              />
            </Box>
          </ItemValue>
        </ItemBox>

        <ItemBox>
          <ItemLabel label='テキストのレビューが投稿された時に通知' />
          <ItemValue>
            <Box sx={{ my: 'auto' }}>メール：</Box>
            <SimpleCheckbox
              onChange={(e) => {
                handleNotifyOnReviewChange(e, true);
              }}
              checked={notifyOnReviewMailCheck}
            />
            <Box sx={{ ml: 4, my: 'auto' }}>Web：</Box>
            <SimpleCheckbox
              onChange={(e) => {
                handleNotifyOnReviewChange(e, false);
              }}
              checked={notifyOnReviewWebCheck}
            />
          </ItemValue>
        </ItemBox>
      </Box>
      <AccountNameSettingDialog
        rkey={Math.random()}
        name={accountName}
        open={accountNameSettingOpen}
        onChange={() => {}}
        onClose={() => {
          setAccountNameSettingOpen(false);
        }}
      />
    </>
  );
};

const ProfileSetting = ({ notifyChanged }) => {
  const { data, error } = useSWR(`getMyAccount`, () => getMyAccount(authAxios), {
    revalidateOnFocus: false,
  });
  const { state, dispatch } = useContext(AppContext);

  const { authAxios } = useContext(AuthContext);

  const [displayName, setDisplayName] = useState();
  const [oldDisplayName, setOldDisplayName] = useState();
  const [displayNameChanged, setDisplayNameChanged] = useState(false);
  const [displayNameValidation, setDisplayNameValidation] = useState(false);

  const [majors, setMajors] = useState();
  const [oldMajors, setOldMajors] = useState();
  const [majorsChanged, setMajorsChanged] = useState(false);
  const [majorsValidation, setMajorsValidation] = useState();

  const [profile, setProfile] = useState();
  const [oldProfile, setOldProfile] = useState();
  const [profileChanged, setProfileChanged] = useState(false);
  const [profileValidation, setProfileValidation] = useState();

  const [web, setWeb] = useState();
  const [oldWeb, setOldWeb] = useState();
  const [webChanged, setWebChanged] = useState(false);
  const [webValidation, setWebValidation] = useState();

  const [twitter, setTwitter] = useState();
  const [oldTwitter, setOldTwitter] = useState();
  const [twitterChanged, setTwitterChanged] = useState(false);
  const [twitterValidation, setTwitterValidation] = useState();

  const [facebook, setFacebook] = useState();
  const [oldFacebook, setOldFacebook] = useState();
  const [facebookChanged, setFacebookChanged] = useState(false);
  const [facebookValidation, setFacebookValidation] = useState();

  const [setComplete, setSetCompolete] = useState(false);

  const photoId = genid(8);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [savingState, setSavingState] = useState(null);

  function checkChange() {
    const changed =
      displayNameChanged ||
      majorsChanged ||
      profileChanged ||
      webChanged ||
      twitterChanged ||
      facebookChanged;

    notifyChanged(changed);
    return changed;
  }

  function checkValidation() {
    return (
      displayNameValidation.ok &&
      majorsValidation.ok &&
      profileValidation.ok &&
      webValidation.ok &&
      twitterValidation.ok &&
      facebookValidation.ok
    );
  }

  async function handleSaveClick() {
    setSavingState('saving');

    const { error } = await updateProfile(authAxios, {
      displayName: displayName,
      profileMessage: profile,
      majors: majors,
      twitter: twitter,
      web: web,
      facebook: facebook,
    });

    if (error) console.log(error);

    mutate(`getMyAccount`);
  }

  const onDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
    setDisplayNameChanged(e.target.value != oldDisplayName);
    validateDisplayName(e.target.value);
  };

  const validateDisplayName = (value) => {
    setDisplayNameValidation(validate(value, Consts.VALIDATE.displayName));
  };

  const onMajorsChange = (e) => {
    setMajors(e.target.value);
    setMajorsChanged(e.target.value != oldMajors);
    validateMajors(e.target.value);
  };

  const validateMajors = (value) => {
    setMajorsValidation(validate(value, Consts.VALIDATE.majors));
  };

  const onProfileChange = (value) => {
    setProfile(value);
    setProfileChanged(value != oldProfile);
    validateProfile(value);
  };

  const validateProfile = (value) => {
    const tagEliminatedValue = value?.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    setProfileValidation(validate(tagEliminatedValue, Consts.VALIDATE.profile));
  };

  const onWebChange = (e) => {
    setWeb(e.target.value);
    setWebChanged(e.target.value != oldWeb);
    validateWeb(e.target.value);
  };

  const validateWeb = (value) => {
    setWebValidation(validate(value, Consts.VALIDATE.web));
  };

  const onTwitterChange = (e) => {
    setTwitter(e.target.value);
    setTwitterChanged(e.target.value != oldTwitter);
    validateTwitter(e.target.value);
  };

  const validateTwitter = (value) => {
    setTwitterValidation(validate(value, Consts.VALIDATE.twitter));
  };

  const onFacebookChange = (e) => {
    setFacebook(e.target.value);
    setFacebookChanged(e.target.value != oldFacebook);
    validateFacebook(e.target.value);
  };

  const validateFacebook = (value) => {
    setFacebookValidation(validate(value, Consts.VALIDATE.facebook));
  };

  useEffect(() => {
    if (data) {
      setDisplayName(data.displayName);
      setOldDisplayName(data.displayName);
      setDisplayNameChanged(false);
      validateDisplayName(data.displayName);

      const _majors = data.majors ? data.majors : '';
      setMajors(_majors);
      setOldMajors(_majors);
      setMajorsChanged(false);
      validateMajors(_majors);

      const _profile = data.profileMessage ? data.profileMessage : '';
      setProfile(_profile);
      setOldProfile(_profile);
      setProfileChanged(false);
      validateProfile(_profile);

      const _web = data.web ? data.web : '';
      setWeb(_web);
      setOldWeb(_web);
      setWebChanged(false);
      validateWeb(_web);

      const _twitter = data.twitter ? data.twitter : '';
      setTwitter(_twitter);
      setOldTwitter(_twitter);
      setTwitterChanged(false);
      validateTwitter(_twitter);

      const _facebook = data.facebook ? data.facebook : '';
      setFacebook(_facebook);
      setOldFacebook(_facebook);
      setFacebookChanged(false);
      validateFacebook(_facebook);

      setSetCompolete(true);
      if (savingState == 'saving') setSavingState('saved');
    }
  }, [data]);

  usePageLeaveConfirm(
    [
      displayNameChanged,
      majorsChanged,
      profileChanged,
      webChanged,
      twitterChanged,
      facebookChanged,
    ],
    () => {
      return checkChange() && savingState != 'saving';
    },
    [`/account`],
  );

  const SaveButton = ({ sx }) => (
    <DefaultButton
      disabled={!checkChange() || !checkValidation()}
      sx={{
        width: '150px',
        mt: 4,
        ...sx,
      }}
      onClick={() => {
        if (savingState !== 'saving') handleSaveClick();
      }}
    >
      {saveButtonContent}
    </DefaultButton>
  );

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

  if (!data || !setComplete) return <CenterLoadingSpinner />;

  let saveButtonContent;

  if (savingState === 'saving') {
    saveButtonContent = <CircularProgress size={28} sx={{ color: 'white' }} />;
  } else if (savingState === 'saved' && !checkChange()) {
    saveButtonContent = <CheckIcon sx={{ color: 'black' }} />;
  } else {
    saveButtonContent = <>保存</>;
  }

  return (
    <Box sx={{ width: { xs: '98%', md: '90%' }, pt: { xs: 0, sm: 2 }, mx: 'auto' }}>
      <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
        <FormItemLabel>プロフィール画像</FormItemLabel>
        <Link
          href={`/users/${state.userId}`}
          style={{
            marginLeft: 'auto',
          }}
        >
          <Box
            sx={{
              textDecoration: 'underline',
              color: '#000000',
              '&:hover': {
                color: Consts.COLOR.Primary,
              },
            }}
          >
            プロフィール画面を確認
          </Box>
        </Link>
      </Box>
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
              avatar
            />
          </>
        )}
      </Box>

      <SaveButton sx={{ ml: 'auto' }} />

      <Box sx={{ display: 'flex', flexFlow: 'column' }}>
        {/* display name */}
        <FormItemLabel sx={{ mt: 1 }}>表示名</FormItemLabel>
        <FormItemSubLabel>
          表示名を{Consts.VALIDATE.displayName.min}～{Consts.VALIDATE.displayName.max}
          文字で入力
        </FormItemSubLabel>

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
            autoFocus
            placeholder='表示名'
            value={displayName}
            sx={{ fontSize: '1.0em' }}
            variant='outlined'
            fullWidth
            onChange={onDisplayNameChange}
          />
        </Box>
        <FormItemState validation={displayNameValidation} />

        {/* majors */}
        <FormItemLabel sx={{ mt: 3 }}>専門領域、得意分野</FormItemLabel>
        <FormItemSubLabel>
          専門領域や得意分野を{Consts.VALIDATE.majors.max}文字以内で入力【任意】
        </FormItemSubLabel>

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
            value={majors}
            sx={{ fontSize: '1.0em' }}
            variant='outlined'
            fullWidth
            onChange={onMajorsChange}
          />
        </Box>
        <FormItemState validation={majorsValidation} />

        {/* profile */}
        <FormItemLabel sx={{ mt: 3 }}>プロフィール</FormItemLabel>
        <FormItemSubLabel>
          プロフィールを{Consts.VALIDATE.profile.max}文字以内で入力【任意】
        </FormItemSubLabel>

        <RTEditor placeholder='プロフィール' initialValue={profile} onChange={onProfileChange} />
        <FormItemState validation={profileValidation} />

        {/* homepage */}
        <FormItemLabel sx={{ mt: 3 }}>ホームぺージを入力</FormItemLabel>
        <FormItemSubLabel>ホームページを入力【任意】</FormItemSubLabel>

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
          <Box sx={{ display: 'flex' }}>
            <Box
              sx={{
                my: 'auto',
                fontWeight: 'bold',
                color: '#aaaaaa',
                mr: 0.5,
                p: 0.5,
                borderRadius: '5px',
                backgroundColor: '#eeeeee',
              }}
            >
              https://
            </Box>
            <InputBase
              placeholder='ホームページアドレス'
              value={web}
              sx={{ fontSize: '1.0em' }}
              variant='outlined'
              fullWidth
              onChange={onWebChange}
            />
          </Box>
        </Box>
        <FormItemState validation={webValidation} />

        {/* twitter */}
        <FormItemLabel sx={{ mt: 3 }}>Twitter</FormItemLabel>
        <FormItemSubLabel>Twitterアカウントを入力【任意】</FormItemSubLabel>
        <Box
          sx={{
            p: 1,
            width: '100%',
            maxWidth: 400,
            border: '2px solid ' + Consts.COLOR.Grey,
            '&:hover': {
              border: '2px solid ' + Consts.COLOR.Primary,
            },
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <Box
              sx={{
                my: 'auto',
                fontWeight: 'bold',
                color: '#aaaaaa',
                mr: 0.5,
                p: 0.5,
                borderRadius: '5px',
                backgroundColor: '#eeeeee',
              }}
            >
              https://twitter.com/
            </Box>
            <InputBase
              placeholder='twitterアカウントID'
              value={twitter}
              sx={{ fontSize: '1.0em' }}
              variant='outlined'
              fullWidth
              onChange={onTwitterChange}
            />
          </Box>
        </Box>
        <FormItemState validation={twitterValidation} />

        {/* facebook */}
        <FormItemLabel sx={{ mt: 3 }}>Facebook</FormItemLabel>
        <FormItemSubLabel>Facebookアカウントを入力【任意】</FormItemSubLabel>
        <Box
          sx={{
            p: 1,
            width: '100%',
            maxWidth: 420,
            border: '2px solid ' + Consts.COLOR.Grey,
            '&:hover': {
              border: '2px solid ' + Consts.COLOR.Primary,
            },
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <Box
              sx={{
                my: 'auto',
                fontWeight: 'bold',
                color: '#aaaaaa',
                mr: 0.5,
                p: 0.5,
                borderRadius: '5px',
                backgroundColor: '#eeeeee',
              }}
            >
              https://facebook.com/
            </Box>
            <InputBase
              placeholder='facebookユーザネーム'
              value={facebook}
              sx={{ fontSize: '1.0em' }}
              variant='outlined'
              fullWidth
              onChange={onFacebookChange}
            />
          </Box>
        </Box>
        <FormItemState validation={facebookValidation} />

        <SaveButton />
      </Box>
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

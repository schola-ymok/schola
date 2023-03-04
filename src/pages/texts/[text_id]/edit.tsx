import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Slider,
  Snackbar,
  Tab,
  Tabs,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/system';
import htmlParse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import useSWR, { useSWRConfig } from 'swr';

import { cancelApplication } from 'api/cancelApplication';
import { createNewChapter } from 'api/createNewChapter';
import { deleteChapter } from 'api/deleteChapter';
import { getChapterList } from 'api/getChapterList';
import { getMyText } from 'api/getMyText';
import { releaseText } from 'api/releaseText';
import { setChapterTrialReading } from 'api/setChapterTrialReading';
import { setTextCoverPhotoId } from 'api/setTextCoverPhotoId';
import { submitApplication } from 'api/submitApplication';
import { updateChapterOrder } from 'api/updateChapterOrder';
import { updateChapterTitle } from 'api/updateChapterTitle';
import { updateText } from 'api/updateText';
import ApplicationConfirmDialog from 'components/ApplicationConfirmDialog';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import ChapterListMenuButton from 'components/ChapterListMenuButton';
import ChapterTitleSettingDialog from 'components/ChapterTitleSettingDialog';
import ConfirmDialog from 'components/ConfirmDialog';
import DefaultButton from 'components/DefaultButton';
import FormItemLabel from 'components/FormItemLabel';
import FormItemState from 'components/FormItemState';
import FormItemSubLabel from 'components/FormItemSubLabel';
import ImageCropDialog from 'components/ImageCropDialog';
import LoadingBackDrop from 'components/LoadingBackDrop';
import Title from 'components/Title';
import TrialReadingAvailableLabel from 'components/TrialReadingAvailableLabel';
import { AuthContext } from 'components/auth/AuthContext';
import EditTextHeader from 'components/headers/EditTextHeader';
import EditTextLayout from 'components/layouts/EditTextLayout';
import RTEditor from 'components/rteditor/RTEditor';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import useCropImage from 'utils/useCropImage';
import usePageLeaveConfirm from 'utils/usePageLeaveConfirm';
import { validate } from 'utils/validate';

const EditText = () => {
  const router = useRouter();
  const { authAxios } = useContext(AuthContext);

  let _tab = 0;
  if (router.query.chp !== undefined) _tab = 1;
  if (router.query.ntc !== undefined) _tab = 2;
  const [tab, setTab] = useState(_tab);

  const textId = router.query.text_id;

  const [price, setPrice] = useState();
  const [oldPrice, setOldPrice] = useState();
  const [priceChanged, setPriceChanged] = useState(false);

  const [setComplete, setSetComplete] = useState(false);
  const [applicationConfirmDialogOpen, setApplicationConfirmDialogOpen] = useState(false);
  const [applicationCancelConfirmDialogOpen, setApplicationCancelConfirmDialogOpen] =
    useState(false);

  const [title, setTitle] = useState();
  const [oldTitle, setOldTitle] = useState();
  const [titleChanged, setTitleChanged] = useState(false);
  const [titleValidation, setTitleValidation] = useState();

  const [abstract, setAbstract] = useState();
  const [oldAbstract, setOldAbstract] = useState();
  const [abstractChanged, setAbstractChanged] = useState(false);
  const [abstractValidation, setAbstractValidation] = useState();

  const [explanation, setExplanation] = useState();
  const [oldExplanation, setOldExplanation] = useState();
  const [explanationChanged, setExplanationChanged] = useState(false);
  const [explanationValidation, setExplanationValidation] = useState();

  const [learningContents, setLearningContents] = useState();
  const [oldLearningContents, setOldLearningContents] = useState();
  const [learningContentsChanged, setLearningContentsChanged] = useState(false);
  const [learningContentsValidation, setLearningContentsValidation] = useState();

  const [learningRequirements, setLearningRequirements] = useState();
  const [oldLearningRequirements, setOldLearningRequirements] = useState();
  const [learningRequirementsChanged, setLearningRequirementsChanged] = useState(false);
  const [learningRequirementsValidation, setLearningRequirementsValidation] = useState();

  const [category1, setCategory1] = useState('nul');
  const [oldCategory1, setOldCategory1] = useState('nul');
  const [category1Changed, setCategory1Changed] = useState(false);

  const [category2, setCategory2] = useState('nul');
  const [oldCategory2, setOldCategory2] = useState('nul');
  const [category2Changed, setCategory2Changed] = useState(false);

  const [textState, setTextState] = useState();

  const [hasChapter, setHasChapter] = useState(false);

  const [savingState, setSavingState] = useState(null);
  const { mutate } = useSWRConfig();
  const photoId = genid(8);

  const [isReleaseToggleLoading, setIsReleaseToggleLoading] = useState(false);

  const [snack, setSnack] = useState({ open: false, message: '' });

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  function checkChange() {
    return (
      priceChanged ||
      titleChanged ||
      abstractChanged ||
      explanationChanged ||
      category1Changed ||
      category2Changed ||
      learningContentsChanged ||
      learningRequirementsChanged
    );
  }

  function checkValidation() {
    let _learningContentsValidation = true;
    for (let i = 0; i < learningContentsValidation.length; i++) {
      _learningContentsValidation = _learningContentsValidation && learningContentsValidation[i].ok;
    }
    let _learningRequirementsValidation = true;
    for (let i = 0; i < learningRequirementsValidation.length; i++) {
      _learningRequirementsValidation =
        _learningRequirementsValidation && learningRequirementsValidation[i].ok;
    }

    return (
      titleValidation.ok &&
      abstractValidation.ok &&
      explanationValidation.ok &&
      _learningContentsValidation &&
      _learningRequirementsValidation
    );
  }

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
      setTextCoverPhotoId(authAxios, textId, photoId);
      setImageUrl(Consts.IMAGE_STORE_URL + photoId + '.png');
      setIsUploadingImage(false);
    },
  );

  const { data, error } = useSWR(`texts/${textId}`, () => getMyText(textId, authAxios), {
    revalidateOnFocus: false,
  });

  const onPriceChange = (e) => {
    setPrice(e.target.value);
    setPriceChanged(e.target.value != oldPrice);
  };

  const onAbstractChange = (e) => {
    setAbstract(e.target.value);
    setAbstractChanged(e.target.value != oldAbstract);
    validateAbstract(e.target.value);
  };
  const validateAbstract = (value) => {
    setAbstractValidation(validate(value, Consts.VALIDATE.textAbstract));
  };

  const onExplanationChange = (value) => {
    setExplanation(value);
    setExplanationChanged(value != oldExplanation);
    validateExplanation(value);
  };

  const validateExplanation = (value) => {
    const tagEliminatedValue = value?.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    setExplanationValidation(validate(tagEliminatedValue, Consts.VALIDATE.textExplanation));
  };

  const onTitleChange = (e) => {
    setTitle(e.target.value);
    setTitleChanged(e.target.value != oldTitle);
    validateTitle(e.target.value);
  };

  const validateTitle = (value) => {
    setTitleValidation(validate(value, Consts.VALIDATE.textTitle));
  };

  const onLearningContentsChange = (list) => {
    setLearningContents(list);
    setLearningContentsChanged(JSON.stringify(list) != JSON.stringify(oldLearningContents));
    validateLearningContents(list);
  };

  const validateLearningContents = (list) => {
    setLearningContentsValidation(
      list.map((item) => {
        return validate(item, Consts.VALIDATE.learningContent);
      }),
    );
  };

  const onLearningRequirementsChange = (list) => {
    setLearningRequirements(list);
    setLearningRequirementsChanged(JSON.stringify(list) != JSON.stringify(oldLearningRequirements));
    validateLearningRequirements(list);
  };

  const validateLearningRequirements = (list) => {
    setLearningRequirementsValidation(
      list.map((item) => {
        return validate(item, Consts.VALIDATE.learningRequirements);
      }),
    );
  };

  const onCategory1Change = (e) => {
    setCategory1(e.target.value);
    setCategory2('nul');
    setCategory1Changed(e.target.value != oldCategory1);
  };

  const onCategory2Change = (e) => {
    setCategory2(e.target.value);
    setCategory2Changed(e.target.value != oldCategory2);
  };

  const handleTabChange = (event, newNumber) => {
    if (newNumber == 1) {
      router.replace(`/texts/${textId}/edit?chp`);
    } else if (newNumber == 2) {
      router.replace(`/texts/${textId}/edit?ntc`);
    } else {
      router.replace(`/texts/${textId}/edit`);
    }
    setTab(newNumber);
  };

  const LimitedBackdrop = styled(Backdrop)(() => ({
    position: 'absolute',
    zIndex: 100,
    opacity: 0.5,
  }));

  useEffect(() => {
    if (data) {
      setTextState(data.state);

      if (data.price) {
        setPrice(data.price);
        setOldPrice(data.price);
      } else {
        setPrice(50);
        setOldPrice(50);
      }
      setPriceChanged(false);

      setTitle(data.title);
      setOldTitle(data.title);
      setTitleChanged(false);
      validateTitle(data.title);

      setAbstract(data.abstract);
      setOldAbstract(data.abstract);
      setAbstractChanged(false);
      validateAbstract(data.abstract);

      setExplanation(data.explanation);
      setOldExplanation(data.explanation);
      setExplanationChanged(false);
      validateExplanation(data.explanation);

      setCategory1(data.category1);
      setOldCategory1(data.category1);
      setCategory1Changed(false);

      setCategory2(data.category2);
      setOldCategory2(data.category2);
      setCategory2Changed(false);

      if (data.photo_id) setImageUrl(Consts.IMAGE_STORE_URL + data.photo_id + '.png');

      let _learningContents;
      if (data.learning_contents) {
        const __learningContents = JSON.parse(data.learning_contents);
        let len = 4 - __learningContents.length;
        if (len < 0) len = 0;
        _learningContents = [...__learningContents, ...Array(len)];
      } else {
        _learningContents = [...Array(4)];
      }

      setLearningContents(_learningContents);
      setOldLearningContents(_learningContents);
      setLearningContentsChanged(false);
      validateLearningContents(_learningContents);

      let _learningRequirements;
      if (data.learning_requirements) {
        _learningRequirements = JSON.parse(data.learning_requirements);
      } else {
        _learningRequirements = [''];
      }

      setLearningRequirements(_learningRequirements);
      setOldLearningRequirements(_learningRequirements);
      setLearningRequirementsChanged(false);
      validateLearningRequirements(_learningRequirements);

      const chapterOrder = JSON.parse(data.chapter_order);
      if (Array.isArray(chapterOrder) && chapterOrder.length > 0) {
        setHasChapter(true);
      } else {
        setHasChapter(false);
      }

      setSetComplete(true);
      if (savingState == 'saving') setSavingState('saved');
    }
  }, [data]);

  usePageLeaveConfirm(
    [
      priceChanged,
      titleChanged,
      abstractChanged,
      explanationChanged,
      category1Changed,
      category2Changed,
      learningContentsChanged,
      learningRequirementsChanged,
    ],
    () => {
      return checkChange() && savingState != 'saving';
    },
    [`/texts/${textId}/edit`, `/texts/${textId}/edit?chp`],
  );

  async function handleSaveClick() {
    setSavingState('saving');

    const filteredLearningContents = learningContents.flatMap((item) =>
      item === null || item === '' ? [] : [item],
    );

    const filteredLearningRequirements = learningRequirements.flatMap((item) =>
      item === null || item === '' ? [] : [item],
    );

    const { error } = await updateText(
      textId,
      title,
      abstract,
      explanation,
      category1,
      category2,
      price,
      JSON.stringify(filteredLearningContents),
      JSON.stringify(filteredLearningRequirements),
      authAxios,
    );

    if (error) console.log(error);

    mutate(`texts/${textId}`);
  }

  async function handleApplicationCancelClick() {
    setIsReleaseToggleLoading(true);
    const { error } = await cancelApplication(textId, authAxios);

    setSnack({ open: true, message: '審査を取り消しました' });
    router.reload(`/texts/${textId}/edit`);
  }

  async function handleApplicationClick() {
    setIsReleaseToggleLoading(true);
    const { error } = await submitApplication(textId, authAxios);

    setSnack({ open: true, message: '審査を提出しました' });
    router.reload(`/texts/${textId}/edit`);
  }

  async function handleReleaseToggle(release) {
    setIsReleaseToggleLoading(true);
    const { error } = await releaseText(textId, release, authAxios);
    setIsReleaseToggleLoading(false);
  }

  const [imageUrl, setImageUrl] = useState('/cover-default.svg');

  if (error) console.log(error);
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
    <>
      <Title title={'Schola | テキストの編集'} />
      <ConfirmDialog
        open={applicationCancelConfirmDialogOpen}
        title='販売審査の取り消し'
        message='販売審査を取り消しますか？'
        onClose={() => {
          setApplicationCancelConfirmDialogOpen(false);
        }}
        onOk={() => {
          setApplicationCancelConfirmDialogOpen(false);
          handleApplicationCancelClick();
        }}
      />
      <ApplicationConfirmDialog
        open={applicationConfirmDialogOpen}
        onClose={() => {
          setApplicationConfirmDialogOpen(false);
        }}
        onOk={() => {
          setApplicationConfirmDialogOpen(false);
          handleApplicationClick();
        }}
      />
      <Snackbar
        open={snack.open}
        message={snack.message}
        autoHideDuration={1000}
        onClose={() => setSnack({ open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {isReleaseToggleLoading && <LoadingBackDrop />}
      <EditTextHeader
        state={data.state}
        textId={textId}
        hasChapter={hasChapter}
        handleReleaseToggle={handleReleaseToggle}
        handleApplicationClick={() => {
          setApplicationConfirmDialogOpen(true);
        }}
        handleApplicationCancelClick={() => {
          setApplicationCancelConfirmDialogOpen(true);
        }}
        release={data.is_public}
      />

      <Container maxWidth='md'>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} TabIndicatorProps={{ sx: { top: 'unset' } }}>
            <Tab label={<Box sx={{ fontWeight: 'bold' }}>テキスト情報</Box>} />
            <Tab label={<Box sx={{ fontWeight: 'bold' }}>チャプター</Box>} />
            {(textState == Consts.TEXTSTATE.DraftBanned ||
              textState == Consts.TEXTSTATE.DraftRejected) && (
              <Tab
                label={<Box sx={{ fontWeight: 'bold', color: 'red' }}>事務局からの伝達事項</Box>}
              />
            )}
          </Tabs>
        </Box>

        {textState == Consts.TEXTSTATE.UnderReview && (
          <Box sx={{ mt: 2, p: 2, display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
            ただいま販売審査中です。公開までしばらくお待ちください。
          </Box>
        )}

        <TabPanel value={tab} index={0}>
          <Box
            sx={{
              position: 'relative',
              width: { xs: '98%', md: '90%' },
              mx: 'auto',
              display: 'flex',
              flexFlow: 'column',
              p: { xs: 0.4, sm: 2 },
            }}
          >
            {textState == Consts.TEXTSTATE.UnderReview && <LimitedBackdrop open={true} />}

            <DefaultButton
              sx={{ width: '100px', ml: 'auto' }}
              disabled={!checkChange() || !checkValidation()}
              onClick={() => {
                if (savingState !== 'saving') handleSaveClick();
              }}
            >
              {saveButtonContent}
            </DefaultButton>

            {/* image */}
            <FormItemLabel>カバー画像</FormItemLabel>
            <Box sx={{ mt: 1 }}>
              {isUploadingImage ? (
                <>
                  <Box
                    sx={{
                      width: 267,
                      height: 144,
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
                  <Box sx={{ textAlign: 'center', width: 267 }}>アップロード中</Box>
                </>
              ) : (
                <>
                  <label
                    style={{
                      cursor: 'pointer',
                      display: 'block',
                      width: 256,
                    }}
                  >
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleSelectFile}
                      style={{ display: 'none' }}
                    />
                    <img src={imageUrl} width='256' height='144' />
                    <Box sx={{ textAlign: 'center', width: '100%', mx: 'auto' }}>
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
                    cropShape={'rect'}
                    cropSize={{ width: 256, height: 144 }}
                  />
                </>
              )}
            </Box>
            {/* title */}
            <FormItemLabel sx={{ mt: 3 }}>テキストのタイトル</FormItemLabel>
            <FormItemSubLabel>
              テキストのタイトルを{Consts.VALIDATE.textTitle.min}～{Consts.VALIDATE.textTitle.max}
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
                placeholder='タイトル'
                value={title}
                variant='outlined'
                sx={{ width: '100%' }}
                onChange={onTitleChange}
              />
            </Box>
            <FormItemState validation={titleValidation} />
            {/* abstract */}
            <FormItemLabel sx={{ mt: 2 }}>テキストの簡単な説明</FormItemLabel>
            <FormItemSubLabel>
              テキストの簡単な説明を{Consts.VALIDATE.textAbstract.min}～
              {Consts.VALIDATE.textAbstract.max}
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
                placeholder='テキストの概要'
                value={abstract}
                sx={{ width: '100%' }}
                rows={4}
                multiline
                onChange={onAbstractChange}
              />
            </Box>
            <FormItemState validation={abstractValidation} />
            {/* explanation */}
            <FormItemLabel sx={{ mt: 2 }}>テキストの詳細な解説</FormItemLabel>
            <FormItemSubLabel>
              テキストの詳細な解説を{Consts.VALIDATE.textExplanation.min}～
              {Consts.VALIDATE.textExplanation.max}
              文字で入力
            </FormItemSubLabel>
            <RTEditor
              placeholder='テキストの詳細な解説'
              initialValue={explanation}
              onChange={onExplanationChange}
            />
            <FormItemState validation={explanationValidation} />
            {/* Price */}
            <FormItemLabel sx={{ mt: 2 }}>テキストの販売価格</FormItemLabel>
            <FormItemSubLabel>テキストの販売価格をスライダで決定</FormItemSubLabel>
            <Box sx={{ display: 'flex', flexFlow: { xs: 'column', sm: 'unset' } }}>
              <Box
                sx={{
                  color: Consts.COLOR.Primary,
                  width: 140,
                  fontWeight: 'bold',
                  fontSize: '1.4em',
                  my: 'auto',
                  display: 'flex',
                  justifyContent: { xs: 'unset', sm: 'center' },
                }}
              >
                {price}円
              </Box>

              <Box
                sx={{
                  my: 'auto',
                  ml: { xs: 'auto', sm: 2 },
                  mr: 'auto',
                  p: 1,
                  width: '75%',
                }}
              >
                <Slider
                  aria-label='円'
                  value={price}
                  onChange={onPriceChange}
                  valueLabelDisplay='auto'
                  marks={[
                    {
                      value: 50,
                      label: '50円',
                    },
                    {
                      value: 5000,
                      label: '5000円',
                    },
                  ]}
                  step={50}
                  min={50}
                  max={5000}
                />
              </Box>
            </Box>
            {/* Category */}
            <FormItemLabel sx={{ mt: 1 }}>カテゴリの選択</FormItemLabel>
            <FormItemSubLabel>テキストのカテゴリを選択【任意】</FormItemSubLabel>
            <Box
              sx={{
                display: 'flex',
                flexFlow: { xs: 'column', md: 'unset' },
              }}
            >
              <Select
                labelId='category1'
                id='category1'
                value={category1}
                onChange={(e) => {
                  onCategory1Change(e);
                }}
                inputProps={{
                  sx: {
                    border: '2px solid ' + Consts.COLOR.Grey,
                    '&:hover': { border: '2px solid ' + Consts.COLOR.Primary },
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      border: '2px solid ' + Consts.COLOR.Grey,
                    },
                  },
                }}
              >
                <MenuItem disabled value='nul'>
                  --- カテゴリ ---
                </MenuItem>
                {Object.keys(Consts.CATEGORY).map((key) => {
                  return (
                    <MenuItem key={key} value={key}>
                      {Consts.CATEGORY[key].label}
                    </MenuItem>
                  );
                })}
              </Select>

              <Select
                labelId='category2'
                id='category2'
                value={category2}
                onChange={(e) => {
                  onCategory2Change(e);
                }}
                sx={{
                  ml: { xs: 'unset', md: 1 },
                  mt: { xs: 0.5, md: 'unset' },
                }}
                inputProps={{
                  sx: {
                    border: '2px solid ' + Consts.COLOR.Grey,
                    '&:hover': { border: '2px solid ' + Consts.COLOR.Primary },
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      border: '2px solid ' + Consts.COLOR.Grey,
                    },
                  },
                }}
              >
                <MenuItem disabled value='nul'>
                  --- サブカテゴリ ---
                </MenuItem>
                {category1 != 'nul' &&
                  Consts.CATEGORY[category1]?.items.map((item) => {
                    return (
                      <MenuItem key={item.key} value={item.key}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
              </Select>
            </Box>
            {/* LearningContents */}
            <FormItemLabel sx={{ mt: 3 }}>テキストで学習できることは何ですか？</FormItemLabel>
            <FormItemSubLabel>
              学べることを最低４つ入力（各項目は{Consts.VALIDATE.learningContent.min}～
              {Consts.VALIDATE.learningContent.max}文字で入力）
            </FormItemSubLabel>
            <Box sx={{ width: '100%' }}>
              <LearningContentsList
                learningContents={learningContents}
                learningContentsValidation={learningContentsValidation}
                onLearningContentsChange={onLearningContentsChange}
              />
            </Box>
            <ItemAddButton
              onClick={() => {
                onLearningContentsChange([...learningContents, '']);
              }}
            />
            {/* LearningRequirements */}
            <FormItemLabel sx={{ mt: 3 }}>想定している読者や要件は何ですか？</FormItemLabel>
            <FormItemSubLabel>
              想定読者や学習要件を最低１つ入力（各項目は{Consts.VALIDATE.learningRequirements.min}～
              {Consts.VALIDATE.learningRequirements.max}文字で入力）
            </FormItemSubLabel>
            <Box sx={{ width: '100%' }}>
              <LearningRequirementsList
                learningRequirements={learningRequirements}
                learningRequirementsValidation={learningRequirementsValidation}
                onLearningRequirementsChange={onLearningRequirementsChange}
              />
            </Box>
            <ItemAddButton
              onClick={() => {
                onLearningRequirementsChange([...learningRequirements, '']);
              }}
            />
            <DefaultButton
              sx={{ width: '180px', mt: { xs: 2, md: 4 }, mx: 'auto' }}
              disabled={!checkChange() || !checkValidation()}
              onClick={() => {
                if (savingState !== 'saving') handleSaveClick();
              }}
            >
              {saveButtonContent}
            </DefaultButton>
          </Box>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Box sx={{ position: 'relative' }}>
            {textState == Consts.TEXTSTATE.UnderReview && <LimitedBackdrop open={true} />}
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ mt: 1.5, mx: { xs: 'auto', md: 2 } }}>
                <h5>Chapters</h5>
              </Box>
            </Box>
            <Box sx={{ width: '100%', p: 1 }}>
              <ChapterList setHasChapter={setHasChapter} />
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ mt: 1.5, mx: { xs: 'auto', md: 2 } }}>
              <Notice message={data.notice} />
            </Box>
          </Box>
        </TabPanel>
      </Container>
    </>
  );
};

const Notice = ({ message }) => {
  const html = message ? htmlParse(message) : '';

  return <Box className='richtext'>{html}</Box>;
};

const ItemAddButton = ({ onClick }) => {
  return (
    <Box
      sx={{
        ...Consts.SX.DashedButton,
        width: '100%',
        maxWidth: '650px',
        height: '40px',
        mt: 1,
      }}
      variant='contained'
      onClick={onClick}
    >
      +
    </Box>
  );
};

const LearningContentsList = ({
  learningContents,
  learningContentsValidation,
  onLearningContentsChange,
}) => {
  return (
    <>
      {learningContents.map((item, index) => {
        if (!item) item = '';
        return (
          <Box key={index}>
            <ListItem
              placeholder={'マーティングの基礎'}
              value={item}
              deleteEnable={learningContents.length > 4}
              onChange={(value) => {
                onLearningContentsChange(
                  learningContents.map((_value, _index) => (index === _index ? value : _value)),
                );
              }}
              onDelete={() => {
                onLearningContentsChange(
                  learningContents.filter((_value, _index) => index !== _index),
                );
              }}
            />
            <FormItemState validation={learningContentsValidation[index]} />
          </Box>
        );
      })}
    </>
  );
};

const LearningRequirementsList = ({
  learningRequirements,
  learningRequirementsValidation,
  onLearningRequirementsChange,
}) => {
  return (
    <>
      {learningRequirements.map((item, index) => {
        if (!item) item = '';
        return (
          <Box key={index}>
            <ListItem
              placeholder={'マーティングの基礎'}
              value={item}
              deleteEnable={learningRequirements.length > 1}
              onChange={(value) => {
                onLearningRequirementsChange(
                  learningRequirements.map((_value, _index) => (index === _index ? value : _value)),
                );
              }}
              onDelete={() => {
                onLearningRequirementsChange(
                  learningRequirements.filter((_value, _index) => index !== _index),
                );
              }}
            />
            <FormItemState validation={learningRequirementsValidation[index]} />
          </Box>
        );
      })}
    </>
  );
};

const ListItem = ({ value, placeholder, onChange, deleteEnable, onDelete }) => {
  return (
    <Box
      sx={{
        p: 1,
        mt: 0.7,
        width: '100%',
        maxWidth: '650px',
        border: '2px solid ' + Consts.COLOR.Grey,
        '&:hover': {
          border: '2px solid ' + Consts.COLOR.Primary,
        },
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <InputBase
          placeholder={placeholder}
          value={value}
          variant='outlined'
          sx={{ width: '100%' }}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
        {deleteEnable && (
          <IconButton
            type='button'
            sx={{
              p: 0,
              '&:hover': Consts.SX.IconButtonHover,
              transform: 'scale(0.8)',
            }}
            onClick={onDelete}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

const ChapterListItem = ({
  keyedChapterList,
  chapterId,
  handleChapterClick,
  handleTitleChange,
  handleDeleteChapterClick,
  handleToggleTrialReadingAvailable,
}) => {
  const [chapterDeleteConfirmDialogOpen, setChapterDeleteConfirmDialogOpen] = useState(false);

  return (
    <Box key={chapterId} sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box
        className='scroll-without-bar'
        sx={{
          fontSize: { xs: '1.0em', sm: '1.2em' },
          fontWeight: 'bold',
          p: { xs: 0.5, md: 1.5 },
          width: '100%',
          '&:hover': { color: Consts.COLOR.Primary },
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          display: 'flex',
          overflowX: 'scroll',
          whiteSpace: 'nowrap',
        }}
        onClick={() => {
          handleChapterClick(keyedChapterList[chapterId]);
        }}
      >
        {keyedChapterList[chapterId]?.title}
        {keyedChapterList[chapterId]?.is_trial_reading_available == 1 && (
          <TrialReadingAvailableLabel sx={{ ml: 1 }} />
        )}
      </Box>
      <ChapterListMenuButton
        key={chapterId + keyedChapterList[chapterId]?.title}
        item={keyedChapterList[chapterId]}
        handleToggleTrialReadingAvailable={handleToggleTrialReadingAvailable}
        handleDelete={() => {
          setChapterDeleteConfirmDialogOpen(true);
        }}
        handleEdit={handleChapterClick}
        handleTitleChange={(title) => {
          handleTitleChange(chapterId, title);
        }}
      />
      <ConfirmDialog
        key={chapterId}
        title={'チャプターの削除'}
        message={'「' + keyedChapterList[chapterId]?.title + '」を削除しますか？'}
        open={chapterDeleteConfirmDialogOpen}
        onClose={() => {
          setChapterDeleteConfirmDialogOpen(false);
        }}
        onOk={() => {
          setChapterDeleteConfirmDialogOpen(false);
          handleDeleteChapterClick(keyedChapterList[chapterId]);
        }}
      />
    </Box>
  );
};

const ChapterList = ({ setHasChapter }) => {
  const { authAxios } = useContext(AuthContext);
  const router = useRouter();
  const textId = router.query.text_id;
  const { mutate } = useSWRConfig();
  const { data, error } = useSWR(`/texts/${textId}/chapters/`, () => getChapterList(textId), {
    revalidateOnFocus: false,
  });
  const [chapterOrder, setChapterOrder] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [chapterNameSettingOpen, setChapterMenuSettingOpen] = useState(false);

  useLayoutEffect(() => {
    if (data) {
      if (data.chapter_order) {
        const _chapterOrder = JSON.parse(data.chapter_order);
        const filteredChapterOrder = _chapterOrder.filter((id) => {
          for (let i = 0; i < data.chapters.length; i++) {
            if (data.chapters[i].id === id) return true;
          }
          return false;
        });
        setChapterOrder(filteredChapterOrder);
      } else {
        const _chapterOrder = data.chapters?.map((item) => item.id);
        setChapterOrder(_chapterOrder);
      }

      setHasChapter(data.chapters.length > 0);

      setIsLoading(false);
    }
  }, [data]);

  const handleAddChapterClick = () => {
    setChapterMenuSettingOpen(true);
  };

  async function handleChapterOrderChanged(order) {
    const { error } = await updateChapterOrder(textId, JSON.stringify(order), authAxios);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`/texts/${textId}/chapters/`);
  }

  async function handleChapterNameDecided(name) {
    setIsLoading(true);

    const { chapterId, error } = await createNewChapter(textId, authAxios, name);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`/texts/${textId}/chapters/`);
  }

  async function handleDeleteChapterClick(item) {
    setIsLoading(true);
    const { error } = await deleteChapter(item.id, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`/texts/${textId}/chapters/`);
  }

  async function handleToggleTrialReadingAvailable(item) {
    setIsLoading(true);
    const available = item.is_trial_reading_available;
    const { error } = await setChapterTrialReading(item.id, !available, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`/texts/${textId}/chapters/`);
  }

  function handleChapterClick(item) {
    router.push(`/chapters/${item.id}/edit`);
  }

  async function handleTitleChange(id, title) {
    setIsLoading(true);
    const { error } = await updateChapterTitle(id, title, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`/texts/${textId}/chapters/`);
  }

  if (error) return <div>failed to load</div>;
  if (!data) return <CenterLoadingSpinner />;

  let keyedChapterList = {};
  data.chapters.forEach((item) => {
    keyedChapterList[item.id] = item;
  });

  return (
    <>
      {isLoading && <LoadingBackDrop />}
      <Box sx={{ minHeight: 400 }}>
        <Box sx={{ p: { xs: 0, md: 2 } }}>
          {data.chapters.length > 0 ? (
            <ReactSortable
              list={chapterOrder}
              setList={(list) => {
                const _chapterOrder = list.map((id) => id);
                setChapterOrder(_chapterOrder);
                if (JSON.stringify(chapterOrder) != JSON.stringify(_chapterOrder)) {
                  handleChapterOrderChanged(_chapterOrder);
                }
              }}
            >
              {chapterOrder.map((chapterId) => (
                <ChapterListItem
                  key={chapterId}
                  chapterId={chapterId}
                  keyedChapterList={keyedChapterList}
                  handleChapterClick={handleChapterClick}
                  handleTitleChange={handleTitleChange}
                  handleDeleteChapterClick={handleDeleteChapterClick}
                  handleToggleTrialReadingAvailable={handleToggleTrialReadingAvailable}
                />
              ))}
            </ReactSortable>
          ) : (
            <span>チャプターはありません</span>
          )}
        </Box>
        <Box sx={{ pt: 3, display: 'flex' }}>
          <Box
            sx={{
              width: '70%',
              mx: 'auto',
              backgroundColor: Consts.COLOR.LightPrimary,
              color: Consts.COLOR.Primary,
              height: '48px',
              fontWeight: 'bold',
              border: '2px dashed grey',
              '&:hover': { backgroundColor: Consts.COLOR.LightPrimarySelected },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            variant='contained'
            onClick={() => handleAddChapterClick()}
          >
            チャプターを追加
          </Box>
        </Box>
      </Box>
      <ChapterTitleSettingDialog
        rkey={Math.random()}
        title=''
        open={chapterNameSettingOpen}
        onChange={handleChapterNameDecided}
        onClose={() => {
          setChapterMenuSettingOpen(false);
        }}
      />
    </>
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

EditText.getLayout = (page) => <EditTextLayout>{page}</EditTextLayout>;
export default EditText;

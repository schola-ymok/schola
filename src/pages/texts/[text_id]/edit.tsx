import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Slider,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Container } from '@mui/system';
import { useRouter } from 'next/router';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import useSWR, { useSWRConfig } from 'swr';

import { createNewChapter } from 'api/createNewChapter';
import { deleteChapter } from 'api/deleteChapter';
import { getChapterList } from 'api/getChapterList';
import { getMyText } from 'api/getMyText';
import { releaseText } from 'api/releaseText';
import { setTextCoverPhotoId } from 'api/setTextCoverPhotoId';
import { updateChapterOrder } from 'api/updateChapterOrder';
import { updateChapterTitle } from 'api/updateChapterTitle';
import { updateText } from 'api/updateText';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import ChapterListMenuButton from 'components/ChaptarListMenuButton';
import ChapterTitleSettingDialog from 'components/ChapterTitleSettingDialog';
import DefaultButton from 'components/DefaultButton';
import FormItemLabel from 'components/FormItemLabel';
import FormItemState from 'components/FormItemState';
import FormItemSubLabel from 'components/FormItemSubLabel';
import ImageCropDialog from 'components/ImageCropDialog';
import { AuthContext } from 'components/auth/AuthContext';
import EditTextHeader from 'components/headers/EditTextHeader';
import EditTextLayout from 'components/layouts/EditTextLayout';
import RTEditor from 'components/rteditor/RTEditor';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import useCropImage from 'utils/useCropImage';
import { validate } from 'utils/validate';

const EditText = () => {
  const router = useRouter();
  const { authAxios } = useContext(AuthContext);

  const [tab, setTab] = useState(router.query.chp !== undefined ? 1 : 0);

  const textId = router.query.text_id;

  const [price, setPrice] = useState();
  const [oldPrice, setOldPrice] = useState();
  const [priceChanged, setPriceChanged] = useState(false);

  const [setComplete, setSetComplete] = useState(false);

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

  const [savingState, setSavingState] = useState(null);
  const { mutate } = useSWRConfig();
  const photoId = genid(8);

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
    } else {
      router.replace(`/texts/${textId}/edit`);
    }
    setTab(newNumber);
  };

  //console.log('validated=' + validated);

  useEffect(() => {
    if (data) {
      if (data.price) {
        setPrice(data.price);
        setOldPrice(data.price);
      } else {
        setPrice(50);
        setOldPrice(50);
      }

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

      setSetComplete(true);
    }
  }, [data]);

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

    setSavingState('saved');
  }

  async function handleReleaseToggle(release) {
    const { error } = await releaseText(textId, release, authAxios);
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

  console.log('changed=' + checkChange());
  console.log('validated=' + checkValidation());

  return (
    <>
      <EditTextHeader
        textId={textId}
        handleSaveClick={handleSaveClick}
        handleReleaseToggle={handleReleaseToggle}
        release={data.is_released}
      />

      <Container maxWidth='md'>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label={<Box sx={{ fontWeight: 'bold' }}>テキスト情報</Box>} />
            <Tab label={<Box sx={{ fontWeight: 'bold' }}>チャプター</Box>} />
          </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
          <Box
            sx={{
              width: { xs: '98%', md: '90%' },
              mx: 'auto',
              display: 'flex',
              flexFlow: 'column',
              p: { xs: 0.4, sm: 2 },
            }}
          >
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
                placeholder='タイトル'
                value={title}
                variant='outlined'
                fullWidth
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
                fullWidth
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

              <Box sx={{ my: 'auto', ml: 2, mr: { xs: 'unset', sm: 'auto' }, p: 1, width: '90%' }}>
                <Slider
                  aria-label='円'
                  value={price}
                  onChange={(e) => {
                    onPriceChange(e);
                  }}
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
                  Consts.CATEGORY[category1].items.map((item) => {
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
              exSx={{ width: '180px', mt: { xs: 2, md: 4 }, mx: 'auto' }}
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
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ mt: 1.5, mx: { xs: 'auto', md: 2 } }}>
              <h5>Chapters</h5>
            </Box>
          </Box>
          <Box fullWidth sx={{ p: 1 }}>
            <ChapterList />
          </Box>
        </TabPanel>
      </Container>
    </>
  );
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
        return (
          <>
            <ListItem
              key={'learningContent-' + index}
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
          </>
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
        return (
          <>
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
          </>
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
          fullWidth
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

const ChapterList = () => {
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
    }
  }, [data]);

  if (error) return <div>failed to load</div>;
  if (!data) return <CenterLoadingSpinner />;

  const handleAddChapterClick = () => {
    setChapterMenuSettingOpen(true);
  };

  async function handleChapterOrderChanged(order) {
    setIsLoading(true);

    const { error } = await updateChapterOrder(textId, JSON.stringify(order), authAxios);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`/texts/${textId}/chapters/`);
    setIsLoading(false);
  }

  async function handleChapterNameDecided(name) {
    setIsLoading(true);

    const { chapterId, error } = await createNewChapter(textId, authAxios, name);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`/texts/${textId}/chapters/`);
    setIsLoading(false);
  }

  async function handleDeleteChapterClick(item) {
    setIsLoading(true);
    const { error } = await deleteChapter(item.id, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`/texts/${textId}/chapters/`);
    setIsLoading(false);
  }

  function handleChapterClick(item) {
    router.push({
      pathname: `/chapters/${item.id}/edit`,
    });
  }

  async function handleTitleChange(id, title) {
    const { error } = await updateChapterTitle(id, title, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`/texts/${textId}/chapters/`);
  }

  let keyedChapterList = {};
  data.chapters.forEach((item) => {
    keyedChapterList[item.id] = item;
  });

  return (
    <>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      fontSize: { xs: '1.0em', sm: '1.2em' },
                      fontWeight: 'bold',
                      p: { xs: 0, md: 1.5 },
                      width: '100%',
                      '&:hover': { color: Consts.COLOR.Primary },
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onClick={() => {
                      handleChapterClick(keyedChapterList[chapterId]);
                    }}
                  >
                    {keyedChapterList[chapterId]?.title}
                  </Box>
                  <ChapterListMenuButton
                    key={chapterId}
                    item={keyedChapterList[chapterId]}
                    handleDelete={handleDeleteChapterClick}
                    handleEdit={handleChapterClick}
                    handleTitleChange={(title) => {
                      handleTitleChange(chapterId, title);
                    }}
                  />
                </Box>
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
            {isLoading ? (
              <CircularProgress size={28} sx={{ color: Consts.COLOR.Primary }} />
            ) : (
              <>チャプターを追加</>
            )}
          </Box>
        </Box>
      </Box>
      <ChapterTitleSettingDialog
        key={Math.random()}
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

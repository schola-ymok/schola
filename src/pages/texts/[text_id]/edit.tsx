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
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Container } from '@mui/system';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { WithContext as ReactTags } from 'react-tag-input';
import useSWR, { useSWRConfig } from 'swr';

import { createNewChapter } from 'api/createNewChapter';
import { deleteChapter } from 'api/deleteChapter';
import { getChapterList } from 'api/getChapterList';
import { getMyText } from 'api/getMyText';
import { releaseText } from 'api/releaseText';
import { setTextCoverPhotoId } from 'api/setTextCoverPhotoId';
import { updateChapterTitle } from 'api/updateChapterTitle';
import { updateText } from 'api/updateText';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import ChapterListMenuButton from 'components/ChaptarListMenuButton';
import ChapterTitleSettingDialog from 'components/ChapterTitleSettingDialog';
import DefaultButton from 'components/DefaultButton';
import ImageCropDialog from 'components/ImageCropDialog';
import SMenuItem from 'components/SMenuItem';
import { AuthContext } from 'components/auth/AuthContext';
import EditTextHeader from 'components/headers/EditTextHeader';
import EditTextLayout from 'components/layouts/EditTextLayout';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import useCropImage from 'utils/useCropImage';

const EditText = () => {
  const router = useRouter();
  const { authAxios } = useContext(AuthContext);

  const [tab, setTab] = useState(router.query.chp !== undefined ? 1 : 0);

  const textId = router.query.text_id;
  const [price, setPrice] = useState(100);
  const [abstract, setAbstract] = useState('');
  const [changed, setChanged] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [title, setTitle] = useState('');
  const [category1, setCategory1] = useState('nul');
  const [category2, setCategory2] = useState('nul');
  const [learningContents, setLearningContents] = useState([]);
  const [learningRequirements, setLearningRequirements] = useState([]);

  const [savingState, setSavingState] = useState(null);
  const { mutate } = useSWRConfig();
  const photoId = genid(8);

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
  ] = useCropImage(Consts.IMAGE_STORE_URL + photoId + '.png', () => {
    setTextCoverPhotoId(authAxios, textId, photoId);
    setImageUrl(Consts.IMAGE_STORE_URL + photoId + '.png');
  });

  const { data, error } = useSWR(`texts/${textId}`, () => getMyText(textId, authAxios), {
    revalidateOnFocus: false,
  });

  const onPriceChange = (e) => {
    setPrice(e.target.value);
  };

  const onAbstractChange = (e) => {
    setAbstract(e.target.value);
  };

  const onExplanationChange = (e) => {
    setExplanation(e.target.value);
  };

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onCategory1Change = (e) => {
    setCategory1(e.target.value);
    setCategory2('nul');
  };

  const onCategory2Change = (e) => {
    setCategory2(e.target.value);
  };

  const handleTabChange = (event, newNumber) => {
    if (newNumber == 1) {
      router.replace(`/texts/${textId}/edit?chp`);
    } else {
      router.replace(`/texts/${textId}/edit`);
    }
    setTab(newNumber);
  };

  useEffect(() => {
    if (data) {
      if (data.price) setPrice(data.price);
      if (data.abstract) setAbstract(data.abstract);
      if (data.explanation) setExplanation(data.explanation);
      setTitle(data.title);
      if (data.category1) setCategory1(data.category1);
      if (data.category2) setCategory2(data.category2);
      if (data.chapter_order) setChapterOrder(JSON.parse(data.chapter_order));
      if (data.photo_id) setImageUrl(Consts.IMAGE_STORE_URL + data.photo_id + '.png');

      if (data.learning_contents) {
        const _learningContents = JSON.parse(data.learning_contents);
        let len = 4 - _learningContents.length;
        if (len < 0) len = 0;
        setLearningContents([..._learningContents, ...Array(len)]);
      } else {
        setLearningContents([...Array(4)]);
      }

      if (data.learning_requirements) {
        setLearningRequirements(JSON.parse(data.learning_requirements));
      } else {
        setLearningRequirements([...Array(1)]);
      }
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
    setChanged(false);
  }

  async function handleReleaseToggle(release) {
    const { error } = await releaseText(textId, release, authAxios);
  }

  const [imageUrl, setImageUrl] = useState('/cover-default.svg');

  if (error) console.log(error);
  if (!data) return <CenterLoadingSpinner />;

  let saveButtonContent;

  if (savingState === 'saving') {
    saveButtonContent = <CircularProgress size={28} sx={{ color: 'white' }} />;
  } else if (savingState === 'saved' && !changed) {
    saveButtonContent = <CheckIcon sx={{ color: 'black' }} />;
  } else {
    saveButtonContent = <>保存</>;
  }

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
            <Tab label={<Box sx={{ fontWeight: 'bold' }}>テキスト情報</Box>} {...a11yProps(0)} />
            <Tab label={<Box sx={{ fontWeight: 'bold' }}>チャプター</Box>} {...a11yProps(1)} />
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
            <Box
              sx={{
                fontWeight: 'bold',
              }}
            >
              カバー画像
            </Box>

            <Box sx={{ mt: 1 }}>
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
            </Box>

            {/* title */}
            <Box
              sx={{
                fontWeight: 'bold',
                mt: 3,
              }}
            >
              テキストのタイトル
            </Box>

            <Box
              sx={{
                p: 1,
                mt: 0.5,
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
                onChange={(e) => {
                  onTitleChange(e);
                  setChanged(true);
                }}
              />
            </Box>

            {/* abstract */}
            <Box
              sx={{
                fontWeight: 'bold',
                mt: 2,
              }}
            >
              テキストの概要
            </Box>

            <Box
              sx={{
                p: 1,
                mt: 0.5,
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
                onChange={(e) => {
                  onAbstractChange(e);
                  setChanged(true);
                }}
              />
            </Box>

            {/* explanation */}
            <Box
              sx={{
                fontWeight: 'bold',
                mt: 2,
              }}
            >
              テキストの詳細な解説
            </Box>

            <Box
              sx={{
                p: 1,
                mt: 0.5,
                mx: 'auto',
                width: '100%',
                maxWidth: 800,
                border: '2px solid ' + Consts.COLOR.Grey,
                '&:hover': {
                  border: '2px solid ' + Consts.COLOR.Primary,
                },
              }}
            >
              <InputBase
                placeholder='テキストの詳細な解説'
                value={explanation}
                fullWidth
                rows={8}
                multiline
                onChange={(e) => {
                  onExplanationChange(e);
                  setChanged(true);
                }}
              />
            </Box>

            {/* Price */}
            <Box
              sx={{
                fontWeight: 'bold',
                mt: 2,
              }}
            >
              テキストの販売価格
            </Box>

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

              <Box sx={{ my: 'auto', ml: 2, mr: { xs: 'unset', sm: 'auto' }, p: 1, width: '60%' }}>
                <Slider
                  aria-label='円'
                  value={price}
                  onChange={(e) => {
                    onPriceChange(e);
                    setChanged(true);
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
            <Box
              sx={{
                fontWeight: 'bold',
                mt: 2,
              }}
            >
              カテゴリの選択
            </Box>

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
                  setChanged(true);
                }}
                sx={{
                  mt: 0.5,
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
                <SMenuItem disabled value='nul'>
                  --- カテゴリ ---
                </SMenuItem>
                {Object.keys(Consts.CATEGORY).map((key) => {
                  return (
                    <SMenuItem key={key} value={key}>
                      {Consts.CATEGORY[key].label}
                    </SMenuItem>
                  );
                })}
              </Select>

              <Select
                labelId='category2'
                id='category2'
                value={category2}
                onChange={(e) => {
                  onCategory2Change(e);
                  setChanged(true);
                }}
                sx={{
                  mt: 0.5,
                  ml: { xs: 'unset', md: 1 },
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
                <SMenuItem disabled value='nul'>
                  --- サブカテゴリ ---
                </SMenuItem>
                {category1 != 'nul' &&
                  Consts.CATEGORY[category1].items.map((item) => {
                    return (
                      <SMenuItem key={item.key} value={item.key}>
                        {item.label}
                      </SMenuItem>
                    );
                  })}
              </Select>
            </Box>

            {/* LearningContents */}
            <Box
              sx={{
                fontWeight: 'bold',
                mt: 2,
              }}
            >
              テキストで学習できることは何ですか？
            </Box>

            <Box sx={{ width: '100%' }}>
              <LearningContentsList
                learningContents={learningContents}
                setLearningContents={setLearningContents}
                setChanged={setChanged}
              />
            </Box>

            <ItemAddButton
              onClick={() => {
                setLearningContents([...learningContents, '']);
              }}
            />

            {/* LearningRequirements */}
            <Box
              sx={{
                fontWeight: 'bold',
                mt: 2,
              }}
            >
              想定している読者や要件は何ですか？
            </Box>

            <Box sx={{ width: '100%' }}>
              <LearningRequirementsList
                learningRequirements={learningRequirements}
                setLearningRequirements={setLearningRequirements}
                setChanged={setChanged}
              />
            </Box>

            <ItemAddButton
              onClick={() => {
                setLearningRequirements([...learningRequirements, '']);
              }}
            />

            <DefaultButton
              exSx={{ width: '180px', mt: { xs: 2, md: 4 }, mx: 'auto' }}
              disabled={!changed}
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

const LearningContentsList = ({ learningContents, setLearningContents, setChanged }) => {
  return (
    <>
      {learningContents.map((item, index) => {
        return (
          <ListItem
            placeholder={'マーティングの基礎'}
            value={item}
            deleteEnable={learningContents.length > 4}
            onChange={(value) => {
              setLearningContents(
                learningContents.map((_value, _index) => (index === _index ? value : _value)),
              );
              setChanged(true);
            }}
            onDelete={() => {
              setLearningContents(learningContents.filter((_value, _index) => index !== _index));
              setChanged(true);
            }}
          />
        );
      })}
    </>
  );
};

const LearningRequirementsList = ({
  learningRequirements,
  setLearningRequirements,
  setChanged,
}) => {
  return (
    <>
      {learningRequirements.map((item, index) => {
        return (
          <ListItem
            placeholder={'マーティングの基礎'}
            value={item}
            deleteEnable={learningRequirements.length > 1}
            onChange={(value) => {
              setLearningRequirements(
                learningRequirements.map((_value, _index) => (index === _index ? value : _value)),
              );
              setChanged(true);
            }}
            onDelete={() => {
              setLearningRequirements(
                learningRequirements.filter((_value, _index) => index !== _index),
              );
              setChanged(true);
            }}
          />
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

  if (error) return <div>failed to load</div>;
  if (!data) return <CenterLoadingSpinner />;

  const handleAddChapterClick = () => {
    setChapterMenuSettingOpen(true);
  };

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

  return (
    <>
      <Box sx={{ minHeight: 400 }}>
        <Box sx={{ p: { xs: 0, md: 2 } }}>
          {data.length > 0 ? (
            <ReactSortable list={data} setList={setChapterOrder}>
              {data.map((item) => (
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
                      handleChapterClick(item);
                    }}
                  >
                    {item.title}
                  </Box>
                  <ChapterListMenuButton
                    key={item.id}
                    item={item}
                    handleDelete={handleDeleteChapterClick}
                    handleEdit={handleChapterClick}
                    handleTitleChange={(title) => {
                      handleTitleChange(item.id, title);
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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

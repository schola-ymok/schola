import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  InputBase,
  MenuItem,
  Select,
  Slider,
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
import { updateText } from 'api/updateText';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import ChapterListMenuButton from 'components/ChaptarListMenuButton';
import DefaultButton from 'components/DefaultButton';
import ImageCropDialog from 'components/ImageCropDialog';
import { AuthContext } from 'components/auth/AuthContext';
import EditTextHeader from 'components/headers/EditTextHeader';
import EditTextLayout from 'components/layouts/EditTextLayout';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import useCropImage from 'utils/useCropImage';

const EditText = () => {
  const router = useRouter();
  const { authAxios } = useContext(AuthContext);
  const [tab, setTab] = useState(0);

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
    setTab(newNumber);
  };

  const onLearningContentsChange = (id, e) => {
    setLearningContents([
      ...learningContents.slice(0, id),
      e.target.value,
      ...learningContents.slice(id + 1),
    ]);
  };

  const onLearningRequirementsChange = (id, e) => {
    setLearningRequirements([
      ...learningRequirements.slice(0, id),
      e.target.value,
      ...learningRequirements.slice(id + 1),
    ]);
  };

  //  useOutsideClick(handleSaveClick, Consts.EVENT.SAVE);

  useEffect(() => {
    if (data) {
      if (data.price) setPrice(data.price);
      if (data.abstract) setAbstract(data.abstract);
      if (data.explanation) setExplanation(data.explanation);
      setTitle(data.title);
      if (data.category1) setCategory1(data.category1);
      if (data.category2) setCategory2(data.category2);
      if (data.learning_contents) setLearningContents(JSON.parse(data.learning_contents));
      if (data.learning_requirements)
        setLearningRequirements(JSON.parse(data.learning_requirements));
      if (data.chapter_order) setChapterOrder(JSON.parse(data.chapter_order));
      if (data.photo_id) setImageUrl(Consts.IMAGE_STORE_URL + data.photo_id + '.png');
    }
  }, [data]);

  async function handleSaveClick() {
    setSavingState('saving');
    const { error } = await updateText(
      textId,
      title,
      abstract,
      explanation,
      category1,
      category2,
      price,
      JSON.stringify(learningContents),
      JSON.stringify(learningRequirements),
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

  const LEFT_COL_SIZE = 300;

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

      <Container maxWidth='lg'>
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
              maxWidth: 1000,
              mx: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              p: { xs: 0.4, sm: 2 },
            }}
          >
            {/* image */}
            <Box sx={{ mt: { xs: 1, md: 1.5 }, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ pr: 2, width: { xs: '100%', md: LEFT_COL_SIZE }, display: 'flex' }}>
                <Box
                  sx={{
                    ml: 'auto',
                    fontWeight: 'bold',
                    my: 'auto',
                    mr: { xs: 'auto', md: 'unset' },
                  }}
                >
                  カバー画像
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', md: 'calc(100% - ' + LEFT_COL_SIZE + 'px)' },
                  display: 'flex',
                }}
              >
                <Box sx={{ mr: 'auto', ml: { xs: 'auto', md: 'unset' }, width: 256 }}>
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
              </Box>
            </Box>

            {/* title */}
            <Box sx={{ mt: { xs: 2, md: 3 }, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ pr: 2, width: { xs: '100%', md: LEFT_COL_SIZE }, display: 'flex' }}>
                <Box
                  sx={{
                    ml: 'auto',
                    fontWeight: 'bold',
                    my: 'auto',
                    mr: { xs: 'auto', md: 'unset' },
                  }}
                >
                  テキストのタイトル
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', md: 'calc(100% - ' + LEFT_COL_SIZE + 'px)' },
                  display: 'flex',
                }}
              >
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
                    onChange={(e) => {
                      onTitleChange(e);
                      setChanged(true);
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* abstract */}
            <Box sx={{ mt: { xs: 2, md: 3 }, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ pr: 2, width: { xs: '100%', md: LEFT_COL_SIZE }, display: 'flex' }}>
                <Box
                  sx={{
                    ml: 'auto',
                    fontWeight: 'bold',
                    my: 'auto',
                    mr: { xs: 'auto', md: 'unset' },
                  }}
                >
                  テキストの概要
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', md: 'calc(100% - ' + LEFT_COL_SIZE + 'px)' },
                  display: 'flex',
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    my: 1,
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
              </Box>
            </Box>

            {/* explanation */}
            <Box sx={{ mt: { xs: 2, md: 3 }, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ pr: 2, width: { xs: '100%', md: LEFT_COL_SIZE }, display: 'flex' }}>
                <Box
                  sx={{
                    ml: 'auto',
                    fontWeight: 'bold',
                    my: 'auto',
                    mr: { xs: 'auto', md: 'unset' },
                  }}
                >
                  テキストの詳細な解説
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', md: 'calc(100% - ' + LEFT_COL_SIZE + 'px)' },
                  display: 'flex',
                }}
              >
                <Box
                  sx={{
                    p: 1,
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
              </Box>
            </Box>

            {/* Price */}
            <Box sx={{ mt: { xs: 2, md: 3 }, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ pr: 2, width: { xs: '100%', md: LEFT_COL_SIZE }, display: 'flex' }}>
                <Box
                  sx={{
                    ml: 'auto',
                    fontWeight: 'bold',
                    my: 'auto',
                    mr: { xs: 'auto', md: 'unset' },
                  }}
                >
                  テキストの販売価格
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', md: 'calc(100% - ' + LEFT_COL_SIZE + 'px)' },
                  px: 1,
                  display: 'flex',
                }}
              >
                <Box
                  sx={{
                    color: Consts.COLOR.Primary,
                    width: 80,
                    ml: 'auto',
                    fontWeight: 'bold',
                    fontSize: '1.3em',
                    my: 'auto',
                  }}
                >
                  {price}円
                </Box>

                <Box sx={{ my: 'auto', mx: 'auto', p: 1, width: '75%' }}>
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
                        value: 100,
                        label: '100円',
                      },
                      {
                        value: 5000,
                        label: '5000円',
                      },
                    ]}
                    step={100}
                    min={100}
                    max={5000}
                  />
                </Box>
              </Box>
            </Box>

            {/* Category */}
            <Box sx={{ mt: { xs: 1, md: 2 }, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ width: { xs: '100%', md: LEFT_COL_SIZE }, display: 'flex' }}>
                <Box
                  sx={{
                    pr: 2,
                    ml: 'auto',
                    fontWeight: 'bold',
                    my: 'auto',
                    mr: { xs: 'auto', md: 'unset' },
                  }}
                >
                  カテゴリの選択
                </Box>
              </Box>

              <Box
                sx={{
                  width: { xs: '100%', md: 'auto' },
                  display: 'flex',
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
                    m: 1,
                    mx: { xs: 'auto', md: 'unset' },
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
              </Box>

              <Box
                sx={{
                  width: { xs: '100%', md: 'auto' },
                  display: 'flex',
                }}
              >
                <Select
                  labelId='category2'
                  id='category2'
                  value={category2}
                  onChange={(e) => {
                    onCategory2Change(e);
                    setChanged(true);
                  }}
                  sx={{
                    m: { xs: 0, md: 1 },
                    mx: { xs: 'auto', md: 1 },
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
            </Box>

            {/* LearningContents */}
            <Box sx={{ mt: { xs: 2, md: 3 }, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ width: { xs: '100%', md: LEFT_COL_SIZE }, display: 'flex' }}>
                <Box
                  sx={{
                    pr: 1.5,
                    ml: 'auto',
                    fontWeight: 'bold',
                    mt: 2,
                    mb: 1,
                    mr: { xs: 'auto', md: 'unset' },
                  }}
                >
                  テキストで学習できることは何ですか？
                </Box>
              </Box>

              <Box
                sx={{
                  width: { xs: '100%', md: 'calc(100% - ' + LEFT_COL_SIZE + 'px)' },
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <ReactTags
                    placeholder='学習内容を８個まで入力'
                    tags={learningContents}
                    autofocus={false}
                    allowDragDrop={false}
                    handleAddition={(tag) => {
                      setLearningContents([...learningContents, tag]);
                      setChanged(true);
                    }}
                    handleDelete={(index) => {
                      setLearningContents(learningContents.filter((tag, i) => i !== index));
                      setChanged(true);
                    }}
                    inputFieldPosition='top'
                  />
                </Box>
              </Box>
            </Box>

            {/* LearningRequirements */}
            <Box sx={{ mt: { xs: 2, md: 3 }, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ width: { xs: '100%', md: LEFT_COL_SIZE }, display: 'flex' }}>
                <Box
                  sx={{
                    pr: 1.5,
                    ml: 'auto',
                    fontWeight: 'bold',
                    mt: 2,
                    mb: 1,
                    mr: { xs: 'auto', md: 'unset' },
                  }}
                >
                  想定している読者や要件は何ですか？
                </Box>
              </Box>

              <Box
                sx={{
                  width: { xs: '100%', md: 'calc(100% - ' + LEFT_COL_SIZE + 'px)' },
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <ReactTags
                    placeholder='学習条件を８個まで入力'
                    tags={learningRequirements}
                    autofocus={false}
                    allowDragDrop={false}
                    handleAddition={(tag) => {
                      setLearningRequirements([...learningRequirements, tag]);
                      setChanged(true);
                    }}
                    handleDelete={(index) => {
                      setLearningRequirements(learningRequirements.filter((tag, i) => i !== index));
                      setChanged(true);
                    }}
                    inputFieldPosition='top'
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: { xs: 2, md: 3 }, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
              <Box sx={{ width: { xs: '100%', md: LEFT_COL_SIZE }, display: 'flex' }}>
                <Box
                  sx={{
                    pr: 1.5,
                    ml: 'auto',
                    fontWeight: 'bold',
                    mt: 2,
                    mb: 1,
                    mr: { xs: 'auto', md: 'unset' },
                  }}
                ></Box>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', md: 'calc(100% - ' + LEFT_COL_SIZE + 'px)' },
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <DefaultButton
                    exSx={{ width: '180px', mt: { xs: 0, md: 2 }, mx: { xs: 'auto', md: 'unset' } }}
                    disabled={!changed}
                    onClick={() => {
                      if (savingState !== 'saving') handleSaveClick();
                    }}
                  >
                    {saveButtonContent}
                  </DefaultButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ mt: 1.5, mx: { xs: 'auto', md: 2 } }}>
              <h5>Chapters</h5>
            </Box>
          </Box>
          <Box sx={{ width: '100%', m: 1 }}>
            <ChapterList />
          </Box>
        </TabPanel>
      </Container>
    </>
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

  if (error) return <div>failed to load</div>;
  if (!data) return <CenterLoadingSpinner />;

  async function handleAddChapterClick() {
    setIsLoading(true);

    const { chapterId, error } = await createNewChapter(textId, authAxios, '新しいチャプター');

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

  return (
    <>
      <Box sx={{ minHeight: 400 }}>
        <Box flexGrow={1} sx={{ p: { xs: 0, md: 2 } }}>
          {data.length > 0 ? (
            <ReactSortable list={data} setList={setChapterOrder}>
              {data.map((item) => (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      fontSize: '1.2em',
                      fontWeight: 'bold',
                      p: { xs: 0, md: 1.5 },
                      width: '100%',
                      '&:hover': { color: Consts.COLOR.Primary },
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleChapterClick(item);
                    }}
                  >
                    {item.title}
                  </Box>
                  <ChapterListMenuButton
                    item={item}
                    handleDelete={handleDeleteChapterClick}
                    handleEdit={handleChapterClick}
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

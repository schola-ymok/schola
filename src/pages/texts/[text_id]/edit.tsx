import { Box, Button, Divider, InputBase, MenuItem, Select, Slider } from '@mui/material';
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

  const textId = router.query.text_id;
  const [price, setPrice] = useState(100);
  const [abstract, setAbstract] = useState('');
  const [title, setTitle] = useState('');
  const [category1, setCategory1] = useState('nul');
  const [category2, setCategory2] = useState('nul');
  const [learningContents, setLearningContents] = useState([]);
  const [learningRequirements, setLearningRequirements] = useState([]);
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
    const { error } = await updateText(
      textId,
      title,
      abstract,
      category1,
      category2,
      price,
      JSON.stringify(learningContents),
      JSON.stringify(learningRequirements),
      authAxios,
    );

    if (error) {
      console.log(error);
    }

    mutate(`texts/${textId}`);
  }

  async function handleReleaseToggle(release) {
    const { error } = await releaseText(textId, release, authAxios);
  }

  const [imageUrl, setImageUrl] = useState('/cover-default.svg');

  if (error) console.log(error);
  if (!data) return <CenterLoadingSpinner />;

  return (
    <>
      <EditTextHeader
        handleSaveClick={handleSaveClick}
        handleReleaseToggle={handleReleaseToggle}
        release={data.is_released}
      />

      <Box
        sx={{
          width: { xs: '98%', md: '90%' },
          maxWidth: 1000,
          mx: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          p: { xs: 0.4, sm: 2 },
          mt: 2,
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: 256 },
          }}
        >
          <Box sx={{ mx: 'auto', width: 256 }}>
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
              <Box sx={{ textAlign: 'center', width: '100%', mb: 1 }}>
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
        </Box>
        <Box
          sx={{
            pl: { xs: 0, md: 1 },
            width: { xs: '100%', md: 'calc(100% - 256px)' },
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
              sx={{ fontSize: '1.3em', fontWeight: 'bold' }}
              variant='outlined'
              fullWidth
              onChange={onTitleChange}
            />
          </Box>

          <Box
            sx={{
              p: 1,
              mt: 1,
              width: '100%',
              maxWidth: 800,
              border: '2px solid ' + Consts.COLOR.Grey,
              '&:hover': {
                border: '2px solid ' + Consts.COLOR.Primary,
              },
            }}
          >
            <InputBase
              placeholder='概要'
              value={abstract}
              fullWidth
              rows={7}
              multiline
              onChange={onAbstractChange}
            />
          </Box>
        </Box>

        {/* Price */}
        <Box sx={{ mt: { xs: 2, md: 3 }, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{ pr: 2, width: { xs: '100%', md: 350 }, display: 'flex' }}>
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
              width: { xs: '100%', md: 'calc(100% - 350px)' },
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
                onChange={onPriceChange}
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
          <Box sx={{ width: { xs: '100%', md: 350 }, display: 'flex' }}>
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
              onChange={onCategory1Change}
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
              onChange={onCategory2Change}
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
          <Box sx={{ width: { xs: '100%', md: 350 }, display: 'flex' }}>
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
              width: { xs: '100%', md: 'calc(100% - 350px)' },
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <ReactTags
                placeholder='学習内容を８個まで入力'
                tags={learningContents}
                autofocus={true}
                allowDragDrop={false}
                handleAddition={(tag) => setLearningContents([...learningContents, tag])}
                handleDelete={(index) =>
                  setLearningContents(learningContents.filter((tag, i) => i !== index))
                }
                inputFieldPosition='top'
              />
            </Box>
          </Box>
        </Box>

        {/* LearningRequirements */}
        <Box sx={{ mt: { xs: 2, md: 3 }, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{ width: { xs: '100%', md: 350 }, display: 'flex' }}>
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
              width: { xs: '100%', md: 'calc(100% - 350px)' },
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <ReactTags
                placeholder='学習条件を８個まで入力'
                tags={learningRequirements}
                autofocus={true}
                allowDragDrop={false}
                handleAddition={(tag) => setLearningRequirements([...learningRequirements, tag])}
                handleDelete={(index) =>
                  setLearningRequirements(learningRequirements.filter((tag, i) => i !== index))
                }
                inputFieldPosition='top'
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 3, width: '100%' }}>
          <Divider />
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ mt: 2, mx: { xs: 'auto', md: 'unset' } }}>
              <h5>Chapters</h5>
            </Box>
          </Box>
          <ChapterList />
        </Box>
      </Box>
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
  const [isChapterAdding, setIsChapterAdding] = useState(false);

  if (error) return <div>failed to load</div>;
  if (!data) return <CenterLoadingSpinner />;

  async function handleAddChapterClick() {
    setIsChapterAdding(true);

    const { chapterId, error } = await createNewChapter(textId, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`/texts/${textId}/chapters/`);
  }

  async function handleDeleteChapterClick(item) {
    const { error } = await deleteChapter(item.id, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    mutate(`/texts/${textId}/chapters/`);
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
          <Button
            sx={{
              width: '70%',
              mx: 'auto',
              backgroundColor: Consts.COLOR.LightPrimary,
              color: Consts.COLOR.Primary,
              fontWeight: 'bold',
              border: '2px dashed grey',
              '&:hover': { backgroundColor: Consts.COLOR.LightPrimarySelected },
            }}
            variant='contained'
            onClick={() => handleAddChapterClick()}
          >
            チャプターを追加
          </Button>
        </Box>
      </Box>
    </>
  );
};

EditText.getLayout = (page) => <EditTextLayout>{page}</EditTextLayout>;
export default EditText;

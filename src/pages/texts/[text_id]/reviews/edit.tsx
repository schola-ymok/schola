import { Box, Button, InputBase, Rating, Slide, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import useSWR from 'swr';

import { deleteReview } from 'api/deleteReview';
import { getBriefText } from 'api/getBriefText';
import { getMyReview } from 'api/getMyReview';
import { upsertReview } from 'api/upsertReview';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import DefaultButton from 'components/DefaultButton';
import FormItemLabel from 'components/FormItemLabel';
import FormItemState from 'components/FormItemState';
import FormItemSubLabel from 'components/FormItemSubLabel';
import LoadingBackDrop from 'components/LoadingBackDrop';
import MiniText from 'components/MiniText';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import { validate } from 'utils/validate';

import type { NextPage } from 'next';

const EditReview: NextPage = () => {
  const router = useRouter();

  const textId = router.query.text_id;
  const { authAxios } = useContext(AuthContext);

  const [rate, setRate] = useState();
  const [oldRate, setOldRate] = useState();
  const [rateChanged, setRateChanged] = useState(false);

  const [title, setTitle] = useState();
  const [oldTitle, setOldTitle] = useState();
  const [titleChanged, setTitleChanged] = useState(false);
  const [titleValidation, setTitleValidation] = useState();

  const [comment, setComment] = useState();
  const [oldComment, setOldComment] = useState();
  const [commentChanged, setCommentChanged] = useState(false);
  const [commentValidation, setCommentValidation] = useState();

  const [swrKey] = useState(genid(4));

  const [setComplete, setSetComplete] = useState(false);

  const [isSaving, setSaving] = useState(false);

  const [notice, setNotice] = useState({ open: false, message: '' });

  function checkChange() {
    return rateChanged || titleChanged || commentChanged;
  }

  function checkValidation() {
    return titleValidation.ok && commentValidation.ok;
  }

  const { data: dataText, error: errorText } = useSWR(
    `texts/${textId}?brf=1`,
    () => getBriefText(textId),
    {
      revalidateOnFocus: false,
    },
  );

  const { data: dataReview, error: errorReview } = useSWR(
    `texts/${textId}/reviews?mine_${swrKey}`,
    () => getMyReview(textId, authAxios),
    {
      revalidateOnFocus: false,
    },
  );

  const onTitleChange = (e) => {
    setTitle(e.target.value);
    setTitleChanged(e.target.value != oldTitle);
    validateTitle(e.target.value);
  };

  const validateTitle = (value) => {
    setTitleValidation(validate(value, Consts.VALIDATE.reviewTitle));
  };

  const onCommentChange = (e) => {
    setComment(e.target.value);
    setCommentChanged(e.target.value != oldComment);
    validateComment(e.target.value);
  };

  const onRateChange = (value) => {
    setRate(value);
    setRateChanged(value != oldRate);
  };

  const validateComment = (value) => {
    setCommentValidation(validate(value, Consts.VALIDATE.reviewComment));
  };

  async function handleEditReviewClick() {
    setSaving(true);
    const { data, error } = await upsertReview(textId, title, rate, comment, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    setNotice({
      open: true,
      message: 'レビューを' + (dataReview.exists ? '更新' : '投稿') + 'しました',
    });

    setTimeout(() => {
      router.push(`/texts/${textId}/reviews`);
    }, 1000);
  }

  async function handleDeleteReviewClick() {
    setSaving(true);
    const { data, error } = await deleteReview(textId, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    setNotice({
      open: true,
      message: 'レビューを削除しました',
    });

    setTimeout(() => {
      router.push(`/texts/${textId}/reviews`);
    }, 1000);
  }

  useEffect(() => {
    if (dataReview) {
      let _rate = 3;
      let _title, _comment;
      if (dataReview.exists) {
        _title = dataReview.review.title;
        _comment = dataReview.review.comment;
        if (dataReview.review.rate) _rate = dataReview.review.rate;
      }

      setTitle(_title);
      setOldTitle(_title);
      setTitleChanged(false);
      validateTitle(_title);

      setComment(_comment);
      setOldComment(_comment);
      setCommentChanged(false);
      validateComment(_comment);

      setRate(_rate);
      setOldRate(_rate);
      setRateChanged(false);

      setSetComplete(true);
    }
  }, [dataReview]);

  if (errorText) console.log(errorText);
  if (errorReview) console.log(errorReview);
  if (!dataText || !dataReview || !setComplete) return <CenterLoadingSpinner />;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      {isSaving && <LoadingBackDrop />}
      <Box sx={{ width: { xs: '100%', sm: '600px' }, display: 'flex', flexFlow: 'column' }}>
        <Box sx={{ fontSize: '1.2em', fontWeight: 'bold' }}>このテキストをレビュー</Box>
        <MiniText text={dataText} />

        <FormItemLabel sx={{ mt: 2 }}>評価</FormItemLabel>
        <Rating
          name='simple-controlled'
          value={rate}
          onChange={(event, newValue) => {
            onRateChange(newValue);
          }}
        />

        <FormItemLabel sx={{ mt: 2 }}>レビュータイトル</FormItemLabel>
        <FormItemSubLabel>
          レビュータイトルを{Consts.VALIDATE.reviewTitle.min}～{Consts.VALIDATE.reviewTitle.max}
          文字で入力
        </FormItemSubLabel>

        <Box
          sx={{
            p: 1,
            width: '100%',
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

        <FormItemLabel sx={{ mt: 2 }}>レビューコメント</FormItemLabel>
        <FormItemSubLabel>
          レビューコメントを{Consts.VALIDATE.reviewComment.min}～{Consts.VALIDATE.reviewComment.max}
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
            placeholder='コメントを入力'
            value={comment}
            fullWidth
            rows={4}
            multiline
            onChange={onCommentChange}
          />
        </Box>
        <FormItemState validation={commentValidation} />

        <Box sx={{ display: 'flex', mt: 3 }}>
          <DefaultButton
            disabled={!checkChange() || !checkValidation()}
            sx={{ width: '30%', minWidth: '150px', fontSize: '1.0em', fontWeight: 'bold' }}
            onClick={handleEditReviewClick}
          >
            レビューを{dataReview.exists ? '更新' : '投稿'}
          </DefaultButton>

          {dataReview.exists && (
            <DefaultButton
              sx={{
                width: '30%',
                minWidth: '150px',
                fontSize: '1.0em',
                fontWeight: 'bold',
                ml: 1,
              }}
              onClick={handleDeleteReviewClick}
            >
              レビューを削除
            </DefaultButton>
          )}
        </Box>
      </Box>
      <Snackbar
        open={notice.open}
        message={notice.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

EditReview.getLayout = (page) => <Layout>{page}</Layout>;
export default EditReview;

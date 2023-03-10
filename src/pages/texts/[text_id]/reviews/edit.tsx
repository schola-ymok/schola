import { Box, InputBase, Rating, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import { deleteReview } from 'api/deleteReview';
import { getBriefText } from 'api/getBriefText';
import { getMyReview } from 'api/getMyReview';
import { upsertReview } from 'api/upsertReview';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import ConfirmDialog from 'components/ConfirmDialog';
import DefaultButton from 'components/DefaultButton';
import FormItemLabel from 'components/FormItemLabel';
import FormItemState from 'components/FormItemState';
import FormItemSubLabel from 'components/FormItemSubLabel';
import LoadingBackDrop from 'components/LoadingBackDrop';
import MiniText from 'components/MiniText';
import Title from 'components/Title';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';
import usePageLeaveConfirm from 'utils/usePageLeaveConfirm';
import { validate } from 'utils/validate';

import type { NextPage } from 'next';

const EditReview: NextPage = () => {
  const router = useRouter();

  const textId = router.query.text_id;
  const { authAxios } = useContext(AuthContext);

  const [rate, setRate] = useState();
  const [oldRate, setOldRate] = useState();
  const [rateChanged, setRateChanged] = useState(false);

  const [title, setTitle] = useState('');
  const [oldTitle, setOldTitle] = useState();
  const [titleChanged, setTitleChanged] = useState(false);
  const [titleValidation, setTitleValidation] = useState();

  const [comment, setComment] = useState('');
  const [oldComment, setOldComment] = useState();
  const [commentChanged, setCommentChanged] = useState(false);
  const [commentValidation, setCommentValidation] = useState();

  const [swrKey] = useState(genid(4));

  const [setComplete, setSetComplete] = useState(false);

  const [isSaving, setSaving] = useState(false);

  const [notice, setNotice] = useState({ open: false, message: '' });

  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);

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
      message: '???????????????' + (dataReview.exists ? '??????' : '??????') + '????????????',
    });

    setTimeout(() => {
      router.push(`/texts/${textId}/reviews`);
    }, 1000);
  }

  async function handleDeleteReview() {
    setSaving(true);
    const { data, error } = await deleteReview(textId, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    setNotice({
      open: true,
      message: '?????????????????????????????????',
    });

    setTimeout(() => {
      router.push(`/texts/${textId}/reviews`);
    }, 1000);
  }

  useEffect(() => {
    if (dataReview) {
      let _rate = 3;
      let _title = '',
        _comment = '';
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

  usePageLeaveConfirm([titleChanged, rateChanged, commentChanged, isSaving], () => {
    return checkChange() && !isSaving;
  });

  if (errorText) console.log(errorText);
  if (errorReview) console.log(errorReview);
  if (!dataText || !dataReview || !setComplete) return <CenterLoadingSpinner />;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Title title={`Schola | ?????????????????????`} />
      {isSaving && <LoadingBackDrop />}

      <ConfirmDialog
        open={deleteConfirmDialogOpen}
        title={'?????????????????????'}
        message={'????????????????????????????????????'}
        onClose={() => {
          setDeleteConfirmDialogOpen(false);
        }}
        onOk={() => {
          setDeleteConfirmDialogOpen(false);
          handleDeleteReview();
        }}
      />

      <Box sx={{ width: { xs: '100%', sm: '600px' }, display: 'flex', flexFlow: 'column' }}>
        <Box sx={{ fontSize: '1.2em', fontWeight: 'bold' }}>?????????????????????????????????</Box>
        <MiniText text={dataText} />

        <FormItemLabel sx={{ mt: 2 }}>??????</FormItemLabel>
        <Rating
          name='simple-controlled'
          value={rate}
          onChange={(event, newValue) => {
            onRateChange(newValue);
          }}
        />

        <FormItemLabel sx={{ mt: 2 }}>????????????????????????</FormItemLabel>
        <FormItemSubLabel>
          ???????????????????????????{Consts.VALIDATE.reviewTitle.min}???{Consts.VALIDATE.reviewTitle.max}
          ???????????????
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
            placeholder='????????????'
            value={title}
            variant='outlined'
            fullWidth
            onChange={onTitleChange}
          />
        </Box>
        <FormItemState validation={titleValidation} />

        <FormItemLabel sx={{ mt: 2 }}>????????????????????????</FormItemLabel>
        <FormItemSubLabel>
          ???????????????????????????{Consts.VALIDATE.reviewComment.min}???{Consts.VALIDATE.reviewComment.max}
          ???????????????
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
            placeholder='?????????????????????'
            value={comment}
            fullWidth
            rows={4}
            multiline
            onChange={onCommentChange}
          />
        </Box>
        <FormItemState validation={commentValidation} />

        <Box sx={{ display: 'flex', mt: 3 }}>
          {dataReview.exists && (
            <DefaultButton
              sx={{
                width: '30%',
                minWidth: '150px',
                fontSize: '1.0em',
                fontWeight: 'bold',
              }}
              onClick={() => {
                setDeleteConfirmDialogOpen(true);
              }}
            >
              ?????????????????????
            </DefaultButton>
          )}

          <DefaultButton
            disabled={!checkChange() || !checkValidation()}
            sx={{ ml: 1, width: '30%', minWidth: '150px', fontSize: '1.0em', fontWeight: 'bold' }}
            onClick={handleEditReviewClick}
          >
            ???????????????{dataReview.exists ? '??????' : '??????'}
          </DefaultButton>
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

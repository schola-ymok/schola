import { Box, Button, InputBase, Rating } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useLayoutEffect, useState } from 'react';
import useSWR from 'swr';

import { deleteReview } from 'api/deleteReview';
import { getBriefText } from 'api/getBriefText';
import { getMyReview } from 'api/getMyReview';
import { upsertReview } from 'api/upsertReview';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import DefaultButton from 'components/DefaultButton';
import MiniText from 'components/MiniText';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import Consts from 'utils/Consts';

import type { NextPage } from 'next';

const EditReview: NextPage = () => {
  const router = useRouter();

  const textId = router.query.text_id;
  const { authAxios } = useContext(AuthContext);

  const [rate, setRate] = useState(3);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const { data: dataText, error: errorText } = useSWR(
    `texts/${textId}?brf=1`,
    () => getBriefText(textId),
    {
      revalidateOnFocus: false,
    },
  );
  const { data: dataReview, error: errorReview } = useSWR(
    `texts/${textId}/reviews?mine`,
    () => getMyReview(textId, authAxios),
    {
      revalidateOnFocus: false,
    },
  );

  async function handleEditReviewClick() {
    const { data, error } = await upsertReview(textId, title, rate, comment, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    router.push(`/texts/${textId}/reviews`);
  }

  async function handleDeleteReviewClick() {
    const { data, error } = await deleteReview(textId, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    router.replace(`/texts/${textId}/reviews`);
  }

  useLayoutEffect(() => {
    if (dataReview && dataReview.exists == true) {
      setTitle(dataReview.review.title);
      setComment(dataReview.review.comment);
      setRate(dataReview.review.rate);
    }
  }, [dataReview]);

  if (errorText) console.log(errorText);
  if (errorReview) console.log(errorReview);
  if (!dataText || !dataReview) return <CenterLoadingSpinner />;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ width: { xs: '100%', sm: '600px' }, display: 'flex', flexFlow: 'column' }}>
        <Box sx={{ fontSize: '1.2em', fontWeight: 'bold' }}>このテキストをレビュー</Box>
        <MiniText text={dataText} />
        <Box sx={{ fontWeight: 'bold', mt: 1 }}>評価</Box>
        <Rating
          name='simple-controlled'
          value={rate}
          onChange={(event, newValue) => {
            setRate(newValue);
          }}
        />
        <Box sx={{ fontWeight: 'bold', mt: 1 }}>レビュータイトル</Box>

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
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </Box>

        <Box sx={{ fontWeight: 'bold', mt: 1 }}>レビューコメント</Box>
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
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', mt: 3 }}>
          <DefaultButton
            exSx={{ width: '30%', minWidth: '200px', fontSize: '1.0em', fontWeight: 'bold' }}
            onClick={handleEditReviewClick}
          >
            レビューを{dataReview.exists ? '更新' : '投稿'}する
          </DefaultButton>

          {dataReview.exists && (
            <DefaultButton
              exSx={{
                width: '30%',
                minWidth: '200px',
                fontSize: '1.0em',
                fontWeight: 'bold',
                ml: 2,
              }}
              onClick={handleDeleteReviewClick}
            >
              レビューを削除する
            </DefaultButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

EditReview.getLayout = (page) => <Layout>{page}</Layout>;
export default EditReview;

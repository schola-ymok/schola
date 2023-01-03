import { text } from 'stream/consumers';

import StarIcon from '@mui/icons-material/Star';
import {
  Card,
  Box,
  Pagination,
  Checkbox,
  Grid,
  Snackbar,
  CardContent,
  Typography,
  Stack,
  Skeleton,
  Rating,
} from '@mui/material';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import error from 'next/error';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import useSWR from 'swr';

import { getBriefUser } from 'api/getBriefUser';
import { getMyAccount } from 'api/getMyAccount';
import { getUser } from 'api/getUser';
import { getUserTexts } from 'api/getUserTexts';
import { setNotifyOnPurchase } from 'api/setNotifyOnPurchase';
import { setNotifyOnReview } from 'api/setNotifyOnReview';
import { updateProfile } from 'api/updateProfile';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import texts from 'pages/api/texts';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';
import { pagenation } from 'utils/pagenation';

const TextCard = ({ text }) => {
  const imageUrl = text.photo_id
    ? Consts.IMAGE_STORE_URL + text.photo_id + '.png'
    : '/cover-default.svg';

  return (
    <Box sx={{ p: 1 }}>
      <Link href={`/texts/${text.id}`}>
        <a className='no-hover'>
          <Box sx={{ backgroundColor: '#ffffff', width: { xs: 150, sm: 200 } }}>
            <Box
              component='img'
              sx={{
                display: 'block',
                mb: 1,
                width: { xs: 150, sm: 200 },
                height: { xs: 84, sm: 112 },
              }}
              src={imageUrl}
            />

            <Box sx={{ fontWeight: 'bold', fontSize: '1.0em' }}>
              {text.title?.substring(0, 23)}
              {text.title?.length > 23 && <>...</>}
            </Box>
            <Box sx={{ fontSize: '0.8em' }}>{text.author_display_name}</Box>
            <Box sx={{ fontSize: '0.8em', color: '#555555', display: 'flex' }}>
              <Rating
                name='size-small'
                defaultValue={text.rate}
                size='small'
                readOnly
                precision={0.5}
                sx={{ mr: 1 }}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
              />
              {text.number_of_reviews}
            </Box>
            <Box sx={{ fontWeight: 'bold', fontSize: '0.8em' }}>￥{text.price}</Box>
          </Box>
        </a>
      </Link>
    </Box>
  );
};

export default TextCard;

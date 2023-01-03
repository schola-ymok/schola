import {
  Card,
  Box,
  Pagination,
  Checkbox,
  Grid,
  Snackbar,
  CardContent,
  Link,
  Divider,
  Rating,
  styled,
} from '@mui/material';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import error from 'next/error';
import router, { useRouter } from 'next/router';
import { useState, useContext, useEffect } from 'react';
import * as React from 'react';
import useSWR from 'swr';

import { getBriefUser } from 'api/getBriefUser';
import { getMyAccount } from 'api/getMyAccount';
import { getPerformance } from 'api/getPerformance';
import { getReviewListForMyText } from 'api/getReviewListForMyText';
import { getUser } from 'api/getUser';
import { getUserTexts } from 'api/getUserTexts';
import { setNotifyOnPurchase } from 'api/setNotifyOnPurchase';
import { setNotifyOnReview } from 'api/setNotifyOnReview';
import { updateProfile } from 'api/updateProfile';
import TextCard from 'components/TextCard';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import DashboardMenu from 'components/sidemenu/DashboardMenuLeft';
import DashboardMenuLeft from 'components/sidemenu/DashboardMenuLeft';
import texts from 'pages/api/texts';
import UserTexts from 'pages/users/[user_id]/texts';
import { AppContext } from 'states/store';
import { pagenation } from 'utils/pagenation';

const DashboardPerformance = () => {
  const router = useRouter();

  const { authAxios } = useContext(AuthContext);

  const { data, error } = useSWR(`/dashboard/performance`, () => getPerformance(authAxios), {
    revalidateOnFocus: false,
  });

  if (error) return <h1>error</h1>;
  if (!data) return <h1>loading..</h1>;

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#888888',
      color: theme.palette.common.white,
      fontWeight: 'bold',
    },
  }));

  return (
    <Box sx={{ display: 'flex' }}>
      <DashboardMenuLeft />

      <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%', maxWidth: '700px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Box sx={{ display: 'flex', flexFlow: 'column' }}>
            <Box>
              <Box sx={{ fontSize: '2.0em', fontWeight: 'bold' }}>{data.number_of_total_texts}</Box>
              <Box sx={{ mx: 'auto', width: 'fit-content' }}>テキスト数</Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexFlow: 'column' }}>
            <Box>
              <Box sx={{ fontSize: '2.0em', fontWeight: 'bold' }}>
                {data.number_of_total_reviews}
              </Box>
              <Box sx={{ mx: 'auto', width: 'fit-content' }}>レビュー数</Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexFlow: 'column' }}>
            <Box>
              <Box sx={{ fontSize: '2.0em', fontWeight: 'bold' }}>{data.number_of_total_sales}</Box>
              <Box sx={{ mx: 'auto', width: 'fit-content' }}>販売数</Box>
            </Box>
          </Box>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>タイトル</StyledTableCell>
                <StyledTableCell align='right'>レビュー数</StyledTableCell>
                <StyledTableCell align='right'>購入数</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.texts.map((item) => (
                <StyledTableRow
                  key={item.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    <Link
                      href={`/texts/${item.id}`}
                      sx={{ fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      {item.title}
                    </Link>
                  </TableCell>
                  <TableCell align='right'>{item.number_of_reviews}</TableCell>
                  <TableCell align='right'>{item.number_of_sales}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

DashboardPerformance.getLayout = (page) => <Layout>{page}</Layout>;
export default DashboardPerformance;

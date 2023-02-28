import { Box, Link, styled } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import useSWR from 'swr';

import { getPerformance } from 'api/getPerformance';
import { AuthContext } from 'components/auth/AuthContext';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';

const DashboardPerformance = () => {
  const router = useRouter();

  const { authAxios } = useContext(AuthContext);

  const { data, error } = useSWR(`/dashboard/performance`, () => getPerformance(authAxios), {
    revalidateOnFocus: false,
  });

  if (error) return <h1>error</h1>;

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
      whiteSpace: 'nowrap',
      backgroundColor: '#888888',
      color: theme.palette.common.white,
      fontWeight: 'bold',
    },
  }));

  const DataContent = ({ data }) => {
    if (!data) return <CenterLoadingSpinner />;
    if (
      data.number_of_total_reviews == 0 &&
      data.number_of_total_sales == 0 &&
      data.number_of_total_texts == 0
    ) {
      return <Box>表示する情報はありません</Box>;
    }

    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Box sx={{ display: 'flex', flexFlow: 'column' }}>
            <Box>
              <Box
                sx={{
                  mx: 'auto',
                  fontSize: { xs: '1.5em', sm: '2.0em' },
                  fontWeight: 'bold',
                  width: 'fit-content',
                }}
              >
                {data.number_of_total_texts}
              </Box>
              <Box sx={{ mx: 'auto', width: 'fit-content' }}>公開テキスト数</Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexFlow: 'column' }}>
            <Box>
              <Box
                sx={{
                  mx: 'auto',
                  fontSize: { xs: '1.5em', sm: '2.0em' },
                  fontWeight: 'bold',
                  width: 'fit-content',
                }}
              >
                {data.number_of_total_reviews}
              </Box>
              <Box sx={{ mx: 'auto', width: 'fit-content' }}>レビュー数</Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexFlow: 'column' }}>
            <Box>
              <Box
                sx={{
                  mx: 'auto',
                  fontSize: { xs: '1.5em', sm: '2.0em' },
                  fontWeight: 'bold',
                  width: 'fit-content',
                }}
              >
                {data.number_of_total_sales}
              </Box>
              <Box sx={{ mx: 'auto', width: 'fit-content' }}>販売数</Box>
            </Box>
          </Box>
        </Box>

        <TableContainer sx={{ mt: 2, width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>タイトル</StyledTableCell>
                <StyledTableCell align='right'>レビュー数</StyledTableCell>
                <StyledTableCell align='right'>販売数</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.texts.map((item) => {
                return (
                  <StyledTableRow
                    key={item.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      wordBreak: 'break-all',
                    }}
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
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%' }}>
      <DataContent data={data} />
    </Box>
  );
};

export default DashboardPerformance;

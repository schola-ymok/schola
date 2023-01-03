import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import router, { useRouter } from 'next/router';

const DashboardMenuLeft = () => {
  const router = useRouter();

  const pathArray = router.asPath.split('/');
  const path = pathArray[2] == undefined ? 'texts' : pathArray[2];

  return (
    <Box sx={{ whiteSpace: 'nowrap', display: { sm: 'block', xs: 'none' }, mr: 2 }}>
      <Box sx={{ width: 130, pr: 1, pt: 2, borderRight: '1px solid #aaaaaa' }}>
        <Box sx={{ fontSize: '0.8em', mb: 1 }}>
          {path == 'texts' ? (
            <Box sx={{ fontWeight: 'bold' }}>テキスト</Box>
          ) : (
            <Link href={'/dashboard'}>
              <a>テキスト</a>
            </Link>
          )}
        </Box>
        <Box sx={{ fontSize: '0.8em', mb: 1 }}>
          {path == 'reviews' ? (
            <Box sx={{ fontWeight: 'bold' }}>レビュー</Box>
          ) : (
            <Link href={'/dashboard/reviews'}>
              <a>レビュー</a>
            </Link>
          )}
        </Box>
        <Box sx={{ fontSize: '0.8em', mb: 1 }}>
          {path == 'performance' ? (
            <Box sx={{ fontWeight: 'bold' }}>パフォーマンス</Box>
          ) : (
            <Link href={'/dashboard/performance'}>
              <a>パフォーマンス</a>
            </Link>
          )}
        </Box>
        <Box sx={{ fontSize: '0.8em', mb: 1 }}>
          {path == 'revenue' ? (
            <Box sx={{ fontWeight: 'bold' }}>収益管理</Box>
          ) : (
            <Link href={'/dashboard/revenue'}>
              <a>収益管理</a>
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardMenuLeft;

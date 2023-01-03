import { Box, Divider, Grid } from '@mui/material';
import Link from 'next/link';

const Footer = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ flexGrow: 1, maxWidth: 1000, p: { xs: 1, sm: 2 } }}>
        <Divider sx={{ mb: 2, mt: 4 }} />
        <Grid container>
          <Grid
            item
            xs={12}
            sm={3}
            sx={{ pl: { xs: 0, sm: 2 }, pt: 3 }}
            textAlign={{ xs: 'center', sm: 'left' }}
          >
            <img src='/logo-s.svg' width='95px' />
            <Box sx={{ typography: 'subtitle2', color: '#aaaaaa', mt: 1 }}>
              知のプラットフォーム
            </Box>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ pt: 3 }}>
            <h6>About</h6>
            <ul className='footer'>
              <li className='footer'>
                <Link href=''>
                  <a>Scholaについて</a>
                </Link>
              </li>
              <li className='footer'>
                <Link href=''>
                  <a>運営会社</a>
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ pt: 3 }}>
            <h6>Legal</h6>
            <ul className='footer'>
              <li className='footer'>
                <Link href=''>
                  <a>利用規約</a>
                </Link>
              </li>
              <li className='footer'>
                <Link href=''>
                  <a>プライバシーポリシー</a>
                </Link>
              </li>
              <li className='footer'>
                <Link href=''>
                  <a>特定法表記</a>
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ pt: 3 }}>
            <h6>Something</h6>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Footer;

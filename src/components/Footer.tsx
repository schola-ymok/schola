import { Box, Divider, Grid } from '@mui/material';
import Link from 'next/link';

const Footer = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pb: 5 }}>
      <Box sx={{ flexGrow: 1, maxWidth: 1000, p: { xs: 1, sm: 2 } }}>
        <Divider sx={{ mb: 2, mt: 4 }} />
        <Grid container sx={{ mx: 'auto' }}>
          <Grid item xs={12} sm={3}>
            <ul className='footer'>
              <li className='footer'>
                <Link href='/info/about'>
                  <a>Scholaについて</a>
                </Link>
              </li>
              <li className='footer'>
                <Link href='/info/md/company'>
                  <a>運営者</a>
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={3}>
            <ul className='footer'>
              <li className='footer'>
                <Link href='/info/md/sfm'>
                  <a>Schola記法</a>
                </Link>
              </li>
              <li className='footer'>
                <Link href='/info/md/guide'>
                  <a>ガイドライン</a>
                </Link>
              </li>
              <li className='footer'>
                <Link href='/info/md/faq'>
                  <a>よくある質問</a>
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={3}>
            <ul className='footer'>
              <li className='footer'>
                <Link href='/info/md/termofuse'>
                  <a>利用規約</a>
                </Link>
              </li>
              <li className='footer'>
                <Link href='/info/md/privacy'>
                  <a>プライバシーポリシー</a>
                </Link>
              </li>
              <li className='footer'>
                <Link href='/info/md/notation'>
                  <a>特定法表記</a>
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={3}>
            <ul className='footer'>
              <li className='footer'>
                <Link href='/info/md/termofuse'>
                  <a>Twitter</a>
                </Link>
              </li>
              <li className='footer'>
                <Link href='/info/md/recruit'>
                  <a>募集</a>
                </Link>
              </li>
            </ul>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Footer;

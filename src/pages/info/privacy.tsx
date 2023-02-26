import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Slider,
  Snackbar,
  Tab,
  Tabs,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';

import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import StaticPageLayout from 'components/layouts/StaticPageLayout';
import ScholaMarkdownViewer from 'components/markdown/ScholaMarkdownViewer';

const Privacy = () => {
  const [markdown, setMarkdown] = useState();

  useEffect(() => {
    (async () => {
      const resp = await fetch('/privacy.md');
      const data = await resp.text();
      setMarkdown(data);
    })();
  }, []);

  if (!markdown) return <CenterLoadingSpinner />;

  return (
    <Container maxWidth='md' sx={{ mt: 10, mb: 5 }}>
      <ScholaMarkdownViewer>{markdown}</ScholaMarkdownViewer>
    </Container>
  );
};

Privacy.getLayout = (page) => <StaticPageLayout>{page}</StaticPageLayout>;
export default Privacy;

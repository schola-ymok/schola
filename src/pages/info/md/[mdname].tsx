import { Container } from '@mui/material';
import { useRouter } from 'next/router';

import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import StaticPageLayout from 'components/layouts/StaticPageLayout';
import ScholaMarkdownViewer from 'components/markdown/ScholaMarkdownViewer';
import { useStaticMarkdownPage } from 'utils/useStaticMarkdownPage';

const SMP = () => {
  const router = useRouter();
  const mdname = router.query.mdname;

  const markdown = useStaticMarkdownPage('/' + mdname + '.md');

  if (!markdown) return <CenterLoadingSpinner />;

  return (
    <Container maxWidth='md' sx={{ my: 5 }}>
      <ScholaMarkdownViewer>{markdown}</ScholaMarkdownViewer>
    </Container>
  );
};

SMP.getLayout = (page) => <StaticPageLayout>{page}</StaticPageLayout>;
export default SMP;

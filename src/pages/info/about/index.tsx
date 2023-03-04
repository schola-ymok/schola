import { Box, Container } from '@mui/material';

import Title from 'components/Title';
import StaticPageLayout from 'components/layouts/StaticPageLayout';

const About = () => (
  <Container maxWidth='sm' sx={{ mt: 10 }}>
    <Title title={'Schola | 学びの促進で社会の進歩を加速'} />
    <h1>Scholaについて</h1>
    <Box sx={{ fontSize: '1.1em', mt: 5 }}>
      「紙」と「活版印刷」が「書物」を生み出したように、「コンピュータ」と「インターネット」は新しい知識の流通単位を生み出します。それは単なる書籍の電子化やクラウド化ではなく、書籍とは異なるコンセプトのものになるでしょう。
    </Box>

    <Box sx={{ fontSize: '1.1em', mt: 5 }}>
      Scholaは現代の学びに適した新しい学習テキストのマーケットプレイスです。個々人が持っている様々な経験や知識をテキスト化し販売できる場を通じて、社会に埋もれている知見を形式化します。
    </Box>

    <Box sx={{ fontSize: '1.1em', my: 5 }}>
      進学や就職、転職、退職など、人生におとずれた転機で新たな領域へ一歩踏み出そうとしている人の学びを支えるためにScholaは存在します。また、Scholaでの学びは個々人がこのような転機を自ら創り出すことを促し、社会全体の進歩を加速させていきます。
    </Box>
  </Container>
);

About.getLayout = (page) => <StaticPageLayout>{page}</StaticPageLayout>;
export default About;

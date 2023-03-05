import { title } from 'process';

import Head from 'next/head';

const Title = ({
  title = 'Schola | 総合型テキストのマーケットプレイス',
  description = 'Schola は様々な専門知識や経験を記したテキストが集まる専門知識のマーケットプレイスです。',
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={`${description}`} />
    </Head>
  );
};

export default Title;

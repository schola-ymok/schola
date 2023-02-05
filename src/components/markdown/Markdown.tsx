import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import 'katex/dist/katex.min.css';
import 'github-markdown-css/github-markdown.css';
import CodeBlock from 'components/markdown/CodeBlock';

import ImageBlock from './ImageBlock';

const Markdown = ({ children }) => {
  return (
    <ReactMarkdown
      className='markdown-body p-3'
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeSlug]}
      components={{ code: CodeBlock, img: ImageBlock }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;

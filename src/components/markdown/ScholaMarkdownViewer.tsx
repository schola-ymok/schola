import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { remark } from 'remark';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import 'katex/dist/katex.min.css';
import 'github-markdown-css/github-markdown.css';
import remarkToc from 'remark-toc';
import { visit } from 'unist-util-visit';

import CodeBlock from 'components/markdown/CodeBlock';
import { extractToc } from 'utils/extractToc';

import ImageBlock from './ImageBlock';

import Link from 'next/link';

const Toc = ({ props }) => {
  const toc = extractToc();
  return <span>Hello</span>;
};

const ScholaMarkdownViewer = ({ children }) => {
  const toc = extractToc(children);

  const TocBlock = ({ props }) => {
    return (
      <ul>
        {toc.map((item) => {
          return (
            <li>
              <Link href={'#' + item.id}>
                <a>{item.text}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <ReactMarkdown
      className='markdown-body p-3'
      remarkPlugins={[remarkGfm, remarkMath, remarkDirective, remarkDirectiveRehype]}
      rehypePlugins={[rehypeKatex, rehypeSlug]}
      components={{ code: CodeBlock, img: ImageBlock, toc: TocBlock }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default ScholaMarkdownViewer;

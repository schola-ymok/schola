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

import CodeBlock from 'components/markdown/CodeBlock';
import { extractToc } from 'utils/extractToc';

import ImageBlock from './ImageBlock';

import Link from 'next/link';

import { parse } from 'path';

const querystring = require('querystring');

const ScholaMarkdownViewer = ({ children }) => {
  const toc = extractToc(children);

  const TocBlock = ({ id, children }) => {
    let depth = 0;

    if (children?.length == 1) {
      const parse = querystring.parse(children[0]);
      if (!Number.isNaN(parseInt(parse.depth))) {
        depth = parseInt(parse.depth);
        if (depth < 1) depth = 1;
        if (depth > 3) depth = 3;
      }
    }

    const ListItem = ({ item }) => {
      if (depth != 0 && item.depth > depth) return <></>;

      const Lv1 = ({ item }) => (
        <li>
          <Link href={'#' + item.id}>
            <a>{item.text}</a>
          </Link>
        </li>
      );

      const Lv2 = ({ item }) => (
        <ul>
          <Lv1 item={item} />
        </ul>
      );

      const Lv3 = ({ item }) => (
        <ul>
          <Lv2 item={item} />
        </ul>
      );

      if (item.depth == 1 || depth == 0) {
        return <Lv1 item={item} />;
      } else if (item.depth == 2) {
        return <Lv2 item={item} />;
      } else if (item.depth == 3) {
        return <Lv3 item={item} />;
      }
    };

    return (
      <ul>
        {toc.map((item) => {
          return <ListItem item={item} />;
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

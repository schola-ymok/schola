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

import TocLine from 'components/TocLine';
import CodeBlock from 'components/markdown/CodeBlock';
import { extractToc } from 'utils/extractToc';

import ImageBlock from './ImageBlock';
import LinkBlock from './LinkBlock';
import AnnotationBlock from './NoteBlock';
import NoteBlock from './NoteBlock';
import TocLineBlock from './TocLineBlock';
import WarningBlock from './WarningBlock';

const querystring = require('querystring');

const ScholaMarkdownViewer = ({ children }) => {
  const toc = extractToc(children);

  const TocBlock = ({ id, children }) => {
    let depth = 2;

    if (children?.length == 1) {
      const parse = querystring.parse(children[0]);
      if (!Number.isNaN(parseInt(parse.depth))) {
        depth = parseInt(parse.depth);
        if (depth < 1) depth = 1;
        if (depth > 3) depth = 3;
      }
    }

    return <TocLineBlock depth={depth} chapters={toc} />;
  };

  return (
    <ReactMarkdown
      className='markdown-body p-3'
      remarkPlugins={[remarkGfm, remarkMath, remarkDirective, remarkDirectiveRehype]}
      rehypePlugins={[rehypeKatex, rehypeSlug]}
      components={{
        code: CodeBlock,
        img: ImageBlock,
        toc: TocBlock,
        note: NoteBlock,
        warning: WarningBlock,
        a: LinkBlock,
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default ScholaMarkdownViewer;

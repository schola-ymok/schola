import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import 'katex/dist/katex.min.css';
import 'github-markdown-css/github-markdown.css';

import CodeBlock from 'components/markdown/CodeBlock';
import { extractToc } from 'utils/extractToc';

import CodeSandboxBlock from './CodeSandboxBlock';
import FigmaBlock from './FigmaBlock';
import GoogleMapBlock from './GoogleMapBlock';
import ImageBlock from './ImageBlock';
import LinkBlock from './LinkBlock';
import NeortBlock from './NeortBlock';
import NoteBlock from './NoteBlock';
import SlideShareBlock from './SlideShareBlock';
import SpeakerDeckBlock from './SpeakerDeckBlock';
import TocLineBlock from './TocLineBlock';
import WarningBlock from './WarningBlock';

const ScholaMarkdownViewer = ({ children }) => {
  const toc = extractToc(children);

  const TocBlock = ({ children }) => {
    return <TocLineBlock chapters={toc} children={children} />;
  };

  return (
    <ReactMarkdown
      className='markdown-body'
      remarkPlugins={[remarkGfm, remarkMath, remarkDirective, remarkDirectiveRehype]}
      rehypePlugins={[rehypeKatex, rehypeSlug]}
      components={{
        code: CodeBlock,
        img: ImageBlock,
        toc: TocBlock,
        note: NoteBlock,
        gmap: GoogleMapBlock,
        warning: WarningBlock,
        neort: NeortBlock,
        slideshare: SlideShareBlock,
        speakerdeck: SpeakerDeckBlock,
        codesandbox: CodeSandboxBlock,
        figma: FigmaBlock,
        a: LinkBlock,
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default ScholaMarkdownViewer;

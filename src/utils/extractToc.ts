import { slug } from 'github-slugger';
import { Node, toString } from 'hast-util-to-string';
import { title } from 'process';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';

export const extractToc = (body) => {
  var result = [];

  if (body === null) return result;
  const ast = remark().parse(body);

  visit(ast, 'heading', (child) => {
    const title = toString(child as unknown as Node);
    const id = slug(title);
    const depth = child.depth;
    result.push({
      title,
      id,
      depth,
    });
  });

  return result;
};

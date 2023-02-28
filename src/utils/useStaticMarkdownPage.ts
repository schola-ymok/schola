import { useEffect, useState } from 'react';

export function useStaticMarkdownPage(filepath) {
  const [markdown, setMarkdown] = useState(null);
  const ERROR_MD = '# ページが見つかりません';

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(filepath);
        if (resp.ok) {
          const data = await resp.text();
          setMarkdown(data);
        } else {
          setMarkdown(ERROR_MD);
        }
      } catch (err) {
        setMarkdown(ERROR_MD);
      }
    })();
    return () => {
      setMarkdown(null);
    };
  }, [filepath]);

  return markdown;
}

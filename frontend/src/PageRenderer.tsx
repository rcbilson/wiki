import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { marked } from 'marked';

function PageRenderer() {
  const { page } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/contents/${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const markdown = await response.text();
        const html = await marked(markdown);
        setContent(html);
      } catch (error) {
        console.error(error);
        setContent('<p>Error loading content</p>');
      }
    };

    fetchContent();
  }, [page]);

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

export default PageRenderer;
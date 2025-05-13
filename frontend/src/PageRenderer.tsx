import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { marked } from 'marked';

function PageRenderer() {
  const { page } = useParams();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [rawMarkdown, setRawMarkdown] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/contents/${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const markdown = await response.text();
        setRawMarkdown(markdown);
        const html = await marked(markdown);
        setContent(html);
      } catch (error) {
        console.error(error);
        setContent('<p>Error loading content</p>');
      }
    };

    fetchContent();
  }, [page]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/contents/${page}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: rawMarkdown,
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      const html = await marked(rawMarkdown);
      setContent(html);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert('Error saving content. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexFlow: 'column', width: '100vw', height: '100vh', margin: 0, padding: '1em', boxSizing: 'border-box' }}>
      <div style={{ justifyContent: 'flex-end', display: 'flex' }}>
        {isEditing && (
          <button onClick={handleSave}>
            Save
          </button>
        )}
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'View' : 'Edit'}
        </button>
      </div>
      {isEditing ? (
        <textarea
          value={rawMarkdown}
          onChange={(e) => setRawMarkdown(e.target.value)}
          style={{ width: 'auto', flex: 1}}
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
}

export default PageRenderer;
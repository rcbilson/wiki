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
    <div>
      <button style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'View' : 'Edit'}
      </button>
      {isEditing ? (
        <textarea
          value={rawMarkdown}
          onChange={(e) => setRawMarkdown(e.target.value)}
          style={{ width: '100%', height: '90vh' }}
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
      {isEditing && (
        <button onClick={handleSave} style={{ marginTop: '10px' }}>
          Save
        </button>
      )}
    </div>
  );
}

export default PageRenderer;
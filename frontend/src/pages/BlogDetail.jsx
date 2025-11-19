import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const BlogDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, token } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPost = async () => {
    try {
      const { data } = await api.get(`/blog/${id}`);
      setPost(data);
      setComments(data.comments || []);
    } catch (err) {
      setError('Unable to load blog post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const submitComment = async (event) => {
    event.preventDefault();
    if (!commentBody.trim()) return;
    setAuthToken(token);
    try {
      const { data } = await api.post(`/blog/${id}/comments`, { body: commentBody });
      setComments((prev) => [data, ...prev]);
      setCommentBody('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post comment');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <article className="section">
      <h1>{post.title}</h1>
      <p>By {post.author?.username}</p>
      <p>{post.content}</p>

      <section>
        <h2>Comments</h2>
        {isAuthenticated ? (
          <form onSubmit={submitComment}>
            <textarea value={commentBody} onChange={(e) => setCommentBody(e.target.value)} required />
            <button type="submit">Add Comment</button>
          </form>
        ) : (
          <p>Please login to comment.</p>
        )}
        <ul>
          {comments.map((comment) => (
            <li key={comment._id} style={{ margin: '0.5rem 0' }}>
              <strong>{comment.author?.username}:</strong> {comment.body}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default BlogDetail;

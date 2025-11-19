import { useEffect, useState } from 'react';
import api from '../services/api';
import BlogPostCard from '../components/BlogPostCard';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/blog');
        setPosts(data);
      } catch (err) {
        setError('Unable to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Blog</h1>
      {posts.map((post) => (
        <BlogPostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Blog;

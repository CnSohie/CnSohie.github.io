import { Link } from 'react-router-dom';

const BlogPostCard = ({ post }) => (
  <article className="section">
    <h3>{post.title}</h3>
    <p>By {post.author?.username || 'Unknown'}</p>
    <p>{post.content.slice(0, 160)}...</p>
    <Link to={`/blog/${post._id}`}>Read more</Link>
  </article>
);

export default BlogPostCard;

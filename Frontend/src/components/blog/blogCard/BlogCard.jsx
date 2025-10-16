import './BlogCard.css';
import { Calendar, Clock, User } from 'lucide-react';

export default function BlogCard({ post }) {
  return (
    <div className="blog-card">
      <img src={post.imageUrl} alt={post.title} />

      <div className="card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
          <span className="badge">{post.category}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Clock size={12} /> {post.readTime} min read
          </div>
        </div>
        <h3>{post.title}</h3>
      </div>

      <div className="card-content">
        <p>{post.excerpt}</p>
        <div className="card-badges">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="badge badge-outline">{tag}</span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <div className="info">
          <User size={14} /> {post.author}
        </div>
        <div className="info">
          <Calendar size={14} /> {new Date(post.publishDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

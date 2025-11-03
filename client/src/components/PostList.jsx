// client/src/components/PostList.jsx -- list with pagination, serach, optimistic UI for deleting
import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../contexts/DataContext.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useApi } from '../api/useApi';

export default function PostList() {
  const { posts, setPosts, meta, setMeta } = useContext(DataContext);
  const { token } = useContext(AuthContext);
  const { loading, error, request } = useApi();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [limit] = useState(5);

  const fetchPosts = async (page = 1) => {
    const q = `?page=${page}&limit=${limit}` + (search ? `&search=${encodeURIComponent(search)}` : '') + (categoryFilter ? `&category=${categoryFilter}` : '');
    const data = await request(`/posts${q}`);
    setPosts(data.posts);
    setMeta({ page: data.page, pages: data.pages, total: data.total });
  };

  useEffect(() => { fetchPosts(1); }, [search, categoryFilter]);

  const handleDelete = async (id) => {
    // optimistic UI: remove from UI before awaiting server (improves UX)
    const previous = [...posts];
    setPosts(posts.filter(p => p._id !== id));
    try {
      await request(`/posts/${id}`, { method: 'DELETE', token });
    } catch (err) {
      // rollback on error
      setPosts(previous);
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {loading && <div>Loading posts...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {posts.map(post => (
          <li key={post._id} style={{ marginBottom: 8 }}>
            <h3><Link to={`/posts/${post._id}`}>{post.title}</Link></h3>
            <p>By {post.author?.name} — {new Date(post.createdAt).toLocaleString()}</p>
            <div>
              {post.featuredImage && <img src={`${import.meta.env.VITE_API_URL.replace('/api','')}/uploads/${post.featuredImage}`} alt="" style={{ width: 120 }} />}
            </div>
            <div>
              <Link to={`/edit/${post._id}`}>Edit</Link>{' '}
              <button onClick={() => handleDelete(post._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => fetchPosts(Math.max(1, meta.page - 1))} disabled={meta.page <= 1}>Prev</button>
        <span style={{ margin: '0 8px' }}>{meta.page} / {meta.pages}</span>
        <button onClick={() => fetchPosts(Math.min(meta.pages, meta.page + 1))} disabled={meta.page >= meta.pages}>Next</button>
      </div>
    </div>
  );
}

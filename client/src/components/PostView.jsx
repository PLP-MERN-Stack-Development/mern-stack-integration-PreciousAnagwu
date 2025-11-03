// client/src/components/PostView.jsx -- single post view with comments
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../api/useApi.js';
import { AuthContext } from '../contexts/AuthContext';

export default function PostView() {
  const { id } = useParams();
  const { request, loading, error } = useApi();
  const { token, user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  async function fetch() {
    const p = await request(`/posts/${id}`);
    setPost(p);
    const c = await request(`/comments/${id}`);
    setComments(c);
  }

  useEffect(() => { fetch(); }, [id]);

  const submitComment = async () => {
    if (!commentText.trim()) return alert('Comment required');
    try {
      // optimistic update
      const draft = { _id: 'temp-' + Date.now(), text: commentText, author: { name: user?.name || 'You' }, createdAt: new Date() };
      setComments(prev => [draft, ...prev]);
      setCommentText('');
      await request(`/comments/${id}`, { method: 'POST', body: { text: commentText }, token });
      await fetch(); // refresh server comments (simple approach)
    } catch (err) {
      alert(err.message || 'Comment failed');
    }
  };

  if (loading && !post) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{JSON.stringify(error)}</div>;
  if (!post) return <div>No post</div>;

  return (<div>
    <h2>{post.title}</h2>
    <p>By {post.author?.name}</p>
    {post.featuredImage && <img src={`${import.meta.env.VITE_API_URL.replace('/api','')}/uploads/${post.featuredImage}`} alt="" style={{ width: 300 }} />}
    <div dangerouslySetInnerHTML={{ __html: post.content }} />
    <hr />
    <h3>Comments</h3>
    {user ? (
      <div>
        <textarea value={commentText} onChange={e => setCommentText(e.target.value)} />
        <button onClick={submitComment}>Add comment</button>
      </div>
    ) : <div>Login to comment</div>}
    <ul>
      {comments.map(c => (
        <li key={c._id}>
          <strong>{c.author?.name}</strong> — {new Date(c.createdAt).toLocaleString()}
          <p>{c.text}</p>
        </li>
      ))}
    </ul>
  </div>);
}

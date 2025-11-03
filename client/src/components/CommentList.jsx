import { useState, useEffect } from "react";

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
      const data = await res.json();
      setComments(data);
    };
    fetchComments();
  }, [postId]);

  if (!comments.length) return <p>No comments yet.</p>;

  return (
    <div>
      <h3>Comments</h3>
      {comments.map(c => (
        <div key={c._id} style={{ borderTop: "1px solid #ddd", padding: "0.5rem 0" }}>
          <p>{c.text}</p>
          <small>by {c.author?.name}</small>
        </div>
      ))}
    </div>
  );
}

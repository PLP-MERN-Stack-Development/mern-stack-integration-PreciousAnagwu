import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPost = () => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      });
  };

  const fetchComments = () => {
    fetch(`${import.meta.env.VITE_API_URL}/comments/${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const handleComment = () => {
    fetch(`${import.meta.env.VITE_API_URL}/comments/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ text: commentText }),
    })
      .then((res) => res.json())
      .then(() => {
        setCommentText("");
        fetchComments();
      });
  };

  if (loading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>Author: {post.author?.name}</p>
      <p>Category: {post.category?.name}</p>

      <h3>Comments</h3>
      {comments.map((c) => (
        <p key={c._id}><b>{c.author?.name}:</b> {c.text}</p>
      ))}

      <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment" />
      <br />
      <button onClick={handleComment}>Post Comment</button>
    </div>
  );
}

export default PostDetail;

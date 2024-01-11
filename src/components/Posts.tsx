import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [addPostOpen, setAddPostOpen] = useState<boolean>(false);
  const [addCommentOpen, setAddCommentOpen] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>();
  const [newBody, setNewBody] = useState<string>();
  const [comment, setComment] = useState<string>("");
  const [currentPost, setCurrentPost] = useState<number>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);

  React.useEffect(() => {
    handleUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
    fetchUsers();
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const sortedPosts = posts.sort((a, b) => b.id - a.id);

  const currentPosts = sortedPosts.slice(startIndex, endIndex);

  const pageCount = Math.ceil(posts.length / pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      handlePageChange(currentPage + 1);
    }
  };

  const getAuthor = (userId: number): string => {
    const user = users.find((user) => user.id === userId);
    return user ? `${user.email}` : "Nieznany";
  };

  const handleOpenLightbox = async (postId: number) => {
    try {
      const response = await axios.get<Comment[]>(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      );

      setComments(response.data);
    } catch (error) {
      console.error(error);
    }

    setLightboxOpen(true);
  };

  const handleUser = () => {
    if (localStorage.getItem("userId")) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const handleAddPost = async () => {
    setAddPostOpen(true);
  };

  const handleAddComment = async (postId: number) => {
    setCurrentPost(postId);
    setAddCommentOpen(true);
  };

  const handleNewPost = async () => {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        body: body,
        userId: JSON.parse(localStorage.getItem("userId") || "{}"),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .then(() => alert("Pomyślnie dodano post"))
      .then(() => setAddPostOpen(false));
  };

  const handleNewComment = async () => {
    await fetch(
      "https://jsonplaceholder.typicode.com/posts/" + currentPost + "/comments",
      {
        method: "POST",
        body: JSON.stringify({
          body: comment,
          email: localStorage.getItem("userEmail"),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => console.log(json))
      .then(() => alert("Pomyślnie dodano komentarz"))
      .then(() => setAddCommentOpen(false));
  };

  const handleEdit = async (postId: number) => {
    setCurrentPost(postId);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts/" + postId
      );
      setNewTitle(response.data.title);
      setNewBody(response.data.body);
    } catch (error) {
      console.error(error);
    }

    setEditMode(true);
  };
  const handleEditPost = async () => {
    fetch("https://jsonplaceholder.typicode.com/posts/" + currentPost, {
      method: "PATCH",
      body: JSON.stringify({
        title: newTitle,
        body: newBody,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .then(() => alert("Pomyślnie zaktualizowano post"))
      .then(() => setEditMode(false));
  };

  const handleDelete = async (postId: number) => {
    setCurrentPost(postId);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts/" + postId
      );
      setNewTitle(response.data.title);
    } catch (error) {
      console.error(error);
    }

    setDeleteMode(true);
  };

  const handleDeletePost = async () => {
    fetch("https://jsonplaceholder.typicode.com/posts/" + currentPost, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => console.log("Pomyślnie usunięto post:" + currentPost))
      .then(() => alert("Pomyślnie usunięto post"))
      .then(() => setDeleteMode(false));
  };

  return (
    <div className="posts">
      <div>
        <h2>POSTY </h2>
        {show && (
          <button className="addBtn" onClick={() => handleAddPost()}>
            DODAJ POST
          </button>
        )}
      </div>
      <div className="post-grid">
        {currentPosts.map((post) => (
          <div key={post.id} className="post-item">
            <p className="author">{getAuthor(post.userId)}</p>
            <h3>{post.title.toUpperCase()}</h3>
            <p className="post">{post.body}</p>
            {post.userId.toString() === localStorage.getItem("userId") && (
              <>
                <div className="userActions">
                  <button
                    className="editBtn"
                    onClick={() => handleEdit(post.id)}
                  >
                    Edytuj
                  </button>
                  <button
                    className="deleteBtn"
                    onClick={() => handleDelete(post.id)}
                  >
                    Usuń
                  </button>
                </div>
              </>
            )}
            <button
              className="showCommentsBtn"
              onClick={() => handleOpenLightbox(post.id)}
            >
              Zobacz komentarze
            </button>
            {show && (
              <button
                className="addCommentBtn"
                onClick={() => handleAddComment(post.id)}
              >
                Dodaj komentarz
              </button>
            )}
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div
          className="post-lightbox-overlay"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="post-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="comments-section">
              <ul>
                {comments.map((comment) => (
                  <li key={comment.id} className="comment">
                    <p>{comment.email.toUpperCase()}</p>
                    <h4>{comment.name.toUpperCase()}</h4>
                    <p>{comment.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {addPostOpen && (
        <div
          className="post-lightbox-overlay"
          onClick={() => setAddPostOpen(false)}
        >
          <div className="addpost-content" onClick={(e) => e.stopPropagation()}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tytuł"
            ></input>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Treść"
            ></textarea>
            <button onClick={() => handleNewPost()}>Dodaj Post</button>
          </div>
        </div>
      )}
      {addCommentOpen && (
        <div
          className="post-lightbox-overlay"
          onClick={() => setAddCommentOpen(false)}
        >
          <div
            className="addcomment-content"
            onClick={(e) => e.stopPropagation()}
          >
            <p>Post: {currentPost}</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Treść"
            ></textarea>
            <button onClick={() => handleNewComment()}>Dodaj Komentarz</button>
          </div>
        </div>
      )}
      {editMode && (
        <div
          className="post-lightbox-overlay"
          onClick={() => setEditMode(false)}
        >
          <div className="edit-post" onClick={(e) => e.stopPropagation()}>
            <p className="titleEdit">Tytuł</p>
            <p className="bodyEdit">Treść</p>
            <textarea
              className="areaTitle"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            ></textarea>
            <textarea
              className="areaBody"
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
            ></textarea>
            <button onClick={() => handleEditPost()}>Zapisz</button>
          </div>
        </div>
      )}
      {deleteMode && (
        <div
          className="post-lightbox-overlay"
          onClick={() => setDeleteMode(false)}
        >
          <div className="delete-post" onClick={(e) => e.stopPropagation()}>
            <p>Czy chcesz usunąć post:</p>
            <p>{newTitle}?</p>

            <button onClick={() => handleDeletePost()}>Usuń</button>
          </div>
        </div>
      )}
      <div className="pagination">
        <p>
          Strona {currentPage} z {pageCount}
        </p>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          ⭠
        </button>
        <button onClick={handleNextPage} disabled={currentPage === pageCount}>
          ⭢
        </button>
      </div>
    </div>
  );
};

export default Posts;

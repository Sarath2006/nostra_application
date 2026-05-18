import React, { useState } from "react";
import "./Discussion.css";

const Discussion = () => {
  const [threads, setThreads] = useState([
    {
      id: 1,
      user: "Kathryn Murphy",
      avatar: "https://i.pravatar.cc/40?img=1",
      text: "The fit is perfect, and the quality is top-notch.",
      time: "1 week ago",
      likes: 7,
      replies: [],
    },
    {
      id: 2,
      user: "Esther Howard",
      avatar: "https://i.pravatar.cc/40?img=2",
      text: "I recently purchased the grey blazer jacket for women, and I couldn't be happier with my purchase!",
      time: "2 weeks ago",
      likes: 2,
      replies: [
        {
          id: 21,
          user: "Cameron Williamson",
          avatar: "https://i.pravatar.cc/40?img=3",
          text: "I’ve received multiple compliments on how stylish it looks.",
          time: "2 weeks ago",
          likes: 4,
        },
        {
          id: 22,
          user: "Jenny Wilson",
          avatar: "https://i.pravatar.cc/40?img=4",
          text: "It’s versatile enough to wear to work or dress up for a night out.",
          time: "2 weeks ago",
          likes: 5,
        },
      ],
    },
    {
      id: 3,
      user: "Kristin Watson",
      avatar: "https://i.pravatar.cc/40?img=5",
      text: "I highly recommend this blazer to any woman looking for a timeless and chic addition to their wardrobe.",
      time: "2 weeks ago",
      likes: 1,
      replies: [],
    },
    {
      id: 4,
      user: "Dianne Russell",
      avatar: "https://i.pravatar.cc/40?img=6",
      text: "It provides just the right amount of warmth without making me too hot.",
      time: "1 month ago",
      likes: 2,
      replies: [],
    },
  ]);

  const [newDiscussion, setNewDiscussion] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // thread or reply id
  const [replyText, setReplyText] = useState("");
  const [page, setPage] = useState(1);

  const threadsPerPage = 2;
  const start = (page - 1) * threadsPerPage;
  const paginatedThreads = threads.slice(start, start + threadsPerPage);
  const totalPages = Math.ceil(threads.length / threadsPerPage);

  // Add a new discussion
  const handleAddDiscussion = () => {
    if (!newDiscussion.trim()) return;
    const newThread = {
      id: Date.now(),
      user: "You",
      avatar: "https://i.pravatar.cc/40?img=10",
      text: newDiscussion,
      time: "Just now",
      likes: 0,
      replies: [],
    };
    setThreads([newThread, ...threads]);
    setNewDiscussion("");
    setPage(1); // go back to first page
  };

  // Like thread or reply
  const handleLike = (threadId, replyId = null) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          if (replyId) {
            return {
              ...t,
              replies: t.replies.map((r) =>
                r.id === replyId ? { ...r, likes: r.likes + 1 } : r
              ),
            };
          }
          return { ...t, likes: t.likes + 1 };
        }
        return t;
      })
    );
  };

  // Add reply
  const handleAddReply = (threadId) => {
    if (!replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      user: "You",
      avatar: "https://i.pravatar.cc/40?img=11",
      text: replyText,
      time: "Just now",
      likes: 0,
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, replies: [...t.replies, newReply] } : t
      )
    );
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <div className="discussion">
      {paginatedThreads.map((thread) => (
        <div key={thread.id} className="thread">
          <div className="thread-header">
            <img src={thread.avatar} alt={thread.user} />
            <div className="thread-body">
              <p>
                <strong>{thread.user}</strong> {thread.text}
              </p>
              <div className="thread-meta">
                <button onClick={() => handleLike(thread.id)}>Like</button>
                <button onClick={() => setReplyingTo(thread.id)}>Reply</button>
                <span>{thread.likes} likes</span>
                <span>{thread.time}</span>
              </div>

              {/* Replies */}
              {thread.replies.length > 0 && (
                <div className="replies">
                  {thread.replies.map((reply) => (
                    <div key={reply.id} className="thread-header">
                      <img src={reply.avatar} alt={reply.user} />
                      <div className="thread-body">
                        <p>
                          <strong>{reply.user}</strong> {reply.text}
                        </p>
                        <div className="thread-meta">
                          <button onClick={() => handleLike(thread.id, reply.id)}>
                            Like
                          </button>
                          <button onClick={() => setReplyingTo(thread.id)}>
                            Reply
                          </button>
                          <span>{reply.likes} likes</span>
                          <span>{reply.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply box */}
              {replyingTo === thread.id && (
                <div className="reply-box">
                  <textarea
                    placeholder="Enter a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button onClick={() => handleAddReply(thread.id)}>
                    Send reply
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={page === i + 1 ? "active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* New thread */}
      <div className="new-thread">
        <textarea
          placeholder="Question / topic"
          value={newDiscussion}
          onChange={(e) => setNewDiscussion(e.target.value)}
        />
        <button onClick={handleAddDiscussion}>Start discussion</button>
      </div>
    </div>
  );
};

export default Discussion;

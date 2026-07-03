'use strict';

const postBtn = document.getElementById("postBtn");
const posts = document.getElementById("posts");
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  displayPosts();
});

postBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();
  if (!name || !message) {
    alert("名前とメッセージを入力してください");
    return;
  }

  const post = {
    id: Date.now(),
    name,
    message,
    date : new Date().toLocaleString("ja-JP"),
    likes: 0,
    replies: []
  };
  boardData.unshift(post);
  saveData();
  displayPosts();

  document.getElementById("name").value = "";
  document.getElementById("message").value = "";
});

function saveData() {
  localStorage.setItem("boardData", JSON.stringify(boardData));
}

function displayPosts() {
  posts.innerHTML = "";

  const keyword = searchInput.value.toLowerCase();

  const filteredPosts = boardData.filter(post =>
    post.name.toLowerCase().includes(keyword) ||
    post.message.toLowerCase().includes(keyword)
  );

  filteredPosts.forEach(post => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");

    postElement.innerHTML = `
    <div class="post-header">
      <strong>${post.name}</strong>
      <span>${post.date}</span>
    </div>
    
    <p>${post.message}</p>
    
    <div class="post-buttons">
      <button onclick="likePost(${post.id})">👍 ${post.likes}</button>
      <button onclick="editPost(${post.id})">編集</button>
      <button onclick="deletePost(${post.id})">削除</button>
      <button onclick="replyPost(${post.id})">返信</button>
    </div>

    <div class="replies">
      ${post.replies.map((reply, index) => `
  <div class="reply">
    <strong>${reply.name}</strong>
    <span>${reply.date}</span>
    <p>${reply.message}</p>
    <button onclick="editReply(${post.id}, ${index})">
    返信編集
    </button>
    <button onclick="deleteReply(${post.id}, ${index})">
    返信削除
    </button>
  </div>
`).join("")}
</div>
`;
posts.appendChild(postElement);
  });
}

function deletePost(id) {
  if(!confirm("削除しますか？")) {
    return;
  }
  boardData = boardData.filter(post => post.id !== id);
  saveData();
  displayPosts();
}

function editPost(id) {
  const post = boardData.find(post => post.id === id);
  if(!post) {
    return;
  }
  const newMessage = prompt(
    "内容を編集してください",
    post.message
  );
  if (newMessage === null || newMessage.trim() === "") {
    return;
  }
  post.message = newMessage;

  saveData();
  displayPosts();
}

let boardData = JSON.parse(localStorage.getItem("boardData")) || [];
displayPosts();

function likePost(id) {
  const post = boardData.find(post => post.id === id);
  if(!post) {
    return;
  }
post.likes++;

saveData();
displayPosts();
}

function replyPost(id) {
const post = boardData.find(post => post.id === id);

if(!post) {
return;
}

const replyName = prompt("返信者名を入力");

if(!replyName) {
return;
}

const replyMessage = prompt("返信内容を入力");

if(!replyMessage) {
return;}

post.replies.push ({

name: replyName,
message: replyMessage,
date: new Date().toLocaleString("ja-JP")
});

saveData();
displayPosts();
}

function editReply(postId, replyIndex) {
  const post = boardData.find(post => post.id === postId);

  if(!post) {
    return;
  }

  const reply = post.replies[replyIndex];

  if(!reply) {
    return;
  }

  const newMessage = prompt(
    "返信内容を編集してください",
    reply.message
  );

  if (newMessage === null || newMessage.trim() === "") {
    return;
  }

  reply.message = newMessage;
  
  saveData();
  displayPosts();
}

function deleteReply(postId, replyIndex) {
  const post = boardData.find(post => post.id === postId);

  if(!post) {
    return;
  }

  if(!confirm("返信を削除しますか？")) {
    return;
  }

  post.replies.splice(replyIndex, 1);

  saveData();
  displayPosts();
}

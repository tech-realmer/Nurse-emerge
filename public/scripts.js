// Hamburger menu toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
  });
  
  // Blog page: Fetch and display posts
  if (document.getElementById('posts-container')) {
    fetch('/api/posts')
      .then(response => response.json())
      .then(posts => {
        const container = document.getElementById('posts-container');
        posts.forEach(post => {
          const postElement = document.createElement('div');
          postElement.className = 'post';
          postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content.substring(0, 100)}...</p>
            <p>${new Date(post.date).toLocaleDateString()}</p>
            <a href="post.html?id=${post.id}">Read More</a>
          `;
          container.appendChild(postElement);
        });
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        document.getElementById('posts-container').innerHTML = '<p>Error loading posts.</p>';
      });
  }
  
  // Post page: Fetch and display single post
  if (document.getElementById('post-content')) {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    if (postId) {
      fetch(`/api/posts/${postId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Post not found');
          }
          return response.json();
        })
        .then(post => {
          const container = document.getElementById('post-content');
          container.innerHTML = `
            <h1>${post.title}</h1>
            <p>${new Date(post.date).toLocaleDateString()}</p>
            ${post.imagePath ? `<img src="${post.imagePath}" alt="${post.title}" style="max-width: 100%;">` : ''}
            <p>${post.content}</p>
          `;
        })
        .catch(error => {
          console.error('Error fetching post:', error);
          document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
        });
    } else {
      document.getElementById('post-content').innerHTML = '<p>No post ID provided.</p>';
    }
  }
  
  // New post form: Handle submission
  if (document.getElementById('new-post-form')) {
    document.getElementById('new-post-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;
      const imagePath = document.getElementById('imagePath').value;
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, imagePath })
        });
        const result = await response.json();
        const messageDiv = document.getElementById('message');
        if (result.success) {
          messageDiv.innerHTML = '<p>Post added successfully!</p>';
          document.getElementById('new-post-form').reset();
        } else {
          messageDiv.innerHTML = '<p>Error adding post.</p>';
        }
      } catch (error) {
        console.error('Error submitting post:', error);
        document.getElementById('message').innerHTML = '<p>Error adding post.</p>';
      }
    });
  }
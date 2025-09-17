// Backend configuration
// Replace with your JSONBin.io and Cloudinary credentials
const JSONBIN_API_KEY = 'your-jsonbin-api-key';
const JSONBIN_BIN_ID = 'your-jsonbin-bin-id';
const CLOUDINARY_CLOUD_NAME = 'your-cloudinary-cloud-name';

// Detect platform: Vercel (full-stack) or GitHub Pages (static)
const isVercel = window.location.hostname.includes('vercel.app');

// Hamburger menu toggle for responsive navigation
document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('active');
  document.querySelector('.hamburger').classList.toggle('active');
});

// Scroll animations using Intersection Observer and GSAP
const fadeIns = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      gsap.to(entry.target, { opacity: 1, y: 0, duration: 0.6 });
    }
  });
}, { threshold: 0.1 });
fadeIns.forEach(el => observer.observe(el));

// Enhanced nursing tips for home page
if (document.getElementById('tips-container')) {
  const tips = [
    { text: 'Guidance and Mentorship: Providing direction and mentorship to nurses and nursing students to help them navigate their journey into specialized areas.' },
    { text: 'Networking Galore: Offering exceptional opportunities to connect with leading professionals across various nursing fields.' },
    { text: 'Enlightenment and Empowerment: Equipping nurses with the knowledge and solutions to overcome the challenges in different specialties.' },
    { text: 'Empowering Your Journey: Supporting nurses to achieve excellence and reach their desired goals within their specialties.' },
    { text: 'Building Future Leaders: Shaping goal-oriented nursing professionals across Africa and beyond to become the next generation of healthcare leaders.' },
  ];
  const container = document.getElementById('tips-container');
  tips.forEach(tip => {
    const tipElement = document.createElement('div');
    tipElement.className = 'tip fade-in';
    tipElement.textContent = tip.text;
    container.appendChild(tipElement);
    observer.observe(tipElement);
  });
}

// Recent blogs section on home page
if (document.getElementById('recent-posts-container')) {
  const fetchRecentPosts = isVercel
    ? fetch('/api_index').then(res => res.json())
    : axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        headers: { 'X-Master-Key': JSONBIN_API_KEY }
      }).then(res => res.data.record || []);

  fetchRecentPosts
    .then(posts => {
      const recentPosts = posts.slice(-3).reverse(); // Get last 3 posts, reverse to show most recent first
      const container = document.getElementById('recent-posts-container');
      recentPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'recent-post-card fade-in';
        postElement.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.content.substring(0, 100)}...</p>
          <p>${new Date(post.date).toLocaleDateString()}</p>
          ${post.imagePath ? `<img src="${post.imagePath}" alt="${post.title}" style="max-width: 100px;">` : ''}
          <a href="post.html?id=${post.id}" class="elegant-button">Read More</a>
        `;
        container.appendChild(postElement);
        observer.observe(postElement);
      });
    })
    .catch(error => {
      console.error('Error fetching recent posts:', error);
      document.getElementById('recent-posts-container').innerHTML = '<p>Error loading recent posts.</p>';
    });
}

// Specialties data (partial list, expand to 100+ with real video URLs)
const specialties = [
  { name: 'Critical Care Nursing', description: 'Cares for patients with life-threatening conditions in ICUs.', video: 'https://www.youtube.com/embed/VIDEO_ID1' },
  { name: 'Pediatric Nursing', description: 'Provides specialized care for children and adolescents.', video: 'https://www.youtube.com/embed/VIDEO_ID2' },
  { name: 'Oncology Nursing', description: 'Supports cancer patients through treatment and recovery.', video: 'https://www.youtube.com/embed/VIDEO_ID3' },
  { name: 'Geriatric Nursing', description: 'Focuses on elderly patients with chronic conditions.', video: 'https://www.youtube.com/embed/VIDEO_ID4' },
  { name: 'Emergency Nursing', description: 'Manages urgent cases in fast-paced emergency departments.', video: 'https://www.youtube.com/embed/VIDEO_ID5' },
  { name: 'Surgical Nursing', description: 'Assists in surgical procedures and post-operative care.', video: 'https://www.youtube.com/embed/VIDEO_ID6' },
  { name: 'Neonatal Nursing', description: 'Cares for newborns, especially premature infants.', video: 'https://www.youtube.com/embed/VIDEO_ID7' },
  { name: 'Psychiatric Nursing', description: 'Supports patients with mental health disorders.', video: 'https://www.youtube.com/embed/VIDEO_ID8' },
  { name: 'Cardiac Nursing', description: 'Specializes in patients with heart-related conditions.', video: 'https://www.youtube.com/embed/VIDEO_ID9' },
  { name: 'Orthopedic Nursing', description: 'Cares for patients with musculoskeletal injuries.', video: 'https://www.youtube.com/embed/VIDEO_ID10' },
  // Add 90+ more specialties from sources like ANA, AHRQ
];
let displayedSpecialties = 0;
const specialtiesPerLoad = 10;

if (document.getElementById('specialties-container')) {
  const container = document.getElementById('specialties-container');
  const loadMore = document.getElementById('load-more');

  const loadSpecialties = () => {
    const nextSpecialties = specialties.slice(displayedSpecialties, displayedSpecialties + specialtiesPerLoad);
    nextSpecialties.forEach(specialty => {
      const specialtyElement = document.createElement('div');
      specialtyElement.className = 'specialty-card fade-in';
      specialtyElement.innerHTML = `
        <h3>${specialty.name}</h3>
        <p>${specialty.description}</p>
        ${specialty.video ? `<iframe src="${specialty.video}" title="${specialty.name}" allowfullscreen></iframe>` : ''}
      `;
      container.appendChild(specialtyElement);
      observer.observe(specialtyElement);
    });
    displayedSpecialties += nextSpecialties.length;
    if (displayedSpecialties >= specialties.length) {
      loadMore.style.display = 'none';
    }
  };

  loadSpecialties();
  loadMore.addEventListener('click', loadSpecialties);
}

// Quill rich text editor for new-post.html with clear tooltips
if (document.getElementById('editor')) {
  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        ['link', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['image', 'video'],
        ['clean']
      ]
    }
  });

  // Add tooltips for toolbar buttons for clarity
  const toolbar = quill.getModule('toolbar');
  const buttons = toolbar.container.querySelectorAll('.ql-toolbar button');
  const buttonTitles = [
    'Header 1', 'Header 2', 'Header 3', 'Normal',
    'Bold', 'Italic', 'Underline',
    'Link', 'Block Quote',
    'Ordered List', 'Bullet List',
    'Align Left', 'Align Center', 'Align Right', 'Align Justify',
    'Insert Image', 'Insert Video',
    'Clean Formatting'
  ];
  buttons.forEach((button, index) => {
    button.title = buttonTitles[index] || '';
  });

  // Save Quill content to hidden input on form submit
  document.getElementById('new-post-form').addEventListener('submit', (e) => {
    document.getElementById('content').value = quill.root.innerHTML;
  });
}

// Manage posts section for deletion
if (document.getElementById('manage-posts-container')) {
  const fetchPostsForManagement = isVercel
    ? fetch('/api_index').then(res => res.json())
    : axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        headers: { 'X-Master-Key': JSONBIN_API_KEY }
      }).then(res => res.data.record || []);

  fetchPostsForManagement
    .then(posts => {
      const container = document.getElementById('manage-posts-container');
      posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-item fade-in';
        postElement.innerHTML = `
          <div>
            <h4>${post.title}</h4>
            <p>${post.content.substring(0, 50)}...</p>
            <p>${new Date(post.date).toLocaleDateString()}</p>
          </div>
          <button onclick="deletePost('${post.id}')">Delete</button>
        `;
        container.appendChild(postElement);
        observer.observe(postElement);
      });
    })
    .catch(error => {
      console.error('Error fetching posts for management:', error);
      document.getElementById('manage-posts-container').innerHTML = '<p>Error loading posts.</p>';
    });
}

// Function to delete post
function deletePost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    const deletePost = isVercel
      ? fetch(`/api_index/${postId}`, { method: 'DELETE' })
      : axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
          headers: { 'X-Master-Key': JSONBIN_API_KEY }
        }).then(res => {
          const posts = res.data.record || [];
          const updatedPosts = posts.filter(p => p.id !== postId);
          return axios.put(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, updatedPosts, {
            headers: { 'X-Master-Key': JSONBIN_API_KEY, 'Content-Type': 'application/json' }
          });
        });

    deletePost
      .then(() => {
        alert('Post deleted successfully!');
        location.reload(); // Reload to update the list
      })
      .catch(error => {
        console.error('Error deleting post:', error);
        alert('Error deleting post.');
      });
  }
}

// Image upload handling for new-post.html
if (document.getElementById('new-post-form')) {
  if (isVercel) {
    // Vercel: File input with server-side upload via /api_upload
    document.getElementById('photo').style.display = 'block';
    document.getElementById('image-upload').style.display = 'none';
    document.getElementById('photo').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          document.getElementById('image-preview').innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
      }
    });
  } else {
    // GitHub Pages: Client-side Cloudinary widget upload
    const uploadWidget = cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'nurse_emerge',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: true
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          document.getElementById('imagePath').value = result.info.secure_url;
          document.getElementById('image-preview').innerHTML = `<img src="${result.info.secure_url}" alt="Preview">`;
        } else if (error) {
          document.getElementById('message').innerHTML = '<p>Error uploading image.</p>';
        }
      }
    );
    document.getElementById('image-upload').addEventListener('click', () => {
      uploadWidget.open();
    });
  }
}

// Blog page: Fetch and display posts
if (document.getElementById('posts-container')) {
  const fetchPosts = isVercel
    ? fetch('/api_index').then(res => res.json())
    : axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        headers: { 'X-Master-Key': JSONBIN_API_KEY }
      }).then(res => res.data.record || []);

  fetchPosts
    .then(posts => {
      const container = document.getElementById('posts-container');
      posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post fade-in';
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <div>${post.content.substring(0, 100)}...</div>
          <p>${new Date(post.date).toLocaleDateString()}</p>
          ${post.imagePath ? `<img src="${post.imagePath}" alt="${post.title}" style="max-width: 100px;">` : ''}
          <a href="post.html?id=${post.id}">Read More</a>
        `;
        container.appendChild(postElement);
        observer.observe(postElement);
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
    const fetchPost = isVercel
      ? fetch(`/api_index/${postId}`).then(res => {
          if (!res.ok) throw new Error('Post not found');
          return res.json();
        })
      : axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
          headers: { 'X-Master-Key': JSONBIN_API_KEY }
        }).then(res => {
          const posts = res.data.record || [];
          const post = posts.find(p => p.id === postId);
          if (!post) throw new Error('Post not found');
          return post;
        });

    fetchPost
      .then(post => {
        const container = document.getElementById('post-content');
        container.innerHTML = `
          <h1>${post.title}</h1>
          <p>${new Date(post.date).toLocaleDateString()}</p>
          ${post.imagePath ? `<img src="${post.imagePath}" alt="${post.title}" style="max-width: 100%;">` : ''}
          <div>${post.content}</div>
        `;
        container.classList.add('fade-in', 'visible');
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
    let imagePath = document.getElementById('imagePath').value;

    if (isVercel && document.getElementById('photo').files[0]) {
      const formData = new FormData();
      formData.append('photo', document.getElementById('photo').files[0]);
      try {
        const uploadResponse = await fetch('/api_upload', {
          method: 'POST',
          body: formData
        });
        const uploadResult = await uploadResponse.json();
        if (!uploadResult.imagePath) throw new Error('Image upload failed');
        imagePath = uploadResult.imagePath;
      } catch (error) {
        console.error('Error uploading image:', error);
        document.getElementById('message').innerHTML = '<p>Error uploading image.</p>';
        return;
      }
    }

    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toISOString(),
      imagePath: imagePath || null
    };

    try {
      if (isVercel) {
        const response = await fetch('/api_index', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost)
        });
        const result = await response.json();
        if (result.success) {
          document.getElementById('message').innerHTML = '<p>Post added successfully!</p>';
          document.getElementById('new-post-form').reset();
          document.getElementById('image-preview').innerHTML = '';
          location.reload(); // Reload to update manage posts
        } else {
          throw new Error('Post submission failed');
        }
      } else {
        const response = await axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
          headers: { 'X-Master-Key': JSONBIN_API_KEY }
        });
        const posts = response.data.record || [];
        posts.push(newPost);
        await axios.put(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, posts, {
          headers: { 'X-Master-Key': JSONBIN_API_KEY, 'Content-Type': 'application/json' }
        });
        document.getElementById('message').innerHTML = '<p>Post added successfully!</p>';
        document.getElementById('new-post-form').reset();
        document.getElementById('image-preview').innerHTML = '';
        location.reload(); // Reload to update manage posts
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      document.getElementById('message').innerHTML = '<p>Error adding post.</p>';
    }
  });
}

// Manage posts section for deletion
if (document.getElementById('manage-posts-container')) {
  const fetchPostsForManagement = isVercel
    ? fetch('/api_index').then(res => res.json())
    : axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        headers: { 'X-Master-Key': JSONBIN_API_KEY }
      }).then(res => res.data.record || []);

  fetchPostsForManagement
    .then(posts => {
      const container = document.getElementById('manage-posts-container');
      posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-item fade-in';
        postElement.innerHTML = `
          <div>
            <h4>${post.title}</h4>
            <p>${post.content.substring(0, 50)}...</p>
            <p>${new Date(post.date).toLocaleDateString()}</p>
          </div>
          <button onclick="deletePost('${post.id}')">Delete</button>
        `;
        container.appendChild(postElement);
        observer.observe(postElement);
      });
    })
    .catch(error => {
      console.error('Error fetching posts for management:', error);
      document.getElementById('manage-posts-container').innerHTML = '<p>Error loading posts.</p>';
    });
}

// Function to delete post
function deletePost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    const deletePost = isVercel
      ? fetch(`/api_index/${postId}`, { method: 'DELETE' })
      : axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
          headers: { 'X-Master-Key': JSONBIN_API_KEY }
        }).then(res => {
          const posts = res.data.record || [];
          const updatedPosts = posts.filter(p => p.id !== postId);
          return axios.put(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, updatedPosts, {
            headers: { 'X-Master-Key': JSONBIN_API_KEY, 'Content-Type': 'application/json' }
          });
        });

    deletePost
      .then(() => {
        alert('Post deleted successfully!');
        location.reload(); // Reload to update the list
      })
      .catch(error => {
        console.error('Error deleting post:', error);
        alert('Error deleting post.');
      });
  }
}
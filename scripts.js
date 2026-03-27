/* ===============================
   NURSE EMERGE - OPTIMIZED SCRIPTS
   =============================== */

   document.addEventListener("DOMContentLoaded", function() {

    /* ---------- MOBILE NAVIGATION ---------- */
    var menuToggle = document.querySelector(".menu-toggle");
    var navMenu = document.querySelector(".nav-menu");
  
    if (menuToggle && navMenu) {
      menuToggle.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        navMenu.classList.toggle("active");
        
        var icon = menuToggle.querySelector("i");
        if (icon) {
          if (navMenu.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
          } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
          }
        }
      });
  
      // Close menu when clicking a link
      var navLinks = navMenu.querySelectorAll("a");
      for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener("click", function() {
          navMenu.classList.remove("active");
          var icon = menuToggle.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
          }
        });
      }
  
      // Close menu when clicking outside
      document.addEventListener("click", function(e) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          navMenu.classList.remove("active");
          var icon = menuToggle.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
          }
        }
      });
    }
  
    /* ---------- FIREBASE CONFIGURATION ---------- */
    var firebaseConfig = {
      apiKey: "AIzaSyDGE-PRlwsZlMzQOgsKI9NRxtv4Lac3t5o",
      authDomain: "nurse-emerge.firebaseapp.com",
      projectId: "nurse-emerge"
    };
  
    // Initialize Firebase if available
    var db = null;
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      db = firebase.firestore();
    }
  
    /* ---------- LOAD RECENT POSTS (HOMEPAGE) ---------- */
    var blogContainer = document.getElementById("blog-container");
    
    if (blogContainer && db) {
      db.collection("posts")
        .orderBy("date", "desc")
        .limit(3)
        .get()
        .then(function(snapshot) {
          if (snapshot.empty) {
            blogContainer.innerHTML = '<div class="empty-state" style="text-align:center;grid-column:1/-1;padding:40px;"><i class="fas fa-newspaper" style="font-size:50px;color:#ddd;margin-bottom:20px;"></i><p>No posts yet. Check back soon!</p></div>';
            return;
          }
  
          var html = '';
          snapshot.forEach(function(doc) {
            var post = doc.data();
            var excerpt = stripHtml(post.content).substring(0, 120) + "...";
            var imageHtml = post.imagePath ? '<img src="' + post.imagePath + '" alt="' + escapeHtml(post.title) + '" loading="lazy">' : '';
  
            html += '<article class="blog-card"><a href="post.html?id=' + doc.id + '">' + imageHtml + '<div class="blog-card-content"><h3>' + escapeHtml(post.title) + '</h3><p>' + escapeHtml(excerpt) + '</p><span class="read-more">Read More →</span></div></a></article>';
          });
  
          blogContainer.innerHTML = html;
        })
        .catch(function(err) {
          console.error("Error loading posts:", err);
          blogContainer.innerHTML = '<div class="error-state" style="text-align:center;grid-column:1/-1;padding:40px;"><i class="fas fa-exclamation-circle" style="font-size:40px;color:#dc3545;margin-bottom:15px;"></i><p>Unable to load posts. Please try again later.</p></div>';
        });
    }
  
    /* ---------- LOAD ALL POSTS (BLOG PAGE) ---------- */
    var postsContainer = document.getElementById("posts-container");
    
    if (postsContainer && db) {
      postsContainer.innerHTML = '<div class="loading-state" style="text-align:center;padding:40px;grid-column:1/-1;"><i class="fas fa-spinner fa-spin" style="font-size:30px;color:var(--primary);"></i><p style="margin-top:15px;">Loading articles...</p></div>';
  
      db.collection("posts")
        .orderBy("date", "desc")
        .get()
        .then(function(snapshot) {
          if (snapshot.empty) {
            postsContainer.innerHTML = '<div class="empty-state" style="text-align:center;padding:60px 20px;grid-column:1/-1;"><i class="fas fa-newspaper" style="font-size:60px;color:#ddd;margin-bottom:20px;"></i><h3>No Articles Yet</h3><p>Check back soon for new content!</p></div>';
            return;
          }
  
          var html = '';
          snapshot.forEach(function(doc) {
            var post = doc.data();
            var excerpt = stripHtml(post.content).substring(0, 150) + "...";
            var date = post.date ? formatDate(post.date.toDate()) : '';
            var imageHtml = post.imagePath ? '<img src="' + post.imagePath + '" alt="' + escapeHtml(post.title) + '" loading="lazy">' : '';
  
            html += '<article class="blog-card"><a href="post.html?id=' + doc.id + '">' + imageHtml + '<div class="blog-card-content"><h3>' + escapeHtml(post.title) + '</h3>' + (date ? '<small style="color:#888;">' + date + '</small>' : '') + '<p>' + escapeHtml(excerpt) + '</p><span class="read-more">Read More →</span></div></a></article>';
          });
  
          postsContainer.innerHTML = html;
        })
        .catch(function(err) {
          console.error("Error loading posts:", err);
          postsContainer.innerHTML = '<div class="error-state" style="text-align:center;padding:60px 20px;grid-column:1/-1;"><i class="fas fa-exclamation-circle" style="font-size:50px;color:#dc3545;margin-bottom:20px;"></i><h3>Error Loading Articles</h3><p>Please refresh the page or try again later.</p></div>';
        });
    }
  
    /* ---------- LOAD SINGLE POST ---------- */
    var postContent = document.getElementById("post-content");
    var postTitle = document.getElementById("post-title");
    var postDate = document.getElementById("post-date");
    var postImage = document.getElementById("post-image");
    
    if (postContent && db) {
      var params = new URLSearchParams(window.location.search);
      var id = params.get("id");
  
      if (!id) {
        postContent.innerHTML = '<div class="error-state" style="text-align:center;padding:40px;"><i class="fas fa-exclamation-triangle" style="font-size:50px;color:#ffc107;margin-bottom:20px;"></i><h2>Post Not Found</h2><p>No post ID was provided.</p><a href="blog.html" style="display:inline-block;margin-top:20px;padding:12px 30px;background:var(--primary);color:white;border-radius:30px;text-decoration:none;">Back to Blog</a></div>';
        return;
      }
  
      postContent.innerHTML = '<div class="loading-state" style="text-align:center;padding:40px;"><i class="fas fa-spinner fa-spin" style="font-size:40px;color:var(--primary);"></i><p style="margin-top:20px;">Loading article...</p></div>';
  
      db.collection("posts").doc(id).get()
        .then(function(doc) {
          if (!doc.exists) {
            postContent.innerHTML = '<div class="error-state" style="text-align:center;padding:40px;"><i class="fas fa-exclamation-triangle" style="font-size:50px;color:#ffc107;margin-bottom:20px;"></i><h2>Post Not Found</h2><p>The article you\'re looking for doesn\'t exist.</p><a href="blog.html" style="display:inline-block;margin-top:20px;padding:12px 30px;background:var(--primary);color:white;border-radius:30px;text-decoration:none;">Back to Blog</a></div>';
            return;
          }
  
          var post = doc.data();
          
          document.title = post.title + ' - Nurse Emerge';
          
          if (postTitle) postTitle.textContent = post.title;
          if (postDate && post.date) postDate.textContent = formatDate(post.date.toDate());
          
          if (postImage) {
            if (post.imagePath) {
              postImage.src = post.imagePath;
              postImage.alt = post.title;
              postImage.style.display = 'block';
            } else {
              postImage.style.display = 'none';
            }
          }
  
          postContent.innerHTML = post.content;
        })
        .catch(function(err) {
          console.error("Error loading post:", err);
          postContent.innerHTML = '<div class="error-state" style="text-align:center;padding:40px;"><i class="fas fa-exclamation-circle" style="font-size:50px;color:#dc3545;margin-bottom:20px;"></i><h2>Error Loading Article</h2><p>Unable to load this article. Please try again later.</p><a href="blog.html" style="display:inline-block;margin-top:20px;padding:12px 30px;background:var(--primary);color:white;border-radius:30px;text-decoration:none;">Back to Blog</a></div>';
        });
    }
  
    /* ---------- NEWSLETTER SUBSCRIPTION ---------- */
    var newsletterForm = document.getElementById("newsletter-form");
    
    if (newsletterForm && db) {
      newsletterForm.addEventListener("submit", function(e) {
        e.preventDefault();
  
        var emailInput = document.getElementById("email");
        var message = document.getElementById("newsletter-msg");
        var submitBtn = newsletterForm.querySelector("button[type='submit']");
  
        var email = emailInput.value.trim().toLowerCase();
  
        if (!email || !isValidEmail(email)) {
          showMessage(message, "Please enter a valid email address.", "error");
          return;
        }
  
        submitBtn.disabled = true;
        submitBtn.textContent = "Subscribing...";
  
        db.collection("newsletter")
          .where("email", "==", email)
          .get()
          .then(function(snapshot) {
            if (!snapshot.empty) {
              showMessage(message, "You're already subscribed!", "success");
              submitBtn.disabled = false;
              submitBtn.textContent = "Subscribe";
              return;
            }
  
            return db.collection("newsletter").add({
              email: email,
              date: firebase.firestore.Timestamp.now()
            });
          })
          .then(function() {
            showMessage(message, "Subscribed successfully! Thank you.", "success");
            emailInput.value = "";
            submitBtn.disabled = false;
            submitBtn.textContent = "Subscribe";
          })
          .catch(function(err) {
            console.error("Newsletter error:", err);
            showMessage(message, "Something went wrong. Please try again.", "error");
            submitBtn.disabled = false;
            submitBtn.textContent = "Subscribe";
          });
      });
    }
  
  });
  
  /* ---------- UTILITY FUNCTIONS ---------- */
  function stripHtml(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  
  function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  function formatDate(date) {
    if (!(date instanceof Date)) return "";
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  function showMessage(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.className = "message " + type;
    element.style.display = "block";
    
    setTimeout(function() {
      element.style.display = "none";
    }, 5000);
  }
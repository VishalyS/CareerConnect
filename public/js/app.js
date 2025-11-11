// CareerConnect - Full-fledged website with page routing
// Handles auth, user session, and module navigation

const app = {
  currentUser: null,
  currentPage: 'landing',

  // Page navigation
  goToPage: function(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    
    if (page === 'dashboard' && !localStorage.getItem('cc_user_id')) {
      page = 'landing';
    }

    // Show requested page
    const pageEl = document.getElementById(page + 'Page');
    if (pageEl) {
      pageEl.style.display = 'flex';
      this.currentPage = page;
      window.scrollTo(0, 0);
    }
  },

  // API helper with auth
  api: async function(path, options = {}) {
    const userId = localStorage.getItem('cc_user_id');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (userId) headers['x-user-id'] = userId;
    const res = await fetch('/api' + path, { ...options, headers });
    return res.json();
  },

  // Check auth status on load
  checkAuth: function() {
    const userId = localStorage.getItem('cc_user_id');
    if (userId) {
      this.api('/auth/me').then(data => {
        if (data.user) {
          this.currentUser = data.user;
          this.loadDashboard();
        } else {
          localStorage.removeItem('cc_user_id');
          this.goToPage('landing');
        }
      }).catch(() => {
        localStorage.removeItem('cc_user_id');
        this.goToPage('landing');
      });
    } else {
      this.goToPage('landing');
    }
  },

  // Load dashboard
  loadDashboard: function() {
    // Populate profile dropdown
    const profileHtml = `
      <p><strong>Name</strong></p>
      <p>${this.currentUser.name}</p>
      <p><strong>Email</strong></p>
      <p>${this.currentUser.email}</p>
      <p><strong>Member Since</strong></p>
      <p>${new Date(this.currentUser.createdAt).toLocaleDateString()}</p>
    `;
    document.getElementById('profileDropdownContent').innerHTML = profileHtml;
    
    // Auto-load all module content
    this.loadAssessmentsContent();
    this.loadTrainingContent();
    this.loadMentorsContent();
    this.loadJobsContent();
    this.goToPage('dashboard');
  },

  // Load assessments content
  loadAssessmentsContent: async function() {
    const data = await this.api('/assessments');
    let html = '';

    if (Array.isArray(data) && data.length > 0) {
      const available = data.filter(a => a.type === 'available');
      
      html = available.map(a => `
        <div class="card">
          <h3>${a.title}</h3>
          <p>${a.description || ''}</p>
          <div class="meta">
            <span class="tag">Duration: ${a.duration}</span>
            <button class="btn btn-small" onclick="alert('Assessment: ${a.title}\\n\\nThis will start a new assessment. (Feature coming soon)')">Take</button>
          </div>
        </div>
      `).join('');
    } else {
      html = '<div class="card"><p>No assessments available yet.</p></div>';
    }

    document.getElementById('assessmentsContent').innerHTML = html;
  },

  // Load training content
  loadTrainingContent: async function() {
    const data = await this.api('/training');
    let html = '';
    if (Array.isArray(data) && data.length > 0) {
      html = data.map(t => `
        <div class="card">
          <h3>${t.title}</h3>
          <p><strong>${t.provider}</strong></p>
          <p>${t.description || ''}</p>
          <div class="meta">
            <span class="tag">${t.durationHours || '?'} hours</span>
            ${t.tags ? t.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
          </div>
        </div>
      `).join('');
    } else {
      html = '<div class="card"><p>No training courses available yet.</p></div>';
    }
    document.getElementById('trainingContent').innerHTML = html;
  },

  // Load mentors content
  loadMentorsContent: async function() {
    const data = await this.api('/mentorship');
    let html = '';
    if (Array.isArray(data) && data.length > 0) {
      html = data.map(m => `
        <div class="card">
          <h3>${m.user?.name || 'Mentor'}</h3>
          <p>${m.bio || 'Experienced mentor'}</p>
          <p><strong>Expertise:</strong> ${m.expertise ? m.expertise.join(', ') : 'N/A'}</p>
          <p><strong>Availability:</strong> ${m.availability || 'Flexible'}</p>
          <div class="meta">
            <span class="rating">${m.rating || 0}/5.0</span>
            <span class="tag">${m.user?.email || 'mentor@example.com'}</span>
          </div>
        </div>
      `).join('');
    } else {
      html = '<div class="card"><p>No mentors available yet.</p></div>';
    }
    document.getElementById('mentorshipContent').innerHTML = html;
  },

  // Load jobs content
  loadJobsContent: async function() {
    const data = await this.api('/jobs');
    let html = '';
    if (Array.isArray(data) && data.length > 0) {
      html = data.map(j => `
        <div class="card">
          <h3>${j.title}</h3>
          <p><strong>${j.company}</strong></p>
          <p>${j.description || ''}</p>
          <p><strong>Location:</strong> ${j.location || 'Remote'}</p>
          <div class="meta">
            ${j.tags ? j.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
          </div>
        </div>
      `).join('');
    } else {
      html = '<div class="card"><p>No job opportunities available yet.</p></div>';
    }
    document.getElementById('jobsContent').innerHTML = html;
  },

  // Switch dashboard tabs
  switchTab: function(tab) {
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tab + 'Section').classList.add('active');
    event.target.classList.add('active');
  },

  // Logout
  logout: function() {
    localStorage.removeItem('cc_user_id');
    this.currentUser = null;
    document.getElementById('registerForm').reset();
    document.getElementById('loginForm').reset();
    this.goToPage('landing');
  }
};

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Expose app to window for inline onclick handlers
  window.app = app;

  // Check auth on load
  app.checkAuth();

  // ============ REGISTER ============
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {
      name: fd.get('name'),
      email: fd.get('email'),
      password: fd.get('password')
    };

    const resultEl = document.getElementById('regResult');
    try {
      const data = await app.api('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (data.user && data.user.id) {
        localStorage.setItem('cc_user_id', data.user.id);
        app.currentUser = data.user;
        resultEl.textContent = 'Registration successful! Redirecting...';
        setTimeout(() => app.loadDashboard(), 500);
      } else {
        resultEl.textContent = (data.message || 'Registration failed');
      }
    } catch (err) {
      resultEl.textContent = 'Error: ' + err.message;
    }
  });

  // ============ LOGIN ============
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {
      email: fd.get('email'),
      password: fd.get('password')
    };

    const resultEl = document.getElementById('loginResult');
    try {
      const data = await app.api('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (data.user && data.user.id) {
        localStorage.setItem('cc_user_id', data.user.id);
        app.currentUser = data.user;
        resultEl.textContent = 'Login successful! Redirecting...';
        setTimeout(() => app.loadDashboard(), 500);
      } else {
        resultEl.textContent = (data.message || 'Login failed');
      }
    } catch (err) {
      resultEl.textContent = 'Error: ' + err.message;
    }
  });

  // ============ LOGOUT ============
  document.getElementById('logoutBtnDropdown').addEventListener('click', () => {
    app.logout();
  });

  // ============ PROFILE DROPDOWN ============
  document.getElementById('profileIconBtn').addEventListener('click', () => {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profileDropdown');
    const profileBtn = document.getElementById('profileIconBtn');
    if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });

  // ============ DASHBOARD NAV ============
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      app.switchTab(this.dataset.tab);
    });
  });

  // ============ SEARCH & FILTER ============
  // Assessments search and filter
  document.getElementById('assessmentsSearch').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filter = document.getElementById('assessmentsFilter').value;
    const items = document.querySelectorAll('#assessmentsContent > div');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const type = item.dataset.type;
      const matchesSearch = text.includes(searchTerm);
      const matchesFilter = !filter || type === filter;
      item.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
  });

  document.getElementById('assessmentsFilter').addEventListener('change', function() {
    const filter = this.value;
    const searchTerm = document.getElementById('assessmentsSearch').value.toLowerCase();
    const items = document.querySelectorAll('#assessmentsContent > div');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const type = item.dataset.type;
      const matchesSearch = text.includes(searchTerm);
      const matchesFilter = !filter || type === filter;
      item.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
  });

  // Training search and filter
  document.getElementById('trainingSearch').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filter = document.getElementById('trainingFilter').value;
    const items = document.querySelectorAll('#trainingContent > div');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const level = item.dataset.level;
      const matchesSearch = text.includes(searchTerm);
      const matchesFilter = !filter || level === filter;
      item.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
  });

  document.getElementById('trainingFilter').addEventListener('change', function() {
    const filter = this.value;
    const searchTerm = document.getElementById('trainingSearch').value.toLowerCase();
    const items = document.querySelectorAll('#trainingContent > div');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const level = item.dataset.level;
      const matchesSearch = text.includes(searchTerm);
      const matchesFilter = !filter || level === filter;
      item.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
  });

  // Mentorship search and filter
  document.getElementById('mentorshipSearch').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filter = document.getElementById('mentorshipFilter').value;
    const items = document.querySelectorAll('#mentorshipContent > div');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const rating = parseFloat(item.dataset.rating);
      const availability = item.dataset.availability;
      const matchesSearch = text.includes(searchTerm);
      let matchesFilter = !filter;
      
      if (filter === 'high-rating') matchesFilter = rating >= 4.8;
      else if (filter === 'available') matchesFilter = availability !== 'Flexible';
      else if (filter === 'flexible') matchesFilter = availability === 'Flexible';
      
      item.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
  });

  document.getElementById('mentorshipFilter').addEventListener('change', function() {
    const filter = this.value;
    const searchTerm = document.getElementById('mentorshipSearch').value.toLowerCase();
    const items = document.querySelectorAll('#mentorshipContent > div');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const rating = parseFloat(item.dataset.rating);
      const availability = item.dataset.availability;
      const matchesSearch = text.includes(searchTerm);
      let matchesFilter = !filter;
      
      if (filter === 'high-rating') matchesFilter = rating >= 4.8;
      else if (filter === 'available') matchesFilter = availability !== 'Flexible';
      else if (filter === 'flexible') matchesFilter = availability === 'Flexible';
      
      item.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
  });

  // Jobs search and filter
  document.getElementById('jobsSearch').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filter = document.getElementById('jobsFilter').value;
    const items = document.querySelectorAll('#jobsContent > div');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const type = item.dataset.type;
      const matchesSearch = text.includes(searchTerm);
      const matchesFilter = !filter || type === filter;
      item.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
  });

  document.getElementById('jobsFilter').addEventListener('change', function() {
    const filter = this.value;
    const searchTerm = document.getElementById('jobsSearch').value.toLowerCase();
    const items = document.querySelectorAll('#jobsContent > div');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const type = item.dataset.type;
      const matchesSearch = text.includes(searchTerm);
      const matchesFilter = !filter || type === filter;
      item.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
  });
});
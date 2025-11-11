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
    document.getElementById('userNameDisplay').textContent = this.currentUser.name;
    const profileCard = `
      <div class="profile-info">
        <div class="profile-info-item">
          <strong>Name</strong>
          <p>${this.currentUser.name}</p>
        </div>
        <div class="profile-info-item">
          <strong>Email</strong>
          <p>${this.currentUser.email}</p>
        </div>
        <div class="profile-info-item">
          <strong>Role</strong>
          <p>${this.currentUser.role || 'User'}</p>
        </div>
        <div class="profile-info-item">
          <strong>Member Since</strong>
          <p>${new Date(this.currentUser.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    `;
    document.getElementById('profileContent').innerHTML = profileCard;
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
  document.getElementById('logoutBtn').addEventListener('click', () => {
    app.logout();
  });

  // ============ DASHBOARD NAV ============
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      app.switchTab(this.dataset.tab);
    });
  });
});

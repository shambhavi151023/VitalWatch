/* ─── STATE ─── */
let currentRole = 'patient';
let sessionTimerInterval = null;

/*
   ROLE SELECTION (Login Page)
 */
function selectRole(el, role) {
  // Deselect all role options
  document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
  // Select clicked option
  el.classList.add('selected');
  currentRole = role;
  // Update email placeholder based on role
  const emailInput = document.getElementById('login-email');
  if (emailInput) {
    emailInput.value = role === 'clinician'
      ? 'sarah.chen@hospital.com'
      : 'john.doe@gmail.com';
  }
}

/*
   LOGIN HANDLER
*/
function handleLogin(e) {
  e.preventDefault();
  const btn   = document.getElementById('login-btn');
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;

  // Basic validation
  if (!email || !pass) {
    showToast('Please fill in all fields.', 'error');
    return;
  }
  if (pass.length < 6) {
    showToast('Password must be at least 6 characters.', 'error');
    return;
  }

  // Simulate loading state
  btn.textContent = 'Signing in…';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Sign In →';
    btn.disabled = false;

    if (currentRole === 'clinician') {
      showPage('page-clinician');
      showToast('Welcome back, Dr. Sarah Chen! 5 sessions pending review.', 'success');
    } else {
      showPage('page-patient');
      showToast('Welcome back, John! You have 2 new messages from Dr. Chen.', 'success');
    }
  }, 1000);
}

/*
   HOSPITAL SSO LOGIN
 */
function ssoLogin() {
  showToast('Redirecting to Hospital SSO portal…', 'info');
  setTimeout(() => {
    showPage('page-clinician');
    showToast('✓ Signed in via Hospital SSO as Dr. Sarah Chen', 'success');
  }, 1600);
}

/* 
   LOGOUT
 */
function logout() {
  // Stop session timer if running
  if (sessionTimerInterval) {
    clearInterval(sessionTimerInterval);
    sessionTimerInterval = null;
  }
  showToast('Signed out successfully. Stay safe!', 'info');
  setTimeout(() => showPage('page-login'), 700);
}

/* 
   PAGE NAVIGATION
 */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(id);
  if (page) {
    page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function goToVerify() {
  showPage('page-verify');
  showToast("Loading John Doe's keyframe session…", 'info');
}

function goToClinicianDash() {
  showPage('page-clinician');
}

/*
   SESSION START MODAL
 */
function startSession() {
  closeModal('session-modal');
  showToast('Session started! First keyframe will capture at a randomized interval.', 'success');
  showPage('page-patient');
  startSessionTimer();
}

function startSessionTimer() {
  // Clear any existing timer
  if (sessionTimerInterval) clearInterval(sessionTimerInterval);

  let secs = 582; // Start at 9 min 42 sec (where the demo is)
  const timerEl = document.getElementById('timer');

  sessionTimerInterval = setInterval(() => {
    secs++;
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    if (timerEl) timerEl.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

/* 
   KEYFRAME VERIFICATION ACTIONS
*/
function approveSession() {
  closeModal('approve-modal');
  showToast('✓ Session approved — John Doe has been notified.', 'success');
  setTimeout(() => showPage('page-clinician'), 1200);
}

function rejectSession() {
  closeModal('reject-modal');
  showToast('Session rejected — patient notified to redo their session.', 'error');
  setTimeout(() => showPage('page-clinician'), 1200);
}

/*
   MODAL HELPERS
*/
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('hidden');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

/* Close modal when clicking the dark overlay */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) {
        this.classList.add('hidden');
      }
    });
  });

  /* Close modal on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => {
        m.classList.add('hidden');
      });
    }
  });

  /* ─── FILTER TABS (interactive) ─── */
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      const group = this.closest('.filter-tabs');
      if (group) {
        group.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  /* ─── TOP NAV TABS (interactive) ─── */
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      // Skip "Back" buttons
      if (this.textContent.includes('Back')) return;
      const group = this.closest('.nav-tabs');
      if (group) {
        group.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  /* ─── SIDEBAR NAV ITEMS (interactive) ─── */
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function () {
      const sidebar = this.closest('.sidebar');
      if (!sidebar) return;
      sidebar.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ─── VERIFY SIDEBAR ITEMS (interactive) ─── */
  document.querySelectorAll('.vs-item').forEach(item => {
    item.addEventListener('click', function () {
      document.querySelectorAll('.vs-item').forEach(v => v.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ─── SEND MESSAGE (patient dashboard) ─── */
  const msgInput = document.getElementById('msg-input');
  const msgSendBtn = document.getElementById('msg-send');
  if (msgSendBtn && msgInput) {
    msgSendBtn.addEventListener('click', () => {
      const text = msgInput.value.trim();
      if (!text) return;
      showToast('Message sent to Dr. Chen ✓', 'success');
      msgInput.value = '';
    });
    msgInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        msgSendBtn.click();
      }
    });
  }
});

/* 
   TOAST NOTIFICATION SYSTEM
= */
/**
 * Shows a toast notification.
 * @param {string} msg  - The message to display
 * @param {string} type - 'success' | 'error' | 'info'
 */
function showToast(msg, type = 'info') {
  const wrap = document.getElementById('toast-wrap');
  if (!wrap) return;

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${msg}</span>`;
  wrap.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
    toast.style.transition = 'opacity .3s, transform .3s';
    setTimeout(() => toast.remove(), 320);
  }, 2800);
}

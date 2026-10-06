/**
 * Abhay Navale - Portfolio Interactive Engine
 * Micro-interactions, Scroll-driven reveals, Architecture Visualizer & Counters
 * Mobile-First Touch & Responsive Optimizations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollSpy();
  initScrollReveals();
  initCounterAnimations();
  initClipboardCopy();
  initArchitecturePlayground();
  initSkillFilters();
  initCard3DTilt();
});

/* --- Header & Mobile Drawer --- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerLinks = document.querySelectorAll('.mobile-drawer a');

  // Sticky header blur effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer when link clicked
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        drawer.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
}

/* --- ScrollSpy Navigation --- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-25% 0px -65% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}

/* --- Scroll-Driven Reveals --- */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --- Proof of Scale Counter Animations --- */
function initCounterAnimations() {
  const counterElements = document.querySelectorAll('.stat-number[data-target]');
  if (!counterElements.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counterElements.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target') || '0');
          const duration = 1600; // ms
          const startTime = performance.now();
          const isDecimal = target % 1 !== 0;

          function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeOutProgress * target;

            if (isDecimal) {
              counter.textContent = currentVal.toFixed(1);
            } else {
              counter.textContent = Math.floor(currentVal).toLocaleString();
            }

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              counter.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
            }
          }

          requestAnimationFrame(updateNumber);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const parent = document.querySelector('.proof-strip');
  if (parent) observer.observe(parent);
}

/* --- One-Click Email Copy with Toast Feedback --- */
function initClipboardCopy() {
  const copyBtns = document.querySelectorAll('[data-copy-text]');
  const toast = document.getElementById('toastNotice');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy-text') || 'navale.abhay12@gmail.com';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Email: ${textToCopy}`);
        });
      } else {
        showToast(`Email: ${textToCopy}`);
      }
    });
  });

  function showToast(msg) {
    if (!toast) return;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${msg}</span>
    `;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/* --- Interactive Architecture Playground --- */
function initArchitecturePlayground() {
  const tabBtns = document.querySelectorAll('.arch-tab-btn');
  const detailsTitle = document.getElementById('archDetailTitle');
  const detailsDesc = document.getElementById('archDetailDesc');
  const diagramContainer = document.getElementById('archDiagram');

  if (!diagramContainer || !tabBtns.length) return;

  const architectures = {
    auth: {
      title: "Multi-Tenant Authentication & Dynamic Routing Gateway",
      description: "A centralized ASP.NET Core gateway that accepts enterprise mobile/web requests, authenticates identity against a shared routing DB, and dynamically redirects each enterprise client to their dedicated isolated backend instance with decoupled token security.",
      nodes: [
        { icon: "📱", title: "Enterprise Client App", tag: "Angular / Mobile", desc: "Sends JWT / Credentials with client tenant code header" },
        { icon: "🛡️", title: "Auth Gateway", tag: ".NET Core API", desc: "Centralized entrypoint; rate limiting, payload validation" },
        { icon: "🔀", title: "Tenant Router", tag: "Shared DB & In-Memory", desc: "Maps client code to dedicated server endpoints" },
        { icon: "🏢", title: "Dedicated Enterprise DB", tag: "SQL Server (Isolated)", desc: "Isolated schema guaranteeing strict data isolation" }
      ]
    },
    loan: {
      title: "State Bank of India: Multi-Level Loan Approval Engine",
      description: "Microservice-oriented workflow digitizing loan applications and approvals for over 100,000 State Bank of India employees. Features multi-level clearance workflows and ISD-audited end-to-end data encryption protocols.",
      nodes: [
        { icon: "🏦", title: "SBI Employee Portal", tag: "Angular Client", desc: "Initiates loan lifecycle request with encrypted attachments" },
        { icon: "⚙️", title: "Loan Microservice", tag: ".NET Core", desc: "Enforces business rules, eligibility criteria & multi-level state machine" },
        { icon: "🔐", title: "ISD Security Guard", tag: "AES Cryptography", desc: "Zero-repeat findings; end-to-end payload encryption" },
        { icon: "💾", title: "Core Financial DB", tag: "SQL Server", desc: "Normalized records optimized for sub-3-second report queries" }
      ]
    },
    event: {
      title: "Real-Time Event-Driven Punch & Attendance Engine",
      description: "An event-driven Windows Service pipeline utilizing pub/sub patterns to capture biometric attendance events across multi-location enterprise facilities in real time, automatically executing shift-tolerance rules and dispatching immediate email alerts.",
      nodes: [
        { icon: "⏱️", title: "Biometric Hardware", tag: "Punch Terminals", desc: "Emits shift punch events and raw timestamps" },
        { icon: "⚡", title: "Event Listener", tag: "Windows Service", desc: "Asynchronously processes incoming punches via Pub/Sub" },
        { icon: "🧮", title: "Tolerance Engine", tag: "T-SQL / ADO.NET", desc: "Evaluates grace periods, shifts, and overtimes" },
        { icon: "📧", title: "Alert Dispatcher", tag: "SignalR & SMTP", desc: "Pushes real-time dashboard updates & manager emails" }
      ]
    }
  };

  function renderNodes(key) {
    const data = architectures[key];
    if (!data) return;

    if (detailsTitle) detailsTitle.textContent = data.title;
    if (detailsDesc) detailsDesc.textContent = data.description;

    diagramContainer.innerHTML = '';
    data.nodes.forEach((node, index) => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'flow-node' + (index === 0 ? ' active-node' : '');
      nodeEl.innerHTML = `
        <div class="node-icon">${node.icon}</div>
        <div class="node-title">${node.title}</div>
        <div class="node-tag">${node.tag}</div>
      `;

      nodeEl.addEventListener('click', () => {
        document.querySelectorAll('.flow-node').forEach(n => n.classList.remove('active-node'));
        nodeEl.classList.add('active-node');
        if (detailsDesc) {
          detailsDesc.innerHTML = `<strong>${node.title} (${node.tag}):</strong> ${node.desc}`;
        }
      });

      diagramContainer.appendChild(nodeEl);

      if (index < data.nodes.length - 1) {
        const connector = document.createElement('div');
        connector.className = 'flow-connector';
        connector.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        diagramContainer.appendChild(connector);
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const archKey = btn.getAttribute('data-arch') || 'auth';
      renderNodes(archKey);
    });
  });

  // Render initial
  renderNodes('auth');
}

/* --- Skills Matrix Filtering --- */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.skill-tab-btn');
  const cards = document.querySelectorAll('.bento-skill-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --- 3D Card Tilt Physics --- */
function initCard3DTilt() {
  // Only on non-touch devices with hover support
  if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('.terminal-card, .case-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

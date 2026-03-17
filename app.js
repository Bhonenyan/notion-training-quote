// ═══════════════════════════════════════════
//  Notion Training Quotation — Auto Pricing
// ═══════════════════════════════════════════

(function () {
  'use strict';

  // ── Pricing tiers ──────────────────────────
  const PRICING = {
    'one-on-one': {
      price: 1000000,
      duration: '1.5 Hours',
      label: '1-on-1 Private Training',
      tier: ''
    },
    'group': [
      { min: 2, max: 5,  price: 2000000, tier: '2–5 participants' },
      { min: 6, max: 10, price: 3000000, tier: '6–10 participants' },
      { min: 11, max: 20, price: 4000000, tier: '11–20 participants' },
      { min: 21, max: 50, price: 5000000, tier: '21+ participants' },
    ]
  };

  // ── DOM Elements ───────────────────────────
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const groupSizeField = document.getElementById('groupSizeField');
  const groupSizeInput = document.getElementById('groupSize');
  const decreaseBtn = document.getElementById('decreaseBtn');
  const increaseBtn = document.getElementById('increaseBtn');
  const sizeHint = document.getElementById('sizeHint');
  const sessionLabel = document.getElementById('sessionLabel');
  const durationLabel = document.getElementById('durationLabel');
  const participantsRow = document.getElementById('participantsRow');
  const participantsLabel = document.getElementById('participantsLabel');
  const priceNumber = document.getElementById('priceNumber');
  const priceTier = document.getElementById('priceTier');

  let currentType = 'one-on-one';
  let groupSize = 5;

  // ── Format number with commas ──────────────
  function formatNumber(n) {
    return n.toLocaleString('en-US');
  }

  // ── Animate price counter ──────────────────
  function animatePrice(target) {
    const el = priceNumber;
    const current = parseInt(el.textContent.replace(/,/g, ''), 10) || 0;
    const diff = target - current;
    const duration = 400;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(current + diff * eased);
      el.textContent = formatNumber(value);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // ── Get group price tier ───────────────────
  function getGroupTier(size) {
    for (const tier of PRICING.group) {
      if (size >= tier.min && size <= tier.max) {
        return tier;
      }
    }
    // Over 50 — use max tier
    return PRICING.group[PRICING.group.length - 1];
  }

  // ── Update hint text ───────────────────────
  function updateHint(size) {
    const tier = getGroupTier(size);
    if (tier) {
      sizeHint.textContent = tier.tier;
    }
  }

  // ── Update quote display ───────────────────
  function updateQuote() {
    if (currentType === 'one-on-one') {
      sessionLabel.textContent = PRICING['one-on-one'].label;
      durationLabel.textContent = PRICING['one-on-one'].duration;
      participantsRow.style.display = 'none';
      priceTier.textContent = PRICING['one-on-one'].tier;
      animatePrice(PRICING['one-on-one'].price);
    } else {
      const tier = getGroupTier(groupSize);
      sessionLabel.textContent = 'Group Training Session';
      durationLabel.textContent = '2 Hours';
      participantsRow.style.display = 'flex';
      participantsLabel.textContent = groupSize;
      priceTier.textContent = tier.tier;
      animatePrice(tier.price);
    }
  }

  // ── Toggle session type ────────────────────
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      currentType = btn.dataset.type;

      if (currentType === 'group') {
        groupSizeField.style.display = 'block';
        // Trigger reflow for animation
        groupSizeField.offsetHeight;
        groupSizeField.classList.remove('hidden');
        groupSizeField.classList.add('visible');
      } else {
        groupSizeField.classList.remove('visible');
        groupSizeField.classList.add('hidden');
        setTimeout(() => {
          if (currentType !== 'group') {
            groupSizeField.style.display = 'none';
          }
        }, 350);
      }

      updateQuote();
    });
  });

  // ── Stepper controls ───────────────────────
  function setGroupSize(val) {
    groupSize = Math.max(2, Math.min(50, val));
    groupSizeInput.value = groupSize;
    updateHint(groupSize);
    updateQuote();
  }

  decreaseBtn.addEventListener('click', () => setGroupSize(groupSize - 1));
  increaseBtn.addEventListener('click', () => setGroupSize(groupSize + 1));

  groupSizeInput.addEventListener('input', () => {
    const val = parseInt(groupSizeInput.value, 10);
    if (!isNaN(val)) {
      setGroupSize(val);
    }
  });

  groupSizeInput.addEventListener('blur', () => {
    const val = parseInt(groupSizeInput.value, 10);
    if (isNaN(val) || val < 2) {
      setGroupSize(2);
    } else if (val > 50) {
      setGroupSize(50);
    }
  });

  // ── Dark mode toggle ───────────────────────
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme() {
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.setAttribute('aria-label', 'Switch to ' + (isDark ? 'light' : 'dark') + ' mode');
    themeToggle.innerHTML = isDark
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  applyTheme();

  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    applyTheme();
  });

  // ── Init ───────────────────────────────────
  updateHint(groupSize);
  updateQuote();

})();

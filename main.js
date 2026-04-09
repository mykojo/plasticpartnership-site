// Plastic Partnership - Main JS

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      mobile.classList.toggle('open');
    });
  }

  // Active nav link
  const links = document.querySelectorAll('.nav-links a, .nav-mobile a');
  links.forEach(link => {
    if (link.href === window.location.href) link.classList.add('active');
  });

  // Animated counters
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.done) {
          entry.target.dataset.done = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => observer.observe(c));
  }
});

function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Yield calculator
function calcYield() {
  const costA  = parseFloat(document.getElementById('costA')?.value) || 0;
  const yieldA = parseFloat(document.getElementById('yieldA')?.value) || 95;
  const costB  = parseFloat(document.getElementById('costB')?.value) || 0;
  const yieldB = parseFloat(document.getElementById('yieldB')?.value) || 75;

  if (!costA || !costB) return;

  const effA = costA / (yieldA / 100);
  const effB = costB / (yieldB / 100);
  const saving = effB - effA;

  document.getElementById('calcEffA').textContent = '$' + effA.toFixed(2);
  document.getElementById('calcEffB').textContent = '$' + effB.toFixed(2);
  document.getElementById('calcSaving').textContent = saving > 0
    ? `PP bales save you $${saving.toFixed(2)} per tonne in equivalent effective cost`
    : `Current supplier is $${Math.abs(saving).toFixed(2)} per tonne more effective`;

  const resultBox = document.getElementById('calcResult');
  if (resultBox) resultBox.style.display = 'block';
}

// Contact form via Formspree (replace FORM_ID with your actual Formspree ID)
async function submitForm(e, formId) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('button[type=submit]');
  const successEl = form.querySelector('.form-success');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  try {
    const resp = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (resp.ok) {
      form.reset();
      if (successEl) { successEl.style.display = 'block'; }
      btn.textContent = 'Sent!';
    } else {
      btn.textContent = 'Error — try again';
      btn.disabled = false;
    }
  } catch {
    btn.textContent = 'Error — try again';
    btn.disabled = false;
  }
}

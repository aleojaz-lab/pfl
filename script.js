(function () {
  'use strict';

  var CONTACT_EMAIL = 'your.email@example.com';
  var ROLES = ['BSIT Student', 'Data Visualization Learner', 'Web Enthusiast', 'Simple Designer', 'Team Supporter'];

  var nav = document.getElementById('nav');
  var toggle = document.querySelector('.nav-toggle');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    links.forEach(function (link) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) spy.observe(target);
    });

    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  var typedEl = document.querySelector('.typed');
  var roleIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function type() {
    var word = ROLES[roleIndex];
    charIndex += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, charIndex);

    var wait = deleting ? 40 : 85;
    if (!deleting && charIndex === word.length) {
      deleting = true;
      wait = 1500;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % ROLES.length;
      wait = 350;
    }
    setTimeout(type, wait);
  }

  if (reduceMotion) {
    typedEl.textContent = ROLES[0];
  } else {
    type();
  }

  document.addEventListener('pointermove', function (event) {
    var glass = event.target.closest ? event.target.closest('.glass') : null;
    if (!glass) return;
    var rect = glass.getBoundingClientRect();
    glass.style.setProperty('--mx', event.clientX - rect.left + 'px');
    glass.style.setProperty('--my', event.clientY - rect.top + 'px');
  }, { passive: true });

  var filters = document.querySelectorAll('.filter');
  var skills = document.querySelectorAll('.skill');

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      var group = button.getAttribute('data-filter');
      filters.forEach(function (b) {
        b.classList.toggle('active', b === button);
      });
      skills.forEach(function (skill) {
        var show = group === 'all' || skill.getAttribute('data-cat') === group;
        skill.classList.toggle('hide', !show);
        if (show) skill.classList.add('visible');
      });
    });
  });

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox.querySelector('img');
  var closeBtn = lightbox.querySelector('.lb-close');

  document.querySelectorAll('.cert-media').forEach(function (media) {
    var img = media.querySelector('img');

    function markMissing() {
      media.classList.add('missing');
    }

    img.addEventListener('error', markMissing);
    if (img.complete && img.naturalWidth === 0) markMissing();

    media.addEventListener('click', function () {
      if (media.classList.contains('missing')) return;
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      } else {
        lightbox.setAttribute('open', '');
      }
    });
  });

  function closeLightbox() {
    if (typeof lightbox.close === 'function') {
      lightbox.close();
    } else {
      lightbox.removeAttribute('open');
    }
  }

  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  var form = document.getElementById('contact-form');
  var note = form.querySelector('.form-note');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;
    var valid = true;

    [name, email, message].forEach(function (field) {
      var ok = field.value.trim() !== '' && (field !== email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()));
      field.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });

    note.classList.toggle('error', !valid);

    if (!valid) {
      note.textContent = 'Please fill in every field with a valid email.';
      return;
    }

    var subject = 'Portfolio message from ' + name.value.trim();
    var body = message.value.trim() + '\n\n' + name.value.trim() + '\n' + email.value.trim();
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Opening your email app...';
    form.reset();
  });

  form.addEventListener('input', function (event) {
    event.target.classList.remove('invalid');
  });
})();
document.addEventListener('DOMContentLoaded', function () {

  // Navbar scroll
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Hamburger
  var hb = document.getElementById('hamburger');
  var nl = document.getElementById('navLinks');
  if (hb && nl) {
    hb.addEventListener('click', function () {
      nl.classList.toggle('open');
      hb.classList.toggle('open');
    });
    nl.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nl.classList.remove('open');
        hb.classList.remove('open');
      });
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(this.getAttribute('href'));
      if (t) {
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 70, behavior: 'smooth' });
      }
    });
  });

  // Form
  var form = document.getElementById('contactForm');
  if (form) {
    var fs = document.getElementById('formSuccess');
    var fe = document.getElementById('formError');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      fs.classList.remove('show');
      fe.classList.remove('show');
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Gonderiliyor...';
      fetch('php/contact.php', { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (j) { j.success ? fs.classList.add('show') : fe.classList.add('show'); })
        .catch(function () { fe.classList.add('show'); })
        .finally(function () { btn.disabled = false; btn.textContent = 'Mesaj Gonder'; });
    });
  }

  // Scroll animasyon
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.hcard,.cinfo-card').forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.4s ease ' + (i * 0.08) + 's, transform 0.4s ease ' + (i * 0.08) + 's';
      obs.observe(el);
    });
  }

  // Hero Slider
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hdot');
  var cur = 0;

  window.goSlide = function (n) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = n;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
  };

  if (slides.length > 1) {
    setInterval(function () {
      window.goSlide((cur + 1) % slides.length);
    }, 4000);
  }

});

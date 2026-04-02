// ===================================
//  BURAK OTO KURTARICI — main.js
// ===================================

document.addEventListener('DOMContentLoaded', function () {

  // 1) Navbar — scroll'da gölge ekle
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // 2) Mobil hamburger menü
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
    });
    // Menü linkine tıklanınca menüyü kapat
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  // 3) Smooth scroll (anchor linkler)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // 4) İletişim formu — AJAX ile php/contact.php'ye gönderir
  //    NOT: Bu sadece hosting'te çalışır, local'de hata verir — normal!
  var form        = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  var formError   = document.getElementById('formError');
  var submitBtn   = form ? form.querySelector('button[type="submit"]') : null;

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      formSuccess.classList.remove('show');
      formError.classList.remove('show');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Gönderiliyor...'; }

      fetch('php/contact.php', {
        method: 'POST',
        body: new FormData(form)
      })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.success) {
          formSuccess.classList.add('show');
          form.reset();
        } else {
          formError.classList.add('show');
        }
      })
      .catch(function () {
        formError.classList.add('show');
      })
      .finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Gönder'; }
      });
    });
  }

  // 5) Scroll animasyonu — elementler görünce yukarı çıkar
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scard, .rcard, .step, .astat-card, .cinfo-item').forEach(function (el, i) {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease ' + (i * 0.06) + 's, transform 0.5s ease ' + (i * 0.06) + 's';
      observer.observe(el);
    });
  }

});

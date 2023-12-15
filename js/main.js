(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio box mouse movement hover
   */

  document.querySelectorAll('.portfolio .portfolio-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const xAxis = -(e.clientY - rect.top - item.clientHeight / 2) / 10;
      const yAxis = (e.clientX - rect.left - item.clientWidth / 2) / 10;
  
      item.style.transition = 'transform 0.1s';
      item.style.transform = `perspective(1000px) rotateX(${xAxis}deg) rotateY(${yAxis}deg) scale3d(1.1, 1.1, 1.1)`;
    });
  
    item.addEventListener('mouseleave', () => {
      item.style.transition = 'transform 0.5s';
      item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
  
/**
 * Portfolio title hover
 */
document.addEventListener("DOMContentLoaded", function () {
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  document.addEventListener("mousemove", function (e) {
    const windowCenterX = window.innerWidth / 2;
    const windowCenterY = window.innerHeight / 2;

    portfolioItems.forEach(function (item) {
      const title = item.querySelector(".project-meta");

      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const itemCenterY = rect.top + rect.height / 2;

      const distanceX = e.clientX - itemCenterX;
      const distanceY = e.clientY - itemCenterY;

      const titlePosX = (distanceX / windowCenterX) * 20;
      const titlePosY = (distanceY / windowCenterY) * 20;

      const titleTranslateX = Math.min(Math.max(titlePosX, -20), 20);
      const titleTranslateY = Math.min(Math.max(titlePosY, -20), 20);

      title.style.transform = `translate(${titleTranslateX}px, ${titleTranslateY}px)`;
    });
  });

/**
 * Gallery image hover
 */
document.querySelectorAll('#gallery .gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const xAxis = -(e.clientY - rect.top - item.clientHeight / 2) / 30;
    const yAxis = (e.clientX - rect.left - item.clientWidth / 2) / 30;

    item.style.transition = 'transform 0.1s';
    item.style.transform = `perspective(1000px) rotateX(${xAxis}deg) rotateY(${yAxis}deg) scale3d(1.1, 1.1, 1.1)`;
  });

  item.addEventListener('mouseleave', () => {
    item.style.transition = 'transform 0.5s';
    item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});

/**
 * About image hover
 */
document.querySelectorAll('#about .image').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const xAxis = -(e.clientY - rect.top - item.clientHeight / 2) / 15;
    const yAxis = (e.clientX - rect.left - item.clientWidth / 2) / 15;

    item.style.transition = 'transform 0.1s';
    item.style.transform = `perspective(1000px) rotateX(${xAxis}deg) rotateY(${yAxis}deg) scale3d(1.1, 1.1, 1.1)`;
  });

  item.addEventListener('mouseleave', () => {
    item.style.transition = 'transform 0.5s';
    item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});

  // Reset title positions on mouse leave
  document.addEventListener("mouseleave", function () {
    portfolioItems.forEach(function (item) {
      const title = item.querySelector(".project-meta");
      title.style.transform = "translate(0, 0)";
    });
  });
});

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

  /**
   * Horizontal auto scroll for navigation menu
   */

  $(document).ready(function () {
    // Smooth scrolling when clicking on a navigation link
    $('.nav-menu a').on('click', function (e) {
      e.preventDefault();
  
      var targetSection = $(this).attr('href');
      var targetOffset = $(targetSection).offset().left - $('.nav-menu').width();
  
      $('html, body').animate({
        scrollLeft: targetOffset
      }, {
        duration: 800,
        complete: function () {
          // Highlight the active section after scrolling
          $('.nav-menu a').removeClass('active');
          $(this).addClass('active');
        }
      });
    });
  });  

})()
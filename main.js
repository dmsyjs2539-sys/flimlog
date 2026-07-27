/**
 * FILM LOG - 공통 스크립트
 */
(function () {
  'use strict';

  var siteHeader = document.getElementById('site_header');
  var heroVisual = document.querySelector('.hero_visual');

  if (!siteHeader) {
    return;
  }

  /**
   * 히어로 비주얼을 벗어나면 헤더를 크림 배경 + 진한 글자 상태로 전환한다.
   * 히어로 위에서는 흰 글자를 유지해야 하므로 스크롤 위치로만 판단한다.
   */
  function handleHeaderScroll() {
    var threshold = heroVisual ? heroVisual.offsetHeight - siteHeader.offsetHeight : 0;
    var isScrolled = window.scrollY > threshold;

    siteHeader.classList.toggle('is_scrolled', isScrolled);
  }

  var isTicking = false;

  function requestHeaderScroll() {
    if (isTicking) {
      return;
    }

    isTicking = true;
    window.requestAnimationFrame(function () {
      handleHeaderScroll();
      isTicking = false;
    });
  }

  window.addEventListener('scroll', requestHeaderScroll, { passive: true });
  window.addEventListener('resize', requestHeaderScroll);
  handleHeaderScroll();
})();

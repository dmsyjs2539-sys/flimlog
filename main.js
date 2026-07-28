/**
 * FILM LOG - 공통 스크립트
 */
(function () {
  'use strict';

  /* -------------------------------------------------------
     헤더: 히어로를 벗어나면 크림 배경 + 진한 글자로 전환
     ------------------------------------------------------- */
  function initHeader() {
    var siteHeader = document.getElementById('site_header');
    var heroVisual = document.querySelector('.hero_visual');

    if (!siteHeader) {
      return;
    }

    function applyHeaderState() {
      var threshold = heroVisual ? heroVisual.offsetHeight - siteHeader.offsetHeight : 0;
      siteHeader.classList.toggle('is_scrolled', window.scrollY > threshold);
    }

    var isTicking = false;

    function requestHeaderState() {
      if (isTicking) {
        return;
      }

      isTicking = true;
      window.requestAnimationFrame(function () {
        applyHeaderState();
        isTicking = false;
      });
    }

    window.addEventListener('scroll', requestHeaderState, { passive: true });
    window.addEventListener('resize', requestHeaderState);
    applyHeaderState();
  }

  /* -------------------------------------------------------
     모바일 헤더: 햄버거 드로어 / 검색창 토글
     ------------------------------------------------------- */
  function initMobileHeader() {
    var navToggle = document.getElementById('nav_toggle');
    var searchToggle = document.getElementById('search_toggle');
    var globalNav = document.getElementById('global_nav');
    var searchBox = document.querySelector('.search_box');
    var searchInput = document.getElementById('search_input');

    if (!navToggle || !globalNav) {
      return;
    }

    function setPanel(button, panel, isOpen, openLabel, closeLabel) {
      panel.classList.toggle('is_open', isOpen);
      button.setAttribute('aria-expanded', String(isOpen));
      button.setAttribute('aria-label', isOpen ? closeLabel : openLabel);
    }

    function closeNav() {
      setPanel(navToggle, globalNav, false, '메뉴 열기', '메뉴 닫기');
    }

    function closeSearch() {
      if (searchToggle && searchBox) {
        setPanel(searchToggle, searchBox, false, '검색 열기', '검색 닫기');
      }
    }

    navToggle.addEventListener('click', function () {
      var willOpen = navToggle.getAttribute('aria-expanded') !== 'true';

      closeSearch();
      setPanel(navToggle, globalNav, willOpen, '메뉴 열기', '메뉴 닫기');
    });

    if (searchToggle && searchBox) {
      searchToggle.addEventListener('click', function () {
        var willOpen = searchToggle.getAttribute('aria-expanded') !== 'true';

        closeNav();
        setPanel(searchToggle, searchBox, willOpen, '검색 열기', '검색 닫기');

        if (willOpen && searchInput) {
          searchInput.focus();
        }
      });
    }

    /* 메뉴 이동, ESC, 바깥 클릭, 데스크톱 복귀 시 닫는다 */
    globalNav.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') {
        closeNav();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeNav();
        closeSearch();
      }
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.header_inner')) {
        closeNav();
        closeSearch();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) {
        closeNav();
        closeSearch();
      }
    });
  }

  /* -------------------------------------------------------
     갤러리 캐러셀
     active 슬라이드가 바뀌면 좌측 [FILM ARCHIVE] 정보와
     우측 하단 캡션을 그 슬라이드의 data-slide_* 값으로 갱신한다.
     ------------------------------------------------------- */
  function initGalleryCarousel() {
    var track = document.getElementById('carousel_track');

    if (!track) {
      return;
    }

    var slides = Array.prototype.slice.call(track.querySelectorAll('.carousel_slide'));

    if (!slides.length) {
      return;
    }

    var section = track.closest('.gallery_section') || document;
    var fields = Array.prototype.slice.call(section.querySelectorAll('[data-slide_field]'));
    var buttons = Array.prototype.slice.call(section.querySelectorAll('[data-carousel_step]'));
    var totalLabel = section.querySelector('.carousel_total');
    var activeIndex = 0;

    function padNumber(value) {
      return value < 10 ? '0' + value : String(value);
    }

    if (totalLabel) {
      totalLabel.textContent = padNumber(slides.length);
    }

    /** 슬라이드의 data-slide_* 값을 [data-slide_field] 요소에 반영 */
    function render(index) {
      var slide = slides[index];

      if (!slide) {
        return;
      }

      activeIndex = index;
      buttons.forEach(function (button) {
        button.disabled = false;
      });

      fields.forEach(function (field) {
        var key = field.getAttribute('data-slide_field');
        var value = slide.getAttribute('data-slide_' + key);

        if (value !== null) {
          field.textContent = value;
        }
      });

      slides.forEach(function (item, itemIndex) {
        item.classList.toggle('is_active', itemIndex === index);
      });
    }

    /* 끝에서 막지 않고 순환한다 */
    function goTo(index) {
      render((index + slides.length) % slides.length);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        goTo(activeIndex + Number(button.getAttribute('data-carousel_step')));
      });
    });

    /* 터치 스와이프 - 스크롤 스냅 없이도 좌우로 넘길 수 있게 한다 */
    var touchStartX = null;

    track.addEventListener(
      'touchstart',
      function (event) {
        touchStartX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );

    track.addEventListener(
      'touchend',
      function (event) {
        if (touchStartX === null) {
          return;
        }

        var deltaX = event.changedTouches[0].clientX - touchStartX;

        if (Math.abs(deltaX) > 40) {
          goTo(activeIndex + (deltaX < 0 ? 1 : -1));
        }

        touchStartX = null;
      },
      { passive: true }
    );

    render(0);
  }

  /* -------------------------------------------------------
     아카이브 슬라이더: 이전/다음 버튼과 썸네일 4장이 같은 인덱스를 순환 공유
     ------------------------------------------------------- */
  function initArchiveSlider() {
    var slider = document.getElementById('archive_slider');

    if (!slider) {
      return;
    }

    var frames = Array.prototype.slice.call(slider.querySelectorAll('.archive_frame'));
    var thumbs = Array.prototype.slice.call(slider.querySelectorAll('.archive_thumb'));
    var buttons = Array.prototype.slice.call(slider.querySelectorAll('[data-archive_step]'));

    if (frames.length < 2) {
      return;
    }

    var activeIndex = 0;

    function render(index) {
      activeIndex = (index + frames.length) % frames.length;

      frames.forEach(function (frame, frameIndex) {
        frame.classList.toggle('is_active', frameIndex === activeIndex);
      });

      /* 썸네일은 1번 프레임부터 대응하므로 인덱스를 한 칸 당겨 맞춘다 */
      thumbs.forEach(function (thumb) {
        var target = Number(thumb.getAttribute('data-archive_index'));
        thumb.classList.toggle('is_active', target === activeIndex);
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        render(activeIndex + Number(button.getAttribute('data-archive_step')));
      });
    });

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        render(Number(thumb.getAttribute('data-archive_index')));
      });
    });

    render(0);
  }

  /* -------------------------------------------------------
     문구 반응형 교체: HTML에는 데스크톱 문구 한 벌만 두고
     data-text_mobile 값으로 모바일 문구를 갈아끼운다.
     값이 빈 문자열이면 모바일에서 감춘다.
     ------------------------------------------------------- */
  function initResponsiveText() {
    var targets = Array.prototype.slice.call(document.querySelectorAll('[data-text_mobile]'));

    if (!targets.length) {
      return;
    }

    var desktopQuery = window.matchMedia('(min-width: 768px)');

    targets.forEach(function (target) {
      target.setAttribute('data-text_desktop', target.textContent.replace(/\s+/g, ' ').trim());
    });

    function applyText() {
      var isDesktop = desktopQuery.matches;

      targets.forEach(function (target) {
        var mobileText = target.getAttribute('data-text_mobile');
        var desktopText = target.getAttribute('data-text_desktop');

        if (isDesktop) {
          target.textContent = desktopText;
          target.hidden = false;
          return;
        }

        target.hidden = mobileText === '';
        target.textContent = mobileText;
      });
    }

    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', applyText);
    } else {
      desktopQuery.addListener(applyText);
    }

    applyText();
  }

  /* -------------------------------------------------------
     피처 카드 레일
     - 768px 이상: 카드 세트를 복제해 끊김 없이 흐르는 무한 마퀴
     - 767px 이하: sticky 스택이라 JS 개입 없이 페이지 스크롤만 사용
     ------------------------------------------------------- */
  function initFeatureMarquee() {
    var rail = document.querySelector('.feature_cards');

    if (!rail) {
      return;
    }

    var desktopQuery = window.matchMedia('(min-width: 768px)');
    var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var originals = Array.prototype.slice.call(rail.querySelectorAll('.feature_card'));

    if (!originals.length) {
      return;
    }

    /* 원본 카드를 감싸는 트랙을 만들고 그 뒤에 같은 세트를 한 벌 복제해 붙인다.
       복제본은 보조기기와 탭 순서에서 제외한다. */
    var marquee = document.createElement('div');
    marquee.className = 'feature_marquee';
    rail.insertBefore(marquee, originals[0]);
    originals.forEach(function (card) {
      marquee.appendChild(card);
    });

    var clones = originals.map(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.classList.add('is_clone');

      Array.prototype.slice.call(clone.querySelectorAll('a, button')).forEach(function (node) {
        node.setAttribute('tabindex', '-1');
      });

      marquee.appendChild(clone);
      return clone;
    });

    var SPEED_PX_PER_SECOND = 55;

    function measure() {
      if (!desktopQuery.matches || reducedMotionQuery.matches) {
        marquee.classList.remove('is_running');
        marquee.style.removeProperty('--marquee_shift');
        marquee.style.removeProperty('--marquee_duration');
        return;
      }

      /* 원본 세트의 총 폭(마지막 카드 오른쪽 - 첫 카드 왼쪽 + gap)만큼 이동하면
         복제본 첫 카드가 정확히 원본 첫 카드 자리에 오면서 이음매가 사라진다. */
      var gap = parseFloat(window.getComputedStyle(marquee).columnGap) || 0;
      var shift = 0;

      originals.forEach(function (card) {
        shift += card.getBoundingClientRect().width + gap;
      });

      if (shift <= 0) {
        return;
      }

      marquee.style.setProperty('--marquee_shift', shift + 'px');
      marquee.style.setProperty('--marquee_duration', shift / SPEED_PX_PER_SECOND + 's');
      marquee.classList.add('is_running');
    }

    var resizeTimer;

    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 180);
    });

    if (typeof reducedMotionQuery.addEventListener === 'function') {
      reducedMotionQuery.addEventListener('change', measure);
      desktopQuery.addEventListener('change', measure);
    }

    /* 이미지 로딩 후 폭이 확정되므로 한 번 더 잰다 */
    window.addEventListener('load', measure);
    measure();

    return clones;
  }

  /* -------------------------------------------------------
     스크롤 연동 글자 등장
     ------------------------------------------------------- */
  function initLetterReveal() {
    var targets = Array.prototype.slice.call(document.querySelectorAll('[data-letter_reveal]'));

    if (!targets.length || !('IntersectionObserver' in window)) {
      return;
    }

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    targets.forEach(function (target) {
      var text = target.textContent.replace(/\s+/g, ' ').trim();
      var fragment = document.createDocumentFragment();
      var units = [];

      /* 단어 단위로 감싸 줄바꿈이 글자 중간에서 끊기지 않게 한다 */
      text.split(' ').forEach(function (word, wordIndex, words) {
        var wordSpan = document.createElement('span');
        wordSpan.className = 'letter_reveal_word';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        word.split('').forEach(function (character) {
          var unit = document.createElement('span');
          unit.className = 'letter_reveal_unit';
          unit.textContent = character;
          wordSpan.appendChild(unit);
          units.push(unit);
        });

        fragment.appendChild(wordSpan);

        if (wordIndex < words.length - 1) {
          fragment.appendChild(document.createTextNode(' '));
        }
      });

      target.textContent = '';
      target.appendChild(fragment);

      if (prefersReducedMotion) {
        units.forEach(function (unit) {
          unit.classList.add('is_revealed');
        });
        return;
      }

      function reveal() {
        units.forEach(function (unit, index) {
          window.setTimeout(function () {
            unit.classList.add('is_revealed');
          }, index * 22);
        });
      }

      /* 문장이 뷰포트보다 길 수 있어 threshold를 낮게 두고 하단 여백으로 트리거 시점을 잡는다 */
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            reveal();
            observer.disconnect();
          });
        },
        { threshold: 0.01, rootMargin: '0px 0px -12% 0px' }
      );

      observer.observe(target);
    });
  }

  /* -------------------------------------------------------
     브랜드 스토리: 키워드 클릭 + 자동 롤링으로 배경 이미지 교차 페이드
     ------------------------------------------------------- */
  function initBrandStory() {
    var list = document.getElementById('approach_list');
    var background = document.getElementById('approach_background');

    if (!list || !background) {
      return;
    }

    var keys = Array.prototype.slice.call(list.querySelectorAll('[data-story_key]'));
    var images = Array.prototype.slice.call(background.querySelectorAll('[data-story_key]'));

    if (!keys.length || !images.length) {
      return;
    }

    var ROTATE_INTERVAL = 5000;
    var activeIndex = 0;
    var rotateTimer = null;

    function show(index) {
      activeIndex = (index + keys.length) % keys.length;

      keys.forEach(function (key, keyIndex) {
        var isActive = keyIndex === activeIndex;
        key.classList.toggle('is_active', isActive);
        key.setAttribute('aria-pressed', String(isActive));
      });

      images.forEach(function (image, imageIndex) {
        image.classList.toggle('is_active', imageIndex === activeIndex);
      });
    }

    function startRotation() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      stopRotation();
      rotateTimer = window.setInterval(function () {
        show(activeIndex + 1);
      }, ROTATE_INTERVAL);
    }

    function stopRotation() {
      if (rotateTimer !== null) {
        window.clearInterval(rotateTimer);
        rotateTimer = null;
      }
    }

    keys.forEach(function (key, index) {
      key.addEventListener('click', function () {
        show(index);
        startRotation();
      });
    });

    /* 마우스를 올린 동안에는 자동 전환을 멈춘다 */
    list.addEventListener('mouseenter', stopRotation);
    list.addEventListener('mouseleave', startRotation);
    list.addEventListener('focusin', stopRotation);
    list.addEventListener('focusout', startRotation);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopRotation();
      } else {
        startRotation();
      }
    });

    show(0);
    startRotation();
  }

  initHeader();
  initMobileHeader();
  initResponsiveText();
  initGalleryCarousel();
  initArchiveSlider();
  initFeatureMarquee();
  initLetterReveal();
  initBrandStory();
})();

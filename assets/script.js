gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, CustomEase, CustomBounce);

CustomBounce.create("myBounce", {
  strength: 0.5,
});

// ScrollTrigger.defaults({ markers: true });

// Initialize ScrollSmoother
const smoother = ScrollSmoother.create({
  // wrapper: '#smooth-wrapper',
  // content: '#smooth-content',
  smooth: 1, // Smoothness duration (seconds)
  // normalizeScroll: true, // Normalize scroll across devices
  effects: true, // looks for data-speed and data-lag attributes on elements
  smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
});

// Utility to compute pixel height for pin end (safer than percentages)
function px(val){ return typeof val === 'number' ? `${val}` : val; }

const NAV_ANIM_DELAY = 1.5; // Delay for floating nav animation

// Map section IDs to text colors for contrast
const sectionTextColors = {
  '#hero': '#FFFFFF',
  '#about': '#000000',
  '#projects': '#000000',
  '#experience': '#FFFFFF',
  '#skills': '#000000',
  '#contact': '#FFFFFF',
};

const sectionBackgroundColors = {
  '#hero': '#233043',
  '#about': '#ffffff',
  '#projects': '#f5fbff',
  '#experience': '#3b3a41',
  '#skills': '#deefff',
  '#contact': '#3e4c5e',
};

document.fonts.ready.then(() => {
  // Set initial opacity and text color for nav visibility
  gsap.set('.nav-btn', { opacity: 1, color: sectionTextColors['#hero'] });

  // Hero Section Animation
  let heroTitleSplit = SplitText.create(".hero-title", { type: "chars, words" });
  let heroTextSplit = SplitText.create(".hero-text", { type: "chars" }); // Split hero-text into chars
  gsap.from(heroTitleSplit.words[0], { 
    opacity: 0, 
    y: -30, 
    rotation: 10,
    duration: 0.5, 
    stagger: 0.4,
    ease: "myBounce",
  });
  gsap.from(heroTitleSplit.words.slice(1), { 
    opacity: 0, 
    y: -30, 
    rotation: 10,
    delay: 0.5,
    duration: 0.5, 
    stagger: 0.2,
    ease: "myBounce",
  });
  gsap.from('.hero-text', {
    opacity: 0,
    scale: 0.8,
    y: 20,
    // rotation: 5,
    duration: 0.7,
    delay: 1.5,
    ease: "power2.out",
  });
  gsap.from('#hero-canvas', {
    opacity: 0,
    scale: 2,
    rotation: 180,
    duration: 2,
    delay: 1,
    ease: "power2.out",
  });
  
  // Random animation for hero-title characters
  let animationTimeout = null;
  function triggerRandomAnimation() {
    const randomIndex = Math.floor(Math.random() * heroTitleSplit.chars.length);
    const randomChar = heroTitleSplit.chars[randomIndex];
    // const animationTypes = ['jump', 'spin', 'scale', 'wobble', 'flipY', 'flipX'];
    const animationTypes = ['spin', 'scale', 'wobble', 'flipY', 'flipX'];
    const animationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    // const animationType = 'spin';

    let animationProps;
    let animationPropsBack;
    switch (animationType) {
      case 'jump':
        animationProps = { y: -40 };
        break;
      case 'spin':
        animationProps = { y: -60, rotation: 180 };
        animationPropsBack = { y: 0, rotation: 360 };
        break;
      case 'scale':
        animationProps = { scale: 1.5 };
        break;
      case 'wobble':
        animationProps = { scaleX: 1.3, scaleY: 0.7, rotation: 10 };
        animationPropsBack = { scaleX: 1, scaleY: 1, rotation: 0 };
        break;
      case 'flipY':
        animationProps = { rotationX: 180, y: -40 };
        animationPropsBack = { rotationX: 0, y: 0 };
        break;
      case 'flipX':
        animationProps = { rotationY: 180 , y: -40 };
        animationPropsBack = { rotationY: 0 };
        break;

    }
    gsap.to(randomChar, {
      ...animationProps,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(randomChar, {
          ...animationPropsBack,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "myBounce",
          onComplete: () => {
            gsap.set(randomChar, { y: 0, rotation: 0, scale: 1 });
            animationTimeout = setTimeout(triggerRandomAnimation, 3000 + Math.random() * 3000);
          }
        });
      }
    });
  }
  setTimeout(triggerRandomAnimation, 3000);

  // Periodic wave jump for hero-text
  function triggerWaveJump() {
    gsap.timeline({
      repeat: -1,
      // repeatDelay: 4 + 2 * Math.random(), 
      repeatDelay: 6, 
    })
      .to(heroTextSplit.chars, {
        y: -5, // Smooth jump up
        duration: 0.15,
        // ease: "power2.out",
        stagger:{
          from: "start", // Start from the first character
          amount: 1, // Stagger the jump for a wave effect
          repeat: 1, // Repeat the stagger for the bounce back
          yoyo: true, // Bounce back down
        }
      })
  }
  // Start first wave after initial animations (4s delay)
  setTimeout(triggerWaveJump, 4000);

  // Hamburger Menu Toggle
  const navToggle = document.getElementById('nav-toggle');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const floatingNav = document.getElementById('floating-nav');
  let isMenuOpen = false;
  /* ========== expanding circle backdrop for mobile nav ========== */
  const svg = document.getElementById('nav-circle-svg');
  const navCircle = document.getElementById('nav-circle-shape');

  // set svg to full viewport and viewBox in px so circle coords are in page pixels
  function sizeSvgToViewport() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.style.width = `${w}px`;
    svg.style.height = `${h}px`;
  }

  // compute final radius to cover the floating nav box from center (cx,cy)
  function radiusToCoverNav(cx, cy, navRect) {
    // corners of the nav rect
    const corners = [
      { x: navRect.left, y: navRect.top },
      { x: navRect.left + navRect.width, y: navRect.top },
      { x: navRect.left, y: navRect.top + navRect.height },
      { x: navRect.left + navRect.width, y: navRect.top + navRect.height }
    ];
    // distance from center to farthest corner
    let maxDist = 0;
    corners.forEach(c => {
      const d = Math.hypot(cx - (c.x + 0), cy - (c.y + 0));
      if (d > maxDist) maxDist = d;
    });
    // add a little padding so menu is comfortably inside circle
    return Math.ceil(maxDist); // padding
  }

  // animate opening by animating r (px). rFinal should be enough to cover viewport.
  function openSvgCircleFromButton(buttonRect, navSelector = '#floating-nav') {

    // ensure svg sizing is up-to-date
    sizeSvgToViewport();

    const cx = Math.round(buttonRect.left + buttonRect.width / 2);
    const cy = Math.round(buttonRect.top + buttonRect.height / 2);

    // get nav rect to compute radius to cover the nav, not whole screen
    const navEl = document.querySelector(navSelector);
    const navRect = navEl ? navEl.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

    const rStart = Math.max(buttonRect.width, buttonRect.height) / 2;
    const rFinal = radiusToCoverNav(cx, cy, navRect);

    // position circle (we use absolute page-pixel coords in svg viewBox)
    navCircle.setAttribute('cx', cx);
    navCircle.setAttribute('cy', cy);
    navCircle.setAttribute('r', rStart);

    // ensure visible
    svg.style.opacity = '1';

    // animate radius (attr animation keeps it vector crisp)
    gsap.killTweensOf(navCircle);
    gsap.fromTo(navCircle, 
      { attr: { r: rStart } }, 
      { attr: { r: rFinal }, x:-100, y: 50, duration: 0.55, ease: 'power4.out' }
    );
  }

  function closeSvgCircle(buttonRect) {
    sizeSvgToViewport();
    const rClose = Math.max(buttonRect.width, buttonRect.height) / 2;
    gsap.killTweensOf(navCircle);
    gsap.to(navCircle, {
      attr: { r: rClose },
      duration: 0.55,
      ease: 'power4.in',
      onComplete: () => {
        // hide quickly so it doesn't cause visual artifact
        svg.style.opacity = '0';
      }
    });
  }

  // expose functions to global so toggleMenu can call them
  window.__openNavCircleSVG = openSvgCircleFromButton;
  window.__closeNavCircleSVG = closeSvgCircle;

  // keep responsive
  window.addEventListener('resize', sizeSvgToViewport, { passive: true });

  // initialize size once
  sizeSvgToViewport();

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    hamburgerBtn.classList.toggle('active');
    const rect = hamburgerBtn.getBoundingClientRect();
    if (isMenuOpen) {
      window.__openNavCircleSVG(rect);
      // add .open class so nav can become pointer-events enabled
      floatingNav.classList.add('open');
      // set aria state
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      // focus first nav item for a11y
      setTimeout(()=>{ floatingNav.querySelector('.nav-btn')?.focus(); }, 300);
      floatingNavAnimationMobile.play()
    } else {
      window.__closeNavCircleSVG(rect);
      floatingNav.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      // return focus to button
      setTimeout(()=>{ hamburgerBtn.focus(); }, 250);
      floatingNavAnimationMobile.reverse();
    }
  }

  navToggle.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // Close menu on scroll or click outside
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !navToggle.contains(e.target) && !floatingNav.contains(e.target)) {
      toggleMenu();
    }
  });
  window.addEventListener('scroll', () => {
    if (isMenuOpen) toggleMenu();
  });

  // Flag to ensure animation runs only once
  let navAnimTriggered = false;
  // Floating navigation appearance animation
  const floatingNavDefaultX = 172 // mobile
  const floatingNavActiveX = floatingNavDefaultX + 8 // mobile
  const floatingNavDefaultY = 48 // desktop
  const floatingNavActiveY = floatingNavDefaultY - 4 // desktop
  const floatingNavInactiveOpacity = 0.5
  const floatingNavAnimation = gsap.to('.nav-btn', {
    opacity: (i, target) => target.classList.contains('active') ? 1 : floatingNavInactiveOpacity,
    y: (i, target) => target.classList.contains('active') ? floatingNavActiveY : floatingNavDefaultY,
    duration: 0.4,
    stagger: 0.06,
    ease: "power4.out",
    // delay: 2
    paused: true, // Start paused
  });
  const floatingNavAnimationMobile = gsap.to('.nav-btn', {
    opacity: (i, target) => target.classList.contains('active') ? 1 : floatingNavInactiveOpacity,
    // opacity: 1,
    x: (i, target) => target.classList.contains('active') ? floatingNavActiveX : floatingNavDefaultX,
    duration: 0.4,
    stagger: 0.06,
    ease: "power4.out",
    // delay: 2
    paused: true, // Start paused
  });
  // Delayed trigger only for desktop
  if (!navAnimTriggered && window.visualViewport.width >= 768) {
    gsap.delayedCall(NAV_ANIM_DELAY, () => {
        floatingNavAnimation.play();
        navAnimTriggered = true; // Set flag to true
    });
  }
  // ScrollTrigger
  if (window.visualViewport.width >= 768) {
    ScrollTrigger.create({
      trigger: "#about",
      start: "top center", // Trigger when element is 80% from the top of viewport
      scroller: "#smooth-wrapper",
      onEnter: () => {
        if (!navAnimTriggered) {
          floatingNavAnimation.play();
          navAnimTriggered = true;
        }
      },
      once: true // Ensures ScrollTrigger only fires once
    });
  }
  
  

  // Hover animations for nav buttons
  // document.querySelectorAll('.nav-btn').forEach(btn => {
  //   btn.addEventListener('mouseenter', () => {
  //     gsap.to(btn, { scale: 1.2, duration: 0.2, ease: "power2.out" });
  //   });
  //   btn.addEventListener('mouseleave', () => {
  //     gsap.to(btn, { scale: 1, duration: 0.2, ease: "power2.out" });
  //   });
  // });
  if (window.visualViewport.width >= 768) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { y: floatingNavActiveY, duration: 0.2, ease: "power2.out" });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { y: btn.classList.contains('active') ? floatingNavActiveY : floatingNavDefaultY, duration: 0.2, ease: "power2.out" });
      });
    });
  }

  // Scroll to section on click
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.getAttribute('data-section');
      if (section === '#hero') {
        smoother.scrollTo(0, true); // Scroll to absolute top for #hero
      } else {
        smoother.scrollTo(section, true, 'top top');
      }
    });
  });

  // Highlight active section in nav with GSAP
  const sections = ['#hero', '#about', '#projects', '#experience', '#skills', '#contact'];
  sections.forEach(section => {
    const btn = document.querySelector(`.nav-btn[data-section="${section}"]`);
    ScrollTrigger.create({
      trigger: section,
      start: 'top 5%',
      end:'bottom 5%', // Extend for projects horizontal scroll
      onEnter: () => {
        // if(section !== '#hero') {
        btn.classList.add('active');
        if (window.visualViewport.width >= 768 && navAnimTriggered) {
          gsap.to(btn, { y: floatingNavActiveY, opacity: 1, duration: 0.3, ease: "power2.out" });
        }
        gsap.to('.nav-btn', { color: sectionTextColors[section], duration: 0.3, ease: "power2.out" });
        navCircle.setAttribute('fill', sectionBackgroundColors[section]);
        // }
      },
      onEnterBack: () => {
        btn.classList.add('active');
        if (window.visualViewport.width >= 768) {
          gsap.to(btn, { y: floatingNavActiveY, opacity: 1, duration: 0.3, ease: "power2.out" });
        }
        gsap.to('.nav-btn', { color: sectionTextColors[section], duration: 0.3, ease: "power2.out" });
        navCircle.setAttribute('fill', sectionBackgroundColors[section]);
      },
      onLeave: () => {
        btn.classList.remove('active');
        if (window.visualViewport.width >= 768) {
          gsap.to(btn, { y: floatingNavDefaultY, opacity: 0.5, duration: 0.3, ease: "power2.out" });
        }
      },
      onLeaveBack: () => {
        btn.classList.remove('active');
        if (window.visualViewport.width >= 768) {
          gsap.to(btn, { y: floatingNavDefaultY, opacity: 0.5, duration: 0.3, ease: "power2.out" });
        }
      }
    });
    ScrollTrigger.create({
      trigger: section,
      start: 'top 1%',
      end: 'bottom 1%', // Extend for projects horizontal scroll
      onEnter: () => {
        // if(section !== '#hero') {
          gsap.to('#hamburger-btn', { color: sectionTextColors[section], duration: 0.3, ease: "power2.out" });
        // }
      },
      onEnterBack: () => {
        btn.classList.add('active');
        gsap.to('#hamburger-btn', { color: sectionTextColors[section], duration: 0.3, ease: "power2.out" });
      },
    });
  });

});

// Pin the hero section
ScrollTrigger.create({
  trigger: '#hero',
  pin: true,
  pinSpacing: false,
});

// Canvas Concentric Circles Animation
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Get hero content center and bounds
  const getHeroBounds = () => {
    const titleRect = document.querySelector('.hero-title').getBoundingClientRect();
    const textRect = document.querySelector('.hero-text').getBoundingClientRect();
    const centerX = (titleRect.left + titleRect.right) / 2;
    const centerY = (titleRect.top + textRect.bottom) / 2;
    const width = Math.max(titleRect.width, textRect.width);
    const height = textRect.bottom - titleRect.top;
    return { centerX, centerY, width, height };
  };

  // Grid settings
  const ringSpacing = 60; // Distance between concentric rings
  const maxRings = 16; // Number of concentric rings
  const baseCirclesPerRing = 32; // Base number of circles for the first ring
  const circleRadius = 3; // Base radius of circles
  const baseCircleOpacity = 0.3; // Base opacity of circles
  const maxOffset = 200; // Max mouse movement offset
  let mouseX = 0;
  let mouseY = 0;

  // Store circle objects
  const circles = [];
  function initCircles() {
    circles.length = 0; // Clear existing circles
    const { centerX, centerY, width, height } = getHeroBounds();
    const minRadius = Math.sqrt(width * width + height * height) / 2 + 100; // Start 100px outside hero content

    for (let ring = 0; ring < maxRings; ring++) {
      const radius = minRadius + ring * ringSpacing;
      const numCircles = baseCirclesPerRing + ring * 2; // Linear increase (8, 10, 12, 14, 16, 18)
      for (let i = 0; i < numCircles; i++) {
        let angle = (i / numCircles) * Math.PI * 2 + Math.PI / 12 * ring; // Stagger with offset
        // angle += (Math.random() - 0.5) * 0.1; // Slight random jitter
        circles.push({
          x: centerX + Math.cos(angle) * radius,       // Keep for initial draw
          y: centerY + Math.sin(angle) * radius,       // Keep for initial draw
          radius: radius,                              // This is the ring's radius
          angle: angle,
          scale: 1,
          opacity: baseCircleOpacity,
          pulseOpacity: baseCircleOpacity
        });
      }
    }
  }
  initCircles();

  // Periodic wave pulse from center
  function triggerWavePulse() {
    const waveTl = gsap.timeline({
      repeat: -1,
      // repeatDelay: 3 + Math.random() * 3, // Random delay between 3-6s
      repeatDelay: 4,
    });
    const { width, height } = getHeroBounds();
    const minRadius = Math.sqrt(width * width + height * height) / 2 + 50; // Start 50px outside hero content
    for (let ring = 0; ring < maxRings; ring++) {
      const targetRadius = minRadius + ring * ringSpacing;
      const ringCircles = circles.filter(c => Math.abs(c.radius - targetRadius) < ringSpacing / 2);
      waveTl.to(ringCircles, {
        scale: 1.5,
        pulseOpacity: 1,
        duration: 0.8, // Smoother wave
        ease: "power2.out",
      }, ring * 0.15) // Gentler stagger (0.15s)
      .to(ringCircles, {
        scale: 1,
        pulseOpacity: baseCircleOpacity,
        duration: 0.8,
        ease: "power2.in",
      }, ring * 0.15 + 0.15);
    }
  }
  setTimeout(triggerWavePulse, 4000); // Start after initial animations

// Mouse movement handler
  document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left; // Absolute canvas coordinates
    mouseY = e.clientY - rect.top;
  });

// Click handler for ripple effect
  let clickX = null;
  let clickY = null;
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;
    triggerRippleEffect();
  });

  // Ripple effect function
  function triggerRippleEffect() {
    if (clickX === null || clickY === null) return;

    const rippleTl = gsap.timeline({ paused: true });
    const maxRippleRadius = 2000; // Radius of the ripple effect

    const affectedCircles = circles
      .filter(circle => {
        const dx = clickX - circle.x;
        const dy = clickY - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= maxRippleRadius;
      })
      .sort((a, b) => {
        const distA = Math.sqrt(Math.pow(clickX - a.x, 2) + Math.pow(clickY - a.y, 2));
        const distB = Math.sqrt(Math.pow(clickX - b.x, 2) + Math.pow(clickY - b.y, 2));
        return distA - distB;
      });

    if (affectedCircles.length === 0) {
      clickX = null;
      clickY = null;
      return;
    }

    // Calculate start time based on distance for a true ripple
    const totalDuration = 1.5; // Total time for the ripple to expand
    affectedCircles.forEach(circle => {
      const distance = Math.sqrt(Math.pow(clickX - circle.x, 2) + Math.pow(clickY - circle.y, 2));
      const startTime = (distance / maxRippleRadius) * totalDuration;

      rippleTl.to(circle, {
        scale: 1.5,
        pulseOpacity: 0.7,
        duration: 0.2,
        ease: "power2.out"
      }, startTime).to(circle, {
        scale: 1,
        pulseOpacity: baseCircleOpacity,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (circle === affectedCircles[affectedCircles.length - 1]) {
            clickX = null;
            clickY = null;
          }
        }
      }, startTime + 0.08);
    });

    rippleTl.play();
  }

  // Animation loop
  function animateCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { centerX, centerY } = getHeroBounds(); // Update center
    circles.forEach(circle => {
      // Update base position for centering
      // Recalculate baseX and baseY on every frame based on the current center
      // This makes the animation resilient to the center point changing.
      const baseX = centerX + Math.cos(circle.angle) * circle.radius;
      const baseY = centerY + Math.sin(circle.angle) * circle.radius;

      // // Apply mouse offset // FOR GLOBAL PARALLAX EFFECT
      // const dx = mouseX * maxOffset;
      // const dy = mouseY * maxOffset;
      // circle.x = circle.baseX + dx;
      // circle.y = circle.baseY + dy;

      // Calculate distance from mouse to circle // FOR LOCAL PARALLAX EFFECT
      const dx = mouseX - baseX;
      const dy = mouseY - baseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Apply localized offset with falloff
      const maxGravityInfluenceRadius = 1500; // Radius within which circles are affected with gravity
      let influence = 1 - Math.min(distance / maxGravityInfluenceRadius, 1); // Linear falloff from 1 to 0
      influence = influence > 0 ? influence * influence : 0; // Quadratic falloff for smoother edge
      const offsetX = dx * influence * (maxOffset / maxGravityInfluenceRadius);
      const offsetY = dy * influence * (maxOffset / maxGravityInfluenceRadius);
      // Apply offset
      circle.x = baseX + offsetX;
      circle.y = baseY + offsetY;
      
      const maxOpacityInfluenceRadius = 200; // Radius within which circles are affected
      // Adjust opacity based on proximity to mouse cursor (already calculated influence)
      const maxOpacity = 1; // Maximum opacity when closest
      const minOpacity = baseCircleOpacity; // Minimum opacity when farthest
      const proximityInfluence = 1 - Math.min(distance / maxOpacityInfluenceRadius, 1); // 1 when closest, 0 when farthest
      const proximityOpacity = minOpacity + (maxOpacity - minOpacity) * proximityInfluence;
      circle.opacity = Math.max(proximityOpacity, circle.pulseOpacity); // Combine proximity and pulse opacity
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circleRadius * circle.scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${circle.opacity})`;
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(animateCircles);
  }
  animateCircles();

  // Clean up and reinitialize on scroll
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => cancelAnimationFrame(animationFrameId),
    onEnterBack: () => {
      initCircles(); // Reinitialize circles on re-entry
      animateCircles(); // Restart animation with updated positions
    },
  });


// About Me animations
// gsap.from('.about-photo', {
//   scrollTrigger: { trigger: '#about', start: 'top 60%', end: 'top top', scrub: 1 },
//   opacity: 0,
//   x: -200,
//   duration: 0.7,
//   ease: "power2.out"
// });
gsap.from('.about-title', {
  scrollTrigger: { trigger: '#about', start: 'top 60%', end: 'top top', scrub: 1 },
  opacity: 0,
  y: -30,
  duration: 0.6,
  delay: 0.2,
  ease: "power2.out"
});
gsap.from('#about p', {
  scrollTrigger: { trigger: '#about', start: 'top 60%', end: 'top top', scrub: 1 },
  opacity: 0,
  y: 20,
  duration: 0.5,
  stagger: 0.5,
  delay: 0.3,
  ease: "power2.out"
});
// Scroll-activated shimmer effect
ScrollTrigger.create({
  trigger: '#about',
  start: 'top 80%',
  onEnter: () => {
    gsap.to('.highlight', {
      backgroundPosition: '200% center',
      duration: 3,
      repeat: -1,
      ease: 'linear'
    });
  },
  onLeaveBack: () => {
    // reset to initial state when scrolling back up
    gsap.set('.highlight', { backgroundPosition: '0% center' });
  }
});


// Pin the about section
ScrollTrigger.create({
  trigger: '#about',
  pin: true,
  pinSpacing: false,
  // end: '150%',
});

// Projects Section Animation
gsap.from('.projects-title', {
  scrollTrigger: { 
    trigger: '#projects', 
    scrub: 1,
    start: 'top bottom',
    end: 'top 20%',
  },
  opacity: 0,
  scale: 0.5,
  // duration: 0.2,
  ease: "power4.out",
});

// gsap.from('.project-card', {
//   scrollTrigger: { 
//     trigger: '#projects', 
//     start: 'top 80%',
//   },
//   opacity: 0,
//   scale: 0.8,
//   y: 50,
//   duration: 0.5,
//   stagger: 0.2,
//   ease: "power2.out",
// });

// Horizontal Scrolling for Projects
// const projectsContainer = document.querySelector('.projects-container');
// let projectsScrollWidth = projectsContainer.scrollWidth - window.innerWidth + 300;
// const extraPinDistance = window.innerHeight;

// Pin the projects section
ScrollTrigger.create({
  trigger: '#projects',
  pin: true,
  pinSpacing: false,
  // start: 'top top',
  // end: '150%',
  // end: `+=${projectsScrollWidth}`,
  // end: `+=${projectsScrollWidth + extraPinDistance}`,
  id: 'projectsPin',
});

// Horizontal scroll animation
// gsap.to('.projects-container', {
//   x: -projectsScrollWidth,
//   ease: 'none',
//   scrollTrigger: {
//     trigger: '#projects',
//     start: 'top top',
//     end: `+=${projectsScrollWidth}`,
//     scrub: 1,
//     snap: {
//       snapTo: 1 / (document.querySelectorAll('.project-card').length - 1),
//       duration: 0.2,
//       ease: 'power1.inOut',
//     },
//     id: 'projectsScroll',
//   },
// });

// Hover effect for project cards
// document.querySelectorAll('.project-card').forEach(card => {
//   card.addEventListener('mouseenter', () => gsap.to(card, { scale: 1.05, duration: 0.3, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }));
//   card.addEventListener('mouseleave', () => gsap.to(card, { scale: 1, duration: 0.3, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }));
// });

// Fade effect for projects during experience overlap (uncommented and adjusted)
// gsap.to('#projects', {
//   filter: 'blur(2px)',
//   scrollTrigger: {
//     trigger: '#projects',
//     start: `top top+=${projectsScrollWidth}`,
//     end: `#experience top top`,
//     scrub: 1,
//     id: 'projectsFade',
//   },
// });


/* --- Pre-set initial states so nothing flashes visible --- */
// gsap.set('.mySwiper .swiper-slide img', { scale: 1.05, opacity: 0, transformOrigin: 'center center' });
// gsap.set('.mySwiper .swiper-slide .project-details > *', { x: 30, opacity: 0 });

/* --- Create the Swiper WITHOUT autoplay initially --- */
const swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 32,
  centeredSlides: true,
  loop: true,
  speed: 700, // match with GSAP timing for smoother feel
  pagination: { el: ".swiper-pagination", clickable: true },
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  on: {
    init: function () {
      // Slow, dramatic hero reveal for very first slide
      animateSlideIn(this.slides[this.activeIndex], { first: true, onComplete: () => {
        // Start autoplay only after initial reveal completes
        this.params.autoplay = { delay: 4000, disableOnInteraction: true };
        // this.autoplay.start();
      }});
    },
    // // When a slide change begins -> animate OUT the previous slide
    // slideChangeTransitionStart: function () {
    //   const prev = this.slides[this.previousIndex];
    //   if (prev) animateSlideOut(prev);
    // },
    // // After the slide transition ends -> animate IN the active slide
    // slideChangeTransitionEnd: function () {
    //   const active = this.slides[this.activeIndex];
    //   animateSlideIn(active);
    // }
  }
});

/* Pause autoplay on hover */
const swiperEl = document.querySelector('.mySwiper');
// swiperEl.addEventListener('mouseenter', () => swiper.autoplay?.stop());
// swiperEl.addEventListener('mouseleave', () => swiper.autoplay?.start());

/* --- Animation helpers --- */
function animateSlideIn(slide, opts = {}) {
  if (!slide) return;
  const image = slide.querySelector('img');
  const textBlocks = slide.querySelectorAll('.project-details > *');

  // kill any running tweens on these elements to avoid overlap
  gsap.killTweensOf([image, textBlocks]);

  const imageDur = opts.first ? 1.2 : 0.8;
  const textDelay = opts.first ? 0.45 : 0.2;

  // Reset start values (ensures consistent behaviour)
  gsap.set(image, { scale: 1.05, opacity: 0 });
  gsap.set(textBlocks, { x: 30, opacity: 0 });

  // Image reveal
  gsap.to(image, {
    scale: 1,
    opacity: 1,
    duration: imageDur,
    ease: "power2.out"
  });

  // Text staggered slide-in
  gsap.to(textBlocks, {
    x: 0,
    opacity: 1,
    duration: 0.55,
    delay: textDelay,
    stagger: 0.08,
    ease: "power2.out",
    onComplete: opts.onComplete || null
  });
}

function animateSlideOut(slide, onComplete) {
  if (!slide) { if (onComplete) onComplete(); return; }
  const image = slide.querySelector('img');
  const textBlocks = slide.querySelectorAll('.project-details > *');

  gsap.killTweensOf([image, textBlocks]);

  gsap.to(image, {
    scale: 0.95,
    opacity: 0,
    duration: 0.45,
    ease: "power2.in"
  });

  gsap.to(textBlocks, {
    x: -30,
    opacity: 0,
    duration: 0.35,
    stagger: 0.04,
    ease: "power2.in",
    onComplete: onComplete || null
  });
}



// Work Experience Section Animation
gsap.from('.experience-title', {
  scrollTrigger: {
    trigger: '#experience',
    start: 'top bottom',
    end: 'top 20%',
    // end: () => `+=${document.querySelector('#experience').offsetHeight - 100}`,
    scrub: 1,
  },
  opacity: 0,
  scale: 0.8,
  // rotation: 5,
  duration: 0.5,
  ease: "power4.out",
});

// Get container and dimensions
const experienceContainer = document.querySelector('.experience-items-container');
const experienceContainerHeight = experienceContainer.scrollHeight;

// Pin the experience section
ScrollTrigger.create({
  trigger: '#experience',
  pin: true,
  pinSpacing: false,
  // end: `+=${experienceContainerHeight}`,
  // start: 'top top',
  // end: 'top top',
  // endTrigger: '#skills',
  id: 'experiencePin',
});

gsap.to(experienceContainer, {
  y: -experienceContainerHeight,
  ease: 'none',
  scrollTrigger: {
    trigger: '#experience',
    start: 'top top',
    end: `+=${experienceContainerHeight - (window.visualViewport.width < 768 ? 128 : 0)}`,
    scrub: true,
    id: 'experienceContainer',
  },
});

ScrollTrigger.matchMedia({

  // Desktop and tablet: enable animations
  "(min-width: 768px)": function() {

    // Animate individual items
    document.querySelectorAll('.experience-item').forEach((item, index) => {
      gsap.fromTo(item, 
        { opacity: 0, x: index % 2 === 0 ? -100 : 100, y: 50 },
        { 
          opacity: 1, 
          x: 0, 
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 100%',
            end: 'top 80%',
            scrub: 0.5,
          },
        }
      );

      gsap.fromTo(item, {
        opacity: 1,
        x: 0,
        y: 0,
      }, {
        opacity: 0,
        x: index % 2 === 0 ? -100 : 100,
        y: -50,
        duration: 1,
        scrollTrigger: {
          trigger: item,
          start: 'top 20%',
          end: 'top 0%',
          scrub: 0.5,
        },
      });
    });
  },

  // Mobile: only fade in
  "(max-width: 767px)": function() {
    document.querySelectorAll('.experience-item').forEach((item, index) => {
      gsap.fromTo(item, 
        { opacity: 0, x: index % 2 === 0 ? -100 : 100, y: 50 },
        { 
          opacity: 1, 
          x: 0, 
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 100%',
            end: 'top 80%',
            scrub: 0.5,
          },
        }
      );
    });
  },

  // optional: a cleanup function returned for when the media query no longer matches
  "all": function() {
    // runs for all sizes - you can put code that should always run here
  }

});

// Animate experience details on hover
document.querySelectorAll('.experience-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    gsap.to(item, { scale: 1.02, duration: 0.3 });
    gsap.to(item.querySelector('.experience-details'), { opacity: 1, y: 0, duration: 0.3 });
  });
  item.addEventListener('mouseleave', () => {
    gsap.to(item, { scale: 1, duration: 0.3 });
    gsap.to(item.querySelector('.experience-details'), { opacity: 0.7, y: 10, duration: 0.3 });
  });
});

// Skills Section Animation
gsap.from('.skills-title', {
  scrollTrigger: { trigger: '#skills', end: 'top center', scrub:1 },
  opacity: 0,
  y: 50,
  scale: 0.5,
  duration: 0.5,
  ease: "power2.out"
})

gsap.utils.toArray('.skill-category').forEach((category, index) => {
  const fromX = index % 2 === 0 ? -50 : 50; // alternate sides
  const skillsText = category.querySelector('.skill-list');

  // Split skills into individual words/items for stagger
  const skillsArray = skillsText.innerText.split(' ').map(s => s.trim());
  skillsText.innerHTML = skillsArray.map(skill => `<span class="inline-block opacity-0">${skill}</span>`).join(' ');

  const skillItems = skillsText.querySelectorAll('span');

  gsap.fromTo(category, 
    { opacity: 0, x: fromX }, 
    { 
      scrollTrigger: { trigger: category, start: 'top 100%', end: 'top 85%', scrub: 0.5 }, 
      opacity: 1, 
      x: 0, 
      duration: 0.6, 
      ease: "power2.out",
      onComplete: () => {
        gsap.to(skillItems, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  );
});


// Pin the skills section
ScrollTrigger.create({
  trigger: '#skills',
  pin: true,
  pinSpacing: false,
  end: '+=150%',
});

// Contact Section Animation
gsap.from('.contact-field', {
  scrollTrigger: { 
    trigger: '#contact', 
    start: 'top 70%',
  },
  opacity: 0,
  y: 100,
  duration: 0.5,
  stagger: 0.2,
});

gsap.to('.submit-button', { 
  scale: 1.05, 
  duration: 0.5, 
  repeat: -1, 
  yoyo: true,
});


// // Pin the contact section
// ScrollTrigger.create({
//   trigger: '#contact',
//   pin: true,
//   pinSpacing: false,
//   end: '+=150%',
// });

// Modal gallery logic (uses Swiper inside modal)
(function() {
  let modalSwiperInstance = null;
  const modal = document.getElementById('case-modal');
  const closeBtn = document.getElementById('closeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalSwiperEl = () => document.querySelector('.modalSwiper');
  const modalWrapperEl = () => document.querySelector('.modalSwiper .swiper-wrapper');

  function parseImagesAttr(str) {
    if (!str) return [];
    // Try JSON parse first
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // not JSON
    }
    // Fallback: comma-separated list
    return str.split(',').map(s => s.trim()).filter(Boolean);
  }

  function buildSlides(images) {
    const wrapper = modalWrapperEl();
    if (!wrapper) return;
    wrapper.innerHTML = '';
    images.forEach(src => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      slide.appendChild(img);
      wrapper.appendChild(slide);
    });
  }

  function initModalSwiper() {
    // Destroy previous instance if exists
    try { if (modalSwiperInstance && modalSwiperInstance.destroy) modalSwiperInstance.destroy(true, true); } catch(e){}
    // Create new Swiper instance
    try {
      modalSwiperInstance = new Swiper('.modalSwiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        navigation: {
          nextEl: '.modal-swiper-next',
          prevEl: '.modal-swiper-prev'
        },
        pagination: {
          el: '.modal-swiper-pagination',
          clickable: true
        },
        loop: true,
        // watchOverflow: true
      });
    } catch (e) {
      console.warn('Swiper not available yet, will retry on next tick.', e);
      setTimeout(initModalSwiper, 50);
    }
  }

  function openModal(images, title, desc) {
    if (!modal) return;
    // build slides and init swiper
    buildSlides(images);
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    initModalSwiper();
    modalTitle.textContent = title || '';
    modalBody.textContent = desc || '';
    // pause smoother if available
    try { smoother.paused(true); } catch (e) {}
    // Prevent body scroll while modal open
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const card = modal.querySelector('.modal-card');
    const backdrop = modal.querySelector('.modal-backdrop');

    // prepare initial states
    gsap.set(modal, { opacity: 0 });
    if (backdrop) gsap.set(backdrop, { opacity: 0 });
    if (card) gsap.set(card, { y: 18, scale: 0.985, opacity: 0, transformOrigin: '50% 50%' });

    // animate in: backdrop fade, modal fade, card pop
    const tl = gsap.timeline();
    tl.to(backdrop || modal, { opacity: 0.6, duration: 0.18, ease: 'power1.out' }, 0);
    tl.to(modal, { opacity: 1, duration: 0.18, ease: 'power1.out' }, 0);
    tl.to(card, { y: 0, scale: 1, opacity: 1, duration: 0.46, ease: 'back.out(1.1)' }, 0.06);

    // focus close for accessibility after animation
    tl.call(() => { try { document.getElementById('closeModal').focus(); } catch(e){} });

  }

  function closeModal() {
    if (!modal) return;
    const card = modal.querySelector('.modal-card');
    const backdrop = modal.querySelector('.modal-backdrop');

    // animate out: card down/shrink, backdrop fade
    const tl = gsap.timeline({
      onComplete: () => {
        // hide and cleanup after animation
        modal.classList.add('hidden');
        modal.style.display = '';
        try { if (modalSwiperInstance && modalSwiperInstance.destroy) modalSwiperInstance.destroy(true, true); modalSwiperInstance = null; } catch(e){}
        const wrapper = modalWrapperEl(); if (wrapper) wrapper.innerHTML = '';
        try { smoother.paused(false); } catch (e) {}
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    });

    if (card) tl.to(card, { y: 18, scale: 0.985, opacity: 0, duration: 0.28, ease: 'power2.in' });
    tl.to(backdrop || modal, { opacity: 0, duration: 0.18, ease: 'power1.in' }, '-=0.12');

  }

  // Attach to thumb buttons (supports data-images JSON or comma-separated, or data-full-src fallback)
  function attachThumbHandlers(root=document) {
    root.querySelectorAll('.thumb-btn').forEach(btn => {
      // Avoid double-binding
      if (btn.dataset.modalBound) return;
      btn.dataset.modalBound = 'true';
      btn.addEventListener('click', (e) => {
        const imagesAttr = btn.getAttribute('data-images') || btn.dataset.images || '';
        const full = btn.getAttribute('data-full-src') || btn.dataset.fullSrc || '';
        const images = imagesAttr ? parseImagesAttr(imagesAttr) : (full ? [full] : []);
        const title = btn.getAttribute('data-title') || '';
        const desc = btn.getAttribute('data-description') || '';
        // swiper.autoplay?.stop(); // pause main swiper autoplay if running 
        openModal(images, title, desc);
      });
    });
  }
  attachThumbHandlers();

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  // close when clicking backdrop
  document.addEventListener('click', (e) => {
    if (e.target.classList && (e.target.classList.contains('case-modal') || e.target.classList.contains('modal-backdrop'))) {
      closeModal();
    }
  });
  // Escape key closes
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Expose a helper in case you add thumbnails dynamically later
  window.__attachModalThumbs = attachThumbHandlers;
})();


ScrollTrigger.refresh();
// smoother.scrollTop(0); // Reset scroll position
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
  smoother.refresh();
});






// Contact form submit via fetch to Formspree
(function() {
  const FORM_ENDPOINT = 'https://formspree.io/f/mgvlqwbp'; // <- replace this
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const status = document.getElementById('contactStatus');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'contact-status';
    status.textContent = '';

    // Basic client validation
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      status.classList.add('error');
      status.textContent = 'Please fill in all required fields.';
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Build payload
      const formData = new FormData(form);
      // optional: you can append extra fields here, e.g. source url
      formData.append('source', window.location.href);

      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await res.json();

      if (res.ok) {
        status.classList.add('success');
        status.textContent = 'Thanks — message sent! I’ll reply as soon as I can.';
        form.reset();
      } else {
        // Formspree returns errors in JSON
        status.classList.add('error');
        status.textContent = (data && data.error) ? data.error : 'Oops — something went wrong.';
      }
    } catch (err) {
      status.classList.add('error');
      status.textContent = 'Network error — please try again later.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });

})();
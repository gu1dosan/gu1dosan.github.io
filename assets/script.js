gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, CustomEase, CustomBounce);

CustomBounce.create("myBounce", {
  strength: 0.5,
});

// ScrollTrigger.defaults({ markers: true });

// Initialize ScrollSmoother
const smoother = ScrollSmoother.create({
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 1, // Smoothness duration (seconds)
  normalizeScroll: true, // Normalize scroll across devices
});

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
  '#about': '#c0bfc5',
  '#projects': '#a8a7b4',
  '#experience': '#3b3a41',
  '#skills': '#ADB8C2',
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

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    hamburgerBtn.classList.toggle('active');
    const tl = gsap.timeline();
    if (isMenuOpen) {
    //   floatingNav.classList.remove('hidden');
    //   tl
    //   // .fromTo(floatingNav, { 
    //   //   x: '-100%', 
    //   //   // opacity: 0 
    //   // }, { 
    //   //   x: 0, 
    //   //   // opacity: 1, 
    //   //   duration: 0.3, 
    //   //   ease: "power2.out" 
    //   // })
    //     .fromTo('.nav-btn', { 
    //       // x: -100,
    //       // y: 20, 
    //       // opacity: 0 
    //     }, { 
    //       x: 124,
    //       // y: 0, 
    //       // opacity: 1, 
    //       stagger: 0.05, 
    //       duration: 0.2, 
    //       ease: "power2.out" 
    //     }, 0.1);
    floatingNavAnimationMobile.play()
    } else {
      // tl
      // .to('.nav-btn', { 
      //   x: -100,
      //   // y: 20, 
      //   // opacity: 0, 
      //   stagger: -0.1, 
      //   duration: 0.3, 
      //   ease: "power2.in" 
      // })
      //   // .to(floatingNav, { 
      //   //   x: '-100%', 
      //   //   // opacity: 0, 
      //   //   duration: 0.3, 
      //   //   ease: "power2.in", 
      //   //   onComplete: () => {
      //   //     floatingNav.classList.add('hidden');
      //   //   }
      //   // }, 0.1);
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
  const floatingNavDefaultX = 140 // mobile
  const floatingNavActiveX = 148 // mobile
  const floatingNavDefaultY = 48 // desktop
  const floatingNavActiveY = 44 // desktop
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
      // scroller: '#smooth-wrapper',
      onEnter: () => {
        // if(section !== '#hero') {
          btn.classList.add('active');
          if (window.visualViewport.width >= 768 && navAnimTriggered) {
            gsap.to(btn, { y: floatingNavActiveY, opacity: 1, duration: 0.3, ease: "power2.out" });
          }
          gsap.to('.nav-btn', { color: sectionTextColors[section], duration: 0.3, ease: "power2.out" });
          if (window.visualViewport.width < 768) {
            gsap.to('.nav-btn', { backgroundColor: sectionBackgroundColors[section], boxShadow: `0 0 4px 6px ${sectionBackgroundColors[section]}`, duration: 0.3, ease: "power2.out" });
          }
          // }
      },
      onEnterBack: () => {
        btn.classList.add('active');
        if (window.visualViewport.width >= 768) {
          gsap.to(btn, { y: floatingNavActiveY, opacity: 1, duration: 0.3, ease: "power2.out" });
        }
        gsap.to('.nav-btn', { color: sectionTextColors[section], duration: 0.3, ease: "power2.out" });
        if (window.visualViewport.width < 768) {
          gsap.to('.nav-btn', { backgroundColor: sectionBackgroundColors[section], boxShadow: `0 0 4px 6px ${sectionBackgroundColors[section]}`, duration: 0.3, ease: "power2.out" });
        }
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
      scroller: '#smooth-wrapper',
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
  scroller: '#smooth-wrapper',
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
          baseX: centerX + Math.cos(angle) * radius,
          baseY: centerY + Math.sin(angle) * radius,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          radius: radius, // Store ring radius for wave animation
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
      const angle = Math.atan2(circle.baseY - centerY, circle.baseX - centerX);
      circle.baseX = centerX + Math.cos(angle) * circle.radius;
      circle.baseY = centerY + Math.sin(angle) * circle.radius;

      // // Apply mouse offset // FOR GLOBAL PARALLAX EFFECT
      // const dx = mouseX * maxOffset;
      // const dy = mouseY * maxOffset;
      // circle.x = circle.baseX + dx;
      // circle.y = circle.baseY + dy;

      // Calculate distance from mouse to circle // FOR LOCAL PARALLAX EFFECT
      const dx = mouseX - circle.x;
      const dy = mouseY - circle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Apply localized offset with falloff
      const maxGravityInfluenceRadius = 1500; // Radius within which circles are affected with gravity
      let influence = 1 - Math.min(distance / maxGravityInfluenceRadius, 1); // Linear falloff from 1 to 0
      influence = influence > 0 ? influence * influence : 0; // Quadratic falloff for smoother edge
      const offsetX = dx * influence * (maxOffset / maxGravityInfluenceRadius);
      const offsetY = dy * influence * (maxOffset / maxGravityInfluenceRadius);
      // Apply offset
      circle.x = circle.baseX + offsetX;
      circle.y = circle.baseY + offsetY;
      
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
gsap.from('.about-photo', {
  scrollTrigger: { trigger: '#about', start: 'top 60%', end: 'top top', scrub: 1 },
  opacity: 0,
  x: -50,
  duration: 0.7,
  ease: "power2.out"
});
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
  stagger: 0.15,
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
gsap.set('.mySwiper .swiper-slide img', { scale: 1.05, opacity: 0, transformOrigin: 'center center' });
gsap.set('.mySwiper .swiper-slide .project-details > *', { x: 30, opacity: 0 });

/* --- Create the Swiper WITHOUT autoplay initially --- */
const swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
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
        this.params.autoplay = { delay: 4000, disableOnInteraction: false };
        this.autoplay.start();
      }});
    },
    // When a slide change begins -> animate OUT the previous slide
    slideChangeTransitionStart: function () {
      const prev = this.slides[this.previousIndex];
      if (prev) animateSlideOut(prev);
    },
    // After the slide transition ends -> animate IN the active slide
    slideChangeTransitionEnd: function () {
      const active = this.slides[this.activeIndex];
      animateSlideIn(active);
    }
  }
});

/* Pause autoplay on hover */
const swiperEl = document.querySelector('.mySwiper');
swiperEl.addEventListener('mouseenter', () => swiper.autoplay?.stop());
swiperEl.addEventListener('mouseleave', () => swiper.autoplay?.start());

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
    // start: 'top top',
    end: () => `+=${document.querySelector('#experience').offsetHeight - 100}`,
    scrub: 1,
  },
  opacity: 0,
  scale: 0.8,
  rotation: 5,
  duration: 0.5,
  ease: "power4.out",
});

// Get container and dimensions
const container = document.querySelector('.experience-items-container');
const containerHeight = container.scrollHeight;

// Pin the experience section
ScrollTrigger.create({
  trigger: '#experience',
  pin: true,
  pinSpacing: false,
  // start: 'top top',
  // end: 'top top',
  // endTrigger: '#skills',
  id: 'experiencePin',
});

gsap.to(container, {
  y: -containerHeight,
  ease: 'none',
  scrollTrigger: {
    trigger: '#experience',
    start: 'top top',
    end: `+=${containerHeight}`,
    scrub: true,
    id: 'experienceContainer',
  },
});

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
  const skillsArray = skillsText.innerText.split(',').map(s => s.trim());
  skillsText.innerHTML = skillsArray.map(skill => `<span class="inline-block opacity-0">${skill}</span>`).join(', ');

  const skillItems = skillsText.querySelectorAll('span');

  gsap.fromTo(category, 
    { opacity: 0, x: fromX }, 
    { 
      scrollTrigger: { trigger: category, start: 'top 90%', end: 'bottom 80%', scrub: 0.5 }, 
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
    start: 'top 80%',
  },
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.2,
});

gsap.to('.submit-button', { 
  scale: 1.05, 
  duration: 0.5, 
  repeat: -1, 
  yoyo: true,
});

// Refresh ScrollTrigger and ScrollSmoother
ScrollTrigger.refresh();
// smoother.scrollTop(0); // Reset scroll position
window.addEventListener('resize', () => {
  // projectsScrollWidth = projectsContainer.scrollWidth - window.innerWidth + 300;
  ScrollTrigger.refresh();
  smoother.refresh();
});
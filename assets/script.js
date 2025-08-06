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

const NAV_ANIM_DELAY = 2; // Delay for floating nav animation

// Map section IDs to text colors for contrast
const sectionTextColors = {
  '#hero': '#FFFFFF', // White text on bg-gray-900
  '#about': '#1F2937', // Dark gray (gray-800) on bg-gray-100
  '#projects': '#1F2937', // Dark gray on bg-gray-200
  '#experience': '#FFFFFF', // White text on bg-gray-500
  '#skills': '#1F2937', // Dark gray on bg-gray-300
  '#contact': '#FFFFFF', // White text on bg-gray-800
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
    y: 20,
    rotation: 5,
    duration: 0.7,
    delay: 1.5,
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
            animationTimeout = setTimeout(triggerRandomAnimation, 2000 + Math.random() * 3000);
          }
        });
      }
    });
  }
  setTimeout(triggerRandomAnimation, 3000);

  // Periodic wave jump for hero-text
  function triggerWaveJump() {
    const waveTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 3 + 2 * Math.random(), 
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
  // Start first wave after initial animations (3s delay)
  setTimeout(triggerWaveJump, 3000);


  // Flag to ensure animation runs only once
  let navAnimTriggered = false;
  // Floating navigation appearance animation
  const floatingNavAnimation = gsap.to('.nav-btn', {
    opacity: 0.5,
    x: 124,
    duration: 0.4,
    stagger: 0.06,
    ease: "power4.out",
    // delay: 2
    paused: true, // Start paused
  });
  // Delayed trigger
  gsap.delayedCall(NAV_ANIM_DELAY, () => { // 3-second delay
    if (!navAnimTriggered) {
      floatingNavAnimation.play();
      navAnimTriggered = true; // Set flag to true
    }
  });
  // ScrollTrigger
  ScrollTrigger.create({
    trigger: "#about",
    start: "top center", // Trigger when element is 80% from the top of viewport
    scroller: "#smooth-wrapper",
    onEnter: () => {
      if (!navAnimTriggered) {
        floatingNavAnimation.play();
      }
    },
    once: true // Ensures ScrollTrigger only fires once
  });
  

  // Hover animations for nav buttons
  // document.querySelectorAll('.nav-btn').forEach(btn => {
  //   btn.addEventListener('mouseenter', () => {
  //     gsap.to(btn, { scale: 1.2, duration: 0.2, ease: "power2.out" });
  //   });
  //   btn.addEventListener('mouseleave', () => {
  //     gsap.to(btn, { scale: 1, duration: 0.2, ease: "power2.out" });
  //   });
  // });
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { x: 132, duration: 0.2, ease: "power2.out" });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: btn.classList.contains('active') ? 132 : 124, duration: 0.2, ease: "power2.out" });
    });
  });

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
      start: 'top 15%',
      end: section === '#projects' ? `+=${projectsScrollWidth+window.innerHeight}` : 'bottom 15%', // Extend for projects horizontal scroll
      scroller: '#smooth-wrapper',
      onEnter: () => {
        // if(section !== '#hero') {
          btn.classList.add('active');
          gsap.to(btn, { x: 132, opacity: 1, duration: 0.3, ease: "power2.out", delay: navAnimTriggered ? 0 : section === '#hero' ? NAV_ANIM_DELAY+1 : 0.5 });
          gsap.to('.nav-btn', { color: sectionTextColors[section], duration: 0.3, ease: "power2.out" });
        // }
      },
      onEnterBack: () => {
        btn.classList.add('active');
        gsap.to(btn, { x: 132, opacity: 1, duration: 0.3, ease: "power2.out" });
        gsap.to('.nav-btn', { color: sectionTextColors[section], duration: 0.3, ease: "power2.out" });
      },
      onLeave: () => {
        btn.classList.remove('active');
        gsap.to(btn, { x: 124, opacity: 0.5, duration: 0.3, ease: "power2.out" });
      },
      onLeaveBack: () => {
        btn.classList.remove('active');
        gsap.to(btn, { x: 124, opacity: 0.5, duration: 0.3, ease: "power2.out" });
      }
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


// About Section Animations

// About Section Text Animation
const aboutTl = gsap.timeline();
aboutTl
  .from('.about-title', { x: 500, opacity: 0, duration: 0.5 }, 0)
  .from('.about-text', { x: -500, opacity: 0, duration: 0.5, delay: 0.01 }, 0)
  .from('.about-image', { scale: 0.8, rotation: 45, duration: 1 }, 0);
ScrollTrigger.create({
  trigger: '.about-title',
  start: 'top bottom',
  end: 'top center',
  scrub: 1,
  animation: aboutTl,
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
  },
  opacity: 0,
  scale: 0.1,
  duration: 0.2,
  ease: "power4.out",
});

gsap.from('.project-card', {
  scrollTrigger: { 
    trigger: '#projects', 
    start: 'top 80%',
  },
  opacity: 0,
  scale: 0.8,
  y: 50,
  duration: 0.5,
  stagger: 0.2,
  ease: "power2.out",
});

// Horizontal Scrolling for Projects
const projectsContainer = document.querySelector('.projects-container');
let projectsScrollWidth = projectsContainer.scrollWidth - window.innerWidth + 300;
const extraPinDistance = window.innerHeight;

// Pin the projects section
ScrollTrigger.create({
  trigger: '#projects',
  pin: true,
  pinSpacing: true,
  start: 'top top',
  end: `+=${projectsScrollWidth}`,
  // end: `+=${projectsScrollWidth + extraPinDistance}`,
  id: 'projectsPin',
});

// Horizontal scroll animation
gsap.to('.projects-container', {
  x: -projectsScrollWidth,
  ease: 'none',
  scrollTrigger: {
    trigger: '#projects',
    start: 'top top',
    end: `+=${projectsScrollWidth}`,
    scrub: 1,
    snap: {
      snapTo: 1 / (document.querySelectorAll('.project-card').length - 1),
      duration: 0.2,
      ease: 'power1.inOut',
    },
    id: 'projectsScroll',
  },
});

// Hover effect for project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => gsap.to(card, { scale: 1.05, duration: 0.3, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }));
  card.addEventListener('mouseleave', () => gsap.to(card, { scale: 1, duration: 0.3, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }));
});

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
  start: 'top top',
  end: 'top top',
  endTrigger: '#skills',
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
gsap.from('.skill-icon', {
  scrollTrigger: { 
    trigger: '#skills', 
    end:() => `+=${document.querySelector('#skills').offsetHeight - 200}`,
    scrub: 1,
  },
  opacity: 0,
  rotation: -30,
  y: 20,
  stagger: 0.1,
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
  projectsScrollWidth = projectsContainer.scrollWidth - window.innerWidth + 300;
  ScrollTrigger.refresh();
  smoother.refresh();
});
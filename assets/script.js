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

document.fonts.ready.then(() => {
  // Hero Section Animation
  let heroTitleSplit = SplitText.create(".hero-title", { type: "words" });
  gsap.from(heroTitleSplit.words[0], { 
    opacity: 0, 
    y: -50, 
    duration: 0.5, 
    stagger: 0.4,
    ease: "myBounce",
  });
  gsap.from(heroTitleSplit.words.slice(1), { 
    opacity: 0, 
    y: -50, 
    delay: 0.5,
    duration: 0.5, 
    stagger: 0.2,
    ease: "myBounce",
  });
  gsap.from('.hero-text', {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 1.5,
    ease: "power2.out",
  });
});

// Pin the hero section
ScrollTrigger.create({
  trigger: '#hero',
  pin: true,
  pinSpacing: false,
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
  end: '150%',
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
const projectsScrollWidth = projectsContainer.scrollWidth - window.innerWidth + 300;
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
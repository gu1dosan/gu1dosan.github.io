gsap.registerPlugin(ScrollTrigger, SplitText, CustomBounce);

CustomBounce.create("myBounce", {
  strength:0.5,
})

// Hero Section Animation
let heroTitleSplit = SplitText.create(".hero-title", { type: "words" });
gsap.from(heroTitleSplit.words[0], { 
  opacity: 0, 
  y: -50, 
  duration: 0.5, 
  stagger: 0.4 ,
  ease: "myBounce",
});
gsap.from(heroTitleSplit.words.slice(1), { 
  opacity: 0, 
  y: -50, 
  delay: 0.5,
  duration: 0.5, 
  stagger: 0.2,
  ease: "myBounce"
});

gsap.from('.hero-text', {
  opacity: 0,
  y: 20,
  duration: 1,
  delay: 1.5,
  ease: "power2.out",
})
// let heroTextSplit = SplitText.create(".hero-text", { type: "words" });
// gsap.from(heroTextSplit.words, { 
//   opacity: 0, 
//   x: 200, 
//   duration: 0.3, 
//   delay: 1.3,
//   stagger: {
//     each: 0.1,
//     ease: "power2.in"
//   },
//   ease: "power2.out" 
// });

// About Section Animation (Scrubbed with scroll)
const aboutTl = gsap.timeline();
aboutTl.from('.about-image', { scale: 0.8, rotation: 10, duration: 0.1 })
        .from('.about-title', { x: 500, opacity: 0, duration: 0.1 }, 0) // Overlap animations
        .from('.about-text', { x: -500, opacity: 0, duration: 0.1, delay: 0.01 }, 0); // Overlap animations
ScrollTrigger.create({
  trigger: '#about',
  // start: 'top 120%',
  end: () => `+=${document.querySelector('#about').offsetHeight}`,
  scrub: 1, // Animation progresses with scroll, reverses on scroll up
  animation: aboutTl
});

// Projects Title Animation
gsap.from('.projects-title', {
  scrollTrigger: { trigger: '#projects', scrub: 1 , end: () => `+=${document.querySelector('#projects').offsetHeight-100}` },
  opacity: 0,
  scale: 0.1,
  duration: 0.5,
  ease: "power4.out",
});

gsap.from('.project-card', {
  scrollTrigger: { trigger: '#projects', start: 'top 80%' },
  opacity: 0,
  scale: 0.5,
  x: (index, target) => {
    const cardRect = target.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const screenCenter = window.innerWidth / 2;
    return screenCenter - cardCenter;
  },
  y: -100,
  duration: 0.7,
  stagger: {
    each: 0.15,
    // ease: "power4.in",
  },
  ease: "power4.out",
})

// Projects Section Horizontal Scrolling
gsap.to('.projects-container', {
  x: () => -(document.querySelector('.projects-container').scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '#projects',
    pin: true,
    scrub: 1,
    snap: 1 / (document.querySelectorAll('.project-card').length - 1), // Snap to each card
    end: () => '+=' + document.querySelector('.projects-container').scrollWidth
  }
});
// Hover effect for project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => gsap.to(card, { scale: 1.05, duration: 0.3 }));
  card.addEventListener('mouseleave', () => gsap.to(card, { scale: 1, duration: 0.3 }));
});

// Skills Section Animation
// gsap.from('.skills-title', {
//   scrollTrigger: { trigger: '#skills', scrub:1 },
//   opacity: 0,
//   y: -50,
//   duration: 1,
//   ease: "power2.out"
// })
gsap.from('.skill-icon', {
  scrollTrigger: { trigger: '#skills', end:() => `+=${document.querySelector('#skills').offsetHeight - 300}`, scrub: 1 },
  opacity: 0,
  rotation: -30,
  y: 20,
  amount: 1,
  stagger: 0.1
});

// Contact Section Animation
gsap.from('.contact-field', {
  scrollTrigger: { trigger: '#contact', start: 'top 80%' },
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.2
});
gsap.to('.submit-button', { 
  scale: 1.05, 
  duration: 0.5, 
  repeat: -1, 
  yoyo: true 
});
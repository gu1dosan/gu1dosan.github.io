gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, CustomBounce);

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

// Hero text parallax effect
gsap.fromTo('.hero-content', 
  { y: 0 },
  {
    y: () => -(document.querySelector('#hero').offsetHeight / 2),
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      refreshPriority: -1 // Lower priority to avoid conflicts
    }
  }
);

// Pin the hero section
ScrollTrigger.create({
  trigger: '#hero',
  pin: true,
  pinSpacing: false, // Prevents extra spacing
});


// About Section Animation (Scrubbed with scroll)
const aboutTl = gsap.timeline();
aboutTl
        .from('.about-title', { x: 500, opacity: 0, duration: 0.1 }, 0) // Overlap animations
        .from('.about-text', { x: -500, opacity: 0, duration: 0.1, delay: 0.01 }, 0) // Overlap animations
        .from('.about-image', { scale: 0.8, rotation: 45, duration: 0.1 }, 0)
ScrollTrigger.create({
  trigger: '.about-title',
  start: 'top bottom',
  end: '+=200',
  scrub: 1, // Animation progresses with scroll, reverses on scroll up
  animation: aboutTl
});

// Pin the about section
ScrollTrigger.create({
  trigger: '#about',
  pin: true,
  pinSpacing: false, // Prevents extra spacing
  end: '150%',
});


// Projects Title Animation
gsap.from('.projects-title', {
  scrollTrigger: { trigger: '#projects', scrub: 1 },
  opacity: 0,
  scale: 0.1,
  duration: 0.2,
  ease: "power4.out",
});

gsap.from('.project-card', {
  scrollTrigger: { trigger: '#projects' },
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

// // Pin the projects section
// ScrollTrigger.create({
//   trigger: '#projects',
//   pin: true,
//   pinSpacing: false // Prevents extra spacing
// });



// Work Experience Section Animation
gsap.from('.experience-title', {
  scrollTrigger: { trigger: '#experience', scrub: 1, end: () => `+=${document.querySelector('#experience').offsetHeight - 100}` },
  opacity: 0,
  scale: 0.8,
  rotation: 5,
  duration: 0.5,
  ease: "power4.out",
});

gsap.from('.experience-item', {
  scrollTrigger: { trigger: '#experience', scrub: 1 },
  opacity: 0,
  x: (index) => index % 2 === 0 ? -100 : 100, // Alternate from left and right
  y: 50,
  duration: 0.5,
  stagger: {
    each: 0.2,
  },
  ease: "power3.out",
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

// Pin the experience section
// ScrollTrigger.create({
//   trigger: '#experience',
//   pin: true,
//   pinSpacing: false // Prevents extra spacing
// });


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
  // amount: 1, // gives error
  stagger: 0.1
});

// Pin the skills section
ScrollTrigger.create({
  trigger: '#skills',
  pin: true,
  pinSpacing: false, // Prevents extra spacing
  end: '+=150%'
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


const modelViewer = document.querySelector(".showcase__model");
const title = document.querySelector(".title");
const radios = document.querySelectorAll('input[name="modelColor"]');
const prevBtn = document.querySelector(".next img:first-child");
const nextBtn = document.querySelector(".next img:last-child");


  //  SCREEN LOADER – ONLY MAIN MODEL CONTROLS IT

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("page-loader");
  if (!loader || !modelViewer) return;

  let hidden = false;

  const hideLoader = () => {
    if (hidden) return;
    hidden = true;
    loader.classList.add("hide");
  };

  modelViewer.addEventListener("load", hideLoader, { once: true });

  setTimeout(hideLoader, 5000);
});

  //  MODEL SWITCHING + PRELOAD (BACKGROUND)

const MODELS = [
  "./model/headphone.glb",
  "./model/h1.glb",
  "./model/h2.glb",
  "./model/h3.glb",
];

let currentModelIndex = 0;

function loadModel(index) {
  if (!modelViewer) return;

  modelViewer.classList.add("slide-out");

  setTimeout(() => {
    modelViewer.setAttribute("src", MODELS[index]);
    modelViewer.classList.remove("slide-out");
    modelViewer.classList.add("slide-in");

    modelViewer.addEventListener(
      "load",
      () => {
        modelViewer.classList.remove("slide-in");
      },
      { once: true }
    );
  }, 300);
}

prevBtn?.addEventListener("click", () => {
  currentModelIndex = (currentModelIndex - 1 + MODELS.length) % MODELS.length;
  loadModel(currentModelIndex);
});

nextBtn?.addEventListener("click", () => {
  currentModelIndex = (currentModelIndex + 1) % MODELS.length;
  loadModel(currentModelIndex);
});

// Background pre-caching of remaining 3D models during idle time
const preloadModels = () => {
  const modelsToPreload = [
    "./model/h1.glb",
    "./model/h2.glb",
    "./model/h3.glb",
    "./model/h5.glb",
    "./model/h8.glb",
    "./model/h6.glb",
    "./model/h7.glb"
  ];

  modelsToPreload.forEach((src) => {
    fetch(src, { priority: "low" }).catch(() => {});
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "fetch";
    link.href = src;
    document.head.appendChild(link);
  });
};

if ("requestIdleCallback" in window) {
  requestIdleCallback(preloadModels);
} else {
  setTimeout(preloadModels, 1000);
}

  //  EXPOSURE / COLOR RADIO (LIGHT)

radios.forEach((radio) => {
  radio.addEventListener("change", () => {
    modelViewer?.setAttribute("exposure", radio.value);

    if (!title) return;
    title.style.color =
      radio.value === "1"
        ? "#ffffff"
        : radio.value === "6"
        ? "#3c3c3c"
        : "#282828";
  });
});

  //  TESTIMONIAL SECTION – SCROLL LINKED PREMIUM MOTION/

const testimonialSection = document.querySelector(".testimonials-grid-layout");
const testimonialCards = document.querySelectorAll(".testimonial-card");

if (testimonialSection && testimonialCards.length) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(testimonialCards, {
    opacity: 0,
    y: 140,
    scale: 0.92,
  });

  gsap.to(testimonialCards, {
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.2,
    ease: "none",
    scrollTrigger: {
      trigger: testimonialSection,
      start: "top 90%",
      end: "top 20%",
      scrub: true,
    },
  });
}
  //  FAQ ACCORDION (NON-BLOCKING)

setTimeout(() => {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const header = item.querySelector(".faq-header");

    header?.addEventListener("click", () => {
      document.querySelectorAll(".faq-item").forEach((other) => {
        if (other !== item) {
          other.classList.remove("active");
          other.querySelector(".icon").textContent = "+";
        }
      });

      item.classList.toggle("active");
      const icon = item.querySelector(".icon");
      if (icon)
        icon.textContent = item.classList.contains("active") ? "−" : "+";
    });
  });
}, 1500);

  //  PRODUCT THUMB MODEL SWAP (IDLE)

requestIdleCallback?.(() => {
  const thumbs = document.querySelectorAll(".thumb");
  const modelA = document.getElementById("modelA");
  const modelB = document.getElementById("modelB");

  if (!thumbs.length || !modelA || !modelB) return;

  let current = modelA;
  let next = modelB;

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbs.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");

      next.setAttribute("src", thumb.dataset.model);

      next.addEventListener(
        "load",
        () => {
          current.classList.remove("active");
          next.classList.add("active");
          [current, next] = [next, current];
        },
        { once: true }
      );
    });
  });
});

  //   GSAP STORY TITLE – LAZY LOAD ON SCROLL

const storyTitle = document.querySelector(".story-title");

if (storyTitle) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;

      gsap.registerPlugin(ScrollTrigger);

      const words = storyTitle.innerText.split(" ");
      storyTitle.innerHTML = words
        .map((w) => `<span>${w}&nbsp;</span>`)
        .join("");

      gsap.to(storyTitle.querySelectorAll("span"), {
        filter: "blur(0px)",
        opacity: 1,
        y: 0,
        stagger: 0.08,
        scrollTrigger: {
          trigger: storyTitle,
          start: "top 85%",
          end: "top 30%",
          scrub: true,
        },
      });

      observer.disconnect();
    },
    { threshold: 0.3 }
  );

  observer.observe(storyTitle);
}

  //  PRODUCT SECTION – SLOW SCROLL LINKED MOTION

const productSection = document.querySelector(".products");
const productCards = document.querySelectorAll(".product-card");

if (productSection && productCards.length) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(productCards, {
    opacity: 0,
    y: 160,
    scale: 0.9,
  });

  gsap.to(productCards, {
    opacity: 1,
    y: 0,
    scale: 1,
    ease: "none",
    stagger: 0.25,
    scrollTrigger: {
      trigger: productSection,
      start: "top 95%",
      end: "top 10%",
      scrub: true,
    },
  });
}

  // SCROLL COUNTER (3.2k+) – FIXED & RELIABLE

const counterEl = document.querySelector(".count-number");

if (counterEl) {
  gsap.registerPlugin(ScrollTrigger);

  const finalValue = parseInt(counterEl.dataset.count, 10);

  const counterObj = { value: 0 };

  gsap.to(counterObj, {
    value: finalValue,
    duration: 2.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: counterEl,
      start: "top 80%",
      once: true,
    },
    onUpdate: () => {
      const val = Math.floor(counterObj.value);
      counterEl.innerHTML = (val / 1000).toFixed(1) + "k<span>+</span>";
    },
  });
}
document.getElementById("closeTopBar").onclick = () => {
  const topBar = document.getElementById("topBar");
  const navbar = document.querySelector(".navbar");

  topBar.style.display = "none";
  navbar.style.top = "0";
};

//  ULTRA SMOOTH SCROLL – CUSTOM EASING WITH MOMENTUM
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 + -2 * Math.pow(2 * t - 2, 3) / 2;
}

function smoothScrollTo(target, duration = 1000) {
  const startPosition = window.scrollY;
  const targetPosition = target.offsetTop - 100;
  const distance = targetPosition - startPosition;
  const startTime = performance.now();

  function animation(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

//  SMOOTH SCROLL ENHANCEMENT – ANCHOR LINKS WITH EASING
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      smoothScrollTo(target, 800);
      // Close mobile menu if open
      document.getElementById("navMenu").classList.remove("active");
    }
  });
});

//  Mobile menu toggle
document.getElementById("menuToggle").onclick = () => {
  document.getElementById("navMenu").classList.toggle("active");
};

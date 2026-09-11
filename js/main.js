/**
 * FABIO IGNACIO TORRES BENÍTEZ — PORTFOLIO ENGINE
 * Responsive, local-first theme & language controller, dynamic metrics & interactive filters.
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLanguage();
  initMetricsCounter();
  initProjectFilters();
  initSmoothScroll();
});

/* -------------------------------------------------------------------------- */
/* THEME CONTROLLER: Blanco Grisáceo (Default) <-> Dark Mode                  */
/* -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById("themeToggle");
  const currentTheme = localStorage.getItem("ft_theme") || "light";
  
  applyTheme(currentTheme);
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(activeTheme);
      localStorage.setItem("ft_theme", activeTheme);
    });
  }
}

function applyTheme(theme) {
  const themeIcon = document.getElementById("themeIcon");
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (themeIcon) {
      // Sun icon for switching back to light
      themeIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    }
  } else {
    document.documentElement.removeAttribute("data-theme");
    if (themeIcon) {
      // Moon icon for switching to dark
      themeIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  }
}

/* -------------------------------------------------------------------------- */
/* LANGUAGE CONTROLLER: ES <-> EN Dynamic Content Swap                        */
/* -------------------------------------------------------------------------- */
function initLanguage() {
  const langToggleBtn = document.getElementById("langToggle");
  const savedLang = localStorage.getItem("ft_lang") || "es";
  
  applyLanguage(savedLang);
  
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      const currentLang = localStorage.getItem("ft_lang") || "es";
      const nextLang = currentLang === "es" ? "en" : "es";
      applyLanguage(nextLang);
      localStorage.setItem("ft_lang", nextLang);
    });
  }
}

function applyLanguage(lang) {
  const langToggleBtn = document.getElementById("langToggle");
  if (langToggleBtn) {
    langToggleBtn.innerText = lang === "es" ? "EN" : "ES";
    langToggleBtn.title = lang === "es" ? "Switch to English" : "Cambiar a Español";
  }
  
  document.documentElement.setAttribute("lang", lang);
  
  const i18nElements = document.querySelectorAll("[data-i18n-es]");
  i18nElements.forEach(el => {
    const text = lang === "en" ? el.getAttribute("data-i18n-en") : el.getAttribute("data-i18n-es");
    if (text) {
      el.innerHTML = text;
    }
  });
}

/* -------------------------------------------------------------------------- */
/* METRIC ANIMATED COUNTERS (Google XYZ Impact)                                */
/* -------------------------------------------------------------------------- */
function initMetricsCounter() {
  const metricNumbers = document.querySelectorAll(".metric-number");
  let animated = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        metricNumbers.forEach(el => {
          const target = parseInt(el.getAttribute("data-target"), 10);
          const prefix = el.getAttribute("data-prefix") || "";
          const suffix = el.getAttribute("data-suffix") || "";
          animateValue(el, 0, target, 1800, prefix, suffix);
        });
      }
    });
  }, { threshold: 0.3 });
  
  const metricsSection = document.querySelector(".metrics-section");
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

function animateValue(element, start, end, duration, prefix, suffix) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const currentValue = Math.floor(easeOutQuad * (end - start) + start);
    
    element.textContent = prefix + currentValue.toLocaleString() + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = prefix + end.toLocaleString() + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

/* -------------------------------------------------------------------------- */
/* PROJECT CATEGORY FILTERS                                                   */
/* -------------------------------------------------------------------------- */
function initProjectFilters() {
  const tabs = document.querySelectorAll(".tab-btn");
  const cards = document.querySelectorAll(".project-card");
  
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const filter = tab.getAttribute("data-filter");
      
      cards.forEach(card => {
        if (filter === "all") {
          card.style.display = "flex";
        } else {
          const categories = card.getAttribute("data-category") || "";
          if (categories.includes(filter)) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* SMOOTH SCROLL & ACTIVE LINK HIGHLIGHT                                      */
/* -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  
  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* CLIPBOARD TOAST HELPER                                                     */
/* -------------------------------------------------------------------------- */
window.copyToClipboard = function(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg || "Copiado al portapapeles / Copied to clipboard");
  }).catch(() => {
    showToast("Error al copiar");
  });
};

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* Shared site behavior */
(function () {
  // Theme toggle
  const root = document.documentElement;
  const themeBtn = document.querySelector(".theme-toggle");
  const THEME_KEY = "mm-theme";

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    if (themeBtn) {
      const next = theme === "dark" ? "light" : "dark";
      themeBtn.setAttribute("aria-label", `Switch to ${next} theme`);
      themeBtn.title = `Switch to ${next} theme`;
    }
  }

  applyTheme(getPreferredTheme());

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");

  function setMenuOpen(open) {
    if (!toggle || !links) return;
    links.classList.toggle("open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      setMenuOpen(!links.classList.contains("open"));
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenuOpen(false));
    });
  }

  // Active nav link
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(".nav-links a[data-nav]").forEach((a) => {
      if (a.dataset.nav === page) a.classList.add("active");
    });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // Contact form via Web3Forms
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const success = document.getElementById("form-success");
      const submitBtn = form.querySelector('button[type="submit"]');
      const data = new FormData(form);
      const service = String(data.get("service") || "").trim();

      data.set(
        "subject",
        `Free Quote Request: ${service || "Cleaning"} | M&M Cleaning Solutions`
      );

      if (success) {
        success.classList.remove("show", "error");
        success.textContent = "Sending...";
        success.classList.add("show");
      }
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: data,
        });
        const json = await res.json();

        if (json.success) {
          if (success) {
            success.classList.remove("error");
            success.textContent =
              "Thanks! Your message was sent. We'll get back to you soon. You can also call or text 204 922 1052.";
          }
          form.reset();
        } else {
          throw new Error(json.message || "Something went wrong.");
        }
      } catch (err) {
        if (success) {
          success.classList.add("error");
          success.textContent =
            "Sorry, we couldn't send that right now. Please call or text 204 922 1052, or email mmcleaningsolution26@gmail.com.";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Year in footer
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Scroll to top button
  const scrollTop = document.createElement("button");
  scrollTop.type = "button";
  scrollTop.className = "scroll-top";
  scrollTop.setAttribute("aria-label", "Scroll to top");
  scrollTop.innerHTML = "↑";
  document.body.appendChild(scrollTop);

  const updateScrollTop = () => {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    scrollTop.classList.toggle("visible", scrolled > 400);
  };

  window.addEventListener("scroll", updateScrollTop, { passive: true });
  updateScrollTop();

  scrollTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

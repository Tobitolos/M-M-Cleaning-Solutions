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

  // Contact form opens email client with filled details
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const email = String(data.get("email") || "").trim();
      const service = String(data.get("service") || "").trim();
      const message = String(data.get("message") || "").trim();

      const subject = encodeURIComponent(`Free Quote Request: ${service || "Cleaning"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`
      );

      window.location.href = `mailto:mmcleaningsolution26@gmail.com?subject=${subject}&body=${body}`;

      const success = document.getElementById("form-success");
      if (success) {
        success.classList.add("show");
        success.textContent =
          "Thanks! Your email app should open so you can send the request. You can also call or text 204 922 1052.";
      }
      form.reset();
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

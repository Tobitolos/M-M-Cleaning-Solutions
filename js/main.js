/* Shared site behavior */
(function () {
 const toggle = document.querySelector(".menu-toggle");
 const links = document.querySelector(".nav-links");

 if (toggle && links) {
 toggle.addEventListener("click", () => {
 const open = links.classList.toggle("open");
 toggle.setAttribute("aria-expanded", open ? "true" : "false");
 });

 links.querySelectorAll("a").forEach((a) => {
 a.addEventListener("click", () => links.classList.remove("open"));
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
})();

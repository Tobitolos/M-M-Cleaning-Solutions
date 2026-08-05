/* Customer reviews multiple people can post comments */
(function () {
 const STORAGE_KEY = "mm-reviews";
 const form = document.getElementById("review-form");
 const list = document.getElementById("reviews-list");
 const countEl = document.getElementById("review-count");
 const success = document.getElementById("review-success");

 if (!form || !list) return;

 function loadReviews() {
 try {
 const raw = localStorage.getItem(STORAGE_KEY);
 const data = raw ? JSON.parse(raw) : [];
 return Array.isArray(data) ? data : [];
 } catch {
 return [];
 }
 }

 function saveReviews(reviews) {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
 }

 function escapeHtml(str) {
 return String(str)
 .replace(/&/g, "&amp;")
 .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;")
 .replace(/"/g, "&quot;");
 }

 function stars(rating) {
 const n = Math.max(1, Math.min(5, Number(rating) || 5));
 return "★".repeat(n) + "☆".repeat(5 - n);
 }

 function formatDate(ts) {
 try {
 return new Date(ts).toLocaleDateString(undefined, {
 year: "numeric",
 month: "short",
 day: "numeric",
 });
 } catch {
 return "";
 }
 }

 function render() {
 const reviews = loadReviews().sort((a, b) => b.createdAt - a.createdAt);
 const n = reviews.length;
 if (countEl) countEl.textContent = n === 1 ? "1 review" : `${n} reviews`;

 if (!reviews.length) {
 list.innerHTML = `
 <div class="media-empty">
 <p>No reviews yet. Be the first to leave a comment!</p>
 </div>`;
 return;
 }

 list.innerHTML = reviews
 .map(
 (r) => `
 <article class="review-card">
 <div class="review-card-top">
 <div>
 <h3>${escapeHtml(r.name)}</h3>
 <div class="review-stars" aria-label="${r.rating} out of 5 stars">${stars(r.rating)}</div>
 </div>
 <time datetime="${new Date(r.createdAt).toISOString()}">${formatDate(r.createdAt)}</time>
 </div>
 <p>${escapeHtml(r.comment)}</p>
 </article>`
 )
 .join("");
 }

 form.addEventListener("submit", (e) => {
 e.preventDefault();
 const data = new FormData(form);
 const name = String(data.get("name") || "").trim();
 const comment = String(data.get("comment") || "").trim();
 const rating = Number(data.get("rating") || 5);

 if (!name || !comment) return;

 const reviews = loadReviews();
 reviews.push({
 id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
 name,
 comment,
 rating,
 createdAt: Date.now(),
 });
 saveReviews(reviews);
 form.reset();
 document.getElementById("review-rating").value = "5";
 render();

 if (success) {
 success.classList.add("show");
 success.textContent = "Thank you! Your review has been added.";
 setTimeout(() => success.classList.remove("show"), 4000);
 }
 });

 render();
})();

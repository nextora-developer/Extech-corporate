/* =========================
   Reveal on Scroll
========================= */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* =========================
   Hero Left / Right Reveal
========================= */
window.addEventListener("load", () => {
  document
    .querySelectorAll(".reveal-left, .reveal-right")
    .forEach((el) => el.classList.add("show"));
});

/* =========================
   Inject Partials (Header / Footer)
========================= */
async function injectPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  try {
    const res = await fetch(url);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(`Failed to load ${url}`, err);
  }

  applyNavActive();
}

injectPartial("#site-header", "/partials/header.html");
injectPartial("#site-footer", "/partials/footer.html");

/* =========================
   Navlink Active
========================= */
function applyNavActive() {
  const currentPage = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  const links = document.querySelectorAll("[data-nav]");
  if (!links.length) return; // header 还没插入就直接跳过

  links.forEach((link) => {
    // reset
    link.classList.remove("text-cyan-400", "relative", "font-semibold");
    const old = link.querySelector(".nav-underline");
    if (old) old.remove();

    const href = (link.getAttribute("href") || "").toLowerCase();

    // ✅ match (支持 / 变 index.html)
    const isHome =
      (location.pathname === "/" || currentPage === "") &&
      href === "index.html";
    const isMatch = href === currentPage || isHome;

    if (isMatch) {
      link.classList.add("text-cyan-400", "relative", "font-semibold");

      const underline = document.createElement("span");
      underline.className =
        "nav-underline absolute left-0 -bottom-2 w-full h-[2px] bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]";
      link.appendChild(underline);
    }
  });
}

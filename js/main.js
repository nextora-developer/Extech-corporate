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
  bindMobileNav();
}

injectPartial("#site-header", "/partials/header.html");
injectPartial("#site-footer", "/partials/footer.html");

/* =========================
   Navlink Active
========================= */
function applyNavActive() {
  const path = location.pathname.toLowerCase();

  const links = document.querySelectorAll("[data-nav]");
  if (!links.length) return;

  // ✅ 判断是否 mobile（和 Tailwind md 断点一致）
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  links.forEach((link) => {
    // reset
    link.classList.remove("text-cyan-400", "relative", "font-semibold");
    const old = link.querySelector(".nav-underline");
    if (old) old.remove();

    const href = (link.getAttribute("href") || "").toLowerCase();
    const linkPath = href.startsWith("/") ? href : `/${href}`;

    let isActive = false;

    // Home
    if (
      (path === "/" || path === "/index.html") &&
      (linkPath === "/index.html" || linkPath === "/")
    ) {
      isActive = true;
    }

    // Exact match
    if (path === linkPath) {
      isActive = true;
    }

    // Services subpages
    if (path.startsWith("/services/") && linkPath === "/services.html") {
      isActive = true;
    }

    if (isActive) {
      link.classList.add("text-cyan-400", "font-semibold");

      // ❌ 手机不要 underline
      if (isMobile) return;

      // ✅ Desktop 才加 underline
      link.classList.add("relative");

      const underline = document.createElement("span");
      underline.className =
        "nav-underline absolute left-0 -bottom-2 w-full h-[2px] bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]";
      link.appendChild(underline);
    }
  });
}

/* =========================
   Mobile Nav (Hamburger)
========================= */
function bindMobileNav() {
  const btn = document.getElementById("navToggle");
  const overlay = document.getElementById("navOverlay");
  const drawer = document.getElementById("navDrawer");

  // Partial 还没注入时会拿不到，所以这里要允许重复调用
  if (!btn || !overlay || !drawer) return;

  const open = () => {
    overlay.classList.remove("opacity-0", "pointer-events-none");
    overlay.classList.add("opacity-100");
    drawer.classList.remove("translate-x-full");
    btn.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("overflow-hidden"); // lock scroll
  };

  const close = () => {
    overlay.classList.add("opacity-0", "pointer-events-none");
    overlay.classList.remove("opacity-100");
    drawer.classList.add("translate-x-full");
    btn.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("overflow-hidden");
  };

  // 防止重复绑定（injectPartial 可能多次）
  if (btn.dataset.bound === "1") return;
  btn.dataset.bound = "1";

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });

  overlay.addEventListener("click", close);

  // 点击 drawer 内任何链接就关闭
  drawer.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", close);
  });

  // ESC 关闭
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

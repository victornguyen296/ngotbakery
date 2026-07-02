/* ============================================
   CONFIG — dán URL Apps Script Web App vào đây
   sau khi làm xong Bước 3 trong hướng dẫn.
   VD: "https://script.google.com/macros/s/xxxxx/exec"
   ============================================ */
const SITE_CONFIG = {
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxKNCYRyIUfvlbGl04QpDSpzmU1DG6LrdSQCWdUmGch7Zs98u9mGuqPsN2aOhjcHn4khw/exec"
};

/* Dữ liệu mẫu — hiển thị tạm khi chưa nối Google Sheet,
   hoặc khi Sheet đang lỗi/offline, để trang không bao giờ trống trơn. */
const FALLBACK_MENU = [
  { id: "m1", category: "Trend", name: "Basque Cheesecake", description: "Mặt bánh cháy caramel, ruột kem béo mịn.", price: "185.000₫", image_url: "https://placehold.co/800x800/6E2A3A/FBF6EF?text=Basque+Cheesecake", active: "TRUE" },
  { id: "m2", category: "Signature", name: "Su kem nhân kem tươi", description: "Vỏ su giòn xốp, nhân kem tươi Pháp.", price: "35.000₫ / cái", image_url: "https://placehold.co/800x800/C9974C/FBF6EF?text=Su+kem", active: "TRUE" },
  { id: "m3", category: "Mới", name: "Chocolate Dubai Bar", description: "Chocolate nhân kataifi pistachio giòn tan.", price: "65.000₫", image_url: "https://placehold.co/800x800/2B211D/FBF6EF?text=Dubai+Bar", active: "TRUE" },
  { id: "m4", category: "Đặt trước", name: "Bánh kem sinh nhật", description: "Thiết kế theo yêu cầu, đặt trước 48h.", price: "Từ 350.000₫", image_url: "https://placehold.co/800x800/8BA878/FBF6EF?text=Banh+sinh+nhat", active: "TRUE" }
];

const FALLBACK_BLOG = [
  { id: "p1", date: "28/06/2026", category: "Bài mới nhất", title: "Mình đã học làm Basque Cheesecake như thế nào", excerpt: "Ba lần cháy mặt bánh, hai lần sập ruột — và cuối cùng là công thức mình dùng mỗi tuần.", content: "<p>Nội dung đầy đủ của bài viết sẽ hiển thị ở đây khi bạn nhập vào Google Sheet, cột content.</p>", image_url: "https://placehold.co/1200x750/6E2A3A/FBF6EF?text=Basque+Cheesecake", active: "TRUE" },
  { id: "p2", date: "20/06/2026", category: "Kiến thức", title: "Vì sao vỏ su kem hay bị xẹp?", excerpt: "3 lỗi phổ biến nhất khi làm bánh su.", content: "<p>Nội dung đầy đủ...</p>", image_url: "https://placehold.co/1200x750/8BA878/FBF6EF?text=Su+kem", active: "TRUE" },
  { id: "p3", date: "12/06/2026", category: "Trend", title: "Thử làm Chocolate Dubai Bar tại nhà", excerpt: "Trend viral từ Dubai — liệu có đáng công sức?", content: "<p>Nội dung đầy đủ...</p>", image_url: "https://placehold.co/1200x750/C9974C/FBF6EF?text=Dubai+Bar", active: "TRUE" }
];

async function fetchSheetData(type, extraQuery = "") {
  if (!https://script.google.com/macros/s/AKfycbzc1YY8gZTqmWihCCKY86JsR5ySMqBwxuBygWp_BOgBCnLS42DSdwTnpX3Nzz4MjHAfvg/exec) return null;
  try {
    const res = await fetch(`${SITE_CONFIG.APPS_SCRIPT_URL}?type=${type}${extraQuery}`);
    if (!res.ok) throw new Error("Network error " + res.status);
    return await res.json();
  } catch (err) {
    console.warn("Không tải được dữ liệu từ Google Sheet, dùng dữ liệu mẫu:", err);
    return null;
  }
}

function isActive(row) {
  return String(row.active).toUpperCase() !== "FALSE";
}

function menuCardHTML(item) {
  return `
    <div class="item-card">
      <div class="item-media"><img src="${item.image_url}" alt="${item.name}" loading="lazy"></div>
      <div class="item-body">
        <span class="k">${item.category || ""}</span>
        <h4>${item.name}</h4>
        <p>${item.description || ""}</p>
        <div class="item-price"><span>${item.price || ""}</span><a href="order.html">Đặt ngay →</a></div>
      </div>
    </div>`;
}

function postCardHTML(post, featured) {
  return `
    <article class="post-card${featured ? " featured" : ""}">
      <a href="post.html?id=${encodeURIComponent(post.id)}">
        <div class="post-media"><img src="${post.image_url}" alt="${post.title}" loading="lazy"></div>
        <div class="post-body">
          <span class="post-date">${post.date || ""} · ${post.category || ""}</span>
          <h3>${post.title}</h3>
          <p>${post.excerpt || ""}</p>
          <span class="read">Đọc tiếp →</span>
        </div>
      </a>
    </article>`;
}

async function renderMenu(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let items = (await fetchSheetData("menu")) || FALLBACK_MENU;
  items = items.filter(isActive);
  if (limit) items = items.slice(0, limit);
  container.innerHTML = items.length
    ? items.map(menuCardHTML).join("")
    : `<p class="loading-note">Chưa có món nào trong menu.</p>`;
}

async function renderBlog(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let posts = (await fetchSheetData("blog")) || FALLBACK_BLOG;
  posts = posts.filter(isActive);
  if (limit) posts = posts.slice(0, limit);
  container.innerHTML = posts.length
    ? posts.map((p, i) => postCardHTML(p, i === 0)).join("")
    : `<p class="loading-note">Chưa có bài viết nào.</p>`;
}

async function renderPost(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let post = await fetchSheetData("post", `&id=${encodeURIComponent(id)}`);
  if (!post) post = FALLBACK_BLOG.find((p) => p.id === id) || FALLBACK_BLOG[0];

  document.title = post.title + " — Ngọt";
  container.innerHTML = `
    <a href="blog.html" class="back-link">← Quay lại Blog</a>
    <span class="post-date">${post.date || ""} · ${post.category || ""}</span>
    <h1>${post.title}</h1>
    <div class="post-hero-img"><img src="${post.image_url}" alt="${post.title}" loading="lazy"></div>
    <div class="post-content">${post.content || ""}</div>
  `;
}

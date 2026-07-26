/* =========================================================
   MR FASAL WALA — SCRIPT.JS
   Vanilla JS. No frameworks. Handles: product rendering,
   search/filter, cart, wishlist, modals, checkout (COD only).
   ========================================================= */

/* ---------------------------------------------------------
   1. DATA
   --------------------------------------------------------- */
const STATES = [
  "Punjab","Haryana","Uttar Pradesh","Madhya Pradesh","Maharashtra","Rajasthan",
  "Gujarat","Bihar","West Bengal","Tamil Nadu","Karnataka","Andhra Pradesh",
  "Telangana","Odisha","Chhattisgarh","Assam"
];

const SELLERS = ["Ramesh Farms","Green Valley Agro","Kisan Direct","Suresh & Sons","Bharat Agro Traders","Annapurna Farms","Farmwell Co-op","Godavari Growers"];

function pick(arr,i){ return arr[i % arr.length]; }
function emoji(list,i){ return pick(list,i); }

// Fasal (crop) products
const FASAL_RAW = [
  ["Wheat","🌾",2180,"quintal",true],
  ["Rice (Basmati)","🍚",3400,"quintal",true],
  ["Paddy","🌾",2040,"quintal",false],
  ["Maize","🌽",1960,"quintal",false],
  ["Mustard","🌻",5650,"quintal",true],
  ["Chana (Gram)","🫘",5230,"quintal",false],
  ["Masoor Lentils","🫘",6100,"quintal",true],
  ["Soybean","🌱",4380,"quintal",false],
  ["Bajra","🌾",2350,"quintal",false],
  ["Jowar","🌾",2970,"quintal",true],
  ["Sugarcane","🎋",340,"quintal",false],
  ["Potato","🥔",1150,"quintal",false],
  ["Onion","🧅",1600,"quintal",true],
  ["Tomato","🍅",1200,"quintal",false],
  ["Garlic","🧄",8200,"quintal",true],
  ["Ginger","🫚",7100,"quintal",true],
  ["Alphonso Mango","🥭",5500,"quintal",true],
  ["Green Chilli","🌶️",2800,"quintal",false]
];

// Fasal waste products
const WASTE_RAW = [
  ["Rice Husk","🌾",680,"quintal",false],
  ["Wheat Straw","🌿",520,"quintal",false],
  ["Paddy Straw","🌿",480,"quintal",false],
  ["Sugarcane Bagasse","🎋",610,"quintal",false],
  ["Corn Stalk","🌽",450,"quintal",false],
  ["Cotton Waste","🧵",720,"quintal",false],
  ["Coconut Husk","🥥",590,"quintal",true],
  ["Dry Leaves","🍂",310,"quintal",false],
  ["Saw Dust","🪵",560,"quintal",false],
  ["Biomass Pellets","🌾",980,"quintal",true],
  ["Organic Compost","🌱",1450,"quintal",true],
  ["Cow Dung Manure","🐄",890,"quintal",true],
  ["Animal Feed Waste","🌾",640,"quintal",false]
];

function buildProducts(raw, category, prefix){
  return raw.map((r,i)=>{
    const [name, ico, price, unit, organic] = r;
    const stockRoll = i % 5;
    const stock = stockRoll === 0 ? "out" : stockRoll === 1 ? "low" : "in";
    return {
      id: prefix + "-" + i,
      name, icon: ico, category,
      price: price + (i*13 % 90),
      unit,
      organic,
      rating: (3.6 + (i % 5) * 0.3).toFixed(1),
      ratingCount: 40 + (i * 27) % 400,
      seller: pick(SELLERS, i + prefix.length),
      state: pick(STATES, i),
      stock,
      qtyAvailable: 50 + (i*37 % 900)
    };
  });
}

const FASAL_PRODUCTS = buildProducts(FASAL_RAW, "fasal", "f");
const WASTE_PRODUCTS = buildProducts(WASTE_RAW, "waste", "w");
const ALL_PRODUCTS = [...FASAL_PRODUCTS, ...WASTE_PRODUCTS];

const CATEGORIES = [
  {icon:"🌾", label:"Wheat", cat:"fasal"},
  {icon:"🍚", label:"Rice", cat:"fasal"},
  {icon:"🌽", label:"Maize", cat:"fasal"},
  {icon:"🧅", label:"Onion", cat:"fasal"},
  {icon:"🍅", label:"Tomato", cat:"fasal"},
  {icon:"🌿", label:"Straw", cat:"waste"},
  {icon:"🎋", label:"Bagasse", cat:"waste"},
  {icon:"🐄", label:"Cow Dung", cat:"waste"},
  {icon:"🌱", label:"Compost", cat:"waste"},
  {icon:"🥥", label:"Coconut Husk", cat:"waste"}
];

const NEWS_ITEMS = [
  {t:"Kharif sowing crosses 80% of normal area this season", d:"2h ago"},
  {t:"Govt raises MSP for wheat ahead of Rabi season", d:"1d ago"},
  {t:"Monsoon rainfall 6% above average across central India", d:"2d ago"},
  {t:"Farmers shift to natural farming methods in Punjab belt", d:"3d ago"},
  {t:"Export demand rises for Indian basmati rice", d:"4d ago"}
];

const SCHEMES_ITEMS = [
  {t:"PM-KISAN — ₹6,000/year direct income support", d:"Central"},
  {t:"PM Fasal Bima Yojana — Crop insurance scheme", d:"Central"},
  {t:"Soil Health Card Scheme", d:"Central"},
  {t:"Kisan Credit Card — Low interest farm loans", d:"Central"},
  {t:"Agriculture Infrastructure Fund", d:"Central"}
];

const REVIEWS_DATA = [
  {name:"Anil Kumar", loc:"Ludhiana, Punjab", stars:5, text:"Got fair price for my wheat, no middleman cut. Payment and pickup were smooth."},
  {name:"Priya Sharma", loc:"Indore, MP", stars:5, text:"Bought rice husk in bulk for my poultry farm. Great quality and quick delivery."},
  {name:"Rajesh Patel", loc:"Rajkot, Gujarat", stars:4, text:"Simple to use, no login needed. Cash on delivery made it very trustworthy."},
  {name:"Sunita Devi", loc:"Patna, Bihar", stars:5, text:"Sold our paddy straw instead of burning it. Extra income and good for environment."},
  {name:"Mohd Irfan", loc:"Lucknow, UP", stars:4, text:"Onion prices were better than local mandi. Will use Mr Fasal Wala again."},
  {name:"Lakshmi Reddy", loc:"Guntur, AP", stars:5, text:"Bought organic compost for our farm. Product matched exactly what was listed."}
];

const FAQ_DATA = [
  {q:"Do I need to create an account to buy or sell?", a:"No. Mr Fasal Wala works without login or registration — anyone can browse, buy and sell directly."},
  {q:"What payment methods are accepted?", a:"Currently we only support Cash on Delivery (COD). No UPI, card, wallet or net banking is required."},
  {q:"How is the delivery charge calculated?", a:"Delivery charge depends on quantity and distance and is shown clearly on the cart page before checkout."},
  {q:"Can I sell my crop waste like rice husk or straw?", a:"Yes, farmers can list any crop waste such as husk, straw, bagasse or compost for buyers to purchase directly."},
  {q:"How do I contact Mr Fasal Wala for support?", a:"You can call or WhatsApp us directly at 6200873964, or use the contact form on this page."},
  {q:"Are the market prices updated daily?", a:"Yes, the Market Prices section reflects daily mandi bhav for major commodities across regions."}
];

/* ---------------------------------------------------------
   2. STATE
   --------------------------------------------------------- */
let cart = []; // {id, qty}
let wishlist = new Set();
let fasalVisibleCount = 8;
let wasteVisibleCount = 8;
let fasalFilter = "all";
let wasteFilter = "all";
let selectedLocation = null;

const DELIVERY_CHARGE = 60;

/* ---------------------------------------------------------
   3. UTIL
   --------------------------------------------------------- */
function money(n){ return "₹" + Number(n).toLocaleString("en-IN"); }
function getProduct(id){ return ALL_PRODUCTS.find(p => p.id === id); }
function showToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(()=> t.classList.remove("show"), 2200);
}

/* ---------------------------------------------------------
   4. PRODUCT CARD RENDERING
   --------------------------------------------------------- */
function stockLabel(stock){
  if(stock === "out") return {text:"Out of Stock", cls:"out"};
  if(stock === "low") return {text:"Only Few Left", cls:"low"};
  return {text:"In Stock", cls:"in"};
}

function productCardHTML(p){
  const s = stockLabel(p.stock);
  const wished = wishlist.has(p.id) ? "active" : "";
  const disabled = p.stock === "out" ? "disabled" : "";
  return `
  <article class="product-card" data-id="${p.id}">
    <div class="product-card__media">
      ${p.organic ? '<span class="product-card__badge product-card__badge--organic">Organic</span>' : (p.stock==="low" ? '<span class="product-card__badge">Selling Fast</span>' : '')}
      <button class="product-card__wishlist ${wished}" data-action="wishlist" data-id="${p.id}" aria-label="Wishlist">♥</button>
      <span>${p.icon}</span>
      <button class="product-card__share" data-action="share" data-id="${p.id}" aria-label="Share">↗</button>
    </div>
    <div class="product-card__body" data-action="open" data-id="${p.id}">
      <span class="product-card__cat">${p.category === 'fasal' ? 'Fasal' : 'Fasal Waste'}</span>
      <h3 class="product-card__name">${p.name}</h3>
      <div class="product-card__meta">
        <span>${p.state}</span>
        <span class="product-card__rating">★ ${p.rating} (${p.ratingCount})</span>
      </div>
      <div class="product-card__price-row">
        <span class="product-card__price">${money(p.price)}</span>
        <span class="product-card__unit">/ ${p.unit}</span>
      </div>
      <span class="product-card__seller">Seller: ${p.seller}</span>
      <span class="product-card__stock product-card__stock--${s.cls}">${s.text}</span>
    </div>
    <div class="product-card__actions">
      <button class="btn btn--outline" data-action="cart" data-id="${p.id}" ${disabled}>Add to Cart</button>
      <button class="btn btn--primary" data-action="buynow" data-id="${p.id}" ${disabled}>Buy Now</button>
    </div>
  </article>`;
}

function renderGrid(containerId, products){
  document.getElementById(containerId).innerHTML = products.map(productCardHTML).join("");
}

/* ---------------------------------------------------------
   5. FILTER BARS
   --------------------------------------------------------- */
function filterChipsHTML(active){
  const opts = [
    ["all","All"], ["organic","Organic"], ["low","Selling Fast"], ["cheap","Lowest Price"], ["top","Top Rated"]
  ];
  return opts.map(([val,label]) =>
    `<button class="filter-chip ${active===val?'active':''}" data-filter="${val}">${label}</button>`
  ).join("");
}

function applyFilter(list, filter){
  let out = [...list];
  if(filter === "organic") out = out.filter(p=>p.organic);
  if(filter === "low") out = out.filter(p=>p.stock==="low");
  if(filter === "cheap") out.sort((a,b)=>a.price-b.price);
  if(filter === "top") out.sort((a,b)=>b.rating-a.rating);
  return out;
}

function renderFasalSection(){
  document.getElementById("fasalFilterBar").innerHTML = filterChipsHTML(fasalFilter);
  const filtered = applyFilter(FASAL_PRODUCTS, fasalFilter);
  renderGrid("fasalGrid", filtered.slice(0, fasalVisibleCount));
  document.getElementById("loadMoreFasal").style.display = fasalVisibleCount >= filtered.length ? "none" : "inline-flex";
}
function renderWasteSection(){
  document.getElementById("wasteFilterBar").innerHTML = filterChipsHTML(wasteFilter);
  const filtered = applyFilter(WASTE_PRODUCTS, wasteFilter);
  renderGrid("wasteGrid", filtered.slice(0, wasteVisibleCount));
  document.getElementById("loadMoreWaste").style.display = wasteVisibleCount >= filtered.length ? "none" : "inline-flex";
}

/* ---------------------------------------------------------
   6. STATIC SECTIONS (deals, featured, trending, etc.)
   --------------------------------------------------------- */
function renderStaticGrids(){
  renderGrid("dealsGrid", ALL_PRODUCTS.filter(p=>p.stock!=="out").slice(0,4));
  renderGrid("featuredGrid", shuffleSample(ALL_PRODUCTS, 8));
  renderGrid("trendingGrid", shuffleSample(ALL_PRODUCTS, 8));
  renderGrid("recommendedGrid", shuffleSample(ALL_PRODUCTS, 8));
  renderGrid("bestSellerGrid", [...ALL_PRODUCTS].sort((a,b)=>b.rating-a.rating).slice(0,8));
  renderGrid("newArrivalGrid", [...ALL_PRODUCTS].slice().reverse().slice(0,8));
}
function shuffleSample(arr,n){
  const copy = [...arr];
  for(let i=copy.length-1;i>0;i--){
    const j = Math.floor(((i*9301+49297) % 233280)/233280 * (i+1));
    [copy[i],copy[j]] = [copy[j],copy[i]];
  }
  return copy.slice(0,n);
}

function renderCategoryStrip(){
  document.getElementById("catStrip").innerHTML = CATEGORIES.map(c => `
    <a href="#${c.cat}" class="cat-card">
      <span class="cat-card__icon">${c.icon}</span>
      <span class="cat-card__label">${c.label}</span>
    </a>`).join("");
}

function renderNewsAndSchemes(){
  document.getElementById("newsList").innerHTML = NEWS_ITEMS.map(n=>`<li><b>${n.t}</b><span>${n.d}</span></li>`).join("");
  document.getElementById("schemesList").innerHTML = SCHEMES_ITEMS.map(s=>`<li><b>${s.t}</b><span>${s.d}</span></li>`).join("");
}

function renderWeather(){
  const days = [["Mon","28°","⛅"],["Tue","30°","☀️"],["Wed","27°","🌧️"],["Thu","29°","⛅"],["Fri","31°","☀️"]];
  document.getElementById("weatherRow").innerHTML = days.map(([d,t,i])=>`<div class="weather-day">${i}<b>${t}</b>${d}</div>`).join("");
}

function renderAdBanner(){
  const slogans = [
    "Buy Direct From Farmers","Best Crop Prices, Every Day","Trusted Digital Mandi for All of India",
    "Sell Crop Waste Easily & Earn More","Fast Delivery, Quality Products"
  ];
  const s = slogans[Math.floor(Date.now()/8000) % slogans.length];
  document.getElementById("adBanner").innerHTML = `${s}<small>Mr Fasal Wala — India's Trusted Digital Marketplace for Crops &amp; Crop Waste</small>`;
}

function renderPriceTable(){
  const rows = ALL_PRODUCTS.slice(0,14).map((p,i)=>{
    const min = Math.round(p.price*0.92);
    const max = Math.round(p.price*1.08);
    const trendUp = i % 3 !== 0;
    return `<tr>
      <td>${p.icon} ${p.name}</td>
      <td>${p.category==='fasal'?'Fasal':'Fasal Waste'}</td>
      <td>${money(min)}</td>
      <td>${money(max)}</td>
      <td class="${trendUp?'price-up':'price-down'}">${money(p.price)} ${trendUp?'▲':'▼'}</td>
      <td>${p.unit}</td>
    </tr>`;
  }).join("");
  document.getElementById("priceTableBody").innerHTML = rows;
}

function renderTicker(){
  const items = ALL_PRODUCTS.slice(0,16).map((p,i)=>{
    const up = i % 3 !== 0;
    return `<span>${p.icon} ${p.name} <b>${money(p.price)}</b> <span class="${up?'ticker__up':'ticker__down'}">${up?'▲':'▼'} ${(1+i%4)}.${i%9}%</span></span>`;
  }).join("");
  document.getElementById("tickerTrack").innerHTML = items + items; // duplicate for seamless loop
}

function renderReviews(){
  document.getElementById("reviewGrid").innerHTML = REVIEWS_DATA.map(r=>`
    <div class="review-card">
      <div class="review-card__stars">${"★".repeat(r.stars)}${"☆".repeat(5-r.stars)}</div>
      <p class="review-card__text">"${r.text}"</p>
      <div class="review-card__author">
        <span class="review-card__avatar">${r.name[0]}</span>
        <div><b>${r.name}</b><small>${r.loc}</small></div>
      </div>
    </div>`).join("");
}

function renderFAQ(){
  document.getElementById("faqList").innerHTML = FAQ_DATA.map((f,i)=>`
    <div class="faq-item" data-idx="${i}">
      <div class="faq-item__q">${f.q}</div>
      <div class="faq-item__a"><p>${f.a}</p></div>
    </div>`).join("");
}

/* ---------------------------------------------------------
   7. CART LOGIC
   --------------------------------------------------------- */
function addToCart(id, qty=1){
  const p = getProduct(id);
  if(!p || p.stock === "out") return;
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty += qty;
  else cart.push({id, qty});
  updateCartUI();
  showToast(`${p.name} added to cart`);
}
function removeFromCart(id){
  cart = cart.filter(c=>c.id!==id);
  updateCartUI();
}
function changeQty(id, delta){
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}
function cartCount(){ return cart.reduce((s,c)=>s+c.qty,0); }
function cartSubtotal(){
  return cart.reduce((s,c)=>{
    const p = getProduct(c.id);
    return s + (p ? p.price * c.qty : 0);
  },0);
}

function updateCartUI(){
  document.getElementById("cartCount").textContent = cartCount();
  const body = document.getElementById("cartBody");
  const footer = document.getElementById("cartFooter");

  if(cart.length === 0){
    body.innerHTML = `<div class="cart-empty">🛒 Your cart is empty.<br>Browse Fasal or Fasal Waste to add products.</div>`;
    footer.innerHTML = "";
    return;
  }

  body.innerHTML = cart.map(c=>{
    const p = getProduct(c.id);
    if(!p) return "";
    return `
    <div class="cart-item" data-id="${p.id}">
      <div class="cart-item__media">${p.icon}</div>
      <div class="cart-item__info">
        <div class="cart-item__name">${p.name}</div>
        <div class="cart-item__unit">${p.unit} · Seller: ${p.seller}</div>
        <div class="cart-item__price">${money(p.price * c.qty)}</div>
      </div>
      <div class="cart-item__qty">
        <button data-qty="dec" data-id="${p.id}">−</button>
        <b>${c.qty}</b>
        <button data-qty="inc" data-id="${p.id}">+</button>
      </div>
      <button class="cart-item__remove" data-action="remove" data-id="${p.id}">Remove</button>
    </div>`;
  }).join("");

  const subtotal = cartSubtotal();
  const delivery = DELIVERY_CHARGE;
  const total = subtotal + delivery;

  footer.innerHTML = `
    <div class="cart-summary-row"><span>Cart Total</span><span>${money(subtotal)}</span></div>
    <div class="cart-summary-row"><span>Delivery Charge</span><span>${money(delivery)}</span></div>
    <div class="cart-summary-row cart-summary-row--total"><span>Grand Total</span><span>${money(total)}</span></div>
    <div class="cart-cod-note">💵 Payment Method: Cash on Delivery (COD) only</div>
    <button class="btn btn--primary btn--block" id="checkoutBtn">Proceed to Checkout</button>
  `;
}

/* ---------------------------------------------------------
   8. PRODUCT MODAL (quick view)
   --------------------------------------------------------- */
let modalQty = 1;
function openProductModal(id){
  const p = getProduct(id);
  if(!p) return;
  modalQty = 1;
  const s = stockLabel(p.stock);
  document.getElementById("productModalContent").innerHTML = `
    <div class="product-modal">
      <div class="product-modal__media">${p.icon}</div>
      <div class="product-modal__body">
        <button class="product-modal__close" id="closeProductModal">✕</button>
        <span class="product-modal__cat">${p.category==='fasal'?'Fasal':'Fasal Waste'}</span>
        <h2 class="product-modal__name">${p.name}</h2>
        <div class="product-modal__price">${money(p.price)} <span style="font-size:14px;color:var(--ink-soft);font-family:var(--font-body);">/ ${p.unit}</span></div>
        <div class="product-modal__meta">
          <span>📍 Location: ${p.state}</span>
          <span>👤 Seller: ${p.seller}</span>
          <span>★ Rating: ${p.rating} (${p.ratingCount} reviews)</span>
          <span>📦 Available Qty: ${p.qtyAvailable} ${p.unit}s</span>
          <span class="product-card__stock--${s.cls}">● ${s.text}</span>
          ${p.organic ? '<span>🌱 Certified Organic</span>' : ''}
        </div>
        <div class="product-modal__qty">
          <span style="font-size:13px;font-weight:600;">Quantity</span>
          <div class="qty-control">
            <button id="modalQtyDec">−</button><span id="modalQtyVal">1</span><button id="modalQtyInc">+</button>
          </div>
        </div>
        <div class="product-modal__actions">
          <button class="btn btn--outline" id="modalAddCart" ${p.stock==='out'?'disabled':''}>Add to Cart</button>
          <button class="btn btn--primary" id="modalBuyNow" ${p.stock==='out'?'disabled':''}>Buy Now</button>
        </div>
      </div>
    </div>`;
  document.getElementById("productModal").classList.add("open");

  document.getElementById("closeProductModal").onclick = () => document.getElementById("productModal").classList.remove("open");
  document.getElementById("modalQtyInc").onclick = () => { modalQty++; document.getElementById("modalQtyVal").textContent = modalQty; };
  document.getElementById("modalQtyDec").onclick = () => { if(modalQty>1) modalQty--; document.getElementById("modalQtyVal").textContent = modalQty; };
  document.getElementById("modalAddCart").onclick = () => { addToCart(id, modalQty); document.getElementById("productModal").classList.remove("open"); };
  document.getElementById("modalBuyNow").onclick = () => { addToCart(id, modalQty); document.getElementById("productModal").classList.remove("open"); openCart(); };
}

/* -------

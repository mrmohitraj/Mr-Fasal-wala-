/* =========================================================
   AUTH + ORDERS — Mr Fasal Wala
   Google Sign-In (free, no SMS/OTP cost), user profile storage,
   and order history, all via Firebase Auth + Firestore (free tier).
   ========================================================= */
import { auth, db } from "./firebase-init.js";
import {
  GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  doc, setDoc, addDoc, collection, serverTimestamp, query, where, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const provider = new GoogleAuthProvider();
let currentUser = null;
let unsubOrders = null;

function $(id){ return document.getElementById(id); }

async function loginWithGoogle(){
  try{
    const result = await signInWithPopup(auth, provider);
    const u = result.user;
    await setDoc(doc(db, "users", u.uid), {
      name: u.displayName || "",
      email: u.email || "",
      photo: u.photoURL || "",
      lastLogin: serverTimestamp()
    }, { merge: true });
  }catch(err){
    console.error(err);
    if(window.showToast) window.showToast("Login failed. Please try again.");
  }
}

async function logout(){
  await signOut(auth);
}

function renderAuthUI(user){
  const loginBtn = $("loginBtn");
  const userMenu = $("userMenu");
  if(!loginBtn || !userMenu) return;
  if(user){
    loginBtn.classList.add("hidden");
    userMenu.classList.remove("hidden");
    $("userMenuName").textContent = (user.displayName || "My Account").split(" ")[0];
    $("userMenuAvatar").src = user.photoURL || "icon-192.png";
  } else {
    loginBtn.classList.remove("hidden");
    userMenu.classList.add("hidden");
  }
}

function watchMyOrders(uid){
  if(unsubOrders) unsubOrders();
  const q = query(collection(db, "orders"), where("userId", "==", uid), orderBy("createdAt", "desc"));
  unsubOrders = onSnapshot(q, (snap) => {
    const body = $("myOrdersBody");
    if(!body) return;
    if(snap.empty){
      body.innerHTML = `<div class="wishlist-empty">📦 No orders yet.<br>Your placed orders will show up here.</div>`;
      return;
    }
    let html = "";
    snap.forEach(docSnap => {
      const d = docSnap.data();
      const statusClass = (d.status || "pending").toLowerCase();
      html += `
      <div class="order-row">
        <div class="order-row__head">
          <b>Order #${d.orderNumber || docSnap.id.slice(0,6).toUpperCase()}</b>
          <span class="order-row__status order-row__status--${statusClass}">${d.status || "Pending"}</span>
        </div>
        <div class="order-row__items">${(d.items || []).map(i => `${i.name} x${i.qty}`).join(", ")}</div>
        <div class="order-row__total">Total: ₹${d.total || 0}</div>
      </div>`;
    });
    body.innerHTML = html;
  });
}

async function saveOrder(orderData){
  try{
    const payload = {
      ...orderData,
      userId: currentUser ? currentUser.uid : "guest",
      status: "Pending",
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, "orders"), payload);
  }catch(err){
    console.error("Order save failed", err);
  }
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  renderAuthUI(user);
  if(user) watchMyOrders(user.uid);
});

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = $("loginBtn");
  if(loginBtn) loginBtn.addEventListener("click", loginWithGoogle);

  const logoutBtn = $("userMenuLogout");
  if(logoutBtn) logoutBtn.addEventListener("click", logout);

  const userMenuToggle = $("userMenuToggle");
  const userMenuDropdown = $("userMenuDropdown");
  if(userMenuToggle){
    userMenuToggle.addEventListener("click", () => userMenuDropdown.classList.toggle("open"));
    document.addEventListener("click", (e) => {
      if(!userMenuToggle.contains(e.target) && !userMenuDropdown.contains(e.target)){
        userMenuDropdown.classList.remove("open");
      }
    });
  }

  const myOrdersBtn = $("myOrdersBtn");
  if(myOrdersBtn){
    myOrdersBtn.addEventListener("click", () => {
      $("myOrdersDrawer").classList.add("open");
      $("myOrdersOverlay").classList.add("open");
      userMenuDropdown?.classList.remove("open");
    });
  }
  const closeMyOrders = () => {
    $("myOrdersDrawer")?.classList.remove("open");
    $("myOrdersOverlay")?.classList.remove("open");
  };
  $("closeMyOrdersBtn")?.addEventListener("click", closeMyOrders);
  $("myOrdersOverlay")?.addEventListener("click", closeMyOrders);
});

// Expose for script.js (non-module) to call when an order is placed
window.MFW_saveOrder = saveOrder;
window.MFW_isLoggedIn = () => !!currentUser;

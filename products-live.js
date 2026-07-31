/* =========================================================
   PRODUCTS-LIVE.JS — Mr Fasal Wala
   Listens to the "products" collection in Firestore in
   real time and merges live (admin/seller-added) products
   into the homepage on top of the built-in demo products.
   Requires script.js's window.mergeLiveProducts() (see script.js).
   ========================================================= */
import { db } from "./firebase-init.js";
import {
  collection, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

function whenReady(cb){
  if (typeof window.mergeLiveProducts === "function") { cb(); }
  else { setTimeout(() => whenReady(cb), 50); }
}

try {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap) => {
    const liveProducts = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      liveProducts.push({
        id: "live-" + docSnap.id,
        docId: docSnap.id,
        name: d.name || "Unnamed Product",
        icon: d.category === "waste" ? "🌿" : "🌾",
        category: d.category === "waste" ? "waste" : "fasal",
        price: Number(d.price) || 0,
        unit: d.unit || "quintal",
        organic: !!d.organic,
        rating: "New",
        ratingCount: 0,
        seller: d.sellerName || "Verified Seller",
        state: d.state || "",
        stock: "in",
        qtyAvailable: Number(d.qty) || 100,
        image: d.image || "",
        sellerPhone: d.sellerPhone || ""
      });
    });
    whenReady(() => window.mergeLiveProducts(liveProducts));
  }, (err) => {
    console.error("Live products error:", err);
  });
} catch (e) {
  console.error("Firestore not reachable:", e);
}

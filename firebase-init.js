/* =========================================================
   FIREBASE INIT — Mr Fasal Wala
   Shared Firebase app used by index.html (live products),
   admin.html (admin panel) and sell.html (seller panel).
   ========================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmrIu4-TWpCffne8etLWF3qKSN9P3KcYU",
  authDomain: "mr-fasal-wala.firebaseapp.com",
  projectId: "mr-fasal-wala",
  storageBucket: "mr-fasal-wala.firebasestorage.app",
  messagingSenderId: "955291744637",
  appId: "1:955291744637:web:e00e822b2b3f5021d6f414",
  measurementId: "G-T5YCXT2EEY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Cloudinary (used for photo uploads — no Firebase Storage/billing needed)
export const CLOUDINARY_CLOUD_NAME = "cafghlj0";
export const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export async function uploadImageToCloudinary(file){
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(url, { method: "POST", body: formData });
  if(!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.secure_url;
}

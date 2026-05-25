// 1. IMPORT STATEMENTS (The fixes you need)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 2. YOUR CONFIGURATION (Keep what you have)
const firebaseConfig = {
  apiKey: "AIzaSyBhFVOOhVK_JvHsw2lAdnE9SVaKOkOo-Z0",
  authDomain: "oppo-billiard-app.firebaseapp.com",
  projectId: "oppo-billiard-app",
  storageBucket: "oppo-billiard-app.firebasestorage.app",
  messagingSenderId: "171565667708",
  appId: "1:171565667708:web:febc1884bd47d310f440f9"
};

// 3. INITIALIZATION (Keep this)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. THE REST OF YOUR CODE (Your form submission logic goes here)
// Example:
// const form = document.querySelector("#reservation-form");
// form.addEventListener("submit", async (e) => { ... });

document.addEventListener('DOMContentLoaded', () => {

  // --- BURGER MENU ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => { e.stopPropagation(); navLinks.classList.toggle('active'); });
    document.addEventListener('click', (e) => { if (!navLinks.contains(e.target)) navLinks.classList.remove('active'); });
  }

  // --- GENERIC FIREBASE SUBMITTER ---
  async function submitToFirebase(collectionName, payload, btn, errDiv, onSuccess) {
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Sending...';

    try {
      await addDoc(collection(db, collectionName), {
        ...payload,
        createdAt: new Date()
      });
      onSuccess && onSuccess();
      showToast('Submission successful!', 'success');
    } catch (err) {
      // THIS WILL PRINT THE REAL ERROR TO YOUR CONSOLE
      console.error("DEBUG ERROR:", err); 
      
      // Update the UI to show the specific error
      if (errDiv) { 
        errDiv.textContent = 'Error: ' + err.message; 
        errDiv.style.display = 'block'; 
      } else { 
        showToast('Error: ' + err.message, 'error'); 
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }

  // --- CONTACT FORM ---
  // --- CONTACT FORM ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.querySelector('.btn-send')?.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Use contactForm.querySelector to find inputs INSIDE the form
      const payload = {
        first_name: contactForm.querySelector('input[name="first_name"]')?.value || '',
        last_name: contactForm.querySelector('input[name="last_name"]')?.value || '',
        phone: contactForm.querySelector('input[type="tel"]')?.value || '',
        message: contactForm.querySelector('textarea')?.value || ''
      };

      await submitToFirebase('messages', payload, e.currentTarget, null, () => {
        // Use the same container to clear fields safely
        contactForm.querySelectorAll('input, textarea').forEach(el => el.value = '');
      });
    });
  }
  

  // --- RESERVATION FORM ---
  // --- RESERVATION FORM ---
  const resForm = document.querySelector('.checkout-card');
  if (resForm) {
    resForm.querySelector('.btn-send')?.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const payload = {
        first_name: resForm.querySelector('input[name="first_name"]')?.value || '',
        reserve_date: resForm.querySelector('input[type="date"]')?.value || '',
        num_tables: resForm.querySelector('#qty')?.textContent || '1', // Use resForm.querySelector
        message: resForm.querySelector('textarea')?.value || ''
      };
      
      await submitToFirebase('reservations', payload, e.currentTarget, null, () => {
        // Safer way to clear the form
        resForm.querySelectorAll('input, textarea').forEach(el => el.value = '');
      });
    });
  }

  // --- PURCHASE MODAL LOGIC ---
  document.querySelectorAll('.rate-card .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pkgName = detectPackage(btn.closest('.rate-card'));
      showPurchaseModal(pkgName);
    });
  });

  function showPurchaseModal(pkgName) {
    document.getElementById('oppo-modal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'oppo-modal';
    modal.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,.85);display:flex;align-items:center;justify-content:center;padding:20px;`;
    modal.innerHTML = `
      <div style="background:#162032;border:1px solid #1e3a5f;border-radius:16px;padding:36px;width:100%;max-width:480px;position:relative;">
        <button id="modal-close" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#94a3b8;font-size:22px;cursor:pointer;">✕</button>
        <h3>Purchase Package</h3>
        <p>${pkgName}</p>
        <div id="modal-err" style="display:none;color:#f87171;margin-bottom:10px;"></div>
        <input id="m-fn" type="text" placeholder="First Name" style="width:100%;margin-bottom:10px;">
        <input id="m-ln" type="text" placeholder="Last Name" style="width:100%;margin-bottom:10px;">
        <input id="m-ph" type="tel" placeholder="Phone" style="width:100%;margin-bottom:10px;">
        <button id="modal-submit" style="width:100%;padding:10px;">Confirm Purchase</button>
      </div>`;
    document.body.appendChild(modal);

    modal.querySelector('#modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('#modal-submit').addEventListener('click', async () => {
      const payload = {
        first_name: modal.querySelector('#m-fn').value,
        last_name: modal.querySelector('#m-ln').value,
        phone: modal.querySelector('#m-ph').value,
        package: pkgName
      };
      await submitToFirebase('purchases', payload, modal.querySelector('#modal-submit'), modal.querySelector('#modal-err'), () => {
        modal.innerHTML = `<div style="text-align:center;"><h3>Success!</h3><p>Purchase Received.</p></div>`;
      });
    });
  }

  function detectPackage(card) {
    const amount = card?.querySelector('.amount')?.textContent?.trim();
    return amount === '400' ? "Package (3 hrs) — ₱400" : (amount === '999' ? "Full Day — ₱999" : "Standard Table — ₱150/hr");
  }

  // --- TOAST NOTIFICATION ---
  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:24px;right:24px;background:#1e293b;color:white;padding:15px;border-radius:8px;z-index:9999;`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
});
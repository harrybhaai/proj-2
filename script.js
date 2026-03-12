// ============================================================
//  script.js — Frontend Logic (Fetch API CRUD)
// ============================================================

// ===== CONFIGURATION — EDIT THESE VARIABLES =====

const API_ROUTE   = "/api/items";   // Must match server.js API_ROUTE
const ENTITY_NAME = "Item";         // Used in alerts and UI labels

// ===== MODIFY DISPLAY FIELD =====
// Which field from your schema shows as the card's main heading?
const DISPLAY_FIELD = "name";
// ================================

// ===== MODIFY SECONDARY DISPLAY FIELDS =====
// Array of { label, field } pairs shown in each card body.
// field values must match your schema field names.
const CARD_FIELDS = [
  { label: "Description", field: "description" },
  { label: "Status",      field: "status"       },
  // Add more rows here to show extra schema fields:
  // { label: "Email",  field: "email"  },
  // { label: "Price",  field: "price"  },
];
// ============================================

// ── DOM References ─────────────────────────────────────────
const form       = document.getElementById("item-form");
const itemIdInput= document.getElementById("item-id");
const formTitle  = document.getElementById("form-title");
const cancelBtn  = document.getElementById("cancel-btn");
const itemList   = document.getElementById("item-list");
const itemCount  = document.getElementById("item-count");
const emptyMsg   = document.getElementById("empty-msg");
const searchInput= document.getElementById("search-input");

// In-memory cache of all items (used for search filtering)
let allItems = [];

// ── Fetch All Items ────────────────────────────────────────
async function fetchItems() {
  try {
    const res   = await fetch(API_ROUTE);
    const items = await res.json();
    allItems = items;
    renderItems(allItems);
  } catch (err) {
    showAlert("❌ Failed to load items. Is the server running?", "error");
  }
}

// ── Render Items to DOM ────────────────────────────────────
function renderItems(items) {
  itemList.innerHTML = "";
  itemCount.textContent = items.length;

  if (items.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.dataset.id = item._id;

    // Build the body rows from CARD_FIELDS config
    const bodyRows = CARD_FIELDS.map(({ label, field }) => {
      const value = item[field] !== undefined ? item[field] : "—";
      return `<p><strong>${label}:</strong> <span class="field-value">${value}</span></p>`;
    }).join("");

    card.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">${item[DISPLAY_FIELD] || "Untitled"}</h3>
        <span class="card-date">${formatDate(item.createdAt)}</span>
      </div>
      <div class="card-body">
        ${bodyRows}
      </div>
      <div class="card-actions">
        <button class="btn btn-warning btn-sm" onclick="startEdit('${item._id}')">✏️ Edit</button>
        <button class="btn btn-danger btn-sm"  onclick="deleteItem('${item._id}')">🗑️ Delete</button>
      </div>
    `;

    itemList.appendChild(card);
  });
}

// ── Collect Form Values ────────────────────────────────────
//  Reads every input/select that has a data-field attribute.
//  This means adding a new <input data-field="fieldName"> in
//  the HTML automatically includes it in POST / PUT requests.
function collectFormData() {
  const data = {};
  document.querySelectorAll("[data-field]").forEach((el) => {
    data[el.dataset.field] = el.value.trim();
  });
  return data;
}

// ── Reset Form to "Add" mode ───────────────────────────────
function resetForm() {
  form.reset();
  itemIdInput.value   = "";
  formTitle.textContent = `Add New ${ENTITY_NAME}`;
  cancelBtn.style.display = "none";
}

// ── Populate Form for Editing ──────────────────────────────
function startEdit(id) {
  const item = allItems.find((i) => i._id === id);
  if (!item) return;

  // Fill every field that exists in both the DOM and the item object
  document.querySelectorAll("[data-field]").forEach((el) => {
    if (item[el.dataset.field] !== undefined) {
      el.value = item[el.dataset.field];
    }
  });

  itemIdInput.value    = id;
  formTitle.textContent = `Edit ${ENTITY_NAME}`;
  cancelBtn.style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Form Submit → Create or Update ────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id   = itemIdInput.value;
  const data = collectFormData();

  const url    = id ? `${API_ROUTE}/${id}` : API_ROUTE;
  const method = id ? "PUT" : "POST";

  try {
    const res  = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (!res.ok) throw new Error(result.detail || result.error);

    showAlert(
      id ? `✅ ${ENTITY_NAME} updated!` : `✅ ${ENTITY_NAME} added!`,
      "success"
    );
    resetForm();
    fetchItems();
  } catch (err) {
    showAlert(`❌ Error: ${err.message}`, "error");
  }
});

// ── Delete ─────────────────────────────────────────────────
async function deleteItem(id) {
  if (!confirm(`Delete this ${ENTITY_NAME}? This cannot be undone.`)) return;

  try {
    const res = await fetch(`${API_ROUTE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");

    showAlert(`🗑️ ${ENTITY_NAME} deleted.`, "success");
    fetchItems();
  } catch (err) {
    showAlert(`❌ Error: ${err.message}`, "error");
  }
}

// ── Cancel Edit ────────────────────────────────────────────
cancelBtn.addEventListener("click", resetForm);

// ── Client-side Search / Filter ───────────────────────────
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allItems.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(query)
  );
  renderItems(filtered);
});

// ── Helpers ────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// Temporary status alert at top of page
function showAlert(message, type = "success") {
  const existing = document.querySelector(".alert-toast");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.className = `alert-toast alert-${type}`;
  div.textContent = message;
  document.body.prepend(div);
  setTimeout(() => div.remove(), 3000);
}

// ── Init ───────────────────────────────────────────────────
fetchItems();

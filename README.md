# 🧰 Universal Node.js Full Stack CRUD Template

A single reusable Express + MongoDB + Vanilla JS project that transforms into
any CRUD application by editing **fewer than 20 lines of code**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Make sure MongoDB is running locally
# (default URI: mongodb://127.0.0.1:27017/universaldb)

# 3. Start server
node server.js

# 4. Open browser
# → http://localhost:3000
```

---

## 📁 Project Structure

```
project/
│
├── server.js          ← Entry point, mounts routes
├── db.js              ← MongoDB connection
├── package.json
│
├── models/
│   └── model.js       ← Mongoose schema  ★ EDIT THIS
│
├── routes/
│   └── api.js         ← CRUD routes      (rarely needs changes)
│
└── public/
    ├── index.html     ← Form + list UI   ★ EDIT THIS
    ├── script.js      ← Fetch API logic  ★ EDIT THIS (top config)
    └── style.css      ← Styling          (optional colour edits)
```

---

## 🗺️ How the Template Works

```
Browser (HTML + script.js)
        │
        │  HTTP Fetch (JSON)
        ▼
 server.js  →  routes/api.js  →  models/model.js  →  MongoDB
        │
        └──  Serves public/ as static files
```

1. **`server.js`** starts Express, connects DB, mounts `/api/items`.
2. **`routes/api.js`** handles GET / POST / PUT / DELETE — no changes needed.
3. **`models/model.js`** defines what data looks like in MongoDB.
4. **`public/index.html`** has `data-field="fieldName"` inputs that auto-map to schema fields.
5. **`public/script.js`** reads all `[data-field]` inputs and sends them as JSON — works automatically for any fields you add.

---

## ✏️ The Only Lines You Need to Edit

| File | What to Change |
|---|---|
| `models/model.js` | Schema fields + model name |
| `server.js` | `API_ROUTE` variable |
| `public/index.html` | Title, heading, form `<input data-field="...">` blocks |
| `public/script.js` | `API_ROUTE`, `ENTITY_NAME`, `DISPLAY_FIELD`, `CARD_FIELDS` |

---

## 🔄 Transformation Cheat Sheet

### Applications you can build by modifying only the marked sections:

| App | ENTITY_NAME | Key Schema Fields |
|---|---|---|
| Student Manager | `"Student"` | name, rollNo, branch, cgpa |
| Todo App | `"Task"` | title, priority, completed |
| Product Inventory | `"Product"` | name, price, quantity, category |
| Library Books | `"Book"` | title, author, isbn, available |
| Notes App | `"Note"` | title, content, tag |
| Blog Posts | `"Post"` | title, content, author, published |
| Employee Manager | `"Employee"` | name, department, salary, role |
| Course Manager | `"Course"` | title, instructor, duration, fee |
| Contact Manager | `"Contact"` | name, phone, email, address |

---

## 🎓 EXAMPLE TRANSFORMATION — Student Manager

Below are the **exact edits** to convert the template into a Student Manager.

### 1. `models/model.js` — Change schema fields

```js
const itemSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    rollNo:   { type: String, required: true, unique: true },
    branch:   { type: String, required: true },
    cgpa:     { type: Number, min: 0, max: 10 },
    // Remove status field (not needed for students)
  },
  { timestamps: true }
);

// Change model name:
const Item = mongoose.model("Student", itemSchema);
```

### 2. `server.js` — Change the API route

```js
const API_ROUTE = "/api/students";   // was "/api/items"
```

### 3. `public/index.html` — Change title, heading, and form fields

```html
<!-- Title -->
<title>Student Manager</title>

<!-- Heading -->
<h1 id="app-title">🎓 Student Manager</h1>

<!-- Inside <form id="item-form"> replace all form-groups with: -->

<div class="form-group">
  <label for="field-name">Full Name *</label>
  <input type="text" id="field-name" data-field="name"
         placeholder="e.g. Aarav Sharma" required />
</div>

<div class="form-group">
  <label for="field-rollNo">Roll Number *</label>
  <input type="text" id="field-rollNo" data-field="rollNo"
         placeholder="e.g. CS2024001" required />
</div>

<div class="form-group">
  <label for="field-branch">Branch *</label>
  <select id="field-branch" data-field="branch">
    <option value="CSE">Computer Science</option>
    <option value="ECE">Electronics</option>
    <option value="MECH">Mechanical</option>
    <option value="CIVIL">Civil</option>
  </select>
</div>

<div class="form-group">
  <label for="field-cgpa">CGPA</label>
  <input type="number" id="field-cgpa" data-field="cgpa"
         placeholder="e.g. 8.5" min="0" max="10" step="0.1" />
</div>
```

### 4. `public/script.js` — Change config variables (top of file)

```js
const API_ROUTE    = "/api/students";  // matches server.js
const ENTITY_NAME  = "Student";
const DISPLAY_FIELD = "name";          // show student name as card title

const CARD_FIELDS = [
  { label: "Roll No", field: "rollNo"  },
  { label: "Branch",  field: "branch"  },
  { label: "CGPA",    field: "cgpa"    },
];
```

That's it — **4 small edits across 4 files**. The CRUD API, search, edit,
delete, and form submission all work automatically.

---

## 📋 Other Quick Transformations

### Todo / Task Manager

```js
// model.js
{ title: { type: String, required: true },
  priority: { type: String, enum: ["low","medium","high"], default: "medium" },
  completed: { type: Boolean, default: false } }
const Item = mongoose.model("Task", itemSchema);

// server.js
const API_ROUTE = "/api/tasks";

// script.js
const API_ROUTE = "/api/tasks";
const ENTITY_NAME = "Task";
const DISPLAY_FIELD = "title";
const CARD_FIELDS = [
  { label: "Priority",  field: "priority"  },
  { label: "Completed", field: "completed" },
];
```

### Product Inventory

```js
// model.js
{ name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  category: { type: String } }
const Item = mongoose.model("Product", itemSchema);

// server.js
const API_ROUTE = "/api/products";

// script.js
const ENTITY_NAME = "Product";
const DISPLAY_FIELD = "name";
const CARD_FIELDS = [
  { label: "Price",    field: "price"    },
  { label: "Quantity", field: "quantity" },
  { label: "Category", field: "category" },
];
```

### Library Book Manager

```js
// model.js
{ title:     { type: String, required: true },
  author:    { type: String, required: true },
  isbn:      { type: String },
  available: { type: Boolean, default: true } }
const Item = mongoose.model("Book", itemSchema);
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/items` | Get all items (sorted newest first) |
| POST | `/api/items` | Create new item (send JSON body) |
| PUT | `/api/items/:id` | Update item by MongoDB `_id` |
| DELETE | `/api/items/:id` | Delete item by MongoDB `_id` |

---

## 🎨 Theme Colours (style.css)

Change these CSS variables to re-theme the entire app:

```css
:root {
  --primary:    #4f46e5;  /* indigo (buttons, titles) */
  --warning:    #d97706;  /* amber  (edit button)     */
  --danger:     #dc2626;  /* red    (delete button)   */
  --success:    #16a34a;  /* green  (success alerts)  */
}
```

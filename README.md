# 📄 Invoice Generator (MAWMAW INTERIOR)

A modern single-page application built with React and Vite, designed for **fast, clean, and professional invoice creation**. The interface emphasizes clarity and usability—everything you need to generate an invoice is presented in one streamlined view.

---

## ✨ Key Features

* **Live Preview** – Real-time updates as you edit, ensuring the final invoice always matches what you see.
* **Unified Sidebar Editor** – All invoice fields (company info, client details, items, terms, notes) in one accessible panel.
* **Automatic Calculations** – Subtotals, discounts, and totals update instantly as you adjust line items.
* **Rich Text Notes** – Add formatted notes and terms (lists, emphasis, etc.) for clearer communication.
* **Save & Resume** – Export your current invoice state as JSON and reload it later.
* **Print-Optimized Output** – A clean layout designed for both PDF export and physical printing.
* **Customizable Theme** – Change invoice colors easily with a built-in color picker.

---

## 🛠 Tech Stack

* **Frontend:** [React](https://react.dev/) with Hooks
* **Build Tool:** [Vite](https://vitejs.dev/)
* **State Management:** `useReducer` + `immer` for predictable immutable updates
* **Styling:** CSS Modules + CSS variables for theming

---

## 🧩 Architecture

This is a **monolithic single-page application** for speed and simplicity.

* **`App.jsx`** – Core container with state logic (`useReducer`), action handling, and layout rendering.
* **`Sidebar.jsx`** – Main control surface: profile info, input fields, and editor controls.
* **`Preview.jsx`** – A4-style live invoice preview, updated in real-time.
* **`ItemsTableEditor.jsx`** – Dedicated interface for managing detailed line items.
* **State Management** – A single, centralized state object updated exclusively via reducer actions, ensuring consistency and debuggability.

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/rzqllh/Mawmaw-Invoice-Generator.git
cd Mawmaw-Invoice-Generator
npm install
```

### Development

```bash
npm run dev
```

Runs the app at [http://localhost:5173](http://localhost:5173) with hot reload.

### Production Build

```bash
npm run build
```

Creates an optimized build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

Serves the `dist` build locally before deployment.

---

## 📌 Notes

This project was developed as a **single-purpose tool** with an emphasis on speed, simplicity, and professional output. Ideal for freelancers, small studios, or anyone needing a lightweight invoice generator without unnecessary complexity.

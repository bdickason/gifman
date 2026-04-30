# 🎬 GIFMAN

A lightweight tool for displaying, organizing, and editing categorized GIFs — with a built-in **agent-assisted development workflow (Rufus)**.

---

## 🧠 What This Project Is

GIFMAN is a simple system for:

- Viewing categorized GIFs (`intro`, `success`, `fail`)
- Browsing them in a grid or “GIFtv” mode
- Editing GIF data via a lightweight UI
- Iterating quickly using an **agent + test loop**

---

## ⚙️ Core Architecture

### Data

```

data/gifs.json

````

- Source of truth
- Categorized structure:

```json id="g1pj0d"
{
  "intro": [...],
  "success": [...],
  "fail": [...]
}
````

---

### API

* Served via Vite middleware
* Endpoint:

````
GET /api/gifs
``` id="x6rgdh"

- Returns raw JSON (no transformation)

---

### Frontend

- Static pages in `/public`
  - `index.html` → grid view
  - `giftv.html` → auto-cycling viewer
  - `editor.html` → in-memory CRUD + export

---

## 🧪 Test System (Important)

This project uses a **helper-driven test loop**.

---

### 👤 For Humans

Run tests locally:

```bash
npm run test:run
````

👉 Human-readable output

---

### 🤖 For Rufus (Agent)

Rufus **CANNOT run shell commands**

Instead, it must use:

```
RUN_TESTS
```

The system will:

1. Run:

```bash
npm run test:rufus
```

2. Return:

```json id="k7sl84"
TEST RESULTS:
{
  "status": "pass" | "fail",
  "failures": [...],
  "meta": {
    "attempt": number,
    "max_attempts": number,
    "iteration_limit_reached": boolean
  }
}
```

---

## 🔁 Development Loop

The system is designed around this loop:

```
write → RUN_TESTS → TEST RESULTS → fix → repeat
```

Rules:

* Rufus must wait for TEST RESULTS
* Must not assume tests pass
* Must not run npm commands

---

## 🚨 Critical Rule

❌ NEVER:

```
npm run test:run
```

✅ ALWAYS:

```
RUN_TESTS
```

---

## 🛠️ Running the App

```bash
npm install
npm run dev
```

Then open:

```
http://localhost:<port>
```

---

## 📁 Key Files

| File                 | Purpose              |
| -------------------- | -------------------- |
| `data/gifs.json`     | GIF dataset          |
| `public/index.html`  | Grid view            |
| `public/giftv.html`  | TV-style viewer      |
| `public/editor.html` | GIF editor           |
| `vite.config.ts`     | Dev server + API     |
| `.cursorrules`       | Agent behavior rules |

---

## 🧭 Design Principles

* Minimal infrastructure
* No unnecessary abstraction layers
* Static data first
* Extend, don’t rebuild
* Tests define correctness

---

## ⚠️ Common Pitfalls

### 1. Trying to run npm from Rufus

Wrong:

```
npm run test:run
```

Correct:

```
RUN_TESTS
```

---

### 2. Adding unnecessary APIs

If data can be fetched directly:

```
fetch('/api/gifs')
```

→ do NOT add new endpoints

---

### 3. Overengineering

Prefer:

* simple logic
* minimal changes
* existing patterns

---

## 🎯 Goal of This Repo

Not just to build features, but to:

> **enable fast, reliable, agent-assisted development**

---

## 💬 Notes

* This repo is optimized for use with Rufus
* `.cursorrules` defines agent behavior
* README + DEVELOPMENT.md provide context

---

Happy building ⚡
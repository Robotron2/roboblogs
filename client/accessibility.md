# RoboBlogs Accessibility Implementation Guide

This document outlines the website-wide accessibility (A11y) improvements integrated into the RoboBlogs frontend. The architecture conforms to WCAG guidelines mapping towards keyboard navigation integrity, focus management clarity, screen reader legibility, and exact semantic hierarchies.

---

## 1. Semantic HTML Infrastructure

Proper semantics allow assistive technologies to naturally interpret the layout and importance of content blocks without relying heavily on custom ARIA tags.

### Layout Wrappers (`MainLayout.tsx` & `AdminLayout.tsx`)
- The top-level navigation container has been explicitly wrapped in a `<header>` tag.
- The interactive internal navigation sequences are wrapped within `<nav>` tags alongside unique `aria-label` discriminators (e.g., `aria-label="Admin Navigation"` vs `aria-label="Main Navigation"`).
- The central router `<Outlet />` relies exclusively strictly on the `<main>` tag.

### Content Hierarchy (`SinglePost.tsx`)
- Articles natively enforce strict hierarchy paths, utilizing the `<article>` tag to group the overarching post construct, avoiding nested `<h1>` fragments recursively.

---

## 2. Dynamic Input Architecture (Forms)

Authentication routes and interactive forms must bind physical labels and logic states seamlessly without causing visual clutter.

### Generating Deterministic Identifiers (`Input.tsx` & `Textarea.tsx`)
- Using the React 18 `useId()` hook, every `<Input />` instantiated dynamically generates a resilient, unique ID token.
- This token is injected into both the physical `<input id="...">` block and the preceding `<label htmlFor="...">` string, creating an impenetrable association even when multiple forms (e.g., Login & Register) share identical variable trees.
- If the form passes down an active `error` state string, the component binds `aria-invalid="true"` to the input instantly. It generates a localized error text node attached back to the input block under an `aria-describedby` string, pushing immediate screen reader dictation on failure.

---

## 3. Keyboard Visibility Strategies

Ensuring visibility rings operate when needed while averting ugly browser default outlines on standard clicks.

### The Focus-Visible Directive (`Button.tsx`)
Instead of assigning blanket `focus:ring` states across Tailwind components indiscriminately, we migrated entirely mapping UI primitives to `focus-visible:ring-2 focus-visible:ring-offset-2`.
- **Keyboard Users**: Receives immediate, high-contrast bounding boxes upon pressing the `Tab` sequence.
- **Mouse/Touch Users**: Navigates cleanly without spawning persistent focus rings when inherently clicking a button.

---

## 4. Modal Deep Focus Management

Opening overlays visually abstracts users, but logically, keyboards must be trapped inside that abstraction to avoid unpredictable chaos.

### Constructing Focus Traps (`Modal.tsx`)
When a Modal component receives `isOpen === true`:
1. **Cache Active Node**: The system stores `document.activeElement` identifying precisely what button spawned the modal.
2. **Body Lock**: Prevents background scrolling (`overflow-hidden`).
3. **Internal Key Trapper**: Binds an event listener listening aggressively for `Tab` sequences. If the user hits the "end" of the focusable elements array nested inside the modal, the focus manually loops them back to the start mapping, guaranteeing they cannot "Tab out" backwards into the core site. 
4. **Escape Hook**: Exits cleanly when `Escape` is pressed.
5. **Restoration**: On clean teardown, focus seamlessly jumps immediately back to the trigger button stored in Step 1.

Furthermore, the wrapping `div` mandates `role="dialog"`, `aria-modal="true"`, and an `aria-labelledby` linking upwards to the modal's internal <h3> title.

---

## 5. Overlay Menus & Mobile Traversal

Mobile UX inherently relies on drawer panels and hamburger menus that heavily require ARIA mappings.

### Drawer State (`Navbar.tsx`)
- The toggle trigger button leverages dynamic `aria-expanded={isMobileMenuOpen}` tags indicating state.
- When constructed into the DOM, the nested mobile overlay utilizes the exact same Deep Focus Management strategy as the Modals — caching triggers, forcefully trapping sequences within the navigation slider, and accepting `Escape` sequence callbacks to eject.

---

## 6. Media Restructuring

### Image Labeling (`LazyImage.tsx`)
- Visual representations of blog posts dynamically enforce robust `<img alt="..."/>` data attributes strictly dictated by TypeScript schemas, preventing engineers from compiling new image hooks without describing them contextually to screen readers.
- In instances of visual loading placeholders or decorative fallbacks (`svg` objects), the inclusion of `aria-hidden="true"` natively suppresses the SVG paths from polluting screen-reader readout flows.

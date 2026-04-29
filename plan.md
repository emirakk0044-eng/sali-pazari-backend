# plan.md

## 1. Objectives
- Rebuild **İstanbul Salı Pazarı AVM** as a modern, mobile-first full-stack app (React + FastAPI + MongoDB).
- Public site: hero, info bar, categories, products (filterable), map/hours, reviews, contact + WhatsApp FAB.
- Admin (password-only): manage products, view messages, update WhatsApp number/settings.
- Contact form: **save to DB** + **open WhatsApp** with prefilled message.
- Keep implementation MVP-focused (fast, low cost), but stable and deployable.

## 2. Implementation Steps

### Phase 1 — Core POC (skip; build directly)
Rationale: Standard CRUD + simple password auth + file upload patterns; no 3rd-party APIs that require isolation POC.

### Phase 2 — V1 App Development (Public site + core admin without auth hardening)
**User stories (V1)**
1. As a visitor, I can see store name, slogan, rating, review count, category count, and today’s open hours at a glance.
2. As a visitor, I can filter products by category and quickly scan name/price/photo.
3. As a visitor, I can send a message and then continue the conversation via WhatsApp automatically.
4. As an admin, I can add a product with name/price/category/photo and see it instantly on the public site.
5. As an admin, I can view submitted contact messages in one list.

**Backend (FastAPI)**
- Project setup: `api/` with routers, Pydantic schemas, Mongo connection.
- Models/collections:
  - `products`: {name, price, category, image_url, created_at, updated_at}
  - `messages`: {name, phone, email, subject, message, created_at, user_agent, ip(optional)}
  - `settings`: {whatsapp_number, instagram_url, address, hours, google_rating, review_count}
- Endpoints (unprotected in V1, except minimal admin token later):
  - `GET /api/categories` (static list or derived distinct from products + seed defaults)
  - `GET /api/products?category=`
  - `POST /api/products` (multipart: fields + image)
  - `PUT /api/products/{id}` (optional image)
  - `DELETE /api/products/{id}`
  - `POST /api/messages` (store contact)
  - `GET /api/settings` (public)
  - `PUT /api/settings` (admin-only in later phase; for V1 can be simple)
- File upload MVP:
  - Store images on server filesystem (e.g., `uploads/`) and expose via `/uploads/...`.
  - Validate mime type + max size.
- Seed script / startup init:
  - Ensure default categories exist.
  - Ensure `settings` has initial WhatsApp `+90 536 283 44 81` (stored normalized), Instagram `@salipazarizmit`, address/hours.

**Frontend (React)**
- Routes:
  - `/` public one-page layout with sections (smooth scroll).
  - `/admin` (temporary unprotected shell in V1; real login in Phase 3).
- Components:
  - Modern Hero (same content, updated typography + spacing).
  - InfoBar with address/hours/Instagram.
  - Categories grid (click to filter).
  - Products grid: loading/empty/error states; price formatting.
  - Map: embed Google Maps iframe + “Google Maps’te Gör” link.
  - Reviews: render fixed 3 reviews (editable later).
  - Contact form:
    - On submit: call `POST /api/messages` then open WhatsApp `wa.me` with prefilled text.
  - WhatsApp FAB: pulls number from `/api/settings`.
- Design system (MVP): Tailwind (or lightweight CSS modules) with teal accent `#0f766e`, card UI, responsive grid.

**Integration & data flow checks (during build)**
- Verify product create → image served → product list renders.
- Verify category filter matches backend query.
- Verify contact submit creates DB record and WhatsApp opens correctly.

**Phase 2 testing (end-to-end)**
- Run app locally, test:
  - Product CRUD basic flows.
  - Image upload/display.
  - Contact submit + WhatsApp redirect.
  - Responsive layout (mobile/desktop).
- Call testing agent for one full E2E pass and fix issues.

### Phase 3 — Add Auth + Admin Hardening + Admin UX
**User stories (Admin)**
1. As an admin, I can log in using a single password and stay logged in during my session.
2. As an admin, I can’t access admin pages unless I’m authenticated.
3. As an admin, I can update the WhatsApp number without code changes.
4. As an admin, I can edit an existing product without re-uploading the photo.
5. As an admin, I can search/filter messages by date/name/subject.

**Backend auth**
- `POST /api/admin/login` with password → return JWT.
- Protect admin endpoints with dependency:
  - `POST/PUT/DELETE /api/products*`
  - `GET /api/admin/messages`
  - `PUT /api/settings`
- Store admin password as env var (hash with bcrypt/argon2).

**Frontend admin**
- `/admin/login` password form.
- Auth storage: httpOnly cookie (preferred) or localStorage token (MVP).
- `/admin/dashboard` basic stats (product count, message count).
- `/admin/products` CRUD UI with image preview.
- `/admin/messages` table view.
- `/admin/settings` WhatsApp number editor (normalize +90).

**Phase 3 testing (end-to-end)**
- Verify protected routes.
- Verify login/logout.
- Verify settings change updates public WhatsApp FAB + contact redirect.
- Call testing agent for one full E2E pass and fix issues.

### Phase 4 — Polish + Deployment
**User stories (Polish)**
1. As a visitor, I see fast loading states and never see broken sections.
2. As a visitor, I can share the site link and it renders well on social previews.
3. As an admin, I get clear error messages when uploads fail.
4. As an admin, I can safely delete a product and it disappears everywhere.
5. As an owner, I can deploy once and have a stable live URL.

- SEO: title/description, OpenGraph tags.
- Performance: image size limits + optional compression.
- Accessibility: form labels, focus states.
- Deploy via Emergent Deploy; set env vars (Mongo URI, ADMIN_PASSWORD_HASH, JWT_SECRET).
- Smoke test on deployed URL.

## 3. Next Actions
1. Confirm exact domain/store settings to seed: address text, hours (all days same?), Instagram URL.
2. Choose image upload approach: filesystem (fast) vs S3/Cloudinary (later).
3. Implement Phase 2 in one cohesive pass (backend + frontend).
4. Run E2E tests + fix.
5. Implement Phase 3 auth + rerun E2E.

## 4. Success Criteria
- Public site loads with modern UI and all sections functional.
- Products list is driven by MongoDB; category filtering works.
- Admin can add/edit/delete products with photo upload.
- Contact form both saves to DB and opens WhatsApp with correct, admin-editable number.
- Admin login protects admin routes.
- Deployed app is stable and passes smoke tests.

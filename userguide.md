# Biomed Invex Portal (biomedwaste.net) — User Guide

## 1) What this portal is

- **Customer Portal (`sha-biomed-frontend`)**: where customers log in, view invoices, request services, submit complaints, and file invoice disputes.
- **Admin Panel (`sha-biomed`)**: internal team workspace to review disputes/complaints, upload supporting documents, and resolve items.

---

## 2) Accessing the Customer Portal

### 2.1 Supported browsers

- Chrome, Edge, Safari, Firefox (latest versions recommended).

### 2.2 How to open the portal

- Open: `https://biomedwaste.net/`
- If you type a direct link (example: `/services`) in the address bar and see “URL not found”, that is a server routing issue. The portal is designed to support direct links once Apache routing is configured.

### 2.3 Login

1. Click the sign-in option.
2. Complete authentication (Microsoft login, if configured).
3. After login, you’ll be redirected into the portal.

### 2.4 Logout

- Use the logout option in the navigation menu (if available).
- Close the browser tab after logout for shared computers.

---

## 3) Navigation overview (Customer Portal)

Common pages you may see in the top navigation:

- **Home/Dashboard**: quick entry points to key actions.
- **Services / Complaints**: submit and review service complaints.
- **Invoices**: view invoices, preview PDFs, download, and dispute invoices.
- **Profile**: view your account details and assigned service locations (if applicable).
- Other pages (blogs, instructions, etc.) depending on what your account has enabled.

---

## 4) Complaints (Customer Portal)

### 4.1 File a complaint

1. Open **Services / Complaints**.
2. Click **File a Complaint**.
3. Enter:
   - **Contact number** (required)
   - **Description** (required)
4. Optional:
   - Upload up to the allowed number of images/attachments (only image types accepted if configured).
5. Click **Submit**.
6. You should see a success message.

### 4.2 What happens after submitting

- The complaint is recorded in the system and appears in the admin-side queue.
- If email notifications are enabled on the backend, the internal team is notified.

### 4.3 If attachments don’t show later

- Attachments must be supported end-to-end:
  - Customer app upload → backend storage → admin rendering endpoints.
- If you can upload but can’t view later, it usually means the admin/customer display logic needs to be updated to match the backend storage format.

---

## 5) Invoices (Customer Portal)

### 5.1 View invoices

1. Open **Invoices**.
2. Invoices typically group by your available service locations (if applicable).
3. For each invoice row you may see:
   - **Preview** (view PDF in-app)
   - **Download**
   - **Dispute / Under Review / Resolved** (action status)

### 5.2 Preview an invoice PDF

1. Click **Preview** (eye icon or “View”).
2. A PDF viewer opens in a dialog.
3. If you want a separate tab: click **Open in New Tab** (if shown).

### 5.3 Download an invoice

- Click the download icon.
- If download fails:
  - Try again
  - Check pop-up blockers
  - Try a different browser

### 5.4 Invoice dispute lifecycle (what the buttons mean)

- **Dispute**: no active dispute exists for that invoice (you can submit one).
- **Under Review**: a dispute exists and is pending/reviewing (cannot submit another dispute for the same invoice while it’s active).
- **Resolved**: the dispute was resolved (read the resolution notes and view any supporting document provided).

### 5.5 File a dispute

1. In **Invoices**, find the invoice row.
2. Click **Dispute**.
3. Enter the **Reason for Dispute** (required).
4. Submit.

What you should see immediately after submitting:

- The invoice row status changes to **Under Review** (no manual refresh required).

### 5.6 Viewing resolution + supporting document (when resolved)

1. In **Invoices**, open the **Invoice Disputes** section.
2. Click **View** on the dispute.
3. If the admin attached a supporting document:
   - Click **View Supporting Document**
   - PDFs/images should preview in-app
   - Other file types open via “Open in New Tab”

### 5.7 Auto-refresh behavior

- The invoices/disputes list auto-refreshes on a schedule (configured to **every 2 minutes**).
- If you are actively reviewing an open invoice PDF or supporting document, auto-refresh pauses to avoid interrupting your review.

---

## 6) Profile (Customer Portal)

### 6.1 What the profile is for

- Confirm your name/email details.
- Review your assigned service locations (if displayed).
- Some pages may depend on your assigned locations to show data correctly.

### 6.2 If you don’t see expected data

- If no approved/assigned locations exist, invoices and service data may appear empty.
- Contact support to confirm your account is linked correctly.

---

## 7) Admin Panel workflow (High-level)

### 7.1 Invoice disputes in Admin Panel

Typical admin flow:

1. Open **Invoice Disputes** in admin panel.
2. Review the dispute details.
3. Upload a **Supporting Document** (this is required before resolving, if configured).
4. Add resolution notes.
5. Mark dispute **Resolved**.

Result in Customer Portal:

- Customer sees status change to **Resolved**
- Customer can view the uploaded supporting document

### 7.2 Client complaints in Admin Panel

1. Open the complaints list.
2. View complaint text and images.
3. Respond/track status as needed.

---

## 8) Troubleshooting (Customer Portal)

### 8.1 “URL not found” when typing a link like `/services` in the address bar

Cause:

- Web server is not rewriting client-side routes to `index.html`.

Fix (server-side):

- Apache needs SPA rewrite rules so `/services` loads the React app.

### 8.2 “Under Review” never changes to “Resolved”

- Resolution is done from the Admin Panel.
- If it was resolved but not showing:
  - Wait for auto-refresh (2 minutes), or
  - Reopen the Invoices page, or
  - Ensure the backend dispute list endpoint returns updated status.

### 8.3 Supporting document won’t open

- If it’s a PDF/image, it should preview.
- If it’s Word/other formats, use **Open in New Tab** (download/view externally).
- If it 404s, confirm the admin upload saved successfully and the backend serves `GET /api/dispute/:id/supporting-document`.

### 8.4 Upload issues (complaint/dispute attachments)

- File size/type restrictions may block uploads.
- Try:
  - smaller file
  - supported format (PDF/PNG/JPG, etc., depending on the endpoint)

---

## 9) Best practices (for smooth usage)

- Use the built-in buttons instead of retyping URLs when possible.
- Don’t keep multiple invoice preview dialogs open at once.
- For disputes: add clear, specific descriptions (invoice #, date, issue type, amount, line item).

---

## 10) Quick “How do I…?” index

- **View invoice PDF** → Invoices → Preview
- **Download invoice** → Invoices → Download icon
- **Dispute invoice** → Invoices → Dispute → Submit reason
- **Check dispute status** → Invoices → Invoice Disputes → View
- **View supporting document** → Dispute Details → View Supporting Document
- **File complaint** → Services/Complaints → File a Complaint → Submit


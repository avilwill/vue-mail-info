# Willora – Project Management Application

A refactored Vue.js application originally based on an open-source email inbox example, redesigned into a project management tool for tracking SDLC tasks.

## About Me

I am a Software Developer with a focus on full-stack development using Vue.js, Ruby on Rails, and PostgreSQL. I have experience building scalable applications, integrating APIs, and improving legacy systems for performance and maintainability.

This project is part of my ePortfolio for course CS499 and demonstrates my ability to analyze, refactor, present, and enhance an existing codebase into a more functional and user-focused application.

## Project Overview

This application allows users to manage and track tasks through different stages of development:

- Board (On Deck, In Progress, QA Testing)
- Backlog
- Priority
- Done

Tickets can be created, updated, and moved between stages to support workflow organization and decision making.

## Enhancements and Contributions

I transformed the original inbox application into a project management system by:

- Refactoring the UI to support SDLC task tracking with a table, instead of messaging
- Fixing modal issues (preventing multiple instances and ensuring proper close behavior)
- Replacing inconsistent action buttons with a reusable dropdown component
- Creating reusable components to reduce code duplication
- Using props to dynamically control behavior across views
- Implementing ticket filtering logic based on active page (Board, Backlog, Priority, Done)
- Improving overall usability and consistency of the interface

These changes improved maintainability, scalability, and user experience.

### UI and user experience

I reworked the interface so the app feels like a real task tracker instead of a generic demo:

- **Clear visual system:** Board, backlog, and modal flows use consistent spacing, typography, and “pill” controls (buttons and dropdowns) so actions are easy to scan and use.
- **End-to-end ticket creation:** Users can create tasks from the sidebar modal with a visible destination (**Board**, **Backlog**, or **Done**), title, and description; creates persist through the API and appear in the right list immediately.
- **Focused views:** Board groups work by stage (On Deck, In Progress, QA Testing); Backlog, Priority, and Done each show the right slice of data so navigation matches how people actually work.

### Backend storage and data updates

Tickets are not only shown in the UI—they are **stored and updated on the server**:

- A small **Node.js / Express** service exposes REST endpoints for listing, creating, updating, and deleting tickets.
- Data lives in **SQLite** (file-backed, relational), with normalization helpers on the server so API responses stay consistent for the Vue client.
- The front end uses a dedicated **`api/tickets`** module and clear handlers in the root app (for example **`loadTickets`**, **`handleCreateTicket`**, **`handleUpdateTicket`**, and batch helpers) so network logic stays out of presentational components.

### Code structure: readable names, simpler flows, and reuse

I simplified and organized the codebase so responsibilities are obvious:

- **Component names match their job:** e.g. **`Tickets`** for shared list/board tables, **`Actions`** for the single-ticket toolbar, **`Create`** for the create/edit modal, **`ViewTicket`** for detail, **`Content`** for switching views.
- **Methods match behavior:** handlers such as **`normalizeTicket`**, **`formatDate`**, and **`handleBulkUpdateTickets`** read like the domain they operate on, which makes debugging and extension easier.
- **Reuse through props instead of copy-paste:** the same **`Tickets`** component is driven by props like **`layout`** (`list` vs `board`) and **`bulkContext`** (default vs Done-specific bulk actions). Child views (**`Board`**, **`BackLog`**, **`Priority`**, **`Done`**) pass filtered ticket lists and those flags rather than duplicating table markup. **`Actions`** is reused from **`ViewTicket`** with props such as **`hideBackButton`** so layout can differ without forking logic.
- **Shared patterns:** reusable dropdown markup and styles, a central **event bus** for cross-cutting events (navigation, ticket CRUD, opening the create modal for edit), and **`keep-alive`** on the main content area keep the architecture predictable.

### Additional changes I made

- **Ticket multiselect:** Checkboxes on list and board tables select tickets without navigating away; clicking the row still opens the ticket detail view.
- **Bulk action bar:** When one or more tickets are selected, a toolbar appears (styled like the single-ticket action bar) with clear selection, set/remove priority, mark as done, and move to board or backlog where applicable. Bulk updates run through the API via a batch update handler in the root app component.
- **Done tab bulk actions:** On the Done view, the bulk bar is tailored for completed tickets: **Delete** (permanent removal via the API) and a **Move to…** dropdown (same reusable pill/dropdown pattern as elsewhere) to move selected tickets back to the **Board** or **Backlog**, clearing the done state as needed.
- **Edit from ticket detail:** The single-ticket action bar includes **Edit**, which opens the same **Create New Task** modal used in the sidebar. In edit mode the modal is prefilled with title and description (HTML stripped for the description field), the Board / Backlog / Done placement matches the current ticket, and **Save changes** issues an update through the existing ticket API. Placement fields are only sent if the destination dropdown was changed from when the modal opened.

## Tech Stack

- Vue.js 2
- JavaScript (ES5/ES6)
- HTML5 / CSS3
- Node.js, Express
- SQLite (ticket persistence via `sqlite` / `sqlite3`)

## Code Review: 
https://vimeo.com/1184589428/cb22762798

## Getting up and Running

``` bash
# Install the dependencies
npm install

# Serve with hot reload at http://localhost:8080
npm run dev

# Start the API server at http://localhost:3001
npm run server

# Build for production with minification
npm run build
```

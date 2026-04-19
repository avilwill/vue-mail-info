/**
 * Tickets API server: Express app with SQLite. CRUD for tickets; optional seed from JSON.
 * Start: initDb() then listen on PORT. Routes under /api/tickets and /api/health.
 */

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'tickets.db');
const SEED_PATH = path.join(__dirname, 'seed', 'tickets.json');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

/** SQLite connection (set in initDb). */
let db;

/** Convert a DB row to API shape: booleans for flags, attachments parsed from JSON. */
const normalizeTicket = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    code: row.code,
    title: row.title,
    content: row.content,
    isPriority: Boolean(row.isPriority ?? row.isImportant),
    isDone: Boolean(row.isDone),
    inProgress: Boolean(row.inProgress),
    onDeck: Boolean(row.onDeck),
    qaTesting: Boolean(row.qaTesting),
    type: row.type,
    date: row.date,
    attachments: row.attachments ? JSON.parse(row.attachments) : []
  };
};

/** Convert API payload to DB shape: 0/1 for flags, attachments as JSON string. */
const buildTicketPayload = (payload = {}) => {
  return {
    code: payload.code || null,
    title: payload.title || 'Untitled',
    content: payload.content || '',
    isPriority: payload.isPriority === true || payload.isPriority === 1 ? 1 : 0,
    isDone: payload.isDone ? 1 : 0,
    inProgress: payload.inProgress ? 1 : 0,
    onDeck: payload.onDeck ? 1 : 0,
    qaTesting: payload.qaTesting ? 1 : 0,
    type: payload.type || 'backlog',
    date: payload.date || new Date().toISOString(),
    attachments: JSON.stringify(payload.attachments || [])
  };
};

/** Insert a ticket; if no code, auto-assign DW-NNN. Returns normalized ticket. */
const createTicket = async (payload) => {
  const ticket = buildTicketPayload(payload);

  const result = await db.run(
    `INSERT INTO tickets (
      code,
      title,
      content,
      isPriority,
      isDone,
      inProgress,
      onDeck,
      qaTesting,
      type,
      date,
      attachments
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ticket.code,
      ticket.title,
      ticket.content,
      ticket.isPriority,
      ticket.isDone,
      ticket.inProgress,
      ticket.onDeck,
      ticket.qaTesting,
      ticket.type,
      ticket.date,
      ticket.attachments
    ]
  );

  if (!ticket.code) {
    const code = `DW-${String(result.lastID).padStart(3, '0')}`;
    await db.run('UPDATE tickets SET code = ? WHERE id = ?', [code, result.lastID]);
  }

  const created = await db.get('SELECT * FROM tickets WHERE id = ?', [result.lastID]);
  return normalizeTicket(created);
};

/** Update ticket by id. allowPartial: merge with existing; else full replace. Returns normalized ticket or null. */
const updateTicket = async (id, payload, allowPartial) => {
  const existing = await db.get('SELECT * FROM tickets WHERE id = ?', [id]);
  if (!existing) {
    return null;
  }

  const current = normalizeTicket(existing);
  const merged = allowPartial
    ? {
        ...current,
        ...payload,
        attachments: payload.attachments || current.attachments
      }
    : payload;

  const ticket = buildTicketPayload(merged);

  await db.run(
    `UPDATE tickets SET
      code = ?,
      title = ?,
      content = ?,
      isPriority = ?,
      isDone = ?,
      inProgress = ?,
      onDeck = ?,
      qaTesting = ?,
      type = ?,
      date = ?,
      attachments = ?
      WHERE id = ?`,
    [
      ticket.code,
      ticket.title,
      ticket.content,
      ticket.isPriority,
      ticket.isDone,
      ticket.inProgress,
      ticket.onDeck,
      ticket.qaTesting,
      ticket.type,
      ticket.date,
      ticket.attachments,
      id
    ]
  );

  const updated = await db.get('SELECT * FROM tickets WHERE id = ?', [id]);
  return normalizeTicket(updated);
};

/** If SEED_PATH exists, load JSON and createTicket for each item (used when table is empty). */
const seedDatabase = async () => {
  if (!fs.existsSync(SEED_PATH)) {
    return;
  }

  const seedData = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
  for (const ticket of seedData) {
    await createTicket(ticket);
  }
};

/** Open SQLite at DB_PATH, create tickets table if missing, seed if empty. */
const initDb = async () => {
  db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await db.exec(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT,
    title TEXT NOT NULL,
    content TEXT,
    isPriority INTEGER DEFAULT 0,
    isDone INTEGER DEFAULT 0,
    inProgress INTEGER DEFAULT 0,
    onDeck INTEGER DEFAULT 0,
    qaTesting INTEGER DEFAULT 0,
    type TEXT,
    date TEXT,
    attachments TEXT
  )`);

  const columns = await db.all('PRAGMA table_info(tickets)');
  const hasOldPriority = columns.some((c) => c.name === 'isImportant');
  const hasNewPriority = columns.some((c) => c.name === 'isPriority');
  if (hasOldPriority && !hasNewPriority) {
    await db.exec('ALTER TABLE tickets RENAME COLUMN isImportant TO isPriority');
  }

  const row = await db.get('SELECT COUNT(*) as count FROM tickets');
  if (row.count === 0) {
    await seedDatabase();
  }
};

// --- Routes ---

/** Health check. */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

/** GET all tickets, newest first. */
app.get('/api/tickets', async (req, res) => {
  const rows = await db.all('SELECT * FROM tickets ORDER BY id DESC');
  res.json(rows.map(normalizeTicket));
});

/** GET one ticket by id; 404 if not found. */
app.get('/api/tickets/:id', async (req, res) => {
  const ticket = await db.get('SELECT * FROM tickets WHERE id = ?', [req.params.id]);
  if (!ticket) {
    res.status(404).json({ message: 'Ticket not found' });
    return;
  }

  res.json(normalizeTicket(ticket));
});

/** POST new ticket; body optional, defaults applied in buildTicketPayload. */
app.post('/api/tickets', async (req, res) => {
  const ticket = await createTicket(req.body || {});
  res.status(201).json(ticket);
});

/** PUT full replace; 404 if id not found. */
app.put('/api/tickets/:id', async (req, res) => {
  const ticket = await updateTicket(req.params.id, req.body || {}, false);
  if (!ticket) {
    res.status(404).json({ message: 'Ticket not found' });
    return;
  }

  res.json(ticket);
});

/** PATCH partial update; 404 if id not found. */
app.patch('/api/tickets/:id', async (req, res) => {
  const ticket = await updateTicket(req.params.id, req.body || {}, true);
  if (!ticket) {
    res.status(404).json({ message: 'Ticket not found' });
    return;
  }

  res.json(ticket);
});

/** DELETE ticket by id; 404 if not found, 204 on success. */
app.delete('/api/tickets/:id', async (req, res) => {
  const result = await db.run('DELETE FROM tickets WHERE id = ?', [req.params.id]);
  if (result.changes === 0) {
    res.status(404).json({ message: 'Ticket not found' });
    return;
  }

  res.status(204).send();
});

// --- Startup ---

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

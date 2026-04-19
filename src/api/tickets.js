/**
 * Tickets API client: HTTP calls to the backend ticket endpoints.
 * All methods return a Promise (resolve with parsed JSON, or null for 204; reject on !response.ok).
 */

/** Base URL for the tickets API (e.g. http://localhost:3001/api). */
const API_BASE = 'http://localhost:3001/api';

/**
 * Generic request helper: GET by default, merges in JSON Content-Type.
 * Rejects with Error on non-ok response; returns null for 204 No Content, else response.json().
 */
const request = (path, options = {}) => {
  const headers = Object.assign(
    {
      'Content-Type': 'application/json'
    },
    options.headers || {}
  );

  return fetch(`${API_BASE}${path}`, Object.assign({}, options, { headers }))
    .then(response => {
      if (!response.ok) {
        return response.text().then(message => {
          throw new Error(message || 'Request failed');
        });
      }

      if (response.status === 204) {
        return null;
      }

      return response.json();
    });
};

/** GET all tickets. Returns Promise<Array>. */
export const fetchTickets = () => request('/tickets');

/** GET a single ticket by id. Returns Promise<Object>. */
export const fetchTicket = (id) => request(`/tickets/${id}`);

/** POST a new ticket. Returns Promise<Object> (created ticket). */
export const createTicket = (payload) =>
  request('/tickets', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

/** PATCH or PUT to update a ticket. usePatch true = PATCH. Returns Promise<Object> (updated ticket). */
export const updateTicket = (id, payload, usePatch = true) =>
  request(`/tickets/${id}`, {
    method: usePatch ? 'PATCH' : 'PUT',
    body: JSON.stringify(payload)
  });

/** DELETE a ticket by id. Returns Promise<null> (204). */
export const deleteTicket = (id) =>
  request(`/tickets/${id}`, {
    method: 'DELETE'
  });

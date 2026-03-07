const API_BASE = 'http://localhost:3001/api';

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

export const fetchTickets = () => request('/tickets');

export const fetchTicket = (id) => request(`/tickets/${id}`);

export const createTicket = (payload) =>
  request('/tickets', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const updateTicket = (id, payload, usePatch = true) =>
  request(`/tickets/${id}`, {
    method: usePatch ? 'PATCH' : 'PUT',
    body: JSON.stringify(payload)
  });

export const deleteTicket = (id) =>
  request(`/tickets/${id}`, {
    method: 'DELETE'
  });

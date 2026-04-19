<!-- Main application component
 Purpose: Manages the overall layout and state of the application, including tickets and event handling.
-->
<template>
  <div class="container-fluid">
    <div class="board-box">
            <app-sidebar :tickets="tickets"></app-sidebar>
            <app-content :tickets="tickets"></app-content>
        </div>
    </div>
</template>

<script>
    import Sidebar from './Sidebar.vue';
    import Content from './Content.vue';
    import randomTickets from './data/random-tickets';
    import moment from 'moment';
    import { fetchTickets, createTicket, updateTicket, deleteTicket } from './api/tickets';
    import { eventBus } from './main';

    /**
     * Root component: holds the single source of truth for tickets and performs
     * all API-backed create/update operations in response to eventBus events.
     */
    export default {
        data() {
            return {
                /** All tickets from the API; shared with Sidebar and Content. */
                tickets: []
            };
        },
        created() {
            this.loadTickets();

            // EventBus: child components emit these; App performs the API call and updates tickets.
            eventBus.$on('refreshTickets', () => {
                this.addRandomTicket();
            });

            eventBus.$on('createTicket', (data) => {
                this.handleCreateTicket(data.ticket);
            });

            eventBus.$on('updateTicket', (data) => {
                this.handleUpdateTicket(data.id, data.updates, data.localTicket);
            });

            eventBus.$on('bulkUpdateTickets', (payload) => {
                this.handleBulkUpdateTickets(payload);
            });

            eventBus.$on('bulkDeleteTickets', (payload) => {
                this.handleBulkDeleteTickets(payload);
            });
        },
        methods: {
            /** Load all tickets from the API and set tickets (with normalized date/attachments). */
            loadTickets() {
                return fetchTickets().then(tickets => {
                    this.tickets = tickets.map(this.normalizeTicket);
                });
            },
            /** Normalize a raw API ticket: date as moment, attachments as array. */
            normalizeTicket(ticket) {
                return Object.assign({}, ticket, {
                    date: ticket.date ? moment(ticket.date) : moment(),
                    attachments: Array.isArray(ticket.attachments) ? ticket.attachments : [],
                    isPriority: Boolean(ticket.isPriority)
                });
            },
            /** Convert date-like value to an ISO string for the API. */
            formatDate(value) {
                if (!value) {
                    return new Date().toISOString();
                }

                if (typeof value === 'string') {
                    return value;
                }

                if (typeof value.toISOString === 'function') {
                    return value.toISOString();
                }

                return new Date().toISOString();
            },
            /** Create one ticket from random-tickets data via API, then prepend to tickets. */
            addRandomTicket() {
                const randomIndex = Math.floor(Math.random() * randomTickets.length);
                const randomTicket = randomTickets[randomIndex];

                return createTicket(
                    Object.assign({}, randomTicket, {
                        date: this.formatDate(randomTicket.date)
                    })
                ).then(created => {
                    this.tickets = [this.normalizeTicket(created), ...this.tickets];
                });
            },
            /** Create a ticket via API (from Create modal or event), then prepend to tickets. */
            handleCreateTicket(ticket) {
                return createTicket(
                    Object.assign({}, ticket, {
                        date: this.formatDate(ticket.date)
                    })
                ).then(created => {
                    this.tickets = [this.normalizeTicket(created), ...this.tickets];
                });
            },
            /** Update a ticket via API, then replace the matching item in tickets. */
            handleUpdateTicket(id, updates, localTicket) {
                return updateTicket(
                    id,
                    Object.assign({}, updates, {
                        date: this.formatDate(updates.date || localTicket.date)
                    })
                ).then(updated => {
                    const index = this.tickets.findIndex(
                        (ticket) => Number(ticket.id) === Number(id)
                    );
                    if (index !== -1) {
                        this.$set(this.tickets, index, this.normalizeTicket(updated));
                    }
                }).catch((err) => {
                    console.error('updateTicket failed:', err);
                });
            },
            /** Apply the same updates to many tickets (parallel API calls). */
            handleBulkUpdateTickets(payload) {
                const ids = payload && payload.ids;
                const updates = (payload && payload.updates) || {};
                if (!ids || !ids.length) {
                    return Promise.resolve();
                }
                return Promise.all(
                    ids.map((id) => {
                        const ticket = this.tickets.find(
                            (t) => Number(t.id) === Number(id)
                        );
                        if (!ticket) {
                            return Promise.resolve();
                        }
                        return updateTicket(
                            id,
                            Object.assign({}, updates, {
                                date: this.formatDate(updates.date || ticket.date)
                            })
                        )
                            .then((updated) => {
                                const index = this.tickets.findIndex(
                                    (t) => Number(t.id) === Number(id)
                                );
                                if (index !== -1) {
                                    this.$set(
                                        this.tickets,
                                        index,
                                        this.normalizeTicket(updated)
                                    );
                                }
                            })
                            .catch((err) => {
                                console.error('bulkUpdate ticket failed:', id, err);
                            });
                    })
                );
            },
            /** DELETE each id in parallel, then remove from local tickets. */
            handleBulkDeleteTickets(payload) {
                const ids = payload && payload.ids;
                if (!ids || !ids.length) {
                    return Promise.resolve();
                }
                return Promise.all(
                    ids.map((id) =>
                        deleteTicket(id)
                            .then(() => {
                                const index = this.tickets.findIndex(
                                    (t) => Number(t.id) === Number(id)
                                );
                                if (index !== -1) {
                                    this.tickets.splice(index, 1);
                                }
                            })
                            .catch((err) => {
                                console.error('bulkDelete ticket failed:', id, err);
                            })
                    )
                );
            }
        },
        components: {
            appSidebar: Sidebar,
            appContent: Content
        }
    }
</script>

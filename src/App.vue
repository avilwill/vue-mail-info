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
    import { fetchTickets, createTicket, updateTicket } from './api/tickets';
    import { eventBus } from './main';

    export default {
        data() {
            return {
                tickets: []
            };
        },
        created() {
            this.loadTickets();

            eventBus.$on('refreshTickets', () => {
                this.addRandomTicket();
            });

            eventBus.$on('createTicket', (data) => {
                this.handleCreateTicket(data.ticket);
            });

            eventBus.$on('updateTicket', (data) => {
                this.handleUpdateTicket(data.id, data.updates, data.localTicket);
            });
        },
        methods: {
            loadTickets() {
                return fetchTickets().then(tickets => {
                    this.tickets = tickets.map(this.normalizeTicket);
                });
            },
            normalizeTicket(ticket) {
                return Object.assign({}, ticket, {
                    date: ticket.date ? moment(ticket.date) : moment(),
                    attachments: Array.isArray(ticket.attachments) ? ticket.attachments : []
                });
            },
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
            handleCreateTicket(ticket) {
                return createTicket(
                    Object.assign({}, ticket, {
                        date: this.formatDate(ticket.date)
                    })
                ).then(created => {
                    this.tickets = [this.normalizeTicket(created), ...this.tickets];
                });
            },
            handleUpdateTicket(id, updates, localTicket) {
                return updateTicket(
                    id,
                    Object.assign({}, updates, {
                        date: this.formatDate(updates.date || localTicket.date)
                    })
                ).then(updated => {
                    const index = this.tickets.findIndex(ticket => ticket.id === id);
                    if (index !== -1) {
                        this.$set(this.tickets, index, this.normalizeTicket(updated));
                    }
                });
            }
        },
        components: {
            appSidebar: Sidebar,
            appContent: Content
        }
    }
</script>

<!--
    Board view: shows active (on-board) tickets that are not done.
    Delegates to Tickets, which renders On Deck / In Progress / QA Testing sections.
-->
<template>
    <div class="backlog-body">
        <app-tickets :tickets="activeTickets" layout="board"></app-tickets>
    </div>
</template>

<script>
    import Tickets from './Tickets.vue';

    /**
     * Board: Content panel for the Board tab. Filters data.tickets to
     * type === 'active' and !isDone, then renders via Tickets (board layout with sections).
     */
    export default {
        props: {
            /** { tickets } from Content; tickets are injected by Content's currentView. */
            data: {
                type: Object,
                required: true
            }
        },
        computed: {
            /** Active (board) tickets only, not done. */
            activeTickets() {
                return this.data.tickets.filter(function(ticket) {
                    return (ticket.type == 'active' && !ticket.isDone);
                });
            }
        },
        components: {
            appTickets: Tickets
        }
    }
</script>
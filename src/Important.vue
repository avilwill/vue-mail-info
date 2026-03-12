<!--
    Important view: shows backlog tickets marked important that are not done.
    Delegates to Tickets with the filtered list.
-->
<template>
    <div class="backlog-body">
        <app-tickets :tickets="importantTickets"></app-tickets>
    </div>
</template>

<script>
    import Tickets from './Tickets.vue';

    /**
     * Important: Content panel for the Important tab. Filters data.tickets to
     * type === 'backlog', isImportant === true, and !isDone, then renders via Tickets.
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
            /** Backlog tickets marked important, not done. */
            importantTickets() {
                return this.data.tickets.filter(function(ticket) {
                    return (ticket.type == 'backlog' && ticket.isImportant === true && !ticket.isDone);
                });
            }
        },
        components: {
            appTickets: Tickets
        }
    }
</script>
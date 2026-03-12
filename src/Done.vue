<!--
    Done view: shows tickets marked as completed (isDone === true).
    Delegates to Tickets with the filtered list.
-->
<template>
    <div class="backlog-body">
        <app-tickets :tickets="completedTickets"></app-tickets>
    </div>
</template>

<script>
    import Tickets from './Tickets.vue';

    /**
     * Done: Content panel for the Done tab. Filters data.tickets to isDone === true,
     * then renders via the Tickets component.
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
            /** Completed tickets only. */
            completedTickets() {
                return this.data.tickets.filter(function(ticket) {
                    return ticket.isDone === true;
                });
            }
        },
        components: {
            appTickets: Tickets
        }
    }
</script>
<!--
    Backlog view: shows tickets that are in the backlog and not done.
    Delegates to Tickets with the filtered list.
-->
<template>
    <div class="backlog-body">
        <app-tickets :tickets="backLogTickets"></app-tickets>
    </div>
</template>

<script>
    import Tickets from './Tickets.vue';

    /**
     * BackLog: Content panel for the Backlog tab. Filters data.tickets to
     * type === 'backlog' and !isDone, then renders them via the Tickets component.
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
            /** Backlog tickets only (not done). */
            backLogTickets() {
                return this.data.tickets.filter(function(ticket) {
                    return (ticket.type == 'backlog' && !ticket.isDone);
                });
            }
        },
        components: {
            appTickets: Tickets
        }
    }
</script>

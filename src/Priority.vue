<!--
    Priority view: backlog or board tickets marked priority and not done.
    Delegates to Tickets with layout=list (flat table).
-->
<template>
    <div class="backlog-body">
        <app-tickets :tickets="priorityTickets" layout="list"></app-tickets>
    </div>
</template>

<script>
    import Tickets from './Tickets.vue';

    /**
     * Priority: Content panel for the Priority tab. Filters data.tickets to
     * isPriority === true, !isDone, and type backlog or active (board or backlog).
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
            /** Priority tickets on backlog or board, not done. */
            priorityTickets() {
                return this.data.tickets.filter(function(ticket) {
                    const onList = ticket.type == 'backlog' || ticket.type == 'active';
                    return onList && ticket.isPriority === true && !ticket.isDone;
                });
            }
        },
        components: {
            appTickets: Tickets
        }
    }
</script>

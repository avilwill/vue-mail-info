<template>
    <div class="backlog-body">
        <app-tickets :tickets="activeTickets"></app-tickets>
    </div>
</template>

<script>
    import { eventBus } from './main';
    import Tickets from './Tickets.vue';

    export default {
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        computed: {
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
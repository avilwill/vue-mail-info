<template>
    <div class="backlog-body">
        <app-tickets :tickets="completedTickets"></app-tickets>
    </div>
</template>

<script>
    import Tickets from './Tickets.vue';

    export default {
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        computed: {
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
<template>
    <div class="backlog-body">
        <app-tickets :tickets="backLogTickets"></app-tickets>
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
        methods: {
        },
        computed: {
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

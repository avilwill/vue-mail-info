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
    import tickets from './data/tickets';
    import randomTickets from './data/random-tickets';
    import { eventBus } from './main';

    export default {
        data() {
            return {
                tickets: tickets
            };
        },
        created() {
            eventBus.$on('refreshTickets', () => {
                let randomIndex = Math.floor(Math.random() * randomTickets.length);
                let temp = [randomTickets[randomIndex]];
                this.tickets = temp.concat(this.tickets.slice(0));
            });

            eventBus.$on('createTicket', (data) => {
                let temp = [data.ticket];
                this.tickets = temp.concat(this.tickets.slice(0));
            });
        },
        components: {
            appSidebar: Sidebar,
            appContent: Content
        }
    }
</script>

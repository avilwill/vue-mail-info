<template>
    <aside class="sm-side">
                <div class="create-wrapper">
         <div class="user-head">
            <img src="src/assets/images/willora-logo.png">

            <div class="user-name">
                <h5>WILLORA</h5>
            </div>
        </div>
        </div>
        <div class="create-button-wrapper">
            <app-create></app-create>
        </div>

        <ul class="backlog-nav">
            <li :class="{ active: activeView == 'app-board' }">
                <a href="#" @click.prevent="navigate('app-board', 'Board')">
                    <i class="fa fa-cube"></i>Board <span class="label label-success pull-right">{{ activeTickets.length }}</span>
                </a>
            </li>
            <li :class="{ active: activeView == 'app-backlog' }">
                <a href="#" @click.prevent="navigate('app-backlog', 'Backlog')">
                    <i class="fa fa-inbox"></i>Backlog <span class="label label-info pull-right">{{ backLogTickets.length }}</span>
                </a>
            </li>

            <li :class="{ active: activeView == 'app-important' }">
                <a href="#" @click.prevent="navigate('app-important', 'Important')">
                    <i class="fa fa-exclamation-triangle"></i>Important <span class="label label-danger pull-right">{{ importantTickets.length }}</span>
                </a>
            </li>

            <li :class="{ active: activeView == 'app-done' }">
                <a href="#" @click.prevent="navigate('app-done', 'Done')">
                    <i class="fa fa-check-square-o"></i>Done <span class="label label-default pull-right">{{ completedTickets.length }}</span>
                </a>
            </li>
        </ul>
    </aside>
</template>

<script>
    import { eventBus } from './main';
    import Create from './Create.vue';

    export default {
        props: {
            tickets: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                activeView: 'app-board'
            };
        },
        created() {
            eventBus.$on('changeView', (data) => {
                this.activeView = data.tag;
            });
        },
        methods: {
            navigate(newView, title) {
                eventBus.$emit('changeView', {
                    tag: newView,
                    title: title
                });
            }
        },
        computed: {
            backLogTickets() {
                return this.tickets.filter(function(ticket) {
                    return (ticket.type == 'backlog' && !ticket.inProgress && !ticket.isDone);
                });
            },
            activeTickets() {
                return this.tickets.filter(function(ticket) {
                    return (ticket.type == 'active' && !ticket.isDone);
                });
            },
            importantTickets() {
                return this.tickets.filter(function(ticket) {
                    return (ticket.type == 'backlog' && ticket.isImportant === true && !ticket.isDone);
                });
            },
            completedTickets() {
                return this.tickets.filter(function(ticket) {
                    return ticket.isDone === true;
                });
            }
        },
        components: {
            appCreate: Create
        }
    }
</script>

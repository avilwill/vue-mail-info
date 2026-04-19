<!--
    Sidebar: app branding, Create button, and nav links for Board, Backlog, Priority, Done.
    Each link shows a count; clicking emits changeView so Content switches the main panel.
-->
<template>
    <aside class="sm-side">
        <!-- Sidebar header: logo and app name -->
        <div class="create-wrapper">
            <div class="user-head">
                <img src="src/assets/images/willora-logo.png">

                <div class="user-name">
                    <h5>WILLORA</h5>
                </div>
            </div>
        </div>
        <!-- Create new ticket button -->
        <div class="create-button-wrapper">
            <app-create></app-create>
        </div>

        <!-- Board navigation -->
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

            <li :class="{ active: activeView == 'app-priority' }">
                <a href="#" @click.prevent="navigate('app-priority', 'Priority')">
                    <i class="fa fa-exclamation-triangle"></i>Priority <span class="label label-danger pull-right">{{ priorityTickets.length }}</span>
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

    /**
     * Sidebar: navigation and create action. Receives tickets from App, derives
     * counts per view (Board, Backlog, Priority, Done), and syncs activeView
     * with Content via changeView events.
     */
    export default {
        props: {
            /** Full ticket list from App; used to compute counts for nav labels. */
            tickets: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                /** Current view tag (e.g. 'app-board'); drives nav highlight and is updated by changeView. */
                activeView: 'app-board'
            };
        },
        created() {
            eventBus.$on('changeView', (data) => {
                this.activeView = data.tag;
            });
        },
        methods: {
            /** Switch main panel to the given view; Content listens and updates its history. */
            navigate(newView, title) {
                eventBus.$emit('changeView', {
                    tag: newView,
                    title: title
                });
            }
        },
        computed: {
            /** Backlog tickets not in progress and not done (for Backlog nav count). */
            backLogTickets() {
                return this.tickets.filter(function(ticket) {
                    return (ticket.type == 'backlog' && !ticket.inProgress && !ticket.isDone);
                });
            },
            /** Active (board) tickets not done (for Board nav count). */
            activeTickets() {
                return this.tickets.filter(function(ticket) {
                    return (ticket.type == 'active' && !ticket.isDone);
                });
            },
            /** Backlog or board tickets marked priority and not done (for Priority nav count). */
            priorityTickets() {
                return this.tickets.filter(function(ticket) {
                    const onList = ticket.type == 'backlog' || ticket.type == 'active';
                    return onList && ticket.isPriority === true && !ticket.isDone;
                });
            },
            /** Completed tickets (for Done nav count). */
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

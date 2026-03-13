<!--
    Main content area: header (current view title) and a dynamic view component.
    - Title comes from currentView.title.
    - Component is currentView.tag (e.g. app-board, app-backlog, app-view-ticket).
    - currentView.data is passed as the `data` prop; tickets are injected in the computed.
    - keep-alive preserves state when switching between list and ticket detail.
-->
<template>
    <aside class="lg-side">
        <div
            v-if="currentView.tag !== 'app-view-ticket'"
            class="backlog-head"
        >
            <h3>{{ currentView.title }}</h3>
        </div>

        <keep-alive>
            <component :is="currentView.tag" :data="currentView.data"></component>
        </keep-alive>
    </aside>
</template>

<script>
    import { eventBus } from './main';
    import BackLog from './BackLog.vue';
    import Board from './Board.vue';
    import Important from './Important.vue';
    import Done from './Done.vue';
    import ViewTicket from './ViewTicket.vue';

    /**
     * Content: main panel that shows the current view (Board, Backlog, Important,
     * Done, or a single ticket). Maintains a view history so "Back" can return
     * to the previous view. List views receive tickets from the parent; ViewTicket
     * receives a ticket in data.
     */
    export default {
        props: {
            /** Ticket list from App; passed into the current view's data. */
            tickets: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                /** Stack of views: [0] = current, [1] = previous (for Back). Each has tag, title, data. */
                history: [
                    {
                        tag: 'app-board',
                        title: 'Board',
                        data: {
                            tickets: null
                        }
                    }
                ]
            };
        },
        created() {
            // On changeView (from Sidebar or Tickets/ViewTicket), push new view as current.
            eventBus.$on('changeView', (data) => {
                const newView = [{
                    tag: data.tag,
                    title: data.title,
                    data: data.data || {}
                }];
                this.history = newView.concat(this.history.splice(0));
            });
        },
        computed: {
            /** Current view config with tickets injected; used by the dynamic component. */
            currentView() {
                const current = this.history[0];
                current.data.tickets = this.tickets;
                return current;
            },
            /** Previous view (for Back button in ViewTicket). */
            previousView() {
                return typeof this.history[1] !== 'undefined' ? this.history[1] : null;
            }
        },
        components: {
            appBacklog: BackLog,
            appBoard: Board,
            appImportant: Important,
            appDone: Done,
            appViewTicket: ViewTicket
        }
    }
</script>

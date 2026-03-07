<!--
    Component: Content
    Purpose: Renders a sidebar area with a header and a dynamic child component.
    Usage: Place this comment at the top of Content.vue (above <template>).
    Details:
        - Displays the current view title from `currentView.title`.
        - Dynamically renders the component specified by `currentView.tag`.
        - Passes `currentView.data` to the dynamic component as the `data` prop.
        - Wraps the dynamic component with <keep-alive> to preserve state.
-->
<template>
    <aside class="lg-side">
        <div class="backlog-head">
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

    export default {
        props: {
            tickets: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
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
            eventBus.$on('changeView', (data) => {
                let temp = [{
                    tag: data.tag,
                    title: data.title,
                    data: data.data || {}
                }];

                this.history = temp.concat(this.history.splice(0));
            });
        },
        computed: {
            currentView() {
                let current = this.history[0];
                current.data.tickets = this.tickets;
                return current;
            },
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

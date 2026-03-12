<!--
    Ticket detail view: Back button, action bar (Mark Done, Move to Board/Backlog),
    HTML content, and optional attachments list. Actions emit updateTicket; Back uses
    Content's previousView to return to the list.
-->
<template>
    <div class="backlog-body">
        <div class="ticket-option">
            <button class="btn btn-primary" @click="navigateBack">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp; Back
            </button>
            <!-- Action bar: change status (done, board, backlog, in progress) -->
            <button class="btn btn-success" @click="markDone" :disabled="data.ticket.isDone">
                <i class="fa fa-check-square-o"></i>&nbsp; {{ data.ticket.isDone ? 'Done' : 'Mark as Done' }}
            </button>
            <button v-if="data.ticket.type === 'backlog'" class="btn btn-primary" @click="moveToBoard">
                    <i class="fa fa-cube" aria-hidden="true"></i>&nbsp; Move to Board
            </button>
            <button v-if="data.ticket.type === 'active'" class="btn btn-primary" @click="moveToBacklog">
                    <i class="fa fa-inbox" aria-hidden="true"></i>&nbsp; Move to Backlog
            </button>
            <button v-if="data.ticket.type === 'active'" class="btn btn-primary" @click="moveToInProgress">
                    <i class="" aria-hidden="true"></i>&nbsp; Move to In Progress
            </button>
        </div>

        <hr>
        <div v-html="data.ticket.content" class="ticket"></div>

        <div v-if="data.ticket.attachments.length > 0" class="attachments">
            <h4>Attachments</h4>

            <ul>
                <li v-for="attachment in data.ticket.attachments">
                    <i class="fa fa-paperclip"></i> {{ attachment.fileName }} ({{ attachment.size | formatBytes }})
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { eventBus } from './main';

    /**
     * ViewTicket: single-ticket detail shown when user clicks a ticket in the list.
     * Receives data.ticket from Content. Actions emit updateTicket (App handles API);
     * Back uses parent's previousView to switch Content back to the prior view.
     */
    export default {
        props: {
            /** { ticket } — ticket object passed from Content when opening detail. */
            data: {
                type: Object,
                required: true
            },
        },
        /** When view is re-activated (keep-alive), ensure inProgress is set for button state. */
        activated() {
            if (typeof this.data.ticket.inProgress !== 'undefined') {
                this.data.ticket.inProgress = true;
            }
        },
        methods: {
            /** Return to the previous view (list); uses Content's previousView. */
            navigateBack() {
                const previousView = this.$parent.previousView;

                eventBus.$emit('changeView', {
                    tag: previousView.tag,
                    title: previousView.title,
                    data: previousView.data
                });
            },
            /** Set ticket as done and persist via App's updateTicket. */
            markDone() {
                if (this.data.ticket.isDone) {
                    return;
                }

                this.data.ticket.isDone = true;
                eventBus.$emit('updateTicket', {
                    id: this.data.ticket.id,
                    updates: { isDone: true },
                    localTicket: this.data.ticket
                });
            },
            /** Move ticket to board (type active); persist via App. */
            moveToBoard() {
                this.data.ticket.type = 'active';
                eventBus.$emit('updateTicket', {
                    id: this.data.ticket.id,
                    updates: { type: 'active' },
                    localTicket: this.data.ticket
                });
            },
            /** Move ticket to backlog; persist via App. */
            moveToBacklog() {
                this.data.ticket.type = 'backlog';
                eventBus.$emit('updateTicket', {
                    id: this.data.ticket.id,
                    updates: { type: 'backlog' },
                    localTicket: this.data.ticket
                });
            },
            /** Move ticket to In Progress (board); persist via App. */
            moveToInProgress() {
                this.data.ticket.type = 'inProgress';
                eventBus.$emit('updateTicket', {
                    id: this.data.ticket.id,
                    updates: { type: 'inProgress' },
                    localTicket: this.data.ticket
                });
            }
        },
        filters: {
            /** Format byte count as human-readable string (e.g. "1.5 MB"). */
            formatBytes(bytes) {
                if (bytes == 0) {
                    return '0 Bytes';
                }

                const decimals = 2;
                const k = 1000;
                const dm = decimals + 1 || 3;
                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));

                return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
            }
        }
    }
</script>
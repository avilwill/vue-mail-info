<!--
    Ticket detail view: Back button, action bar (Mark Done, Move to Board/Backlog),
    HTML content, and optional attachments list. Actions emit updateTicket; Back uses
    Content's previousView to return to the list.
-->
<template>
    <div class="backlog-body">
        <div class="ticket-detail-header">
            <div class="ticket-detail-left">
                <button type="button" class="back-btn" @click="navigateBack">
                    <i class="fa fa-arrow-left"></i>
                    Back
                </button>
            </div>
            <h2 class="ticket-detail-title">{{ data.ticket.title }}</h2>
            <div class="ticket-detail-actions">
                <app-actions
                    :ticket="data.ticket"
                    :hide-back-button="true"
                    @mark-done="markDone"
                    @move-type="onMoveType"
                    @select-stage="onSelectStage"
                />
            </div>
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
    import Actions from './Actions.vue';

    /**
     * ViewTicket: single-ticket detail shown when user clicks a ticket in the list.
     * Receives data.ticket from Content. Uses Actions for toolbar; emits updateTicket (App handles API);
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
        components: {
            appActions: Actions
        },
        /** When view is re-activated (keep-alive), ensure inProgress is set for button state. */
        activated() {
            if (typeof this.data.ticket.inProgress !== 'undefined') {
                this.data.ticket.inProgress = true;
            }
        },
        created() {
           console.log('ViewTicket created with ticket:', this.data.ticket);
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
            /** Move ticket to Board or Backlog; persist via App's updateTicket. When moving to board, set onDeck so it appears in On Deck. */
            onMoveType(newType) {
                const updates = { type: newType };
                if (newType === 'active') {
                    updates.onDeck = true;
                    updates.inProgress = false;
                    updates.qaTesting = false;
                    this.data.ticket.onDeck = true;
                    this.data.ticket.inProgress = false;
                    this.data.ticket.qaTesting = false;
                }
                this.data.ticket.type = newType;
                eventBus.$emit('updateTicket', {
                    id: this.data.ticket.id,
                    updates,
                    localTicket: this.data.ticket
                });
            },
            /** Apply stage selection: only the selected flag is true; others false. Persist via App's updateTicket. */
            onSelectStage(updates) {
                this.data.ticket.onDeck = updates.onDeck === true;
                this.data.ticket.inProgress = updates.inProgress === true;
                this.data.ticket.qaTesting = updates.qaTesting === true;
                eventBus.$emit('updateTicket', {
                    id: this.data.ticket.id,
                    updates,
                    localTicket: this.data.ticket
                });
            },
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
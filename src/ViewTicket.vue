<template>
    <div class="backlog-body">
        <div class="ticket-option">
            <button class="btn btn-primary" @click="navigateBack">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp; Back
            </button>

            <button class="btn btn-success" @click="data.ticket.isDone = true" :disabled="data.ticket.isDone">
                <i class="fa fa-check-square-o"></i>&nbsp; {{ data.ticket.isDone ? 'Done' : 'Mark as Done' }}
            </button>

            <button v-if="data.ticket.type === 'backlog'" class="btn btn-primary" @click="data.ticket.type = 'active'">
                    <i class="fa fa-cube" aria-hidden="true"></i>&nbsp; Move to Board
            </button>

            <button v-if="data.ticket.type === 'active'" class="btn btn-primary" @click="data.ticket.type = 'backlog'">
                    <i class="fa fa-inbox" aria-hidden="true"></i>&nbsp; Move to Backlog
            </button>
        </div>

        <p><strong>Date:</strong> {{ data.ticket.date.fromNow() }}</p>
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

    export default {
        props: {
            data: {
                type: Object,
                required: true
            },
        },
        activated() {
            if (typeof this.data.ticket.inProgress !== 'undefined') {
                this.data.ticket.inProgress = true;
            }
        },
        methods: {
            navigateBack() {
                let previousView = this.$parent.previousView;

                eventBus.$emit('changeView', {
                    tag: previousView.tag,
                    title: previousView.title,
                    data: previousView.data
                });
            }
        },
        filters: {
            formatBytes(bytes) {
                if (bytes == 0) {
                    return '0 Bytes';
                }

                let decimals = 2;
                let k = 1000;
                let dm = decimals + 1 || 3;
                let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                let i = Math.floor(Math.log(bytes) / Math.log(k));

                return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
            }
        }
    }
</script>
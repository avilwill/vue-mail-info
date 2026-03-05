<template>
    <div >
        <app-messages :messages="incomingMessages"></app-messages>
    </div>
</template>

<script>
    import { eventBus } from './main';
    import Messages from './Messages.vue';

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
            incomingMessages() {
                return this.data.messages.filter(function(message) {
                    return (message.type == 'incoming' && !message.isDeleted);
                });
            }
        },
        components: {
            appMessages: Messages
        }
    }
</script>

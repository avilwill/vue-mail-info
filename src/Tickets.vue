<template>
    <!-- Table for backlog, done, and important tabs -->
    <table
        v-if="tickets.length > 0 && tickets.some(t => ['backlog', 'done', 'important'].includes(t.type))"
        class="table table-backlog table-hover"
    >
        <tbody>
            <tr
                v-for="ticket in tickets.filter(t => ['backlog', 'done', 'important'].includes(t.type))"
                :key="ticket.code"
                @click="openTicket(ticket)"
            >
                <td><input type="checkbox"></td>
                <td>{{ ticket.code }}</td>
                <td>{{ ticket.title }}</td>
                <td><i v-if="ticket.attachments.length > 0" class="fa fa-paperclip"></i></td>
                <td class="text-right ticket-meta">
                    <span class="ticket-date">{{ ticket.date.fromNow() }}</span>
                    <a
                        href="#"
                        v-if="typeof ticket.isImportant !== 'undefined'"
                        @click.prevent.stop="ticket.isImportant = !ticket.isImportant"
                    >
                        <i :class="['fa','fa-star',{ important: ticket.isImportant }]"></i>
                    </a>
                </td>
            </tr>
        </tbody>
    </table>
<!-- Table for active (Board) tickets -->
 <!-- catagorized into On Deck, In Progress, and QA Testing -->
    <table
        v-else-if="tickets.length > 0"
        class="table table-backlog"
    >
        <tbody>
            <template v-if="tickets.some(t => t.type === 'active' && t.onDeck)">
                <tr class="board-section">
                    <td colspan="5"><i class="fa fa-hourglass-start"></i> <span>&nbsp;&nbsp;On Deck</span></td>
                </tr>
                <tr
                    v-for="ticket in tickets.filter(t => t.type === 'active' && t.onDeck)"
                    :key="'onDeck-' + ticket.code"
                    @click="openTicket(ticket)"
                >
                    <td><input type="checkbox"></td>
                    <td>{{ ticket.code }}</td>
                    <td>{{ ticket.title }}</td>
                    <td><i v-if="ticket.attachments.length > 0" class="fa fa-paperclip"></i></td>
                    <td class="text-right ticket-meta">
                        <span class="ticket-date">{{ ticket.date.fromNow() }}</span>
                        <a
                            href="#"
                            @click.prevent.stop="toggleImportant(ticket)"
                        >
                            <i :class="['fa','fa-star',{ important: ticket.isImportant }]"></i>
                        </a>
                    </td>
                </tr>
            </template>

            <template v-if="tickets.some(t => t.type === 'active' && t.inProgress)">
                <tr class="board-section">
                    <td colspan="5"><i class="fa fa-hourglass-2"></i> <span>&nbsp;&nbsp;In Progress</span></td>
                </tr>
                <tr
                    v-for="ticket in tickets.filter(t => t.type === 'active' && t.inProgress)"
                    :key="'inProgress-' + ticket.code"
                    @click="openTicket(ticket)"
                >
                    <td><input type="checkbox"></td>
                    <td>{{ ticket.code }}</td>
                    <td>{{ ticket.title }}</td>
                    <td><i v-if="ticket.attachments.length > 0" class="fa fa-paperclip"></i></td>
                    <td class="text-right ticket-meta">
                        <span class="ticket-date">{{ ticket.date.fromNow() }}</span>
                        <a
                            href="#"
                            @click.prevent.stop="toggleImportant(ticket)"
                        >
                            <i :class="['fa','fa-star',{ important: ticket.isImportant }]"></i>
                        </a>
                    </td>
                </tr>
            </template>

            <template v-if="tickets.some(t => t.type === 'active' && t.qaTesting)">
                <tr class="board-section">
                    <td colspan="8"><i class="fa fa-hourglass-end"></i> <span>&nbsp;&nbsp;QA Testing</span></td>
                </tr>
                <tr
                    v-for="ticket in tickets.filter(t => t.type === 'active' && t.qaTesting)"
                    :key="'qaTesting-' + ticket.code"
                    @click="openTicket(ticket)"
                >
                    <td><input type="checkbox"></td>
                    <td>{{ ticket.code }}</td>
                    <td>{{ ticket.title }}</td>
                    <td><i v-if="ticket.attachments.length > 0" class="fa fa-paperclip"></i></td>
                    <td class="text-right ticket-meta">
                        <span class="ticket-date">{{ ticket.date.fromNow() }}</span>
                        <a
                            href="#"
                            @click.prevent.stop="toggleImportant(ticket)"
                        >
                            <i :class="['fa','fa-star',{ important: ticket.isImportant }]"></i>
                        </a>
                    </td>
                </tr>
            </template>
        </tbody>
    </table>
<!-- When there are no tickets -->
    <p v-else>No tickets here yet.</p>
</template>
<script>
    import { eventBus } from './main';

    export default {
        props: {
            tickets: {
                type: Array,
                required: true
            }
        },
        methods: {
            openTicket(ticket) {
                console.log('Opening ticket: ' + ticket);
                eventBus.$emit('changeView', {
                    tag: 'app-view-ticket',
                    title: ticket.title,
                    data: {
                        ticket: ticket
                    }
                });
            },
            toggleImportant(ticket) {
                const updates = { isImportant: !ticket.isImportant };
                ticket.isImportant = updates.isImportant;

                eventBus.$emit('updateTicket', {
                    id: ticket.id,
                    updates,
                    localTicket: ticket
                });
            }
        }
    }
</script>
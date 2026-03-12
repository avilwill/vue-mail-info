<!--
    Tickets list: either a single table (Backlog/Done/Important) or a Board table
    with sections On Deck, In Progress, QA Testing. Row click opens ticket detail;
    star toggles important (Board only). Empty state: "No tickets here yet."
-->
<template>
    <!-- List view: one table for backlog, done, or important-type tickets -->
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
    <!-- Board view: active tickets in sections On Deck, In Progress, QA Testing -->
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
    <p v-else>No tickets here yet.</p>
</template>
<script>
    import { eventBus } from './main';

    /**
     * Tickets: shared list/board display used by BackLog, Board, Important, and Done.
     * Renders one of: flat table (backlog/done/important), board table with sections,
     * or empty message. Emits changeView to open detail, updateTicket to toggle important.
     */
    export default {
        props: {
            /** Tickets to show (already filtered by parent: BackLog, Board, Important, or Done). */
            tickets: {
                type: Array,
                required: true
            }
        },
        methods: {
            /** Open ticket detail view; Content switches to app-view-ticket with this ticket. */
            openTicket(ticket) {
                eventBus.$emit('changeView', {
                    tag: 'app-view-ticket',
                    title: ticket.title,
                    data: {
                        ticket: ticket
                    }
                });
            },
            /** Toggle isImportant and persist via App's updateTicket API handler. */
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
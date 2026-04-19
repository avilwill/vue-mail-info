<!--
    Tickets: list (layout=list) or board (layout=board). Row opens detail; checkbox selects.
    Bulk bar: default = priority / mark done / move; Done tab (bulkContext=done) = delete + Move to… dropdown.
-->
<template>
    <div>
        <div
            v-if="selectedCount > 0"
            class="ticket-detail-header tickets-bulk-header"
        >
            <div class="ticket-detail-left">
                <span class="tickets-bulk-count">{{ selectedCount }} selected</span>
            </div>
            <div class="ticket-detail-actions">
                <div class="ticket-option">
                    <button
                        type="button"
                        class="back-btn"
                        @click="clearSelection"
                    >
                        <i class="fa fa-times"></i>
                        Clear selection
                    </button>
                    <template v-if="bulkContext === 'default'">
                        <button
                            type="button"
                            class="move-btn"
                            @click="bulkApply({ isPriority: true })"
                        >
                            <i class="fa fa-star"></i>
                            Set priority
                        </button>
                        <button
                            type="button"
                            class="move-btn"
                            @click="bulkApply({ isPriority: false })"
                        >
                            <i class="fa fa-star-o"></i>
                            Remove priority
                        </button>
                        <button
                            type="button"
                            class="linear-mark-done-btn"
                            @click="bulkApply({ isDone: true })"
                        >
                            <i class="fa fa-check-square-o"></i>
                            Mark as Done
                        </button>
                        <button
                            v-if="canBulkMoveToBoard"
                            type="button"
                            class="move-btn"
                            @click="bulkMoveToBoard"
                        >
                            <i class="fa fa-cube"></i>
                            Move to Board
                        </button>
                        <button
                            v-if="canBulkMoveToBacklog"
                            type="button"
                            class="move-btn"
                            @click="bulkMoveToBacklog"
                        >
                            <i class="fa fa-inbox"></i>
                            Move to Backlog
                        </button>
                    </template>
                    <template v-else-if="bulkContext === 'done'">
                        <button
                            type="button"
                            class="linear-delete-btn"
                            @click="bulkDelete"
                        >
                            <i class="fa fa-trash-o"></i>
                            Delete
                        </button>
                        <div
                            class="linear-dropdown"
                            ref="doneBulkDropdown"
                        >
                            <button
                                type="button"
                                class="linear-pill-select-btn"
                                @click.stop.prevent="toggleDoneBulkMoveMenu"
                            >
                                Move to…
                                <i class="fa fa-chevron-down linear-dropdown-arrow"></i>
                            </button>
                            <div
                                v-if="showDoneBulkMoveMenu"
                                class="linear-dropdown-menu"
                                @click.stop
                            >
                                <div
                                    class="linear-dropdown-item"
                                    @mousedown.prevent="selectDoneBulkDestination('board')"
                                >
                                    <i class="fa fa-cube"></i>
                                    <span>Board</span>
                                </div>
                                <div
                                    class="linear-dropdown-item"
                                    @mousedown.prevent="selectDoneBulkDestination('backlog')"
                                >
                                    <i class="fa fa-inbox"></i>
                                    <span>Backlog</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <!-- List layout -->
        <table
            v-if="layout === 'list' && tickets.length > 0"
            class="table table-backlog table-hover"
        >
            <tbody>
                <tr
                    v-for="ticket in tickets"
                    :key="ticket.id || ticket.code"
                    @click="openTicket(ticket)"
                >
                    <td @click.stop>
                        <input
                            type="checkbox"
                            :checked="isSelected(ticket.id)"
                            @change="onCheckboxChange(ticket, $event)"
                        >
                    </td>
                    <td>{{ ticket.code }}</td>
                    <td>{{ ticket.title }}</td>
                    <td><i v-if="ticket.attachments.length > 0" class="fa fa-paperclip"></i></td>
                    <td class="text-right ticket-meta">
                        <span class="ticket-date">{{ ticket.date.fromNow() }}</span>
                        <a
                            v-if="!ticket.isDone"
                            href="#"
                            @click.prevent.stop="togglePriority(ticket)"
                        >
                            <i :class="['fa','fa-star',{ priority: ticket.isPriority }]"></i>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Board layout -->
        <template v-else-if="layout === 'board' && tickets.length > 0">
            <div
                v-if="tickets.some(isOnDeck)"
                class="board-section-block"
            >
                <div class="board-section-header">
                    <i class="fa fa-hourglass-start"></i>
                    <span>On Deck</span>
                </div>
                <table class="table table-backlog">
                    <tbody>
                        <tr
                            v-for="ticket in tickets.filter(isOnDeck)"
                            :key="'onDeck-' + (ticket.id || ticket.code)"
                            @click="openTicket(ticket)"
                        >
                            <td @click.stop>
                                <input
                                    type="checkbox"
                                    :checked="isSelected(ticket.id)"
                                    @change="onCheckboxChange(ticket, $event)"
                                >
                            </td>
                            <td>{{ ticket.code }}</td>
                            <td>{{ ticket.title }}</td>
                            <td><i v-if="ticket.attachments.length > 0" class="fa fa-paperclip"></i></td>
                            <td class="text-right ticket-meta">
                                <span class="ticket-date">{{ ticket.date.fromNow() }}</span>
                                <a
                                    v-if="!ticket.isDone"
                                    href="#"
                                    @click.prevent.stop="togglePriority(ticket)"
                                >
                                    <i :class="['fa','fa-star',{ priority: ticket.isPriority }]"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                v-if="tickets.some(t => t.type === 'active' && t.inProgress)"
                class="board-section-block"
            >
                <div class="board-section-header">
                    <i class="fa fa-hourglass-2"></i>
                    <span>In Progress</span>
                </div>
                <table class="table table-backlog">
                    <tbody>
                        <tr
                            v-for="ticket in tickets.filter(t => t.type === 'active' && t.inProgress)"
                            :key="'inProgress-' + (ticket.id || ticket.code)"
                            @click="openTicket(ticket)"
                        >
                            <td @click.stop>
                                <input
                                    type="checkbox"
                                    :checked="isSelected(ticket.id)"
                                    @change="onCheckboxChange(ticket, $event)"
                                >
                            </td>
                            <td>{{ ticket.code }}</td>
                            <td>{{ ticket.title }}</td>
                            <td><i v-if="ticket.attachments.length > 0" class="fa fa-paperclip"></i></td>
                            <td class="text-right ticket-meta">
                                <span class="ticket-date">{{ ticket.date.fromNow() }}</span>
                                <a
                                    v-if="!ticket.isDone"
                                    href="#"
                                    @click.prevent.stop="togglePriority(ticket)"
                                >
                                    <i :class="['fa','fa-star',{ priority: ticket.isPriority }]"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                v-if="tickets.some(t => t.type === 'active' && t.qaTesting)"
                class="board-section-block"
            >
                <div class="board-section-header">
                    <i class="fa fa-hourglass-end"></i>
                    <span>QA Testing</span>
                </div>
                <table class="table table-backlog">
                    <tbody>
                        <tr
                            v-for="ticket in tickets.filter(t => t.type === 'active' && t.qaTesting)"
                            :key="'qaTesting-' + (ticket.id || ticket.code)"
                            @click="openTicket(ticket)"
                        >
                            <td @click.stop>
                                <input
                                    type="checkbox"
                                    :checked="isSelected(ticket.id)"
                                    @change="onCheckboxChange(ticket, $event)"
                                >
                            </td>
                            <td>{{ ticket.code }}</td>
                            <td>{{ ticket.title }}</td>
                            <td><i v-if="ticket.attachments.length > 0" class="fa fa-paperclip"></i></td>
                            <td class="text-right ticket-meta">
                                <span class="ticket-date">{{ ticket.date.fromNow() }}</span>
                                <a
                                    v-if="!ticket.isDone"
                                    href="#"
                                    @click.prevent.stop="togglePriority(ticket)"
                                >
                                    <i :class="['fa','fa-star',{ priority: ticket.isPriority }]"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <p v-else-if="tickets.length === 0">No tickets here yet.</p>
    </div>
</template>

<script>
    import { eventBus } from './main';

    export default {
        props: {
            tickets: {
                type: Array,
                required: true
            },
            layout: {
                type: String,
                required: true,
                validator(value) {
                    return value === 'list' || value === 'board';
                }
            },
            /** default: standard bulk actions; done: delete + Move to (board/backlog) for completed tickets. */
            bulkContext: {
                type: String,
                default: 'default',
                validator(value) {
                    return value === 'default' || value === 'done';
                }
            }
        },
        data() {
            return {
                selectedIds: [],
                showDoneBulkMoveMenu: false
            };
        },
        mounted() {
            document.addEventListener('click', this.handleDoneBulkClickOutside);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleDoneBulkClickOutside);
        },
        computed: {
            selectedCount() {
                return this.selectedIds.length;
            },
            selectedTickets() {
                return this.tickets.filter((t) => this.isSelected(t.id));
            },
            canBulkMoveToBoard() {
                return this.selectedTickets.some(
                    (t) => t.type === 'backlog' && !t.isDone
                );
            },
            canBulkMoveToBacklog() {
                return this.selectedTickets.some(
                    (t) => t.type === 'active' && !t.isDone
                );
            }
        },
        watch: {
            tickets: {
                handler(next, prev) {
                    if (next !== prev) {
                        this.selectedIds = [];
                    }
                }
            }
        },
        methods: {
            isOnDeck(t) {
                if (t.type !== 'active') return false;
                return t.onDeck === true || (!t.inProgress && !t.qaTesting);
            },
            isSelected(id) {
                return this.selectedIds.some((i) => Number(i) === Number(id));
            },
            onCheckboxChange(ticket, event) {
                const id = ticket.id;
                const checked = event.target.checked;
                if (checked) {
                    if (!this.isSelected(id)) {
                        this.selectedIds = this.selectedIds.concat([id]);
                    }
                } else {
                    this.selectedIds = this.selectedIds.filter(
                        (i) => Number(i) !== Number(id)
                    );
                }
            },
            clearSelection() {
                this.selectedIds = [];
            },
            openTicket(ticket) {
                eventBus.$emit('changeView', {
                    tag: 'app-view-ticket',
                    title: ticket.title,
                    data: {
                        ticket: ticket
                    }
                });
            },
            togglePriority(ticket) {
                const current = ticket.isPriority === true || ticket.isPriority === 1;
                const next = !current;
                this.$set(ticket, 'isPriority', next);
                eventBus.$emit('updateTicket', {
                    id: ticket.id,
                    updates: { isPriority: next },
                    localTicket: ticket
                });
            },
            bulkApply(updates) {
                if (!this.selectedIds.length) return;
                eventBus.$emit('bulkUpdateTickets', {
                    ids: this.selectedIds.slice(),
                    updates
                });
                this.clearSelection();
            },
            bulkMoveToBoard() {
                if (!this.selectedIds.length) return;
                eventBus.$emit('bulkUpdateTickets', {
                    ids: this.selectedIds.slice(),
                    updates: {
                        type: 'active',
                        onDeck: true,
                        inProgress: false,
                        qaTesting: false
                    }
                });
                this.clearSelection();
            },
            bulkMoveToBacklog() {
                if (!this.selectedIds.length) return;
                eventBus.$emit('bulkUpdateTickets', {
                    ids: this.selectedIds.slice(),
                    updates: { type: 'backlog' }
                });
                this.clearSelection();
            },
            bulkDelete() {
                if (!this.selectedIds.length) return;
                eventBus.$emit('bulkDeleteTickets', {
                    ids: this.selectedIds.slice()
                });
                this.clearSelection();
            },
            toggleDoneBulkMoveMenu() {
                this.showDoneBulkMoveMenu = !this.showDoneBulkMoveMenu;
            },
            selectDoneBulkDestination(where) {
                this.showDoneBulkMoveMenu = false;
                if (!this.selectedIds.length) return;
                const ids = this.selectedIds.slice();
                if (where === 'board') {
                    eventBus.$emit('bulkUpdateTickets', {
                        ids,
                        updates: {
                            isDone: false,
                            type: 'active',
                            onDeck: true,
                            inProgress: false,
                            qaTesting: false
                        }
                    });
                } else if (where === 'backlog') {
                    eventBus.$emit('bulkUpdateTickets', {
                        ids,
                        updates: {
                            isDone: false,
                            type: 'backlog'
                        }
                    });
                }
                this.clearSelection();
            },
            handleDoneBulkClickOutside(event) {
                if (!this.showDoneBulkMoveMenu) {
                    return;
                }
                const dropdown = this.$refs.doneBulkDropdown;
                if (dropdown && !dropdown.contains(event.target)) {
                    this.showDoneBulkMoveMenu = false;
                }
            }
        }
    }
</script>

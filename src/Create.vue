<!--
    Create: button that opens a modal to add a new ticket. Modal has a dropdown
    (Board / Backlog / Done) for initial placement, title and description fields,
    and Create New Task; submits via eventBus createTicket (App calls API).
-->
<template>
    <div>
        <a href="#createModal" data-toggle="modal" class="btn btn-create">Create New Task</a>
        <div role="dialog" tabindex="-1" id="createModal" class="modal fade" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <!-- Modal header: dropdown for where to create (Board, Backlog, Done) -->
                    <div class="modal-header">
                        <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>
                        <div class="linear-dropdown" ref="dropdown">
                            <button
                                type="button"
                                class="linear-pill-select-btn"
                                @click.stop.prevent="toggleDropdown"
                            >
                                {{ selectedValue }}
                                <i class="fa fa-chevron-down linear-dropdown-arrow"></i>
                            </button>
                            <div
                                v-if="showDropdown"
                                class="linear-dropdown-menu"
                                @click.stop
                            >
                                <div
                                v-for="listValue in valuesList"
                                :key="listValue"
                                class="linear-dropdown-item"
                                :class="{ active: selectedValue === listValue }"
                                @mousedown.prevent="selectValue(listValue)"
                                >
                                <i
                                    v-if="selectedValue === listValue"
                                    class="fa fa-check linear-check"
                                ></i>
                                <span>{{ listValue }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Modal body: title and description inputs -->
                    <div class="modal-body">
                        <div class="linear-create-modal">
                            <div class="linear-create-body">
                                <input
                                id="title"
                                v-model="ticket.title"
                                type="text"
                                placeholder="Issue title"
                                class="linear-title-input"
                                >

                                <textarea
                                id="ticket"
                                v-model="ticket.content"
                                rows="8"
                                placeholder="Add description..."
                                class="linear-description-input"
                                ></textarea>
                            </div>
                            <!-- Modal footer: submit button -->
                            <div class="linear-create-footer">
                                <button class="linear-primary-btn" @click="createTicket">Create New Task</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';
    import { eventBus } from './main';

    /**
     * Create: sidebar button + modal to add a new ticket. User picks Board, Backlog,
     * or Done; enters title and description. Emits createTicket on eventBus; App
     * performs the API call and updates the ticket list. Click-outside closes dropdown.
     */
    export default {
        data() {
            return {
                /** Form state: title and content. */
                ticket: {
                    title: '',
                    content: ''
                },
                /** Selected destination (Board, Backlog, Done); drives type/isDone. */
                selectedValue: 'Board',
                /** Whether the destination dropdown is open. */
                showDropdown: false,
                /** Options for the destination dropdown. */
                valuesList: ['Board', 'Backlog', 'Done']
            };
        },
        mounted() {
            document.addEventListener('click', this.handleClickOutside);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleClickOutside);
        },
        methods: {
            /** Validate title, emit createTicket with payload (App calls API), then clear form. */
            createTicket() {
                if (!this.ticket.title.trim()) {
                    return;
                }

                const typeMapping = {
                    Board: 'active',
                    Backlog: 'backlog',
                    Done: 'done'
                };

                const type = typeMapping[this.selectedValue] || 'backlog';
                const isDone = this.selectedValue === 'Done';

                eventBus.$emit('createTicket', {
                    ticket: {
                        title: this.ticket.title,
                        content: `<p>${this.ticket.content}</p>`,
                        isImportant: false,
                        isDone: isDone,
                        onDeck: type === 'active',
                        inProgress: false,
                        qaTesting: false,
                        type: type,
                        date: moment(),
                        attachments: []
                    }
                });

                this.ticket.title = '';
                this.ticket.content = '';
                this.closeModal();
            },
            /** Close the create modal (Bootstrap). */
            closeModal() {
                this.$nextTick(() => {
                    const el = document.getElementById('createModal');
                    if (el && typeof window.$ !== 'undefined') {
                        window.$(el).modal('hide');
                    }
                });
            },
            /** Toggle the destination dropdown open/closed. */
            toggleDropdown() {
                this.showDropdown = !this.showDropdown;
            },
            /** Set destination and close dropdown. */
            selectValue(value) {
                this.selectedValue = value;
                this.showDropdown = false;
            },
            /** Close dropdown when clicking outside the dropdown ref. */
            handleClickOutside(event) {
                const dropdown = this.$refs.dropdown;
                if (dropdown && !dropdown.contains(event.target)) {
                    this.showDropdown = false;
                }
            }
        }
    }
</script>

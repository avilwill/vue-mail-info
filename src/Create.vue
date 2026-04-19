<!--
    Create: sidebar button opens modal to add a ticket, or Edit from detail opens same modal.
    Board / Backlog / Done placement; title and description. createTicket vs updateTicket via eventBus.
-->
<template>
    <div>
        <a
            href="#createModal"
            data-toggle="modal"
            class="btn btn-create"
            @click="prepareNewTicket"
        >Create New Task</a>
        <div role="dialog" tabindex="-1" id="createModal" class="modal fade" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>
                        <p v-if="isEditing" class="create-modal-mode">Editing ticket</p>
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
                            <div class="linear-create-footer">
                                <button type="button" class="linear-primary-btn" @click="submitForm">
                                    {{ submitButtonLabel }}
                                </button>
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

    export default {
        data() {
            return {
                ticket: {
                    title: '',
                    content: ''
                },
                selectedValue: 'Board',
                showDropdown: false,
                valuesList: ['Board', 'Backlog', 'Done'],
                /** When set, modal is editing this ticket (same object ref as detail view). */
                editingTicket: null,
                /** Placement label when edit modal opened; used to detect placement-only changes. */
                initialSelectedValue: null
            };
        },
        computed: {
            isEditing() {
                return this.editingTicket !== null;
            },
            submitButtonLabel() {
                return this.isEditing ? 'Save changes' : 'Create New Task';
            }
        },
        created() {
            eventBus.$on('openCreateModal', this.onOpenCreateModal);
        },
        mounted() {
            document.addEventListener('click', this.handleClickOutside);
            this.$nextTick(() => {
                const el = document.getElementById('createModal');
                if (el && typeof window.$ !== 'undefined') {
                    window.$(el).on('hidden.bs.modal', this.onCreateModalHidden);
                }
            });
        },
        beforeDestroy() {
            eventBus.$off('openCreateModal', this.onOpenCreateModal);
            document.removeEventListener('click', this.handleClickOutside);
            const el = document.getElementById('createModal');
            if (el && typeof window.$ !== 'undefined') {
                window.$(el).off('hidden.bs.modal', this.onCreateModalHidden);
            }
        },
        methods: {
            /** Sidebar link: ensure next open is create mode, not leftover edit state. */
            prepareNewTicket() {
                this.editingTicket = null;
                this.initialSelectedValue = null;
                this.ticket.title = '';
                this.ticket.content = '';
                this.selectedValue = 'Board';
                this.showDropdown = false;
            },
            onOpenCreateModal(payload) {
                const ticket = payload && payload.ticket;
                if (!ticket) {
                    return;
                }
                this.editingTicket = ticket;
                this.initialSelectedValue = this.placementLabelFromTicket(ticket);
                this.selectedValue = this.initialSelectedValue;
                this.ticket.title = ticket.title || '';
                this.ticket.content = this.htmlToPlainText(ticket.content || '');
                this.showDropdown = false;
                this.openModal();
            },
            placementLabelFromTicket(t) {
                if (t.isDone === true || t.isDone === 1) {
                    return 'Done';
                }
                if (t.type === 'active') {
                    return 'Board';
                }
                return 'Backlog';
            },
            htmlToPlainText(html) {
                if (!html || typeof html !== 'string') {
                    return '';
                }
                const div = document.createElement('div');
                div.innerHTML = html;
                const text = div.textContent || div.innerText || '';
                return text.trim();
            },
            /** Placement fields when user changed Board / Backlog / Done (aligned with create payload). */
            buildPlacementUpdatesOnly() {
                if (this.selectedValue === 'Board') {
                    return {
                        type: 'active',
                        isDone: false,
                        onDeck: true,
                        inProgress: false,
                        qaTesting: false
                    };
                }
                if (this.selectedValue === 'Backlog') {
                    return {
                        type: 'backlog',
                        isDone: false,
                        onDeck: false,
                        inProgress: false,
                        qaTesting: false
                    };
                }
                return {
                    type: 'done',
                    isDone: true,
                    onDeck: false,
                    inProgress: false,
                    qaTesting: false
                };
            },
            submitForm() {
                if (!this.ticket.title.trim()) {
                    return;
                }

                const title = this.ticket.title.trim();
                const content = '<p>' + this.ticket.content + '</p>';

                if (this.editingTicket) {
                    const updates = { title, content };
                    if (
                        this.initialSelectedValue !== null &&
                        this.selectedValue !== this.initialSelectedValue
                    ) {
                        Object.assign(updates, this.buildPlacementUpdatesOnly());
                    }
                    eventBus.$emit('updateTicket', {
                        id: this.editingTicket.id,
                        updates: updates,
                        localTicket: this.editingTicket
                    });
                    Object.assign(this.editingTicket, updates);
                    this.resetAfterSubmit();
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
                        title: title,
                        content: content,
                        isPriority: false,
                        isDone: isDone,
                        onDeck: type === 'active',
                        inProgress: false,
                        qaTesting: false,
                        type: type,
                        date: moment(),
                        attachments: []
                    }
                });

                this.resetAfterSubmit();
            },
            resetAfterSubmit() {
                this.ticket.title = '';
                this.ticket.content = '';
                this.editingTicket = null;
                this.initialSelectedValue = null;
                this.selectedValue = 'Board';
                this.showDropdown = false;
                this.closeModal();
            },
            closeModal() {
                this.$nextTick(() => {
                    const el = document.getElementById('createModal');
                    if (el && typeof window.$ !== 'undefined') {
                        window.$(el).modal('hide');
                    }
                });
            },
            openModal() {
                this.$nextTick(() => {
                    const el = document.getElementById('createModal');
                    if (el && typeof window.$ !== 'undefined') {
                        window.$(el).modal('show');
                    }
                });
            },
            onCreateModalHidden() {
                this.editingTicket = null;
                this.initialSelectedValue = null;
                this.ticket.title = '';
                this.ticket.content = '';
                this.selectedValue = 'Board';
                this.showDropdown = false;
            },
            toggleDropdown() {
                this.showDropdown = !this.showDropdown;
            },
            selectValue(value) {
                this.selectedValue = value;
                this.showDropdown = false;
            },
            handleClickOutside(event) {
                const dropdown = this.$refs.dropdown;
                if (dropdown && !dropdown.contains(event.target)) {
                    this.showDropdown = false;
                }
            }
        }
    }
</script>

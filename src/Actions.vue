<!--
    Actions: Back, Edit, Mark as Done, move board/backlog, and stage dropdown (On Deck / In Progress / QA Testing).
    Emits back, edit, mark-done, move-type, and select-stage for the parent to handle.
-->
<template>
    <div class="ticket-option">
        <button
            v-if="!hideBackButton"
            type="button"
            class="back-btn"
            @click="navigateBack"
        >
            <i class="fa fa-arrow-left"></i>
            Back
        </button>
        <button
            type="button"
            class="move-btn"
            @click="edit"
        >
            <i class="fa fa-pencil"></i>
            Edit
        </button>
        <button
            type="button"
            class="linear-mark-done-btn"
            @click="markDone"
            :disabled="ticket.isDone"
        >
            <i class="fa fa-check-square-o"></i>
            {{ ticket.isDone ? 'Done' : 'Mark as Done' }}
        </button>

        <button
            type="button"
            class="move-btn"
            @click="moveToOtherBoard"
        >
            <i class="fa fa-inbox" v-if="ticket.type === 'active'" aria-hidden="true"></i>
            <i class="fa fa-cube" v-else aria-hidden="true"></i>
            {{ ticket.type === 'active' ? 'Move to Backlog' : 'Move to Board' }}
        </button>

        <div v-if="ticket.type === 'active'" class="linear-dropdown" ref="dropdown">
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
</template>

<script>
    /**
     * Actions: toolbar for ticket detail (Back, Mark as Done, stage dropdown).
     * Receives ticket as prop; emits back, mark-done, select-stage for parent to handle.
     */
    export default {
        props: {
            /** Current ticket (for isDone, type, and stage flags). */
            ticket: {
                type: Object,
                required: true
            },
            /** When true, do not render the Back button (e.g. when parent puts Back on the left separately). */
            hideBackButton: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                showDropdown: false,
                valuesList: ['On Deck', 'In Progress', 'QA Testing']
            };
        },
        computed: {
            /** Match section order: On Deck first, then In Progress, then QA Testing. Default to On Deck when none set. */
            selectedValue() {
                const t = this.ticket;
                if (t.onDeck) return 'On Deck';
                if (t.inProgress) return 'In Progress';
                if (t.qaTesting) return 'QA Testing';
                return 'On Deck';
            }
        },
        mounted() {
            document.addEventListener('click', this.handleClickOutside);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleClickOutside);
        },
        methods: {
            navigateBack() {
                this.$emit('back');
            },
            markDone() {
                this.$emit('mark-done');
            },
            edit() {
                this.$emit('edit');
            },
            /** Emit move-type with the target type: 'backlog' when active, 'active' when backlog. */
            moveToOtherBoard() {
                const newType = this.ticket.type === 'active' ? 'backlog' : 'active';
                this.$emit('move-type', newType);
            },
            toggleDropdown() {
                this.showDropdown = !this.showDropdown;
            },
            /** Set stage: only the selected one is true; the other two are false. */
            selectValue(value) {
                const updates = {
                    onDeck: false,
                    inProgress: false,
                    qaTesting: false
                };
                if (value === 'On Deck') updates.onDeck = true;
                else if (value === 'In Progress') updates.inProgress = true;
                else if (value === 'QA Testing') updates.qaTesting = true;
                this.showDropdown = false;
                this.$emit('select-stage', updates);
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
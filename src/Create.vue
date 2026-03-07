<template>
    <div>
        <a href="#createModal" data-toggle="modal" class="btn btn-create">Create New Task</a>

        <div role="dialog" tabindex="-1" id="createModal" class="modal fade" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
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

    export default {
        data() {
            return {
                ticket: {
                    title: '',
                    content: ''
                },
                selectedValue: 'Board',
                showDropdown: false,
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
            createTicket() {
              
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
    },
        }
    }
</script>

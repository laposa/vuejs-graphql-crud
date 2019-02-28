const store = {
    state: {
        messages: []
    },

    addMessage(text, type, title) {
        this.state.messages.push({text, type, title});
    },

    removeMessage(message) {
        this.state.messages.splice(this.state.messages.indexOf(message), 1);
    },

    addError(text, title = '') {
        this.addMessage(text, 'error', title);
    },

    addSuccess(text, title = '') {
        this.addMessage(text, 'success', title);
    },

    clear() {
        this.state.messages.splice(0, this.state.messages.length);
    },
};

export default store;

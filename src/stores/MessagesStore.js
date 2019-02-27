let store = {
    state: {
        messages: []
    },

    addMessage(text, type) {
        this.state.messages.push({text: text, type: type});
    },

    removeMessage(message) {
        this.state.messages.splice(this.state.messages.indexOf(message), 1);
    },

    addError(text) {
        this.addMessage(text, 'error');
    },

    addSuccess(text) {
        this.addMessage(text, 'success');
    },

    clear() {
        this.state.messages.splice(0, this.state.messages.length);
    },
};

export default store;

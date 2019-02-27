<template>
    <div :class="message.type + '-message message'">
        <div v-html="message.text"></div>

        <button type="button" class="close" @click="removeMessage()">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>

<script>
    import messagesStore from "@/stores/MessagesStore.js"

    export default {
        name: "Message",
        props: {
            message: {type: Object, required: true},
        },

        methods: {
            removeMessage() {
                messagesStore.removeMessage(this.message);
            }
        },

        created() {
            setTimeout(() => {
                this.removeMessage();
            }, 15000);
        }
    }
</script>

<style scoped>
    div.message {
        position: relative;
        padding: .75rem 4rem .75rem 1.25rem;
        margin: 0.5rem;
    }

    div.error-message {
        color: #721c24;
        background-color: #f8d7da;
        border-color: #f5c6cb;
    }

    div.success-message {
        color: #155724;
        background-color: #d4edda;
        border-color: #c3e6cb;
    }

    button.close {
        position: absolute;
        top: 0;
        right: 0;
        padding: .75rem 1.25rem;
        color: inherit;
        font-size: 1.5rem;
        background-color: transparent;
        border: 0;
    }
</style>

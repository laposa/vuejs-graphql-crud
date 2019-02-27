<template>
    <div id="messagesContainer">
        <Message
                v-for="(message, key) in messages"
                :key="key"
                :message="message"
        />
    </div>
</template>

<script>
    import messagesStore from "@/stores/MessagesStore.js"
    import Message from "@/components/other/Message";

    export default {
        name: "MessagesContainer",
        components: {Message},
        data() {
            return {
                messages: messagesStore.state.messages,
            }
        },
    }
</script>

<style scoped>
    div#messagesContainer {
        margin: 1rem;
    }
</style>

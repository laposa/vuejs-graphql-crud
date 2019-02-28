<template>
    <ul v-if="numOfPages < maxPages">
        <li>
            <a href="#" @click="$emit('input', 1)">  &twoheadleftarrow; </a>
        </li>

        <li v-for="page in numOfPages" :key="page">
            <a href="#"
               :class="{selected: page === value}"
               @click="$emit('input', page)"
            >
                {{page}}
            </a>
        </li>

        <li>
            <a href="#" @click="$emit('input', numOfPages)"> &twoheadrightarrow; </a>
        </li>
    </ul>
    <ul v-else>
        <li>
            <a href="#" @click="$emit('input', 1)"> &twoheadleftarrow; </a>
        </li>

        <li v-for="page in leftPages" :key="page">
            <a href="#"
               :class="{selected: page === value}"
               @click="$emit('input', page)"
            >
                {{page}}
            </a>
        </li>

        <li v-if="(numOfPages - 4) - value > 3">...</li>

        <li v-for="page in [numOfPages - 4, numOfPages - 3, numOfPages - 2, numOfPages - 1, numOfPages]" :key="page">
            <a href="#"
               :class="{selected: page === value}"
               @click="$emit('input', page)"
            >
                {{page}}
            </a>
        </li>


        <li>
            <a href="#" @click="$emit('input', numOfPages)"> &twoheadrightarrow; </a>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "TablePagination",

        props: {
            value: {required: true},
            numOfPages: {type: Number, required: true}
        },

        data() {
            return {
                maxPages: 20,
                leftPages: [],
            }
        },

        watch: {
            value() {
                this.generateLeftPages();
            }
        },

        methods: {
            generateLeftPages(){
                let start = (this.value - parseInt(this.maxPages/Math.pow(2,2)) > 1 ? this.value - parseInt(this.maxPages/Math.pow(2,2)) : 1);
                let stop = parseInt(this.maxPages/2) + this.value - parseInt(this.maxPages/Math.pow(2,2)) - 1;

                if (stop < parseInt(this.maxPages/2))  {
                    stop = parseInt(this.maxPages/2);
                }

                if(stop >=  this.numOfPages - parseInt(this.maxPages/2) + 1){
                    stop =  this.numOfPages - parseInt(this.maxPages/2);
                    start = this.numOfPages - parseInt(this.maxPages/2) - parseInt(this.maxPages/Math.pow(2,2)) - 2;
                }

                this.leftPages = [];

                for (let i = start; i <= stop; i++){
                    this.leftPages.push(i);
                }
            }
        },

        mounted(){
            this.generateLeftPages()
        }
    }
</script>

<style scoped>
    ul {
        list-style: none;
        margin: 25px 0 0 0;
        padding: 0;
    }

    li {
        float: left;
        margin-right: 15px;
    }

    li a.selected {
        font-weight: bold;
    }
</style>

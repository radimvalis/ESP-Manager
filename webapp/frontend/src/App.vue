
<script setup>

    import { RouterLink, RouterView } from "vue-router";
    import HelloWorld from "./components/HelloWorld.vue";

</script>

<template>

    <header>

        <HelloWorld/>

        <nav>

            <RouterLink to="/">Home</RouterLink>

            <br/>

            <RouterLink to="/about">About</RouterLink>

        </nav>

    </header>

    <RouterView/>

</template>

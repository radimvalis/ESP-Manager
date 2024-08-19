
<script setup>

    defineProps({ modelValue: Number });

</script>

<template>

    <v-card-info>

        <v-card-text>

            <v-progress-circular
                :model-value="modelValue"
                :size="100"
                :width="10"
                color="primary"
            >   
            
                {{ modelValue }} %

            </v-progress-circular>

        </v-card-text>

        <v-card-title>

            Registering board ...

        </v-card-title>                    

    </v-card-info>
    
</template>
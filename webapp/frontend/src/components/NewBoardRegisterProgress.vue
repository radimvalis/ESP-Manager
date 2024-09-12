
<script setup>

    defineProps({ modelValue: Number, stage: Number });

</script>

<template>

    <v-card-info>

        <v-card-text>

            <v-progress-circular
                v-if="stage === 1"
                indeterminate
                :size="100"
                :width="10"
                color="primary"
            />

            <v-progress-circular
                v-else
                :model-value="modelValue"
                :size="100"
                :width="10"
                color="primary"
            >   
            
                {{ modelValue }} %

            </v-progress-circular>

        </v-card-text>

        <v-card-subtitle>

            {{ stage }} / 2

        </v-card-subtitle>

        <v-card-title
            v-if="stage === 1"
        >

            Erasing flash ...

        </v-card-title>

        <v-card-title
            v-else
        >

            Flashing board ...

        </v-card-title> 
        
    </v-card-info>
    
</template>
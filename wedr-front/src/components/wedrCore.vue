<template>
    <div>

        <v-dialog v-model="showModal" max-width="290" persistent>

            <v-alert text="success" type="success"></v-alert>

            <v-btn text @click="closingModal">Submit</v-btn>

        </v-dialog>
        <v-card outlined elevation="3" class="m-3 p-3 my-3">

            <v-card-text class="m-3 p-3 dictionary-text-card non-selectable">
                <v-card-title>
                    Dictionary:
                </v-card-title>
                <div>
                    <div class="flex-container">
                        <div v-for="(emoji, letter) in fullDict" :key="letter" class="flex-item">
                            <div class="emoji">
                                {{ emoji }}
                            </div>
                            <div class="letter">
                                {{ letter.toUpperCase() }}
                            </div>
                        </div>
                    </div>
                </div>
            </v-card-text>
        </v-card>


        <v-card outlined elevation="3" class="m-3 p-3 my-3">
            <v-card-title>
                Encoded Word:
            </v-card-title>
            <v-card-text>
                <!-- Grid container for emojis and input fields -->
                <div class="input-flex-container">

                    <template v-for="(emoji, index) in encoded_word" :key="index">
                        <div class="input-flex-item non-selectable">
                            <div class="emoji">{{ emoji }}</div>
                            <div>
                                <input class="input-field" autocomplete="off" :name="`input-${index}`"
                                    v-model="userInputs[index]" @input="handleInput(index)"
                                    @keydown="handleKeydown(index, $event)" :ref="setInputRef" :data-index="index"
                                    type="text" maxlength="1" @focus="handleFocus($event)" />
                            </div>
                        </div>
                    </template>


                </div>





            </v-card-text>
            <v-card-actions>
                <v-btn-group>

                    <v-btn elevation="3" color="danger" @click="handleReset">Reset</v-btn>
                    <v-btn elevation="3" color="success" :flat="false" :disabled="!isCorrect"
                        @click="handleSubmit">Submit</v-btn>
                </v-btn-group>



                <v-alert color="red" class="mx-1" v-if="errorMessage">{{ errorMessage }}</v-alert>
            </v-card-actions>
        </v-card>
        <v-alert color="info" class="m-3 p-3 my-3" v-if="youCompleted">
            You completed the puzzle! Please wait for the other player to finish.
        </v-alert>


    </div>
</template>

<script setup>
import { ref, watch, nextTick, watchEffect, computed } from 'vue';
import { storeToRefs } from "pinia";
import { useWebSocketStore } from '../store';

const wsStore = useWebSocketStore();
const { time_to_go, word, encoded_word, dictionary: fullDict, groupDict: displayedEmojiDict } = storeToRefs(useWebSocketStore());


import _ from 'lodash';

const userInputConcatenated = computed(() => userInputs.value.join(''));

// Computed property to check if all inputs are filled
const allInputsFilled = computed(() => userInputs.value.every(input => input.trim() !== ''));

// Method to check if the user input matches the correct word
const checkWordMatch = () => {
    console.debug(userInputConcatenated.value, word.value)
    if (allInputsFilled.value) {
        // Convert both strings to lowercase for case-insensitive comparison
        if (userInputConcatenated.value.toLowerCase() === word.value.toLowerCase()) {
            console.log('Correct!');
            isCorrect.value = true;
            // Handle correct input (e.g., display success message, move to next stage)
        } else {
            console.log('Wrong.');
            isCorrect.value = false;
            // Handle incorrect input (e.g., display error message, clear inputs for retry)
        }
    }
};


const userInputs = ref(encoded_word.value.map(() => ''));
const isCorrect = ref(false); // Initializes as false

const inputRefs = ref([]);
// Function to collect input refs
const setInputRef = (el) => {
    if (el) {
        inputRefs.value[el.dataset.index] = el;
    }
};


// Handle user input
const handleInput = (index) => {
    // You can add logic here if needed, e.g., automatically moving to the next input
};

const handleKeydown = (inputIndex, event) => {
    console.debug('we are in handleKeydown', inputIndex, event.key);

    // Check for character length and exclude specific control keys
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        // Assuming every input is meant for a single character,
        // move focus immediately after one character is entered.
        event.preventDefault(); // Prevent the default input to manually manage it.
        userInputs.value[inputIndex] = event.key; // Manually set the input value.

        // Move to the next input
        const nextInput = inputRefs.value[inputIndex + 1];
        if (nextInput) {
            nextInput.focus();
        } else {
            // If there's no next input, potentially handle submission.
            if (allInputsFilled.value) {
                // handleSubmit();
            }
        }

        // Optionally, handle the input event here as well
        // (e.g., update other state based on the input, validate, etc.)
    }
    else if (event.key === 'Enter') {
        event.preventDefault();
        // Your existing logic for Enter key...
    }
    else if (event.key === 'Backspace' && userInputs.value[inputIndex].trim() === '') {
        // Your existing logic for Backspace key...
    }
};

const handleFocus = (event) => {
    event.target.select();
};

// If the encoded word updates, reset userInputs
watchEffect(() => {
    userInputs.value = encoded_word.value.map(() => '');
});

const handleReset = () => {
    // Clear any displayed error messages
    errorMessage.value = '';

    // Reset all user inputs to empty strings
    userInputs.value = userInputs.value.map(() => '');

    // Optionally reset the correctness state
    isCorrect.value = false;

    // Focus on the first input field after the reset
    nextTick(() => {
        if (inputRefs.value[0]) {
            inputRefs.value[0].focus();
        }
    });
};


const errorMessage = ref('');

// Watcher to automatically check the match when all inputs are filled
// Watch the userInputs array for changes
watch(userInputs, () => {
    // Check if all inputs are filled to avoid premature validation
    const inputsFilled = userInputs.value.every(input => input.trim() !== '');
    isCorrect.value = inputsFilled && userInputConcatenated.value.toLowerCase() === word.value.toLowerCase();
}, { deep: true }); // Use deep watch because userInputs is an array


</script>

<style scoped>
@media (max-width: 480px) {
    html {
        font-size: 10px;
        /* Adjust this value as needed */
    }
}

.input-flex-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    min-height: 50px;
}

.input-flex-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    min-height: 80px;
    /* Adjust this value to increase the height */
    max-width: 40px;
    /* You can adjust this value */
    width: 100%;
    /* Take up full width up to max-width */
}

.input-flex-item input {
    min-height: 60px;
}

.dictionary-text-card {
    line-height: 2rem !important;
}

.flex-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    line-height: normal;
}

.flex-item {
    border: 0.5px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.emoji,
.letter {
    font-size: 2.5rem;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    grid-template-rows: repeat(2, 50px);
    /* Create two rows of 50px height each */
    gap: 0px 4px;
}

.grid-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px;
}

.input-field {
    width: 100%;
    height: 100%;
    min-height: 50px !important;
    text-align: center;
    font-size: 1.5rem;
    border: none;
    border-bottom: 2px solid black;
}


.non-selectable {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
</style>
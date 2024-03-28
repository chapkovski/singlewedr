<script setup>


import { useWebSocketStore } from './store';
import { storeToRefs } from "pinia";
const wsStore = useWebSocketStore();
const { remaining_time } = storeToRefs(useWebSocketStore());

import wedrCore from './components/wedrCore.vue';
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay();
const drawer = ref(false);

const instructionsHtml = document.getElementById('instructions').innerHTML;


</script>
<template>
  <v-app app style="padding: 0px;">
    <v-navigation-drawer v-model="drawer" app location="right" temporary :width="500">
      <v-card>
        <v-card-title>
          Instructions
          <v-spacer></v-spacer>
          <v-btn icon @click="drawer = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-html="instructionsHtml"></div>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-toolbar-title>Decoding task</v-toolbar-title>
      <vue-countdown :time="remaining_time * 1000" v-slot="{ days, hours, minutes, seconds }">
        Time Remaining：{{ days }} days, {{ hours }} hours, {{ minutes }} minutes, {{ seconds }} seconds.
      </vue-countdown>

      <v-spacer></v-spacer> <!-- This pushes the menu items to the right -->

      <v-btn outlined elevation="3" @click="drawer = !drawer">
        Instructions
      </v-btn>



    </v-app-bar>
    <v-main app full-width class="non-scrollable">

      <v-row :class="{ 'flex-column': smAndDown }" style="height: calc(100vh - 50px);">

        <v-col>
          <wedrCore></wedrCore>
        </v-col>



      </v-row>
    </v-main>
  </v-app>
</template>



<style>
div#app {
  padding: 0px !important;
}

/* Mobile screens */
@media (max-width: 480px) {
  html {
    font-size: 12px;
    /* or whatever size you want */
  }
}

/* Tablet screens */
@media (min-width: 481px) and (max-width: 1024px) {
  html {
    font-size: 14px;
    /* or whatever size you want */
  }
}

/* Desktop screens */
@media (min-width: 1025px) {
  html {
    font-size: 16px;
    /* or whatever size you want */
  }
}

.chat-container-col {
  display: flex;
  flex-direction: column;
}

.scrollable {
  height: 100vh;
  /* Full viewport height */
  overflow-y: auto;
  /* Enable vertical scroll */
}

.non-scrollable {
  height: 100vh;
  /* Full viewport height */
  overflow-y: hidden;
  /* Enable vertical scroll */
}
</style>

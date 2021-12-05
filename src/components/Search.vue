<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

const count = ref(0)

</script>








<template>
  <!-- <h1>{{ msg }}</h1> -->


  <input id="search" type="text" v-model="search" @keyup.enter="search" />
  <button @click="search">Search</button>

  <!-- <button type="button" @click="count++">Count is  : {{ count }}</button> -->
   
</template>







<style scoped>
#search {
  width: 80%;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 9px;
  font-size: 22px;
}

a {
  color: #42b983;
}

button {
  background: #42b983;
  color: #fff;
  border: 0;
  padding: 12px;
  font-size: 22px;
  cursor: pointer;
   
  }
</style>

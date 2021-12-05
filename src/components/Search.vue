<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

let items = ["foo", "bar", "baz"]

const count = ref(0)
</script>








<template>


<div id="searchComp">


  <!-- <h1>{{ msg }}</h1> -->
 <!-- <button type="button" @click="count++">Count is  : {{ count }}</button> -->


  <div class="searchBar">
    <input id="searchTxt" type="text" v-model="search" @keyup.enter="search" />
    <button id="searchBtn" @click="search">Search</button>
  </div>
   
  <ul class="items">
    <li v-for="item in items">
      {{ item }}
    </li>
  </ul>

 
</div>
</template>







<style scoped>

#searchComp{
  border: 1px solid #ccc;
  margin: 20px;
}

.searchBar{
  display: flex;
}

#searchTxt {
  flex: 10;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 9px;
  font-size: 22px;
}
#searchBtn {
  flex: 1;
  background: #42b983;
  color: #fff;
  border: 0;
  padding: 12px;
  font-size: 22px;
  cursor: pointer;
   
  }

ul.items {
    list-style: none;
    padding: 10px;
}

ul.items li {
    display: flex;
    flex-direction: column;
    text-align: left;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}



</style>

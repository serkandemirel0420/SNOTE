<script setup>
import { ref } from 'vue'
import Database from 'tauri-plugin-sql-api'
 let db;

(async function(){
     try {
      db = await Database.load('/Users/serkandemirel/snote.db')
     }catch(e){
        console.log(e)
     }
})();

let result = ref(null);


async function searchClick(){
  //calculate the time spend on execution


  let rslt = await db.select(`SELECT * from content;`);
  result.value = rslt; 
  
}

</script>



<template>

  <div id="searchComp">
    {{msg}}
    <div class="searchBar">
      <input id="searchTxt" type="text" v-model="search" @keyup.enter="search" />
      <button id="searchBtn" @click="searchClick">Search</button>
    </div>
    
    <ul class="items">
      <li v-for='item in result'>
        {{ item.content }}
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

<script setup lang="ts">
import { ref } from "vue";
import Database from "tauri-plugin-sql-api";

let db = null;
let result = ref(null);

try {
  (async () => {
    db = await Database.load("/Users/serkandemirel/snote.db");
    let rslt = await db.select(`SELECT * from content;`);
    result.value = rslt;
  })();
} catch (e) {
  console.log("Error happened when connecting to DB", e);
}

async function searchClick() {
  let rslt = await db.select(`SELECT * from content;`);
  result.value = rslt;
}

let indent = ref(5);

function sizeClick($event) {
  $event.target.style.paddingLeft = indent.value++ + "px";
}

let contentIcon = "99";
</script>

<template>
  <div id="searchComp">
    {{ msg }}
    <div class="searchBar">
      <input id="searchTxt" type="text" v-model="search" @keyup.enter="search" />
      <button id="searchBtn" @click="searchClick">Search</button>
    </div>

    <div class="items">
      <div
        v-for="item in result"
        :key="item.id"
        @click="sizeClick"
        class="item item_style"
      >
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.item_style {
  color: red;
  content: var(--contentIcon);
}

#searchComp {
  border: 1px solid #ccc;
  margin: 20px;
}

.searchBar {
  display: flex;
  height: 50px;
}

#searchTxt {
  flex: 10;
  height: 100%;
  border: 1px solid #ccc;

  padding: 9px;
  font-size: 19px;
  height: 100%;
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

.item {
  text-align: left;
  padding: 10px 7px;
  border: 1px solid lightgray;
  font-size: large;
}

.margin-first {
  margin-left: 20 px;
}
</style>

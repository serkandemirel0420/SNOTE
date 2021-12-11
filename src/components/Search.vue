<script setup lang="ts">
import { ref, computed } from "vue";
import Database from "tauri-plugin-sql-api";

// $refs.searchTxt.focus();

let db = null;
let result = ref(null);

// load db
try {
  (async () => {
    db = await Database.load("/Users/serkandemirel/snote.db");
    let rslt = await db.select(`SELECT * from content;`);

    rslt[0].current = false;
    //immute
    result.value = rslt;

    // result.value[0].current = true;
  })();
} catch (e) {
  console.log("Error happened when connecting to DB", e);
}

async function searchClick() {
  let rslt = await db.select(`SELECT * from content;`);
  result.value = rslt;
}

function sizeClick(item, e) {
  return item.parent * 15 + "px";
}

const paddingSize = computed((item, e) => {
  return item.parent + 20 + "px";
});

function navigate() {
  result.value[0].current = true;
  return;
}

document.addEventListener("keydown", (e) => {
  if (e.key === 83747) {
    let el = document.querySelector(".items> :first-child").focus();
    el.target.style.border = "1px solid red";
  }
});
</script>

<template>
  <div id="searchComp">
    {{ msg }}
    <div class="searchBar">
      <input
        id="searchTxt"
        type="text"
        ref="searchTxt"
        v-model="search"
        @keyup.enter="search"
      />
      <button id="searchBtn" @click="searchClick">Search</button>
    </div>

    <div class="items">
      <div
        tabindex="1"
        v-for="(item, index) in result"
        :style="{ paddingLeft: sizeClick(item, $event) }"
        :key="item.id"
        @click="sizeClick(item, $event)"
        class="item item_style"
        :class="{ current: item.current }"
        id="`item_${item.id}`"
        @keyup.down="navigate"
      >
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.current {
  border: 1px solid purple;
  background-color: aqua;
}
</style>

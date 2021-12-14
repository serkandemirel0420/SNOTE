<script setup lang="ts">
import { ref, computed } from "vue";
import Database from "tauri-plugin-sql-api";

// $refs.searchTxt.focus();

let db = null;
let rslt = null;
let result = ref(null);

// load db
try {
  (async () => {
    db = await Database.load("/Users/serkandemirel/snote.db");
    rslt = await db.select(`SELECT * from content;`);

    // rslt = childNodeCount(rslt);
    // debugger;
    rslt[0].current = false;
    //immute
    result.value = rslt;
    result.value[0].current = true;

    // result.value[0].current = true;
  })();
} catch (e) {
  console.log("Error happened when connecting to DB", e);
}

function findAllChildren(id, data) {
  let results = [];
  function iterate(id, data) {
    for (const item of data) {
      if (item.parent == id) {
        results.push(item);
        iterate(item.id, results);
      }
    }
  }
  iterate(id, data);
  return results;
}

async function searchClick() {
  let rslt = await db.select(`SELECT * from content;`);

  result.value = rslt;
  //iff result is not empty
  if (result.value.length) {
    result.value[0].current = true;
  }
}

function sizeClick(item, firstParent) {
  let parentSize = Math.abs(item.parent + 1);

  return `calc(100% - ${(parentSize - (firstParent + 1)) * 30}px)`;
}

function iconSet(item) {
  let childLengthCount = findAllChildren(item.id, result.value).length;
  return childLengthCount;
}

const paddingSize = computed((item, e) => {
  return item.parent + 20 + "px";
});

let latestIdIndex = 0;

document.addEventListener("keydown", (e) => {
  let dataLength = result.value.length;

  //if lastindexid is null then set tp 0 index id
  if (latestIdIndex === null) {
    latestIdIndex = 0;
    return;
  }

  if (e.code === "ArrowDown") {
    // let el = document.querySelector(".items> :first-child");

    result.value[latestIdIndex].current = false;
    latestIdIndex += 1;
    latestIdIndex = latestIdIndex % dataLength;
    result.value[latestIdIndex].current = true;
    // console.log(latestIdIndex);
    // el.focus();
    // el.style.border = "5px solid red";
  }

  if (e.code === "ArrowUp") {
    result.value[latestIdIndex].current = false;

    //if latestIdIndex is less then 0 then change assign to the last item of the index
    if (latestIdIndex < 0) {
      latestIdIndex = dataLength - 1;
    }
    // if latestIdIndex is greater then dataLength then change assign to the first item of the index
    if (latestIdIndex > dataLength) {
      latestIdIndex = 0;
    }

    latestIdIndex -= 1;

    latestIdIndex = (result.value.length + latestIdIndex) % dataLength;
    result.value[latestIdIndex].current = true;
    console.log(latestIdIndex);

    // el.focus();
    // el.style.border = "5px solid red";
  }
});
</script>

<template>
  <div id="searchComp">
    <div class="searchBar">
      <input id="searchTxt" type="text" ref="searchTxt" />
      <button id="searchBtn" @click="searchClick">Search</button>
    </div>

    <div class="items">
      <div
        tabindex="0"
        v-for="(item, index) in result"
        :style="{ width: sizeClick(item, result[0].parent) }"
        :key="item.id"
        class="item item_style"
        :class="{
          current: item.current,

          itemExpanded: iconSet(item),
        }"
        id="`item_${item.id}`"
      >
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<style scoped>
#searchComp {
  border: 1px solid #ccc;
  margin: auto;
  width: 90%;
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
  width: 100%;
  display: flex;
  line-height: 1.3;
  border: 1px solid transparent;
}

.items {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  align-items: flex-end;
}

.margin-first {
  margin-left: 20 px;
}

.current {
  line-height: 1.3;
  border: 1px solid transparent;
  background-color: rgb(215, 239, 255);
}

.itemExpanded::before {
  content: url('data:image/svg+xml,<svg width="1em" height="1em" fill="green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /> </svg></svg>');
  padding-right: 10px;
}

.itemNotExpanded::before {
  content: url('data:image/svg+xml,<svg width="1em" height="1em" fill="green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /> </svg></svg>');
  padding-right: 10px;
}
</style>

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

    rslt[0].current = false;
    //immute
    result.value = rslt;
    result.value[0].current = true;

    // result.value[0].current = true;
  })();
} catch (e) {
  console.log("Error happened when connecting to DB", e);
}

async function searchClick() {
  let rslt = await db.select(`SELECT * from content;`);

  result.value = rslt;
  //iff result is not empty
  if (result.value.length) {
    result.value[0].current = true;
  }
}

function sizeClick(item, e) {
  return item.parent * 25 + "px";
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
    console.log(latestIdIndex);
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
        :style="{ marginLeft: sizeClick(item, $event) }"
        :key="item.id"
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

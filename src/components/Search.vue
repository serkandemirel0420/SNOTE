<script setup lang="ts">
import { ref, computed } from "vue";
import Database from "tauri-plugin-sql-api";

// $refs.searchTxt.focus();

let db = null;
(async function () {
  db = await Database.load("/Users/serkandemirel/snote.db");
})();

let resultLocal = [];
let result = ref(null);
let itemRefs = ref([]);
const newEntryText = ref(null);

resultLocal = [
  {
    id: 1,
    parent: 0,
    content: "General",
    status: 0,
  },
  {
    id: 2,
    parent: 1,
    content: "JS Study",
    status: 1,
  },
  {
    id: 3,
    parent: 2,
    content: "Modules",
    status: 0,
  },
  {
    id: 4,
    parent: 3,
    content: "Commonjs",
    status: 0,
  },
  {
    id: 5,
    parent: 3,
    content: "ES module",
    status: 0,
  },
  {
    id: 6,
    parent: 1,
    content: "Job find",
    status: 0,
  },
  {
    id: 7,
    content: "Go Home",
    parent: 1,
    status: 1,
  },
];

result.value = resultLocal;

//add childcount property to each item
result.value.map((item) => {
  item.childCount = findAllChildren(item.id, result.value).length;
  item.expanded = true;
  item.show = true;
  return item;
});

// make the current item active
result.value[0].current = true;

function findAllChildren(id, data) {
  let results = [];
  function iterate(id, data) {
    for (const item of data) {
      if (item.parent == id) {
        results.push(item);
        iterate(item.id, data);
      }
    }
  }
  iterate(id, data);
  return results;
}

function paddingCalculate(item, firstParent) {
  let parentSize = Math.abs(item.parent + 1);
  return `calc(100% - ${(parentSize - (firstParent + 1)) * 30}px)`;
}

function iconSet(item) {
  if (item.status == 0) {
    return "folder";
  } else {
    return "file";
  }
}

async function searchClick() {
  // debugger;
  let rslt = await db.select(`SELECT * from content;`);
  result.value = rslt;

  //TODO refactor this, code repeat
  //add childcount property to each item
  result.value.map((item) => {
    item.childCount = findAllChildren(item.id, result.value).length;
    item.expanded = true;
    item.show = true;
    return item;
  });

  // make the current item active
  result.value[0].current = true;
}

function setItemRef(el) {
  if (el) {
    itemRefs.value.push(el);
  }
}

// debugger;

document.addEventListener("keydown", (e) => {
  let dataLength = result.value.length;
  if (e.code === "ArrowDown") {
    let index = result.value.findIndex((e) => {
      return e.current == true;
    });

    result.value[index].current = false;
    //increase index as long as the item's show is false

    do {
      index = ++index % result.value.length;
    } while (result.value[index].show == false);

    // index = index + 1;
    // index = index % result.value.length;
    result.value[index].current = true;
    console.table(result.value);
  }

  if (e.code === "ArrowUp") {
    let index = result.value.findIndex((e) => {
      return e.current == true;
    });
    // debugger;

    result.value[index].current = false;
    do {
      index = --index < 0 ? result.value.length - 1 : index;
    } while (result.value[index].show == false);
    result.value[index].current = true;
    console.table(result.value);
  }

  if (e.code === "ArrowLeft") {
    // get current item
    let index = result.value.findIndex((e) => {
      return e.current == true;
    });

    result.value[index].expanded = false;

    // loop deep all children of the current item and set show property to false
    let children = findAllChildren(result.value[index].id, result.value);
    children.forEach((item) => {
      item.show = false;
    });
    console.table(result.value);
  }

  //Arrowright
  if (e.code === "ArrowRight") {
    // get current item
    let index = result.value.findIndex((e) => {
      return e.current == true;
    });

    //change expand css
    result.value[index].expanded = true;

    // loop deep all children of the current item and set show property to true
    let children = findAllChildren(result.value[index].id, result.value);
    children.forEach((item) => {
      item.show = true;
    });

    children.forEach((item) => {
      if (item.expanded == false) {
        // item.expanded = true;
        let subChildren = findAllChildren(item.id, result.value);
        subChildren.forEach((subItem) => {
          subItem.show = false;
        });
      }
    });

    console.table(result.value);
  }

  if (e.code === "Enter") {
    let currentId = result.value.findIndex((e) => {
      return e.current == true;
    });
    debugger;
    itemRefs.value[currentId].insertAdjacentElement("afterend", newEntryText.value);
  }
});
</script>

<template>
  <div id="searchComp">
    <div class="searchBar">
      <input id="searchTxt" class="searchTxt" type="text" ref="searchTxt" />
      <button id="searchBtn" @click="searchClick" class="searchBtn">Search</button>
    </div>

    <input style="" type="text" ref="newEntryText" class="newEntryText" />

    <div class="items">
      <template v-for="(item, index) in result" :key="item.id">
        <div
          :ref="setItemRef"
          v-on:keyup.enter="enter"
          tabindex="0"
          :style="{ width: paddingCalculate(item, result[0].parent) }"
          class="item item_style"
          v-if="item.show != false"
          :class="{
            current: item.current,
            itemExpanded: item.expanded && item.childCount > 0,
            itemNotExpanded: !item.expanded && item.childCount > 0,
          }"
          id="`item_${item.id}`"
        >
          {{ item.content }}
        </div>
      </template>
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

.searchTxt {
  flex: 10;
  height: 100%;
  border: 1px solid #ccc;

  padding: 9px;
  font-size: 19px;
  height: 100%;
}
.newEntryText {
  flex: 10;
  height: 100%;
  border: 1px solid #ccc;

  padding: 9px;
  font-size: 19px;
  height: 100%;
}

.searchBtn {
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

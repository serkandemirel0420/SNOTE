import { globalShortcut, tauri, app, window } from "@tauri-apps/api";
import { createApp } from "vue";
import App from "./App.vue";

import "./index.css";

// app.getName().then(alert);

import Database from "tauri-plugin-sql-api";

let wm = new window.WindowManager("tauri-apps-wm");
wm.setFocus();

// globalShortcut.register("CommandOrControl+K", () => {
//   wm.setFocus();
// });

createApp(App).mount("#app");

import { globalShortcut, tauri, app, window } from '@tauri-apps/api'
import { createApp } from 'vue'
import App from './App.vue'

// app.getName().then(alert);


let wm = new window.WindowManager()
wm.setFocus()

globalShortcut.register('CommandOrControl+K', () => {
    wm.setFocus()
})

 
createApp(App).mount('#app')

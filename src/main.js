import { globalShortcut, tauri, app, window } from '@tauri-apps/api'
import { createApp } from 'vue'
import App from './App.vue'

// app.getName().then(alert);

import Database from 'tauri-plugin-sql-api'



(async function(){
    
     const db = await Database.load('/Users/serkandemirel/snote.db')
  
     try {
        let result = await db.execute(`CREATE TABLE "serkan" ("id" INTEGER, "content"	TEXT );`);
        alert(result)
     }catch(e){
         alert(e)
     }
     
     
    

})();



console.log("db created")
 


let wm = new window.WindowManager()
wm.setFocus()

globalShortcut.register('CommandOrControl+K', () => {
    wm.setFocus()
})

 



createApp(App).mount('#app')

import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser',timeout:30000,fullyParallel:false,workers:1,reporter:'list',
 use:{baseURL:'http://127.0.0.1:4173',browserName:'chromium',channel:'msedge',headless:true,viewport:{width:1440,height:1000},trace:'retain-on-failure'},
 webServer:{command:'"'+process.execPath+'" scripts/serve.mjs',url:'http://127.0.0.1:4173',reuseExistingServer:false,timeout:30000},
});

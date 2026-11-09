import { chromium } from 'playwright';
export async function browser(){return chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});}
export const origin=process.env.SITE_ORIGIN||'http://127.0.0.1:4173/engineering-portfolio/';

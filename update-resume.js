const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const UserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36';
const ResumesID = [
  '<id resume>',
  '<id resume>'
]


async function getCookie() {
  const browser = await puppeteer.launch( {headless: false} )
  const page = await browser.newPage()
  await page.setUserAgent(UserAgent)
  await page.goto('https://spb.hh.ru/login')
  const cookies = await page.cookies()
  await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2))
}

async function updateResume(resumeID) {
  const browser = await puppeteer.launch( {headless: true, slowMo: 20} )
  const page = await browser.newPage()
  await page.setUserAgent(UserAgent)
  const cookiesString = await fs.readFile(__dirname+'/cookies.json')
  const cookies = JSON.parse(cookiesString)
  await page.setCookie(...cookies)
  await page.goto('https://spb.hh.ru/resume/'+resumeID)
  await page.click('[data-qa="resume-update-button"]')
  await browser.close()
}

if (process.argv[2] == '--get-cookies') { 
  getCookie()
} 
else {
  ResumesID.map(updateResume)
}


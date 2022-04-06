const puppeteer = require('puppeteer');
const fs = require('fs');


var counter = 0;
var date = 1;

// fills number instead 1 becomes 01
function leftFillNum(num) {
  return num.toString().padStart(2, 0)
}

urll = "https://www.google.com/flights?hl=en#flt=SEA.JFK.2019-07-01*JFK.SEA.2019-09-08;c:USD;e:1;sd:1;t:f";


async function flyer(url) {

  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitFor(2250);
  await navigationPromise;

  cLog();
  await page.waitForXPath('//*[@id="flt-app"]/div[2]/main[4]/div[7]/div[1]/div[6]/div[3]/div[1]/div[1]/ol/li[1]/div/div[1]/div[2]/div[1]/div[1]/div[6]/div[1]')[0];
  cLog();
  
  const dPrice = await page.$x('//*[@id="flt-app"]/div[2]/main[4]/div[7]/div[1]/div[6]/div[3]/div[1]/div[1]/ol/li[1]/div/div[1]/div[2]/div[1]/div[1]/div[6]/div[1]');
  let departPrice = await page.evaluate(h1 => h1.textContent, dPrice[0]);
  console.log(departPrice);
  
  await page.click('div[class="flt-subhead1 gws-flights-results__price gws-flights-results__cheapest-price"]');
  await page.waitFor(2250);
  await navigationPromise;
  await page.waitForXPath('//*[@id="flt-app"]/div[2]/main[4]/div[7]/div[1]/div[6]/div[3]/div[1]/div[1]/ol/li[1]/div/div[1]/div[2]/div[1]/div[1]/div[6]/div[1]');
  await page.waitFor(2250);


  const rPrice = await page.$x('//*[@id="flt-app"]/div[2]/main[4]/div[7]/div[1]/div[6]/div[3]/div[1]/div[1]/ol/li[1]/div/div[1]/div[2]/div[1]/div[1]/div[6]/div[1]');
  let returnPrice = await page.evaluate(h1 => h1.textContent, rPrice[0]);
  console.log(returnPrice)

  console.log("Price to depart is " + departPrice + "-- Price to return is " +
    returnPrice + "\n\t" + url + "\n");

  fs.appendFile('log.txt', "\nPrice to depart is " + departPrice + "-- Price to return is " + returnPrice + "\n\t" + url + "\n", function (err) {
    if (err) throw err;
  });

  await browser.close();

  if (date  < 10){
    date++;
    flyer("https://www.google.com/flights?hl=en#flt=SEA.JFK.2020-06-" + leftFillNum(date) + "*JFK.SEA.2020-09-04;c:USD;e:1;sd:1;t:f");
    console.log("Date is " + leftFillNum(date) + "\n");
  } else if (9 <= date < 30){
    date++;
    flyer("https://www.google.com/flights?hl=en#flt=SEA.JFK.2020-06-" + date + "*JFK.SEA.2020-09-04;c:USD;e:1;sd:1;t:f");
    console.log("\nDate is " + date + "\n");
  }
   
};

function cLog(){
  counter++;
  console.log(counter);
}


flyer("https://www.google.com/flights?hl=en#flt=SEA.JFK.2020-06-01*JFK.SEA.2020-09-04;c:USD;e:1;sd:1;t:f");


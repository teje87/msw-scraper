const puppeteer = require('puppeteer');
const rootPage = "https://es.magicseaweed.com/Zurriola-Surf-Report/171/";


// (TODO) Make an array of webpages of different spots 

   



let scrape = async () => {
    
    //OPEN PAGE
    const browser = await puppeteer.launch({args: ['--no-sandbox'], timeout:0});
    const page = await browser.newPage();
    await page.goto(rootPage);

  
    
    //SELECT ITEMS
    const result = await page.evaluate(() => {
        let days = document.querySelectorAll('.msw-fc-day'); 
        let horas = document.querySelectorAll('.msw-fc-thour');
        let swells = document.querySelectorAll('.msw-fc-s');
        let swellDirections = document.querySelectorAll('.msw-fc-lps')
        
        

        let data = [];
        let hoursArr = [];
        let swellArr = [];
        let swellDirArr = [];
        let daysArr = [];

        
        //DAYS
        for (var day of days){ 
        
           var dia = day.textContent;
            console.log(day)
            
            data.push({dia}); 
        }

        //HOURS
        for (var hora of horas){ 
        
            let time = hora.innerText;    
            hoursArr.push({time}); 
        }

         //SWELL 
        for( var swell of swells){
            let measure = swell.textContent;
            swellArr.push({measure});
        }

        swellArr.splice(0,1);

       
        //SWELL DIRECTION
        for( var swellDirection of swellDirections){
            let direction = swellDirection.getAttribute('data-original-title');
            swellDirArr.push({direction});
        }
        
        var chart = hoursArr.map((b,i)=> chart = {...b, ...swellArr[i], ...swellDirArr[i] }
        )
        
        
       
        

        return chart;
    });

    browser.close();
    return result; 
};

//SCRAPE FORECAST
scrape().then((value) => {
    console.log(value); 
});

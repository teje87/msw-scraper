const puppeteer = require('puppeteer');
const axios = require('axios');
const rootPage = "https://es.magicseaweed.com/Zurriola-Surf-Report/171/";
const json = require('format-json');


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
        let swellDirections = document.querySelectorAll('.msw-fc-lps');
        let winds = document.querySelectorAll('.msw-fc-wg');
        let windDirections = document.querySelectorAll('.msw-fc-wa')
        
        

        let data = [];
        let hoursArr = [];
        let swellArr = [];
        let swellDirArr = [];
        let daysArr = [];
        let windsArr = [];
        let windDirArr= [];

        
        //DAYS
        for (var day of days){ 
        
           var dia = day.textContent;
            console.log(day)
            
            data.push(dia); 
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

        //WIND
        for (var wind of winds){ 
        
            var viento = wind.innerText;
            
            viento = viento.replace(/\n|\r/g, "");

            windsArr.push({viento}); 
        }
        
        //WIND DIR
        for (var windDirection of windDirections){ 
        
            var direccionViento = windDirection.getAttribute('data-original-title');
        

            windDirArr.push({direccionViento}); 
        }
        

        //////////////////////////////////////////////////////////
        var chart = hoursArr.map((b,i)=> chart = {...b, ...swellArr[i], ...swellDirArr[i] , ...windsArr[i], ...windDirArr[i]}
        )
        
        extractTable = (start,n)=> {
            return chart.slice(start,n)
        }
        //////////////////////////////////////////////////////////
        

        //MAKE THIS CLEAR////////////////////////////////////////
        
        var msw=[];

        counter = 0;
        msw = data.map((day,i)=>{
            dayForecast = extractTable(counter,counter+8)
            counter+=8;
            return  {day, dayForecast}
        })
        /////////////////////////////////////////////////////



        return msw;
    });

    browser.close();
    let getSwell = result[0];

    return getSwell;  
};





//SCRAPE FORECAST
scrape().then((value) => {

    axios.post('https://api.telegram.org/bot586158692:AAEL92pNxZAwXJE_Kp-16O9S2wXU9vXSRIs/sendMessage?chat_id=125672177&text=Este es el parte de olas de hoy:');

    value.dayForecast.forEach((hour)=>{
        axios.post('https://api.telegram.org/bot586158692:AAEL92pNxZAwXJE_Kp-16O9S2wXU9vXSRIs/sendMessage?chat_id=125672177&text='+ encodeURIComponent(JSON.stringify(hour)
        .replace(/,/g,  '\n' )
        .replace(/['"]+/g, '')
        .replace('{', '')
        .replace('}', '')
        ))

    })
});
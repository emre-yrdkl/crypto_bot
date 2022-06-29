const { Spot } = require('@binance/connector')

const apiKey = '';
const apiSecret = '';
const client = new Spot(apiKey, apiSecret);

const CoinGecko = require('coingecko-api');

const CoinGeckoClient = new CoinGecko();

var nodemailer = require('nodemailer');




// Get account information
//client.account().then(response => client.logger.log(response.data))

// Place a new order
/*client.newOrder('DOGETRY', 'BUY', 'LIMIT', {
  price: '1.8',
  quantity: 10,
  timeInForce: 'GTC'
}).then(response => client.logger.log(response.data))
  .catch(error => client.logger.error(error))*/

  let bool = false;

  let profit= [];

  let data3Min = [];

  let color = [];

  let buyPrice= [];
  
  let count = 4;

  let refreshV;

  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'botsoybot06@gmail.com',
      pass: 'Bot0soybot!'
    }
  });


  function sellFunc(a){
    console.log("sell calisti");

    //sell request

    if(buyPrice.length==4){
      bool=false;
    }

    buyPrice.splice(a,1);

    //clearInterval(refreshV);
    
    count++;

  }

  function buyFunc(){
      
      var boolean1=0;
      for(var i=(color.length-2); i>=0; i--){
        if(color[i]=="Y" && (data3Min[i]/data3Min[color.length-1])>1004/1000){
            boolean1=1;

        }


      }
      if(color[color.length-1]=="Y"){
        bool=false;
      }
      
      if(color[color.length-1]=="Y" && boolean1){

        count -= 1;
        
        var mailOptions = {
          from: 'botsoybot06@gmail.com',
          to: 'egemenalicaner74@hotmail.com, emreyurdakul24@gmail.com',
          subject: 'CRYPTO BOT - BUY(4,5|emre)',
          text: "BUYING PRICE: "+ data3Min[data3Min.length-1].toString() + "\n" + "REMAIN BULLET NUMBER: " + count.toString()
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });



        console.log("buy calisti");
        //bool = false;
        if(buyPrice.length==0){
          refreshV = setInterval(getData3Sec, 2000);
        }
        buyPrice.push(data3Min[data3Min.length-1]);

      }
  }

  function compare(){

    if(data3Min[4]/data3Min[3] >= 1008/1000 || data3Min[4]/data3Min[2] >= 1008/1000 || data3Min[4]/data3Min[1] >= 1008/1000 || data3Min[4]/data3Min[0] >= 1008/1000){
      
      sleep(180000);//burasi degisebilir, satimda sikinti var
    }

    if(data3Min.length>1){

      if(data3Min[data3Min.length-1] < data3Min[data3Min.length-2]){
        color.push("K");
      }
      else{
        color.push("Y");
      }      
    }

    if(color.length > 1){

      if(color[color.length-1] == "K" && color[color.length-2] == "K"){

        
        bool = true;

      }
      if(bool){
        if(count > 0){
          buyFunc();
        }
        
      }
      if(color.length > 10){
        color.shift();
      }
    }

  }


  function getData3Min() {

    got('https://api.binance.com/api/v3/ticker/price?symbol=DOGEUSDT', { json: true }).then(response => {
    //console.log(response.body.data.prices[1].price);
    b = response.body.price;
    var num = parseFloat(b);

    data3Min.push(num);
    console.log(bool);
    compare();
    
    if(data3Min.length > 10){
      data3Min.shift();
    }
    console.log("data : ",data3Min);
    console.log("color: ",color);
    

  }).catch(error => {
    console.log("error.response.body");
  })
  }

  function getData3Sec() {

    got('https://api.binance.com/api/v3/ticker/price?symbol=DOGEUSDT', { json: true }).then(response => {
    //console.log(response.body.data.prices[1].price);
    a = response.body.price;
    var num = parseFloat(a);
    var profitNum = num*10000/10045
    console.log("3 sec calisiyor");

    for(var i=0; i < buyPrice.length; i++){

      if(buyPrice[i] <= profitNum){
        
        var mailOptions2 = {
          from: 'botsoybot06@gmail.com',
          to: 'egemenalicaner74@hotmail.com, emreyurdakul24@gmail.com',
          subject: 'CRYPTO BOT - SELL(5,5)(emre)',
          text: "PROFIT: "+ ((num/buyPrice[i]-1)*1000).toString() 
        };
        transporter.sendMail(mailOptions2, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        profit.push(num/buyPrice[i]);
        console.log("profit: ",profit);
        sellFunc(i);
      }
    }

  }).catch(error => {
    console.log("error.response.body");
  })
  }

  const got = require('got');

  var refreshIntervalId = setInterval(getData3Min, 180000);

  //clearInterval(refreshIntervalId);
  

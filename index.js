const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const dialogflow = require('dialogflow');
const requestHttp = require('request');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  //console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  //console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  console.log('agent', agent);
  
  //var name = request.body.queryResult.parameters.name;
  
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function Hello(agent) {
    agent.add("Hello "+ name );
      
  }
  
  function TypeOfCard(agent){
   console.log('card name '+ request.body.queryResult.outputContexts[0].parameters.card);
    var cardName = request.body.queryResult.outputContexts[0].parameters.card; // Credit or Debit
    var cardType = request.body.queryResult.parameters.CardType; // Silver or Gold
    // var limit = true ;
	
    if (cardType === 'Gold')
    {
		let imageUrl = 'https://princy2018-db628.firebaseapp.com/gold.png';
		let buttonUrl = 'https://princy2018-db628.firebaseapp.com/gold.png';
		agent.add('Sorry! Mr. Bond, Based on your financial statements and transaction history, you are not eligible for gold card'+
                'but you are eligible for the silver card. Do you like me to proceed with a silver card?');
		agent.add(getSampleCreditCard(cardType, imageUrl, 'ABN AMRO', 'Button', buttonUrl));
		
    } else if(cardType === 'Silver') {
		let imageUrl = 'https://princy2018-db628.firebaseapp.com/silver.png';
		let buttonUrl = 'https://princy2018-db628.firebaseapp.com/silver.png';
		
		agent.add('Ok.. I will order a '+ cardType + ' '+ cardName  +' card for you');
		agent.add(getSampleCreditCard(cardType, imageUrl, 'ABN AMRO', 'Button', buttonUrl));
	} else {
		agent.add('ABN AMRO offers only Gold or Silver Credit Cards');
	}
    	
  }
  
  function getSampleCreditCard(cardType, imageUrl, text, buttonText, buttonUrl) {
	  var cardObj = {};
	  
	  cardObj.title = cardType + ' card';
	  cardObj.imageUrl = imageUrl;
	  cardObj.text = text;
	  cardObj.buttonText = buttonText;
	  cardObj.buttonUrl = buttonUrl;
	  
	  /*
	  new Card({
          title: 'First card',
          imageUrl: 'http://xinature.com/wp-content/uploads/2016/10/flowers-love-rose-flower-delicte-blue-wallpapers-big-size.jpg',
          text: 'this is the body of the card .. this is the body of the card... this is the body of the card',
          buttonText: 'this is a button',
          buttonUrl: 'http://xinature.com/wp-content/uploads/2016/10/flowers-love-rose-flower-delicte-blue-wallpapers-big-size.jpg'
          })
      
	  */
	  return new Card(cardObj);
  }
  
  function getApi(){
    console.log('isnide getapi');
    const url = 'https://jsonplaceholder.typicode.com/posts/1';

   requestHttp(url, function(error, response, body) {
   	var data = JSON.parse(body);
    console.log(data.userId)
   });
  }
  

  // List of all the Intent available
  let intentMap = new Map();
  
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Hello', Hello);
  intentMap.set('TypeOfCard', TypeOfCard);
  intentMap.set('getApi',getApi);
  
  agent.handleRequest(intentMap);
});

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var http = require('http');
var headerBody = {
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    // recommended to inject access tokens as environmental variables, e.g.
    'x-viber-auth-token': process.env.X_VIBER_AUTH_TOKEN || config.X_VIBER_AUTH_TOKEN
};
var buttons = [];
var text = [];
var link = [];
var value;
app.set('port', (process.env.PORT || 8080));

//app.use(express.static(__dirname + '/public'));

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function(req, response) {
    response.writeHead(200, {
        'content-type': 'text/plain'
    });
    response.write("To chat with Susi through Viber, visit this link - chats.viber.com/chatauto and click on the 'Have a look' button\n\n");
    // setting options to request the chat api of viber.
    var options = {
        method: 'POST',
        url: 'https://chatapi.viber.com/pa/set_webhook',
        headers: headerBody,
        body: {
            url: 'https://eoviberbot.herokuapp.com/',
            event_types: ['delivered', 'seen', 'failed', 'subscribed', 'unsubscribed', 'conversation_started']
        },
        json: true
    };
    // request to the chat api of viber.
    request(options, function(error, res, body) {
        if (error) throw new Error(error);
        response.write("The status message received for set Webhook request is - " + body.status_message);
        response.end();
    });
});

app.post('/postToPublic', function(req, response) {
    response.writeHead(200);
    // setting options to request the chat api of viber.
    var options = {
        method: 'POST',
        url: 'https://chatapi.viber.com/pa/post',
        headers: headerBody,
        body: {
            from: "0JzJAjLh7wGDPJwDobRhwg==",
            sender: {
                name: 'Susi',
                avatar: 'https://github.com/fossasia/susi_viberbot/tree/master/docs/images/susi.png'
            },
            type: 'text',
            text: req.body.val
        },
        json: true
    };
    // request to the chat api of viber.
    request(options, function(error, res, body) {
        if (error) throw new Error(error);
    });
    response.end();
});

app.post('/', function(req, response) {
    response.writeHead(200);

    // If user sends a message in 1-on-1 chat to the susi public account
    if (req.body.event === 'message') {
        // Susi answer to a user message
        var request = require('request');
		
        var ans;
        var message = req.body.message.text;

        if(message.indexOf("https://") !== -1){}
        else if(message === "Get started"){          

            // setting options to request susi bot.
            var options1 = {
                method: 'GET',
                url: 'http://api.susi.ai/susi/chat.json',
                qs: {
                    timezoneOffset: '-330',
                    q: message
                }
            };            

            // A request to the Susi bot
            request(options1, function(error1, response1, body1) {
                if (error1) throw new Error(error1);
                // answer fetched from susi
                ans = (JSON.parse(body1)).answers[0].actions[0].expression;
                
                var options = {
                    method: 'POST',
                    url: 'https://chatapi.viber.com/pa/send_message',
                    headers: headerBody,
                    body: {
                        receiver: req.body.sender.id,
                        min_api_version: 1,
                        tracking_data: 'tracking data',
                        type: 'text',
                        text: '\nHi ' + req.body.sender.name + '! Thank you for getting started to chat with us. Please tap "I Agree" to continue.'
                    },
                    json: true
                };

                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);

                    var buttons = [{
                        Columns: 6,
                        Rows: 1,
                        Text: "<font color=#323232><b>I Agree</b></font>",
                        "ActionType": "reply",
                        "ActionBody": "I Agree",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 6,
                        Rows: 1,
                        Text: "<font color=#323232><b>Terms of Use</b></font>",
                        "ActionType": "open-url",
                        "ActionBody": "https://about.powermaccenter.com/privacy-policy/",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    ];

                    var options2 = {
                        method: 'POST',
                        url: 'https://chatapi.viber.com/pa/send_message',
                        headers: headerBody,
                        body: {
                            receiver: req.body.sender.id,
                            min_api_version: 2,
                            type: 'rich_media',
                            rich_media: {
                                Type: "rich_media",
                                ButtonsGroupColumns: 6,
                                ButtonsGroupRows: 2,
                                BgColor: "#FFFFFF",
                                Buttons: buttons
                            }
                        },
                        json: true
                    };

                    request(options2, function(error2, res2, body2) {
                        if (error) throw new Error(error);
                        console.log(body);
                    });
                });
            });
        }

        else if(message === "I Agree"){
            // setting options to request susi bot.
            var options1 = {
                method: 'GET',
                url: 'http://api.susi.ai/susi/chat.json',
                qs: {
                    timezoneOffset: '-330',
                    q: message
                }
            };

            // A request to the Susi bot
            request(options1, function(error1, response1, body1) {
                if (error1) throw new Error(error1);
                // answer fetched from susi
                ans = (JSON.parse(body1)).answers[0].actions[0].expression;
                
                var options = {
                    method: 'POST',
                    url: 'https://chatapi.viber.com/pa/send_message',
                    headers: headerBody,
                    body: {
                        receiver: req.body.sender.id,
                        min_api_version: 1,
                        tracking_data: 'tracking data',
                        type: 'text',
                        text: '\nHow can we help you? You may choose from the options below to continue.'
                    },
                    json: true
                };

                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);

                    var buttons = [{
                        Columns: 6,
                        Rows: 1,
                        Text: "<font color=#323232><b>Branches</b></font>",
                        "ActionType": "reply",
                        "ActionBody": "Branches",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 6,
                        Rows: 1,
                        Text: "<font color=#323232><b>Products</b></font>",
                        "ActionType": "reply",
                        "ActionBody": "Products",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 6,
                        Rows: 1,
                        Text: "<font color=#323232><b>Services</b></font>",
                        "ActionType": "reply",
                        "ActionBody": "Services",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 6,
                        Rows: 1,
                        Text: "<font color=#323232><b>Contact Us</b></font>",
                        "ActionType": "open-url",
                        "ActionBody": "http://www.executiveoptical.com/ContactUs",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    }];

                    var options2 = {
                        method: 'POST',
                        url: 'https://chatapi.viber.com/pa/send_message',
                        headers: headerBody,
                        body: {
                            receiver: req.body.sender.id,
                            min_api_version: 2,
                            type: 'rich_media',
                            rich_media: {
                                Type: "rich_media",
                                ButtonsGroupColumns: 6,
                                ButtonsGroupRows: 2,
                                BgColor: "#FFFFFF",
                                Buttons: buttons
                            }
                        },
                        json: true
                    };

                    request(options2, function(error2, res2, body2) {
                        if (error) throw new Error(error);
                        console.log(body);
                    });
                });
            });
        }

        else if(message === "Branches"){
            // setting options to request susi bot.
            var options1 = {
                method: 'GET',
                url: 'http://api.susi.ai/susi/chat.json',
                qs: {
                    timezoneOffset: '-330',
                    q: message
                }
            };

            // A request to the Susi bot
            request(options1, function(error1, response1, body1) {
                if (error1) throw new Error(error1);
                // answer fetched from susi
                ans = (JSON.parse(body1)).answers[0].actions[0].expression;                
                
                var options = {
                    method: 'POST',
                    url: 'https://chatapi.viber.com/pa/send_message',
                    headers: headerBody,
                    body: {
                        receiver: req.body.sender.id,
                        min_api_version: 1,
                        tracking_data: 'tracking data',
                        type: 'text',
                        text: 'Type the City you wish to check so that I can send the list of stores we have in that area.'
                    },
                    json: true
                };

                request(options, function(error, res, body) {
                    if (error) throw new Error(error);
                    console.log(body);
                });                
            });            
        }
        
        else if(message === "Manila" || message === "manila" || message === "metro manila" || message === "Metro Manila" || message === "metro Manila" || message === "Metro manila"){
            // setting options to request susi bot.
            var options1 = {
                method: 'GET',
                url: 'http://api.susi.ai/susi/chat.json',
                qs: {
                    timezoneOffset: '-330',
                    q: message
                }
            };

            // A request to the Susi bot
            request(options1, function(error1, response1, body1) {
                if (error1) throw new Error(error1);
                // answer fetched from susi
                ans = (JSON.parse(body1)).answers[0].actions[0].expression;
                
                var options = {
                    method: 'POST',
                    url: 'https://chatapi.viber.com/pa/send_message',
                    headers: headerBody,
                    body: {
                        receiver: req.body.sender.id,
                        min_api_version: 1,
                        tracking_data: 'tracking data',
                        type: 'text',
                        text: 'Here are the list of Stores we have in ' + message + ':' 
                    },
                    json: true
                };

                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);

                    var buttons = 
                    [
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>SM Southmall</b></font><font color=#777777><br>SMS 1203 G/F SM Southmall, Las Pinas, Metro Manila</font>", 
                        "ActionType":"none",                       
                        "ActionBody": "SM Southmall",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>SM Manila</b></font><font color=#777777><br>Stall 106 SM City City Manila, Concepcion cor. Arroceros & SAN Marcelino sts. Ermita Manila</font>", 
                        "ActionType": "none",
                        "ActionBody": "SM Manila",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>Metropoint</b></font><font color=#777777><br>3/F Metropoint Mall, EDSA cor. Taft Ave., Pasay City Metro Manila</font>", 
                        "ActionType": "none",
                        "ActionBody": "Metropoint",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>Market Market</b></font><font color=#777777><br>2/F Stall # S232 The Fort Bonifacio Global City Taguig, Metro Manila</font>", 
                        "ActionType": "none",
                        "ActionBody": "Market Market",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>SM San Lazaro</b></font><font color=#777777><br>Upper G/F SM City San Lazaro, F Huertas cor. A.H. Lacson St., Sta. Cruz, Manila</font>", 
                        "ActionType": "none",
                        "ActionBody": "SM San Lazaro",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 3,
                        Silent: true,
                        "Image":"https://www.4shared.com/img/jdRXrELZea/s25/17c07ad5708/eo_logo.jpg",
                        "ActionType":"reply",
                        "ActionBody":"See More Manila",
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Text: "<font color=#323232><b>See More</b></font>", 
                        "ActionType": "reply",
                        "ActionBody": "See More Manila",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },                                                            
                ];

                    var options2 = {
                        method: 'POST',
                        url: 'https://chatapi.viber.com/pa/send_message',
                        headers: headerBody,
                        body: {
                            receiver: req.body.sender.id,
                            min_api_version: 7,
                            type: 'rich_media',
                            rich_media: {
                                Type: "rich_media",
                                ButtonsGroupColumns: 6,
                                ButtonsGroupRows: 7,
                                BgColor: "#FFFFFF",
                                Buttons: buttons
                            }
                        },
                        json: true
                    };     
                    request(options2, function(error2, res2, body2) {
                        if (error) throw new Error(error);
                        console.log(body);
                    });               
                });
            });            
        }

        else if(message === "See More Manila"){
            // setting options to request susi bot.
            var options1 = {
                method: 'GET',
                url: 'http://api.susi.ai/susi/chat.json',
                qs: {
                    timezoneOffset: '-330',
                    q: message
                }
            };            

            request(options1, function(error1, response1, body1) {
                if (error1) throw new Error(error1);
                // answer fetched from susi
                ans = (JSON.parse(body1)).answers[0].actions[0].expression;
                
                var options = {
                    method: 'POST',
                    url: 'https://chatapi.viber.com/pa/send_message',
                    headers: headerBody,
                    body: {
                        receiver: req.body.sender.id,
                        min_api_version: 1,
                        tracking_data: 'tracking data',
                        type: 'text',
                        text: 'More lists:' 
                    },
                    json: true
                };

                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);

                    var buttons = 
                    [
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>Virra Mall</b></font><font color=#777777><br>2/F V-Mall, Greenhills Shopping Center, Greenhills San Juan, Metro Manila</font>", 
                        "ActionType": "none",
                        "ActionBody": "Virra Mall",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },                   
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>SM City Sta. Mesa</b></font><font color=#777777><br>102b Upper Ground Flr. SM City Sta. Mesa R.Magsaysay cor. Araneta Avenue, Sta. Mesa</font>", 
                        "ActionType": "none",
                        "ActionBody": "SM City Sta. Mesa",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>Tutuban Center</b></font><font color=#777777><br>First Level Main Station  Tutuban Center, Tondo Manila</font>", 
                        "ActionType": "none",
                        "ActionBody": "Tutuban Center",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 3,                        
                        Text: "<font color=#323232><b>Robinsons Place Manila EO Kids and Up</b></font><font color=#777777><br>Level 3 Midtown Wing Robinsons Place Manila Pedro Gil cor. M. Adriatico St. Ermita Manila</font>", 
                        "ActionType": "none",
                        "ActionBody": "Robinsons Place Manila EO Kids and Up",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>Vista Mall Las Pinas</b></font><font color=#777777><br>Ground Flr. Vista Mall Las Pinas CV Starr Ave., Las Pinas Metro Manila</font>", 
                        "ActionType": "none",
                        "ActionBody": "Vista Mall Las Pinas",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 3,
                        Silent: true,
                        "Image":"https://www.4shared.com/img/jdRXrELZea/s25/17c07ad5708/eo_logo.jpg",
                        "ActionType":"reply",
                        "ActionBody":"See More Manila 2",
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Text: "<font color=#323232><b>See More</b></font>", 
                        "ActionType": "reply",
                        "ActionBody": "See More Manila 2",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },                                                                         
                ];

                    var options2 = {
                        method: 'POST',
                        url: 'https://chatapi.viber.com/pa/send_message',
                        headers: headerBody,
                        body: {
                            receiver: req.body.sender.id,
                            min_api_version: 7,
                            type: 'rich_media',
                            rich_media: {
                                Type: "rich_media",
                                ButtonsGroupColumns: 6,
                                ButtonsGroupRows: 7,
                                BgColor: "#FFFFFF",
                                Buttons: buttons
                            }
                        },
                        json: true
                    };     
                    request(options2, function(error2, res2, body2) {
                        if (error) throw new Error(error);
                        console.log(body);
                    });               
                });
            }); 
        }
        else if(message === "See More Manila 2"){
            // setting options to request susi bot.
            var options1 = {
                method: 'GET',
                url: 'http://api.susi.ai/susi/chat.json',
                qs: {
                    timezoneOffset: '-330',
                    q: message
                }
            };            

            request(options1, function(error1, response1, body1) {
                if (error1) throw new Error(error1);
                // answer fetched from susi
                ans = (JSON.parse(body1)).answers[0].actions[0].expression;
                
                var options = {
                    method: 'POST',
                    url: 'https://chatapi.viber.com/pa/send_message',
                    headers: headerBody,
                    body: {
                        receiver: req.body.sender.id,
                        min_api_version: 1,
                        tracking_data: 'tracking data',
                        type: 'text',
                        text: 'More lists:' 
                    },
                    json: true
                };

                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);

                    var buttons = 
                    [
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>Puregold Tayuman</b></font><font color=#777777><br>Ground Flr. Puregold Tayuman No. 31 Juan Luna St cor. Tayuman Tondo Manila</font>", 
                        "ActionType": "none",
                        "ActionBody": "Puregold Tayuman",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>RP Manila Tempo</b></font><font color=#777777><br>Level 3 Robinsons Ermita Manila, Pedro Gil St., Ermita Manila</font>", 
                        "ActionType": "none",
                        "ActionBody": "RP Manila Tempo",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    }                                                       
                ];

                    var options2 = {
                        method: 'POST',
                        url: 'https://chatapi.viber.com/pa/send_message',
                        headers: headerBody,
                        body: {
                            receiver: req.body.sender.id,
                            min_api_version: 4,
                            type: 'rich_media',
                            rich_media: {
                                Type: "rich_media",
                                ButtonsGroupColumns: 6,
                                ButtonsGroupRows: 7,
                                BgColor: "#FFFFFF",
                                Buttons: buttons
                            }
                        },
                        json: true
                    };     
                    request(options2, function(error2, res2, body2) {
                        if (error) throw new Error(error);
                        console.log(body);
                    });               
                });
            }); 
        }
        else if(message === "Pasig" || message === "pasig" || message === "pasig city" || message === "Pasig City" || message === "pasig City" || message === "Pasig city"){
            // setting options to request susi bot.
            var options1 = {
                method: 'GET',
                url: 'http://api.susi.ai/susi/chat.json',
                qs: {
                    timezoneOffset: '-330',
                    q: message
                }
            };

            // A request to the Susi bot
            request(options1, function(error1, response1, body1) {
                if (error1) throw new Error(error1);
                // answer fetched from susi
                ans = (JSON.parse(body1)).answers[0].actions[0].expression;
                
                var options = {
                    method: 'POST',
                    url: 'https://chatapi.viber.com/pa/send_message',
                    headers: headerBody,
                    body: {
                        receiver: req.body.sender.id,
                        min_api_version: 1,
                        tracking_data: 'tracking data',
                        type: 'text',
                        text: 'Here are the list of Stores we have in ' + message + ':' 
                    },
                    json: true
                };

                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);

                    var buttons = 
                    [
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>Ayala Mall Feliz</b></font><font color=#777777><br>Second Flr. Ayala Mall Feliz Marikina-Infanta Highway, Pasig City</font>", 
                        "ActionType":"none",                       
                        "ActionBody": "Ayala Mall Feliz",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 3,
                        Text: "<font color=#323232><b>Estancia</b></font><font color=#777777><br>Lower Level Estancia in Capitol Commons 1605 Meralco Avenue, Ortigas Center  Pasig City</font>", 
                        "ActionType": "none",
                        "ActionBody": "Estancia",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 2,
                        Silent: true,
                        Text: "<font color=#323232><b>Book Appointment</b></font>",
                        "ActionType":"open-url",
                        "ActionBody": "http://www.executiveoptical.com/Appointment",
                        "TextSize": "regular",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },                    
                ];

                    var options2 = {
                        method: 'POST',
                        url: 'https://chatapi.viber.com/pa/send_message',
                        headers: headerBody,
                        body: {
                            receiver: req.body.sender.id,
                            min_api_version: 2,
                            type: 'rich_media',
                            rich_media: {
                                Type: "rich_media",
                                ButtonsGroupColumns: 6,
                                ButtonsGroupRows: 7,
                                BgColor: "#FFFFFF",
                                Buttons: buttons
                            }
                        },
                        json: true
                    };     
                    request(options2, function(error2, res2, body2) {
                        if (error) throw new Error(error);
                        console.log(body);
                    });               
                });
            });
        }
        else if(message === "Products" || message === "products" || message === "Product" || message === "products"){
            // setting options to request susi bot.
            var options1 = {
                method: 'GET',
                url: 'http://api.susi.ai/susi/chat.json',
                qs: {
                    timezoneOffset: '-330',
                    q: message
                }
            };

            // A request to the Susi bot
            request(options1, function(error1, response1, body1) {
                if (error1) throw new Error(error1);
                // answer fetched from susi
                ans = (JSON.parse(body1)).answers[0].actions[0].expression;
                
                var options = {
                    method: 'POST',
                    url: 'https://chatapi.viber.com/pa/send_message',
                    headers: headerBody,
                    body: {
                        receiver: req.body.sender.id,
                        min_api_version: 7,
                        tracking_data: 'tracking data',
                        type: 'text',
                        text: 'We have a special variety of products for you. You can choose what categories you may want to explore.' 
                    },
                    json: true
                };

                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);

                    var buttons = 
                    [
                    {
                        Columns: 6,
                        Rows: 1,
                        BgColor: "#87CEFA",
                        Text: "<font color=#323232><b>Frames</b></font>", 
                        "ActionType":"reply",                       
                        "ActionBody": "Frames",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 1,
                        BgColor: "#87CEFA",
                        Text: "<font color=#323232><b>Contact Lens</b></font>", 
                        "ActionType":"reply",                       
                        "ActionBody": "Contact Lens",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 1,
                        BgColor: "#87CEFA",
                        Text: "<font color=#323232><b>Solutions</b></font>", 
                        "ActionType":"reply",                       
                        "ActionBody": "Solutions",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 1,
                        BgColor: "#87CEFA",
                        Text: "<font color=#323232><b>Sunglass</b></font>", 
                        "ActionType":"reply",                       
                        "ActionBody": "Sunglass",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 1,
                        BgColor: "#87CEFA",
                        Text: "<font color=#323232><b>Complete Eyeglass</b></font>", 
                        "ActionType":"reply",                       
                        "ActionBody": "Complete Eyeglass",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 1,
                        BgColor: "#87CEFA",
                        Text: "<b>Accessories</b>", 
                        "ActionType":"reply",                       
                        "ActionBody": "Accessories",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    }                    
                ];

                    var options2 = {
                        method: 'POST',
                        url: 'https://chatapi.viber.com/pa/send_message',
                        headers: headerBody,
                        body: {
                            receiver: req.body.sender.id,
                            min_api_version: 2,
                            type: 'text',
                            keyboard: {
                                Type: "keyboard",
                                // ButtonsGroupColumns: 6,
                                // ButtonsGroupRows: 2,
                                BgColor: "#FFFFFF",
                                Buttons: buttons
                            }
                        },
                        json: true
                    };     
                    request(options2, function(error2, res2, body2) {
                        if (error) throw new Error(error);
                        console.log(body);
                    });               
                });
            });
        }
        else if(message === "Contact Lens"){
            // setting options to request susi bot.
            var options1 = {
                method: 'GET',
                url: 'http://api.susi.ai/susi/chat.json',
                qs: {
                    timezoneOffset: '-330',
                    q: message
                }
            };

            // A request to the Susi bot
            request(options1, function(error1, response1, body1) {
                if (error1) throw new Error(error1);
                // answer fetched from susi
                ans = (JSON.parse(body1)).answers[0].actions[0].expression;
                
                var options = {
                    method: 'POST',
                    url: 'https://chatapi.viber.com/pa/send_message',
                    headers: headerBody,
                    body: {
                        receiver: req.body.sender.id,
                        min_api_version: 1,
                        tracking_data: 'tracking data',
                        type: 'text',
                        text: 'Here are our ' + message + ' products for you to choose from:' 
                    },
                    json: true
                };

                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);

                    var buttons = 
                    [
                    {
                        "Columns":6,
                        "Rows":3,
                        "ActionType":"open-url",
                        "ActionBody":"https://www.google.com",
                        "Image":"http://html-test:8080/myweb/guy/assets/imageRMsmall2.png"
                    },
                    {
                        "Columns":6,
                        "Rows":2,
                        "Text":"<font color=#323232><b>FLEXWEAR COLORS</b></font><font color=#777777><br>1 PAIR COLORED CONTACT LENSES (BC: 8.6 , DIA: 14.00)          </font><font color=#6fc133>P450.00</font>",
                        "ActionType":"open-url",
                        "ActionBody":"http://executiveoptical.com/Product/Select/1743700000001/Contact%20Lens",
                        "TextSize":"medium",
                        "TextVAlign":"middle",
                        "TextHAlign":"left"
                    },
                    {
                        "Columns":6,
                        "Rows":1,
                        "ActionType":"reply",
                        "ActionBody":"https://www.google.com",
                        "Text":"<font color=#ffffff>Buy</font>",
                        "TextSize":"large",
                        "TextVAlign":"middle",
                        "TextHAlign":"middle",
                        "Image":"https://s14.postimg.org/4mmt4rw1t/Button.png"
                    },
                    {
                        "Columns":6,
                        "Rows":1,
                        "ActionType":"reply",
                        "ActionBody":"https://www.google.com",
                        "Text":"<font color=#8367db>MORE DETAILS</font>",
                        "TextSize":"small",
                        "TextVAlign":"middle",
                        "TextHAlign":"middle"
                    },
                    {
                        "Columns":6,
                        "Rows":3,
                        "ActionType":"open-url",
                        "ActionBody":"https://www.google.com",
                        "Image":"https://s16.postimg.org/wi8jx20wl/image_RMsmall2.png"
                    },
                    {
                        "Columns":6,
                        "Rows":2,
                        "Text":"<font color=#323232><b>Hanes Men's Humor Graphic T-Shirt</b></font><font color=#777777><br>Hanes</font><font color=#6fc133>$10.99</font>",
                        "ActionType":"open-url",
                        "ActionBody":"https://www.google.com",
                        "TextSize":"medium",
                        "TextVAlign":"middle",
                        "TextHAlign":"left"
                    },
                    {
                        "Columns":6,
                        "Rows":1,
                        "ActionType":"reply",
                        "ActionBody":"https://www.google.com",
                        "Text":"<font color=#ffffff>Buy</font>",
                        "TextSize":"large",
                        "TextVAlign":"middle",
                        "TextHAlign":"middle",
                        "Image":"https://s14.postimg.org/4mmt4rw1t/Button.png"
                    },
                    {
                        "Columns":6,
                        "Rows":1,
                        "ActionType":"reply",
                        "ActionBody":"https://www.google.com",
                        "Text":"<font color=#8367db>MORE DETAILS</font>",
                        "TextSize":"small",
                        "TextVAlign":"middle",
                        "TextHAlign":"middle"
                    }                
                ];

                    var options2 = {
                        method: 'POST',
                        url: 'https://chatapi.viber.com/pa/send_message',
                        headers: headerBody,
                        body: {
                            receiver: req.body.sender.id,
                            min_api_version: 7,
                            type: 'rich_media',
                            rich_media: {
                                Type: "rich_media",
                                ButtonsGroupColumns: 6,
                                ButtonsGroupRows: 7,
                                BgColor: "#FFFFFF",
                                Buttons: buttons
                            }
                        },
                        json: true
                    };     
                    request(options2, function(error2, res2, body2) {
                        if (error) throw new Error(error);
                        console.log(body);
                    });               
                });
            });
        }
        else{
            // setting options to request susi bot.
            var options1 = {
                method: 'GET',
                url: 'http://api.asksusi.com/susi/chat.json',
                qs: {
                    timezoneOffset: '-330',
                    q: req.body.message.text
                }
            };

            // A request to the Susi bot
            request(options1, function(error1, response1, body1) {
                if (error1) throw new Error(error1);
                // answer fetched from susi
                ans = (JSON.parse(body1)).answers[0].actions[0].expression;
                var type = (JSON.parse(body1)).answers[0].actions;

                // checking type of json response
                if (type.length == 3 && type[2].type == "map") {
                    var latitude = type[2].latitude;
                    var longitude = type[2].longitude;

                    var options = {
                        method: 'POST',
                        url: 'https://chatapi.viber.com/pa/send_message',
                        headers: headerBody,
                        body: {
                            receiver: req.body.sender.id,
                            min_api_version: 1,
                            tracking_data: 'tracking data',
                            type: 'text',
                            text: ans
                        },
                        json: true
                    };

                    // request to the chat api of viber.
                    request(options, function(error, res, body) {
                        if (error) throw new Error(error);
                        console.log(body);
                    });

                    var options1 = {
                        method: 'POST',
                        url: 'https://chatapi.viber.com/pa/send_message',
                        headers: headerBody,
                        body: {
                            receiver: req.body.sender.id,
                            min_api_version: 1,
                            tracking_data: 'tracking data',
                            type: 'location',
                            location: {
                                lat: latitude,
                                lon: longitude
                            }
                        },
                        json: true
                    };
                    // request to the chat api of viber.
                    request(options1, function(error, res, body) {
                        if (error) throw new Error(error);
                        console.log(body);
                    });
                } else if (type.length == 1 && type[0].type == "table") {
                    var data = (JSON.parse(body1)).answers[0].data;
                    var columns = (JSON.parse(body1)).answers[0].actions[0].columns;
                    var key = Object.keys(columns);
                    var count = (JSON.parse(body1)).answers[0].metadata.count

                    for (i = 0; i < count; i++) {
                        text[i] = "";
                        link[i] = data[i][key[2]];
                        for (j = 0; j < key.length; j++) {
                            value = key[j];
                            console.log(data[i][value]);
                            text[i] += "<font color=#323232><b>" + value + ": </b>" + data[i][value] + "</font><br>";
                        }
                    }

                    for (i = 0; i < count; i++) {
                        buttons[i] = {
                            Columns: 6,
                            Rows: 3,
                            Text: text[i],
                            "ActionType": "open-url",
                            "ActionBody": link[i],
                            "TextSize": "large",
                            "TextVAlign": "middle",
                            "TextHAlign": "middle"
                        };
                    }

                    var options1 = {
                        method: 'POST',
                        url: 'https://chatapi.viber.com/pa/send_message',
                        headers: headerBody,
                        body: {
                            receiver: req.body.sender.id,
                            min_api_version: 2,
                            type: 'rich_media',
                            rich_media: {
                                Type: "rich_media",
                                ButtonsGroupColumns: 6,
                                ButtonsGroupRows: 6,
                                BgColor: "#FFFFFF",
                                Buttons: buttons
                            }
                        },
                        json: true
                    };

                    request(options1, function(error, res, body) {
                        if (error) throw new Error(error);
                        console.log(body);
                    });
                } else if (type.length == 2 && type[1].type == "rss"){
    				var data = (JSON.parse(body1)).answers[0].data;
    				var columns = type[1];
    				var key = Object.keys(columns);
    				var msg = [];
    				console.log(key);

    	            msg = (JSON.parse(body1)).answers[0].actions[0].expression;

    	            var options = {
    	                method: 'POST',
    	                url: 'https://chatapi.viber.com/pa/send_message',
    	                headers: headerBody,
    	                body: {
    	                    receiver: req.body.sender.id,
    	                    min_api_version: 1,
    	                    tracking_data: 'tracking data',
    	                    type: 'text',
    	                    text: msg
    	                },
    	                json: true
    	            };

    	            // request to the chat api of viber.
    	            request(options, function(error, res, body) {
    	                if (error) throw new Error(error);
    	                console.log(body);
    	            	for (var i = 1; i < 4; i++) {
    	                	msg = "";
    	                    msg = key[1].toUpperCase() + ": " + data[i][key[1]] + "\n" + key[2].toUpperCase() + ": " + data[i][key[2]] + "\n" + key[3].toUpperCase() + ": " + data[i][key[3]];
    	                    console.log(msg);
    	                    var options = {
    	                        method: 'POST',
    	                        url: 'https://chatapi.viber.com/pa/send_message',
    	                        headers: headerBody,
    	                        body: {
    	                            receiver: req.body.sender.id,
    	                            min_api_version: 1,
    	                            tracking_data: 'tracking data',
    	                            type: 'text',
    	                            text: msg
    	                        },
    	                        json: true
    	                    };

    	                    // request to the chat api of viber.
    	                    request(options, function(error, res, body) {
    	                        if (error) throw new Error(error);
    	                        console.log(body);
    	                    });

    	                }    
    	            });
                } else if(link.indexOf(message) <= -1) {

                    var options = {
                        method: 'POST',
                        url: 'https://chatapi.viber.com/pa/send_message',
                        headers: headerBody,
                        body: {
                            receiver: req.body.sender.id,
                            min_api_version: 1,
                            tracking_data: 'tracking data',
                            type: 'text',
                            text: ans
                        },
                        json: true
                    };
                    // request to the chat api of viber.
                    request(options, function(error, res, body) {
                        if (error) throw new Error(error);
                        console.log(body);
                    });
                }
              });
            }
    }

    // When user opens 1-on-1 chat with Susi public account
    else if (req.body.event === 'conversation_started') {
        // Welcome Message
        var request = require("request");
        var options = {
            method: 'POST',
            url: 'https://chatapi.viber.com/pa/send_message',
            headers: headerBody,
            body: {
                receiver: req.body.user.id,
                min_api_version: 4,
                tracking_data: 'tracking data',
                type: 'text',
                text: 'Welcome to EO Viber Chatbot. Your most trusted vision care in the Philippines is very excited to serve your optical needs.',
                keyboard: {
                    "Type": "keyboard",
                    "DefaultHeight": true,
                    "InputFieldState": "hidden",
                    "Buttons": [{
                        "ActionType": "reply",
                        "ActionBody": "Get started",
                        "Text": "<font color=\"#494E67\">Get started</font>",
                        "BgColor": "#f7bb3f",
                        "TextSize": "large"
                    }]
                }
            },
            json: true
        };

        request(options, function(error, res, body) {
            if (error) throw new Error(error);
            console.log(body);
        });
    }
    response.end();
});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
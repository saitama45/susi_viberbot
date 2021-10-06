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
    response.write("To chat with EO Bot through Viber, visit this link and click - viber://pa?chatURI=EOSAMP\n\n");
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

function MainMenu() {
    var buttons = [{
        Columns: 3,
        Rows: 2,
        BgColor: "#87CEFA",
        Text: "<b>Branches</b>",
        "ActionType": "reply",
        "ActionBody": "Branches",
        "TextSize": "large",
        "TextVAlign": "middle",
        "TextHAlign": "middle"
    },{
        Columns: 3,
        Rows: 2,
        BgColor: "#87CEFA",
        Text: "<b>Products</b>",
        "ActionType": "reply",
        "ActionBody": "Products",
        "TextSize": "large",
        "TextVAlign": "middle",
        "TextHAlign": "middle"
    },{
        Columns: 3,
        Rows: 2,
        BgColor: "#87CEFA",
        Text: "<b>Services</b>",
        "ActionType": "reply",
        "ActionBody": "Services",
        "TextSize": "large",
        "TextVAlign": "middle",
        "TextHAlign": "middle"
    },{
        Columns: 3,
        Rows: 2,
        Silent: true,
        BgColor: "#87CEFA",
        Text: "<b>Contact Us</b>",
        "ActionType": "open-url",
        "ActionBody": "http://www.executiveoptical.com/ContactUs",
        "TextSize": "large",
        "TextVAlign": "middle",
        "TextHAlign": "middle"
    }];

    return buttons;
}

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


            var buttons = [
            {
                Columns: 3,
                Rows: 1,
                BgColor: "#87CEFA",
                Text: "<b>I Agree</b>",
                "ActionType": "reply",
                "ActionBody": "I Agree",
                "TextSize": "large",
                "TextVAlign": "middle",
                "TextHAlign": "middle"
            },
            {
                Columns: 3,
                Rows: 1,
                BgColor: "#87CEFA",
                Silent: true,
                Text: "<b>Terms of Use</b>",
                "ActionType": "open-url",
                "ActionBody": "https://about.powermaccenter.com/privacy-policy/",
                "TextSize": "large",
                "TextVAlign": "middle",
                "TextHAlign": "middle"
            },            
            ];

            var options = {
                method: 'POST',
                url: 'https://chatapi.viber.com/pa/send_message',
                headers: headerBody,
                body: {
                    receiver: req.body.sender.id,
                    min_api_version: 7,
                    tracking_data: 'tracking data',
                    type: 'text',
                    text: 'Hi ' + req.body.sender.name + '! Thank you for getting started to chat with us. Please tap "I Agree" to continue.',
                    keyboard: {
                        "Type": "keyboard",
                        "DefaultHeight": true,
                        "InputFieldState": "hidden",                        
                        "Buttons": buttons
                    }
                },
                json: true
            };

            // request to the chat api of viber.
            request(options, function(error, res, body) {
                if (error) throw new Error(error);                    
                console.log(body);
            });            
        }

        else if(message === "I Agree"){

            MainMenu();

            var options = {
                method: 'POST',
                url: 'https://chatapi.viber.com/pa/send_message',
                headers: headerBody,
                body: {
                    receiver: req.body.sender.id,
                    min_api_version: 7,
                    tracking_data: 'tracking data',
                    type: 'text',
                    text: 'How can we help you? You may choose from the options below to continue.',
                    keyboard: {
                        "Type": "keyboard",
                        "DefaultHeight": true,
                        "InputFieldState": "hidden",                        
                        "Buttons": MainMenu()
                    }
                },
                json: true
            };

            // request to the chat api of viber.
            request(options, function(error, res, body) {
                if (error) throw new Error(error);                    
                console.log(body);
            });
            
        }

        else if(message === "Branches"){

            var options1 = {
                method: 'POST',
                url: 'https://chatapi.viber.com/pa/send_message',
                headers: headerBody,
                body: {
                    receiver: req.body.sender.id,
                    min_api_version: 7,
                    tracking_data: 'tracking data',
                    type: 'text',
                    text: 'Select the City you wish to check so that I can send the list of stores we have in that area.',                        
                },
                json: true
            };

            // request to the chat api of viber.
            request(options1, function(error1, res1, body1) {
                if (error1) throw new Error(error1);                    
                var buttons = [
                    {
                        Columns: 6,
                        Rows: 1,
                        BgColor: "#87CEFA",
                        Text: "<font color=#323232><b>Metro Manila</b></font>", 
                        "ActionType":"reply",                       
                        "ActionBody": "Metro Manila",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 1,
                        BgColor: "#87CEFA",
                        Text: "<font color=#323232><b>Pasig City</b></font>", 
                        "ActionType":"reply",                       
                        "ActionBody": "Pasig",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 1,
                        BgColor: "#87CEFA",
                        Text: "<font color=#323232><b>Baguio City</b></font>", 
                        "ActionType":"reply",                       
                        "ActionBody": "Baguio",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 1,
                        BgColor: "#87CEFA",
                        Text: "<font color=#323232><b>Cebu City</b></font>", 
                        "ActionType":"reply",                       
                        "ActionBody": "Cebu",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 1,
                        BgColor: "#87CEFA",
                        Text: "<font color=#323232><b>Negros Occidental</b></font>", 
                        "ActionType":"reply",                       
                        "ActionBody": "Negros Occidental",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },
                    {
                        Columns: 6,
                        Rows: 1,
                        BgColor: "#87CEFA",
                        Text: "<b>Quezon City</b>", 
                        "ActionType":"reply",                       
                        "ActionBody": "Quezon",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    }
                    ];
    
                var options = {
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
                            ButtonsGroupRows: 2,
                            BgColor: "#FFFFFF",
                            Buttons: buttons
                        }                    
                    },
                    json: true
                };
    
                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);                    
                       
                    var buttons2 = [{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Branches</b>",
                        "ActionType": "reply",
                        "ActionBody": "Branches",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Products</b>",
                        "ActionType": "reply",
                        "ActionBody": "Products",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Services</b>",
                        "ActionType": "reply",
                        "ActionBody": "Services",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        Silent: true,
                        BgColor: "#87CEFA",
                        Text: "<b>Contact Us</b>",
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
                            min_api_version: 7,
                            tracking_data: 'tracking data',                              
                            keyboard: {
                                "Type": "keyboard",
                                "DefaultHeight": true,
                                "InputFieldState": "hidden",                        
                                "Buttons": buttons2
                            }
                        },
                        json: true
                    };
        
                    // request to the chat api of viber.
                    request(options2, function(error2, res2, body2) {
                        if (error2) throw new Error(error2);                    
                        console.log(body);                     
                    });
                });                     
            });            
                                              
        }
        
        else if(message === "Manila" || message === "manila" || message === "metro manila" || message === "Metro Manila" || message === "metro Manila" || message === "Metro manila"){
            
            var options1 = {
                method: 'POST',
                url: 'https://chatapi.viber.com/pa/send_message',
                headers: headerBody,
                body: {
                    receiver: req.body.sender.id,
                    min_api_version: 7,
                    tracking_data: 'tracking data',
                    type: 'text',
                    text: 'Here are the list of Stores we have in ' + message + ':',
                },
                json: true
            };

            // request to the chat api of viber.
            request(options1, function(error1, res1, body1) {
                if (error1) throw new Error(error1);                    
                var buttons = [
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
    
                var options = {
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
    
                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);                    
                       
                    var buttons2 = [
                    {
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Branches</b>",
                        "ActionType": "reply",
                        "ActionBody": "Branches",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Products</b>",
                        "ActionType": "reply",
                        "ActionBody": "Products",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Services</b>",
                        "ActionType": "reply",
                        "ActionBody": "Services",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        Silent: true,
                        BgColor: "#87CEFA",
                        Text: "<b>Contact Us</b>",
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
                            min_api_version: 7,
                            tracking_data: 'tracking data',                              
                            keyboard: {
                                "Type": "keyboard",
                                "DefaultHeight": true,
                                "InputFieldState": "hidden",                        
                                "Buttons": buttons2
                            }
                        },
                        json: true
                    };
        
                    // request to the chat api of viber.
                    request(options2, function(error2, res2, body2) {
                        if (error2) throw new Error(error2);                    
                        console.log(body);                     
                    });
                });                     
            });
                        
        }

        else if(message === "See More Manila"){

            var options1 = {
                method: 'POST',
                url: 'https://chatapi.viber.com/pa/send_message',
                headers: headerBody,
                body: {
                    receiver: req.body.sender.id,
                    min_api_version: 7,
                    tracking_data: 'tracking data',
                    type: 'text',
                    text: 'More Lists:',
                },
                json: true
            };

            // request to the chat api of viber.
            request(options1, function(error1, res1, body1) {
                if (error1) throw new Error(error1);                    
                var buttons = [
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
    
                var options = {
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
    
                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);                    
                       
                    var buttons2 = [
                    {
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Branches</b>",
                        "ActionType": "reply",
                        "ActionBody": "Branches",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Products</b>",
                        "ActionType": "reply",
                        "ActionBody": "Products",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Services</b>",
                        "ActionType": "reply",
                        "ActionBody": "Services",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        Silent: true,
                        BgColor: "#87CEFA",
                        Text: "<b>Contact Us</b>",
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
                            min_api_version: 7,
                            tracking_data: 'tracking data',                              
                            keyboard: {
                                "Type": "keyboard",
                                "DefaultHeight": true,
                                "InputFieldState": "hidden",                        
                                "Buttons": buttons2
                            }
                        },
                        json: true
                    };
        
                    // request to the chat api of viber.
                    request(options2, function(error2, res2, body2) {
                        if (error2) throw new Error(error2);                    
                        console.log(body);                     
                    });
                });                     
            });             
        }

        else if(message === "See More Manila 2"){
            
            var options1 = {
                method: 'POST',
                url: 'https://chatapi.viber.com/pa/send_message',
                headers: headerBody,
                body: {
                    receiver: req.body.sender.id,
                    min_api_version: 7,
                    tracking_data: 'tracking data',
                    type: 'text',
                    text: 'More Lists:',
                },
                json: true
            };

            // request to the chat api of viber.
            request(options1, function(error1, res1, body1) {
                if (error1) throw new Error(error1);                    
                var buttons = [
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
    
                var options = {
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
    
                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);                    
                       
                    var buttons2 = [
                    {
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Branches</b>",
                        "ActionType": "reply",
                        "ActionBody": "Branches",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Products</b>",
                        "ActionType": "reply",
                        "ActionBody": "Products",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Services</b>",
                        "ActionType": "reply",
                        "ActionBody": "Services",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        Silent: true,
                        BgColor: "#87CEFA",
                        Text: "<b>Contact Us</b>",
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
                            min_api_version: 7,
                            tracking_data: 'tracking data',                              
                            keyboard: {
                                "Type": "keyboard",
                                "DefaultHeight": true,
                                "InputFieldState": "hidden",                        
                                "Buttons": buttons2
                            }
                        },
                        json: true
                    };
        
                    // request to the chat api of viber.
                    request(options2, function(error2, res2, body2) {
                        if (error2) throw new Error(error2);                    
                        console.log(body);                     
                    });
                });                     
            });             
        }

        else if(message === "Pasig" || message === "pasig" || message === "pasig city" || message === "Pasig City" || message === "pasig City" || message === "Pasig city"){
            
            var options1 = {
                method: 'POST',
                url: 'https://chatapi.viber.com/pa/send_message',
                headers: headerBody,
                body: {
                    receiver: req.body.sender.id,
                    min_api_version: 7,
                    tracking_data: 'tracking data',
                    type: 'text',
                    text: 'Here are the list of Stores we have in ' + message + ':',
                },
                json: true
            };

            // request to the chat api of viber.
            request(options1, function(error1, res1, body1) {
                if (error1) throw new Error(error1);                    
                var buttons = [
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
    
                var options = {
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
    
                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);                    
                       
                    var buttons2 = [
                    {
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Branches</b>",
                        "ActionType": "reply",
                        "ActionBody": "Branches",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Products</b>",
                        "ActionType": "reply",
                        "ActionBody": "Products",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Services</b>",
                        "ActionType": "reply",
                        "ActionBody": "Services",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        Silent: true,
                        BgColor: "#87CEFA",
                        Text: "<b>Contact Us</b>",
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
                            min_api_version: 7,
                            tracking_data: 'tracking data',                              
                            keyboard: {
                                "Type": "keyboard",
                                "DefaultHeight": true,
                                "InputFieldState": "hidden",                        
                                "Buttons": buttons2
                            }
                        },
                        json: true
                    };
        
                    // request to the chat api of viber.
                    request(options2, function(error2, res2, body2) {
                        if (error2) throw new Error(error2);                    
                        console.log(body);                     
                    });
                });                     
            });            
        }

        else if(message === "Products" || message === "Product" || message === "products" || message === "product" || message === "PRODUCT" || message === "PRODUCTS"){

            var options1 = {
                method: 'POST',
                url: 'https://chatapi.viber.com/pa/send_message',
                headers: headerBody,
                body: {
                    receiver: req.body.sender.id,
                    min_api_version: 7,
                    tracking_data: 'tracking data',
                    type: 'text',
                    text: 'We have a special variety of products for you. You can choose what categories you may want to explore.',                        
                },
                json: true
            };

            // request to the chat api of viber.
            request(options1, function(error1, res1, body1) {
                if (error1) throw new Error(error1);                    
                var buttons = [
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
    
                var options = {
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
                            ButtonsGroupRows: 2,
                            BgColor: "#FFFFFF",
                            Buttons: buttons
                        }                    
                    },
                    json: true
                };
    
                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);                    
                       
                    var buttons2 = [{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Branches</b>",
                        "ActionType": "reply",
                        "ActionBody": "Branches",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Products</b>",
                        "ActionType": "reply",
                        "ActionBody": "Products",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Services</b>",
                        "ActionType": "reply",
                        "ActionBody": "Services",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        Silent: true,
                        BgColor: "#87CEFA",
                        Text: "<b>Contact Us</b>",
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
                            min_api_version: 7,
                            tracking_data: 'tracking data',                              
                            keyboard: {
                                "Type": "keyboard",
                                "DefaultHeight": true,
                                "InputFieldState": "hidden",                        
                                "Buttons": buttons2
                            }
                        },
                        json: true
                    };
        
                    // request to the chat api of viber.
                    request(options2, function(error2, res2, body2) {
                        if (error2) throw new Error(error2);                    
                        console.log(body);                     
                    });
                });                     
            });
                        
        }

        else if(message === "Contact Lens" || message === "contact lens" || message === "Contact lens" || message === "contact Lens" || message === "CONTACT LENS"){
            
            var options1 = {
                method: 'POST',
                url: 'https://chatapi.viber.com/pa/send_message',
                headers: headerBody,
                body: {
                    receiver: req.body.sender.id,
                    min_api_version: 7,
                    tracking_data: 'tracking data',
                    type: 'text',
                    text: 'Here are our ' + message + ' products for you to choose from:' 
                },
                json: true
            };

            // request to the chat api of viber.
            request(options1, function(error1, res1, body1) {
                if (error1) throw new Error(error1);                    
                var buttons = [
                    {
                    "Columns":6,
                    "Rows":3,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1743700000001/Contact%20Lens",
                    "Image":"http://www.executiveoptical.com/images/products/1743700000001.jpg"
                    },
                    {
                    "Columns":6,
                    "Rows":2,
                    Silent: true,
                    "Text":"<font color=#323232><b>FLEXWEAR COLORS</b></font><font color=#777777><br>1 PAIR COLORED CONTACT LENSES (BC: 8.6 , DIA: 14.00)</font>",
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1743700000001/Contact%20Lens",
                    "TextSize":"medium",
                    "TextVAlign":"middle",
                    "TextHAlign":"left"
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1743700000001/Contact%20Lens",
                    "Text":"<font color=#ffffff>More Details</font>",
                    "TextSize":"large",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle",                        
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1743700000001/Contact%20Lens",
                    "Text":"<font color=#8367db><b>Buy Now for P450.00</b></font>",
                    "TextSize":"small",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle"
                    },

                    {
                    "Columns":6,
                    "Rows":3,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1744600000126/Contact%20Lens",
                    "Image":"http://www.executiveoptical.com/images/products/1744600000126.jpg"
                    },
                    {
                    "Columns":6,
                    "Rows":2,
                    Silent: true,
                    "Text":"<font color=#323232><b>FLEXWEAR ENHANCE</b></font><font color=#777777><br>1 PAIR COLORED CONTACT LENSES (BC: 8.6 , DIA: 14.00)</font>",
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1744600000126/Contact%20Lens",
                    "TextSize":"medium",
                    "TextVAlign":"middle",
                    "TextHAlign":"left"
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1744600000126/Contact%20Lens",
                    "Text":"<font color=#ffffff>More Details</font>",
                    "TextSize":"large",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle",                        
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1744600000126/Contact%20Lens",
                    "Text":"<font color=#8367db><b>Buy Now for P480.00</b></font>",
                    "TextSize":"small",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle"
                    },  
                    
                    {
                    "Columns":6,
                    "Rows":3,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1744200000030/Contact%20Lens",
                    "Image":"http://www.executiveoptical.com/images/products/1744200000030.jpg"
                    },
                    {
                    "Columns":6,
                    "Rows":2,
                    Silent: true,
                    "Text":"<font color=#323232><b>FLEXWEAR ILLUSIONS</b></font><font color=#777777><br>1 PAIR COLORED CONTACT LENSES (BC: 8.6 , DIA: 14.00)</font>",
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1744200000030/Contact%20Lens",
                    "TextSize":"medium",
                    "TextVAlign":"middle",
                    "TextHAlign":"left"
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1744200000030/Contact%20Lens",
                    "Text":"<font color=#ffffff>More Details</font>",
                    "TextSize":"large",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle",                        
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1744200000030/Contact%20Lens",
                    "Text":"<font color=#8367db><b>Buy Now for P590.00</b></font>",
                    "TextSize":"small",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle"
                    },
                    
                    
                    {
                    "Columns":6,
                    "Rows":3,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1744700000078/Contact%20Lens",
                    "Image":"http://www.executiveoptical.com/images/products/1744700000078.jpg"
                    },
                    {
                    "Columns":6,
                    "Rows":2,
                    Silent: true,
                    "Text":"<font color=#323232><b>FLEXWEAR EMOTIONS</b></font><font color=#777777><br>1 PAIR COLORED CONTACT LENSES (BC: 8.6 , DIA: 14.00)</font>",
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1744700000078/Contact%20Lens",
                    "TextSize":"medium",
                    "TextVAlign":"middle",
                    "TextHAlign":"left"
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1744700000078/Contact%20Lens",
                    "Text":"<font color=#ffffff>More Details</font>",
                    "TextSize":"large",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle",                        
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1744700000078/Contact%20Lens",
                    "Text":"<font color=#8367db><b>Buy Now for P630.00</b></font>",
                    "TextSize":"small",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle"
                    },

                    {
                    "Columns":6,
                    "Rows":3,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1742000000123/Contact%20Lens",
                    "Image":"http://www.executiveoptical.com/images/products/1742000000123.jpg"
                    },
                    {
                    "Columns":6,
                    "Rows":2,
                    Silent: true,
                    "Text":"<font color=#323232><b>FLEXWEAR VISION</b></font><font color=#777777><br>3 PAIRS CLEAR CONTACT LENSES (BC: 8.6 , DIA: 14.2)</font>",
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1742000000123/Contact%20Lens",
                    "TextSize":"medium",
                    "TextVAlign":"middle",
                    "TextHAlign":"left"
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1742000000123/Contact%20Lens",
                    "Text":"<font color=#ffffff>More Details</font>",
                    "TextSize":"large",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle",                        
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1742000000123/Contact%20Lens",
                    "Text":"<font color=#8367db><b>Buy Now for P650.00</b></font>",
                    "TextSize":"small",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle"
                    },

                    {
                    "Columns":6,
                    "Rows":3,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1723190000001/Contact%20Lens",
                    "Image":"http://www.executiveoptical.com/images/products/1723190000001.jpg"
                    },
                    {
                    "Columns":6,
                    "Rows":2,
                    Silent: true,
                    "Text":"<font color=#323232><b>FLEXWEAR ADORE</b></font><font color=#777777><br>1 PAIR COLORED CONTACT LENSES (BC: 8.8 , DIA: 16.00)</font>",
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1723190000001/Contact%20Lens",
                    "TextSize":"medium",
                    "TextVAlign":"middle",
                    "TextHAlign":"left"
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1723190000001/Contact%20Lens",
                    "Text":"<font color=#ffffff>More Details</font>",
                    "TextSize":"large",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle",                        
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/1723190000001/Contact%20Lens",
                    "Text":"<font color=#8367db><b>Buy Now for P690.00</b></font>",
                    "TextSize":"small",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle"
                    },
                ];
    
                var options = {
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
    
                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);                    
                       
                    var buttons2 = [{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Branches</b>",
                        "ActionType": "reply",
                        "ActionBody": "Branches",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Products</b>",
                        "ActionType": "reply",
                        "ActionBody": "Products",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Services</b>",
                        "ActionType": "reply",
                        "ActionBody": "Services",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        Silent: true,
                        BgColor: "#87CEFA",
                        Text: "<b>Contact Us</b>",
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
                            min_api_version: 7,
                            tracking_data: 'tracking data',                              
                            keyboard: {
                                "Type": "keyboard",
                                "DefaultHeight": true,
                                "InputFieldState": "hidden",                        
                                "Buttons": buttons2
                            }
                        },
                        json: true
                    };
        
                    // request to the chat api of viber.
                    request(options2, function(error2, res2, body2) {
                        if (error2) throw new Error(error2);                    
                        console.log(body);                     
                    });
                });                     
            });
                        
        }

        else if(message === "Solutions" || message === "Solution" || message === "solutions" || message === "solution" || message === "SOLUTIONS" || message === "SOLUTION"){
            
            var options1 = {
                method: 'POST',
                url: 'https://chatapi.viber.com/pa/send_message',
                headers: headerBody,
                body: {
                    receiver: req.body.sender.id,
                    min_api_version: 7,
                    tracking_data: 'tracking data',
                    type: 'text',
                    text: 'Here are our ' + message + ' products for you to choose from:' 
                },
                json: true
            };

            // request to the chat api of viber.
            request(options1, function(error1, res1, body1) {
                if (error1) throw new Error(error1);                    
                var buttons = [
                    {
                    "Columns":6,
                    "Rows":3,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0800800000002/Solutions",
                    "Image":"http://www.executiveoptical.com/images/products/0800800000002.jpg"
                    },
                    {
                    "Columns":6,
                    "Rows":2,
                    Silent: true,
                    "Text":"<font color=#323232><b>EO NEO PLUS SOLUTION</b></font><font color=#777777><br>Multi-Purpose Solution with FREE CL Case</font>",
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0800800000002/Solutions",
                    "TextSize":"medium",
                    "TextVAlign":"middle",
                    "TextHAlign":"left"
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0800800000002/Solutions",
                    "Text":"<font color=#ffffff>More Details</font>",
                    "TextSize":"large",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle",                        
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0800800000002/Solutions",
                    "Text":"<font color=#8367db><b>Buy Now for P99.00</b></font>",
                    "TextSize":"small",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle"
                    },

                    {
                    "Columns":6,
                    "Rows":3,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0823290000002/Solutions",
                    "Image":"http://www.executiveoptical.com/images/products/0823290000002.jpg"
                    },
                    {
                    "Columns":6,
                    "Rows":2,
                    Silent: true,
                    "Text":"<font color=#323232><b>EO FLEXWEAR SOLUTION</b></font><font color=#777777><br>All-in-1 Solution with FREE CL Case</font>",
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0823290000002/Solutions",
                    "TextSize":"medium",
                    "TextVAlign":"middle",
                    "TextHAlign":"left"
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0823290000002/Solutions",
                    "Text":"<font color=#ffffff>More Details</font>",
                    "TextSize":"large",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle",                        
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0823290000002/Solutions",
                    "Text":"<font color=#8367db><b>Buy Now for P99.00</b></font>",
                    "TextSize":"small",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle"
                    },  
                    
                    {
                    "Columns":6,
                    "Rows":3,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0829640000007/Solutions",
                    "Image":"http://www.executiveoptical.com/images/products/0829640000007.jpg"
                    },
                    {
                    "Columns":6,
                    "Rows":2,
                    Silent: true,
                    "Text":"<font color=#323232><b>EO VISUALITIES LUBRICATING EYE DROPS</b></font><font color=#777777><br>Artificial Tears Formula</font>",
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0829640000007/Solutions",
                    "TextSize":"medium",
                    "TextVAlign":"middle",
                    "TextHAlign":"left"
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0829640000007/Solutions",
                    "Text":"<font color=#ffffff>More Details</font>",
                    "TextSize":"large",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle",                        
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0829640000007/Solutions",
                    "Text":"<font color=#8367db><b>Buy Now for P135.00</b></font>",
                    "TextSize":"small",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle"
                    },
                    
                    
                    {
                    "Columns":6,
                    "Rows":3,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/4809011752023/Solutions",
                    "Image":"http://www.executiveoptical.com/images/products/4809011752023.jpg"
                    },
                    {
                    "Columns":6,
                    "Rows":2,
                    Silent: true,
                    "Text":"<font color=#323232><b>EO LENSCARE</b></font><font color=#777777><br>Multi-Purpose Solution</font>",
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/4809011752023/Solutions",
                    "TextSize":"medium",
                    "TextVAlign":"middle",
                    "TextHAlign":"left"
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/4809011752023/Solutions",
                    "Text":"<font color=#ffffff>More Details</font>",
                    "TextSize":"large",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle",                        
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/4809011752023/Solutions",
                    "Text":"<font color=#8367db><b>Buy Now for P135.00</b></font>",
                    "TextSize":"small",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle"
                    },

                    {
                    "Columns":6,
                    "Rows":3,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0829640000005/Solutions",
                    "Image":"http://www.executiveoptical.com/images/products/0829640000005.jpg"
                    },
                    {
                    "Columns":6,
                    "Rows":2,
                    Silent: true,
                    "Text":"<font color=#323232><b>EO VISUALITIES MPS AIO ARTIFICIAL TEARS FORMULA</b></font><font color=#777777><br>Multi-Purpose Solution with FREE CL Case</font>",
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0829640000005/Solutions",
                    "TextSize":"medium",
                    "TextVAlign":"middle",
                    "TextHAlign":"left"
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0829640000005/Solutions",
                    "Text":"<font color=#ffffff>More Details</font>",
                    "TextSize":"large",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle",                        
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0829640000005/Solutions",
                    "Text":"<font color=#8367db><b>Buy Now for P195.00</b></font>",
                    "TextSize":"small",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle"
                    },

                    {
                    "Columns":6,
                    "Rows":3,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0800800000001/Solutions",
                    "Image":"http://www.executiveoptical.com/images/products/0800800000001.jpg"
                    },
                    {
                    "Columns":6,
                    "Rows":2,
                    Silent: true,
                    "Text":"<font color=#323232><b>NEO NEO PLUS SOLUTION</b></font><font color=#777777><br>Multi-Purpose Solution with FREE CL Case</font>",
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0800800000001/Solutions",
                    "TextSize":"medium",
                    "TextVAlign":"middle",
                    "TextHAlign":"left"
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0800800000001/Solutions",
                    "Text":"<font color=#ffffff>More Details</font>",
                    "TextSize":"large",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle",                        
                    },
                    {
                    "Columns":6,
                    "Rows":1,
                    Silent: true,
                    "ActionType":"open-url",
                    "ActionBody":"http://www.executiveoptical.com/Product/Select/0800800000001/Solutions",
                    "Text":"<font color=#8367db><b>Buy Now for P199.00</b></font>",
                    "TextSize":"small",
                    "TextVAlign":"middle",
                    "TextHAlign":"middle"
                    },
                ];
    
                var options = {
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
    
                // request to the chat api of viber.
                request(options, function(error, res, body) {
                    if (error) throw new Error(error);                    
                       
                    var buttons2 = [{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Branches</b>",
                        "ActionType": "reply",
                        "ActionBody": "Branches",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Products</b>",
                        "ActionType": "reply",
                        "ActionBody": "Products",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        BgColor: "#87CEFA",
                        Text: "<b>Services</b>",
                        "ActionType": "reply",
                        "ActionBody": "Services",
                        "TextSize": "large",
                        "TextVAlign": "middle",
                        "TextHAlign": "middle"
                    },{
                        Columns: 3,
                        Rows: 2,
                        Silent: true,
                        BgColor: "#87CEFA",
                        Text: "<b>Contact Us</b>",
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
                            min_api_version: 7,
                            tracking_data: 'tracking data',                              
                            keyboard: {
                                "Type": "keyboard",
                                "DefaultHeight": true,
                                "InputFieldState": "hidden",                        
                                "Buttons": buttons2
                            }
                        },
                        json: true
                    };
        
                    // request to the chat api of viber.
                    request(options2, function(error2, res2, body2) {
                        if (error2) throw new Error(error2);                    
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
/**
 * Created by richardbrash on 12/16/14.
 */

function HostedAPILib(config){

    var self = this;
    self.config = config;
    self.token = "1234.567890";

    self.isTokenValid = function(){

    };

    self.getToken = function(username, password, callback){

        $.get(self.config.endpoint + "/account/token/" + self.config.clientid + "?username="+username+"&password="+password, function(result){
            self.token = result;
            callback(result);
        })

    };

    self.authenticatedAjax = function(payload){

        payload.headers = {
            'x-access-token': self.token.token
        }

        $.ajax(payload);
    };

    self.callinfusionsoftapi = function(method, params, callback){

        $.ajax
        ({
            type: "POST",
            url: self.config.endpoint + "/infusionsoft/api/" + method,
            'processData': false,
            'contentType': 'application/json',
            data: JSON.stringify(params),
            async: false,
            headers: {
                'x-access-token': self.token.token
            },
            success: function(data){
                callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
                callback({success:false, data:{}, error: errorThrown})
            }
        });


    };




    //  Load the needed libraries
    //rbm_loadjscssfile("http://localhost:3000/stylesheets/bootstrap/bootstrap.min.css", "css");
    //rbm_loadjscssfile("http://localhost:3000/stylesheets/hostedapilib.css", "css");
    //rbm_loadjscssfile("http://localhost:3000/javascripts/bootstrap/bootstrap.min.js", "js");

};


function rbm_loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function rbm_pop() {

    var self = this;
    self.square = null;
    self.overdiv = null;

    self.popOut = function(msgtxt) {
        //filter:alpha(opacity=25);-moz-opacity:.25;opacity:.25;
        self.overdiv = document.createElement("div");
        self.overdiv.className = "overdiv";

        self.horizon = document.createElement("div");
        self.horizon.className = "horizon";

        self.content = document.createElement("div");
        self.content.className = "content";

        var msg = document.createElement("div");
        msg.className = "bodytext";
        msg.innerHTML = msgtxt;

        var closebtn = document.createElement("a");
        closebtn.className = "boxclose";

        closebtn.onclick = function() {


            if (self.horizon != null) {
                document.body.removeChild(self.horizon);
                self.horizon = null;
            }
            if (self.overdiv != null) {
                document.body.removeChild(self.overdiv);
                self.overdiv = null;
            }
        }

        self.content.appendChild(closebtn);

        self.content.appendChild(msg);

        self.horizon.appendChild(self.content);

        document.body.appendChild(self.overdiv);
        document.body.appendChild(self.horizon);
    };

}

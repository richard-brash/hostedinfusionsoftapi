/**
 * Created by richardbrash on 12/16/14.
 */

function AppViewModel() {
    var self = this;

    self.api = new HostedAPILib({clientid:"54a2f312f97d60e206e9c3bf", endpoint:"http://localhost:3000"});
    self.token = ko.observable();
    self.username = ko.observable();
    self.password = ko.observable();

    self.addUser = function(){
        self.users.push(new User({}));
    };

    self.getToken = function(){
        self.api.getToken(self.username(), self.password(), function(result){
            console.log(result);
            self.token(result.token);
        });
    };

    self.testButton = function(){

        self.api.callinfusionsoftapi("ContactService.load", [843, ["FirstName", "LastName", "Email"]], function(data){
            console.log(data);
        });

    };
};


// Activates knockout.js
ko.applyBindings(new AppViewModel());
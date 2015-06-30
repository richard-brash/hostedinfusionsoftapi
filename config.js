/**
 * Created by richardbrash on 11/29/14.
 */

function Config(){
    var self = this;
    self.AppName = "my122";
    self.ApiKey = "66c916b3ded3536b71d3e9c5e61cf30b";
    self.UserId = 1;

    self.infusionsoftConfigs = [
        {
            name:"TSP",
            AppName:"cj105",
            ApiKey:"e33781ad49e3c4934b5fb59b355f3821",
            UserId:1,
            ApiToken:"ThisIsMYS3cr3tP@ssw0rd"
        }
    ];

    self.ISConfig = function(appName){
        var config = null;

        for(var key in self.infusionsoftConfigs){
            if(self.infusionsoftConfigs[key].AppName == appName){
                config = self.infusionsoftConfigs[key];
            }
        }

        return config;
    }




};



module.exports = new Config();
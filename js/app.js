$(document).ready(function() {
                        
    var app = {
        apiURL : "http://api.openweathermap.org/data/2.5/find?",
        apiImageURL : "http://openweathermap.org/img/w/%s.png",
        weatherData : {},
        coords : {},
        elementsToRender : { 
        },
        init : function() {
            this.activeDOM = this.cacheDOM();
            
            // bind click handler to Check it button
            this.activeDOM.$checkItButton.on("click", this.grabData.bind(this));
            
            // if (navigator.geolocation !== undefined) {
            //     navigator.geolocation.watchPosition(function(position) {
            //         this.coords.latitude = position.coords.latitude;
            //         this.coords.longitude = position.coords.longitude;
            //         // SUPPORT GEOLACTION
            //         //this.grabData(this.coords);
            //         //console.log(this.coords);
            //     }.bind(this));
            //   
            //}
        },
        resolveLocation : function(coordinates) {
            
        },
        cacheDOM : function() {
            var $locationInput = $("#location-input");
            var $checkItButton = $("#check-it");
            var $weatherStats = $("#weather-stats");
            var $weatherDesc = $("#weather-desc");
            var $body = $("body");
             
            return {
                $locationInput : $locationInput,
                $checkItButton : $checkItButton,
                $weatherStats : $weatherStats,
                $weatherDesc : $weatherDesc,
                $body : $body
            }
        },
        grabData : function(coordinates) {
          var self = this;
          var url = self.apiURL;
          var tempFormatVal = $("input[name='temp-format']:checked").val();
          //console.log(coordinates);
          if (!coordinates) {
              url = url + "lat=" + coordinates.latitude + "&lon=" + coordinates.longitude;
          } else {
              var locationInputData = self.activeDOM.$locationInput.val();
               if (locationInputData.length > 0) {
                    if (tempFormatVal === "°F")
                        url = url + "q=" + locationInputData + "&units=imperial";
                    else if (tempFormatVal === "°C") {
                        url = url + "q=" + locationInputData + "&units=metric";
                    }
                    console.log(url);
                   $.getJSON(url).done(function(data) {
                        if (data.cod !== "404") {
                            self.weatherData.temp = data.list[0].main.temp;
                            self.weatherData.max_temp = data.list[0].main.temp_max;
                            self.weatherData.min_temp = data.list[0].main.temp_min;
                            self.weatherData.weather = data.list[0].weather;
                            self.renderData();
                        } else {
                            console.log(data.message);
                        }
                    });
                } else {
                    console.log("Missing location");
                }
            }
        },
        renderData : function() {
            var self = this; 
            var $weatherStats = self.activeDOM.$weatherStats;
            var $weatherDesc = self.activeDOM.$weatherDesc;
            var $weatherStatsList = $weatherStats.find("#weather-stats-list");
            var $weatherDescRow = $weatherDesc.find(".container-fluid .row");
            var tempFormatVal = $("input[name='temp-format']:checked").val();
            
            var weatherMainHTML = "<ul id='weather-stats-list'><li id='temp'></li><li id='max-temp'</li>" + 
                        "<li id='min-temp'></li></ul>";
    
            var weatherRowHTML = "<div class='row'><div class='col-xs-4' id='weather-icon%s'><img></div>" +
                         "<div class='col-xs-4 weather-head' id='weather-head%s'><p></p></div><div class='col-xs-4 weather-description' id='desc%s'><p></p>"+
                         "</div></div>";
            
            function addStats($weatherMain, tempFormatVal) {
                $weatherMain.find("#temp").html("<span class='bold'>Temperature:</span> " + self.weatherData.temp + " " + tempFormatVal);
                $weatherMain.find("#max-temp").html("<span class='bold'>Max. Temperature:</span> " + self.weatherData.max_temp + " " + tempFormatVal);
                $weatherMain.find("#min-temp").html("<span class='bold'>Min. Temperature:</span> " + self.weatherData.min_temp + " " + tempFormatVal);
            }
            
            function addWeather($weatherDesc) {
                self.weatherData.weather.forEach(function(elem, index) {
                    $weatherDesc.find(".container-fluid").append(weatherRowHTML.replace(/%s/g, index));
                    var $currentWeatherHead = $weatherDesc.find("#weather-head" + index + " p");
                    var $currentWeatherDescription = $weatherDesc.find("#desc" + index + " p");
                    var $currentWeatherIcon = $weatherDesc.find("#weather-icon" + index + " img");
                    $currentWeatherHead.text(elem.main);
                    $currentWeatherDescription.text(elem.description);
                    $currentWeatherIcon.attr("src", self.apiImageURL.replace("%s", elem.icon));
                });
            }
            
            // render temperature
            if ($weatherStatsList.length === 0) {
                $weatherStats.append(weatherMainHTML);
                $weatherStatsList = $weatherStats.find("#weather-stats-list");
                if (tempFormatVal === "°F") {
                    addStats($weatherStatsList, tempFormatVal);
                } else if (tempFormatVal === "°C") {
                    addStats($weatherStatsList, tempFormatVal);
                }
            } else {
                if (tempFormatVal === "°F") {
                    addStats($weatherStatsList, tempFormatVal);
                } else if (tempFormatVal === "°C") {
                    addStats($weatherStatsList, tempFormatVal);
                }
            }
            
            // render weather
            if ($weatherDescRow.length === 0) {
                addWeather($weatherDesc);
            } else {
                $weatherDescRow.remove();
                addWeather($weatherDesc);
            }
            
            // adjust background - based on first weather listed
            console.log(self.weatherData.weather[0].main);
            var primaryWeatherCondition = self.weatherData.weather[0].main;
            if (primaryWeatherCondition === "Rain") {
                self.activeDOM.$body.css({"background" : "url('img/rain.jpg') no-repeat center center fixed", "background-size" : "cover"});
            } else if (primaryWeatherCondition === "Clouds") {
                self.activeDOM.$body.css({"background" : "url('img/clouds.jpg') no-repeat center center fixed", "background-size" : "cover"});
            } else if (primaryWeatherCondition === "Mist" || primaryWeatherCondition === "Haze" || primaryWeatherCondition === "Fog")  {
                self.activeDOM.$body.css({"background" : "url('img/misty.jpg') no-repeat center center fixed", "background-size" : "cover"});
            } else if (primaryWeatherCondition === "Snow") {
                self.activeDOM.$body.css({"background" : "url('img/snowy.jpg') no-repeat center center fixed", "background-size" : "cover"});
            } else if (primaryWeatherCondition === "Clear") {
                self.activeDOM.$body.css({"background" : "url('img/clear.jpg') no-repeat center center fixed", "background-size" : "cover"});
            } else {
                self.activeDOM.$body.css({"background" : "#A0A0A0", "background-size" : "cover"});
            }
        }
    };
    
    app.init();
});
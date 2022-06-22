const request = require('request');

const fetchMyIP = (callback) => {
 request(`https://api.ipify.org?format=json`, (error, response, body) => {
 
  if (error) {
   return callback(error, null);
  }

  if (response.statusCode !== 200) {
   callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
   return;
  }
 
  const ip = JSON.parse(body).ip;
  callback(null, ip);
 });
}

const fetchCoordsByIP = (ip, callback) => {
 request(`https://api.ipbase.com/v2/info?apikey=nABaPZLhCzgH3dYh2K9WRfwDHp3PQV9L3lOOpDPE&ip=${ip}`, (error, response, body) => {

  if (error) {
   return callback(error, null);
  }

  if (response.statusCode !== 200) {
   callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${ip}`), null);
   return;
  }

  const { latitude, longitude } = JSON.parse(body).data.location;

  callback(null, { latitude, longitude });
});
}

const fetchISSFlyOverTimes = function(coordinates, callback) {
const url = (`https://iss-pass.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`)

request(url, (error, response, body) => {

  if (error) {
   callback(error, null);
    return;
  }
  if (response.statusCode !== 200) {
    callback(Error(`Status Code ${response.statusCode} when fetching times for ISS fly over: ${body}`), null);
    return;
   }

  const passTimes = JSON.parse(body).response;
  callback(null, passTimes)

})

};

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, passTimes);
      });
    });
  });      
};

module.exports = { nextISSTimesForMyLocation };
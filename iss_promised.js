const request = require('request-promise-native');

const fetchMyIP = () => {
 return request(`https://api.ipify.org?format=json`);
 
 }  
 const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`https://api.ipbase.com/v2/info?apikey=nABaPZLhCzgH3dYh2K9WRfwDHp3PQV9L3lOOpDPE&ip=${ip}`)
 };

 const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body).data.location;
  return request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`)
 }


 const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((data) => {
   const { response } = JSON.parse(data);
   return response;
  });
 };

 module.exports = { nextISSTimesForMyLocation }
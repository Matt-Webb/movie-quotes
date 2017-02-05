
import request from 'request';

class Movies {

    constructor() {
      this.apiKey = "rB7hQRo2Z2msh4azTtDBcyVIPVcIp1FgqyPjsnsyrIbR7NHcMs";
      this.url = "https://andruxnet-random-famous-quotes.p.mashape.com";
    }

    getQuote() {
        return new Promise((resolve, reject) => {
          request({
              url: this.url,
              qs: {cat: 'movies'},
              method: 'POST',
              headers: {
                  "X-Mashape-Key": this.apiKey,
                  "Content-Type": "application/x-www-form-urlencoded",
                  "Accept": "application/json"
              }
          }, function(error, response, quote){
              if(error) return reject(new Error(error));
              return resolve(JSON.parse(quote).quote);
          });
      });
    }
}

export default Movies;

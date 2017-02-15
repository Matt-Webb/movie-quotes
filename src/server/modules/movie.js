
import request from 'request';
import config from '../config/'; // any benefit passing this into the constructor?!

class Movies {

    constructor() {
      this.apiKey = config.apiKey;
      this.url = config.url;
      this.lastQuote = {};
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
          }, (error, response, quote) => {
              if(error) return reject(new Error(error));

              if(response.statusCode === 200) {
                this.lastQuote = JSON.parse(quote);
                return resolve(this.lastQuote /*.quote */ ); // send ONLY the quote to the client.
              } else {
                return reject(new Error(response.statusCode));
              }

          });
      });
    }
}

export default Movies;

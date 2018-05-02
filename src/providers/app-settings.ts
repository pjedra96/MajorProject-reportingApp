import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import 'rxjs/add/operator/map';

// The MongoDB operations (API) address (all of the MongoDB operations - insert,find, remove etc. have to be run on a server with node.js)
const CONFIG = {
  apiUrl: 'THE URL OF THE SERVER HOLDING THE API',
};

@Injectable()
export class AppSettings {

  constructor(public http: Http) {
  }
  
  public getApiUrl() {
    return CONFIG.apiUrl;
  }
}
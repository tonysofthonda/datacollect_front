import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-saml',
  templateUrl: './saml.component.html',
  styleUrls: ['./saml.component.scss']
})
export class SamlComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
   const authentication = this.getAuthentication();
      
    this.checkToken(authentication)
    .pipe(catchError(()=>{
      this.router.navigate([""]);
      return throwError(()=> new Error())
    }))
    .subscribe(()=>{
      //TODO: Process authentication
      this.router.navigate(["financialstate","list"]);
    });
  }

  getAuthentication() {
    const results = new RegExp('[\\?&]' + 'auth=([^&#]*)').exec(decodeURIComponent(this.router.url));
    if (!results) {
        return null;
    }
    return JSON.parse(results[1]) || null;
  }

  checkToken(authentication: any){
    const token = authentication.access_token;
    return this.http.post(`${environment.securityUrl}/oauth/check_token?token=${token}`, null);
  }
}

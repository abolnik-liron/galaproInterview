import { Component } from '@angular/core';
import { HomeProvider } from '../../providers/home/home';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HomeProvider, InAppBrowser]
})
export class HomePage {

  // Variables
  RedirectUrl: string = "";
  isRedirectUrl: boolean = false;
  errorMessage: string = "";

  constructor(private homeProvider: HomeProvider, private iab: InAppBrowser) {

  }
  // Method to submit the form and call api service.
  submitForm() {
    let requestBody = {
      url: this.RedirectUrl,
      isRedirect: this.isRedirectUrl
    }

    this.homeProvider.getVarifiedUrl(requestBody).subscribe((response: any) => {
      this.errorMessage = '';
      this.openUrl(response.data.url);

    }, (err) => {
      if (err) {
        this.errorMessage = err.error.data;
      }
    });
  }

  // TODO -- redirect and not open in blank
  openUrl(url) {
    window.open(url, '_self');
  }
}

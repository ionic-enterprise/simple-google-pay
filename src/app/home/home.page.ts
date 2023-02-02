import { Component, OnInit } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';
import { GooglePayService } from '../services/google-pay.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  googlePayIsAvailable = false;

  constructor(private googlePayService: GooglePayService, private toastController: ToastController) {}


  async ngOnInit(): Promise<void> {
    const isReady = await this.googlePayService.init();
    if(isReady) {
      this.googlePayIsAvailable = await this.googlePayService.canMakePayment();
      if(this.googlePayIsAvailable) {
        return;
      }
    }
    const toast = await this.toastController.create({
      duration: 5000,
      message: 'Google Pay is unavailable!',
      color: 'danger'
    });
    await toast.present();
  }

  public async makePaymentRequest(): Promise<void> {
    const toastOpts: ToastOptions = {
      color: 'success',
      duration: 5000,
      header: 'Successful!'
    };
    try {
      const response = await this.googlePayService.makePaymentRequest();
      console.log('MakePayment Success! You can find the token(s) required by your provider in this payload', response);
      console.log('The next step is to invoke your payment gateway API to process the transaction!');
    } catch(err: any) {
      console.log(`MakePayment Error: ${err.code} - ${err.message}`, err);
      toastOpts.header = 'Error';
      toastOpts.message = `MakePayment Error! ${err.message || ''}`;
    } finally {
      const toast = await this.toastController.create(toastOpts);
      await toast.present();
    }
  }
}

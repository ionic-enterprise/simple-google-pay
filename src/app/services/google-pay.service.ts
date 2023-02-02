import { Injectable } from '@angular/core';
import {  GooglePayInitClientRequest, GooglePay, GooglePayEnvironment,
          GooglePayAllowedAuthMethod, GooglePayAllowedNetwork,
          GooglePayVersion, GooglePayPaymentMethod, GooglePayTransactionInfo } from '@ionic-enterprise/google-pay';

@Injectable({
  providedIn: 'root',
})
export class GooglePayService {
  private googlePayVersion: GooglePayVersion = {
    apiVersion: 2,
    apiVersionMinor: 0
  };

  // These values should be reviewed and tailored to your requirements
  private allowedPaymentMethods: GooglePayPaymentMethod[] = [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: [
          GooglePayAllowedAuthMethod.PAN_ONLY,
          GooglePayAllowedAuthMethod.CRYPTOGRAM_3DS,
        ],
        allowedCardNetworks: [
          GooglePayAllowedNetwork.AMEX,
          GooglePayAllowedNetwork.DISCOVER,
          GooglePayAllowedNetwork.MASTERCARD,
          GooglePayAllowedNetwork.VISA
        ],
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'GATEWAY-IDENTIFIER', // The gateway's identifier which is issued by Google.
          gatewayMerchantId: 'GATEWAY-MERCHANT-ID', // The gateway account ID which is provided by the gateway.
        },
      },
    },
  ];
  constructor() {}

  async init(): Promise<boolean> {
    const options: GooglePayInitClientRequest = {
      environment: GooglePayEnvironment.TEST,
      version: this.googlePayVersion
    };
    const { isReady } = await GooglePay.initGooglePayClient(options);
    console.log('GOOGLE PAY INIT. IS READY?', isReady);
    return isReady;
  }

  // https://developers.google.com/static/pay/api/download-assets/Google-Pay-Acceptance.zip
  public async canMakePayment(): Promise<boolean> {
    const { canMakePayments } = await GooglePay.canMakePayments({
      allowedPaymentMethods: this.allowedPaymentMethods,
    });
    console.log('CAN MAKE PAYMENTS?', canMakePayments);
    return canMakePayments;
  }

  public async makePaymentRequest(transactionInfo?: GooglePayTransactionInfo): Promise<any> {
    transactionInfo ??= {
      countryCode: 'US',
      currencyCode: 'USD',
      totalPrice: '1.00',
      totalPriceStatus: 'FINAL',
    };
    const res = await GooglePay.makePaymentRequest({
      allowedPaymentMethods: this.allowedPaymentMethods,
      merchantInfo: {
        merchantId: 'YOUR-GOOGLE-MERCHANT-ID',
        merchantName: 'YOUR-GOOGLE-MERCHANT-NAME',
      },
      transactionInfo,
    });
    console.log('MAKE PAYMENT RESPONSE', res);
    return res;
  }
}

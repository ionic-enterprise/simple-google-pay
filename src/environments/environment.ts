// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { GooglePayEnvironment, GooglePayInitClientRequest,
        GooglePayMerchantInfo, GooglePayTokenizationSpecification } from '@ionic-enterprise/google-pay';

export const environment = {
  production: false,
  // Consider moving your config values to your enivronment files for eaiser management between environments
  googlePayConfig: {
    googlePayInitClientRequest: {
      environment: GooglePayEnvironment.TEST,
      version: {
        apiVersion: 2,
        apiVersionMinor: 0
      },
    } as GooglePayInitClientRequest,
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      parameters: {
        gateway: 'GATEWAY-IDENTIFIER', // The gateway's identifier which is issued by Google.
        gatewayMerchantId: 'GATEWAY-MERCHANT-ID' // The gateway account ID which is provided by the gateway.
      }
    } as GooglePayTokenizationSpecification,
    merchantInfo: {
      merchantId: 'YOUR-GOOGLE-MERCHANT-ID',
      merchantName: 'YOUR-GOOGLE-MERCHANT-NAME',
    } as GooglePayMerchantInfo
  }
};





/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

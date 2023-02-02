# Ionic Customer Success Demo - Google Pay

This applicaton a simple implementation of the [Google Pay Enterprise plugin](https://ionic.io/integrations/google-pay) ([docs](https://ionic.io/docs/google-pay)). There are several assumptions made, including:

- You have already purchased the Google Pay Enterprise plugin and have a valid [Native Plugin Key](https://ionic.io/docs/appflow/cookbook/private-native-enterprise-keys#about-native-plugin-keys). If not, please [contact sales](https://ionic.io/integrations/google-pay#contact).
- You have access to a valid [Google Pay Merchant](https://pay.google.com/about/business/) account ([getting started](https://pay.google.com/about/business/implementation/)).
- You have established an account with a Payment Service Provider. If not, a good place to start would be the [list of providers](https://developers.google.com/pay/api) from the Google Pay documentation ([more docs](https://developers.google.com/pay/api/web/guides/tutorial#tokenization)).

Once you have all of the above setup, the next step is to ensure that you have your requests configured correctly. In most cases, it may require a bit of back and forth between the docs of your Payment Service Provider and [Google Pay](https://developers.google.com/pay/api/web/guides/tutorial).

> **PLEASE NOTE:**
> It's vital that you understand that simply copying & pasting code from this project may not work as expected in your situation. So it's important to review the documentation provided by your Payment Service Provider (specific to Google Pay). If you have any questions on setting up your Payment Service Provider, please refer to the support options provided by the Payment Service Provider.

## Getting Started

Follow all the normal steps:

1. clone the repo
1. install your own `.npmrc` file with a valid Native Plugin Key for Google Pay
1. `npm i`
1. `npm run build`
1. `npx cap sync`
1. `npx cap run android`

## Plugin Lifecycle

1. [`initGooglePayClient`](https://ionic.io/docs/google-pay/classes/googlepay#initgooglepayclient) - Loads and initializes the Google Pay API on the client.
2. [`canMakePayments`](https://ionic.io/docs/google-pay/classes/googlepay#canmakepayments) - Checks if the user is able to make payments, based on their current device and the supplied parameters. Its best to check for this and determine whether Google Pay is provided as a checkout option.
3. [`makePaymentRequest`](https://ionic.io/docs/google-pay/classes/googlepay#makepaymentrequest) - Requests a payment by presenting the Google Pay payment modal over the app. When successful, you're typically provided with a token that can be used when you make the call to your specified gateway to process the payment.

> **NOTE:**
> The specifics of how to handle the response of a successful payment request may differ based on your provider. Please refer to their documentation, usually related to `Mobile Payments`, or more specifically `Google Pay`.

### Google Pay Service

The `GooglePayService` class contains a public method called `init()`. This is the first method that should be called, typically in an `async ngOnIt()`. This will return a `boolean` if Google Pay can be instatiated. If this returns false, you should confirm that you followed the [installation instructions](https://ionic.io/docs/google-pay/install).

```typescript
async init(): Promise<boolean> {
    const options: GooglePayInitClientRequest = {
      environment: GooglePayEnvironment.TEST,
      version: this.googlePayVersion
    };
    const { isReady } = await GooglePay.initGooglePayClient(options);
    console.log('GOOGLE PAY INIT. IS READY?', isReady);
    return isReady;
}
```

The next step is to verify that the user is on a device capable of using Google Pay by calling `canMakePayments`. If this returns false, its a good idea to either hide your Google Pay button or otherwise make the user aware that payment option isn't available:

```typescript
public async canMakePayment(): Promise<boolean> {
  const { canMakePayments } = await GooglePay.canMakePayments({
    allowedPaymentMethods: this.allowedPaymentMethods,
  });
  console.log('CAN MAKE PAYMENTS?', canMakePayments);
  return canMakePayments;
}
```

The `makePaymentRequest` method can be called when the user is ready to purchase. The user will be prompted with the Google Pay interface to select their payment method, and a payloard will be generated that you can send along to your payment service provider.

```typescript
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
    // You'll most likely need to inspect this response and refer to your payment service provider on:
    //  - Which value(s) they need from the payload
    //  - How your request to their systems should be structured
    return res; 
  }
```

## Related Info

- [Ionic Google Pay Enterprise Plugin Docs](https://ionic.io/docs/google-pay/)
- [Google Pay - Tutorial](https://developers.google.com/pay/api/web/guides/tutorial)
- [Google Pay - Troubleshooting Docs](https://developers.google.com/pay/api/web/support/troubleshooting)

## Conclusion

This application demonstrates the basics of using Google Pay. It provides patterns and best-practices that can be expanded upon to construct larger and more full featured applications.

Happy Coding!!

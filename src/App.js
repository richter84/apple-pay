import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import braintree from 'braintree-web';

const App = () => {
  const [message, setMessage] = useState('test');
  const [applePay, setApplePay] = useState(null);

  /*if(!window.ApplePaySession)
  {
    console.log("no apple");
  }

  if (window.ApplePaySession.canMakePayments()) {
      console.error('This device is not capable of making Apple Pay payments');
    }*/

  const handleSetupClient = async () => {
    try {
      const clientInstance = await braintree.client.create({
        authorization: 'sandbox_gp9kp6y5_9rbqdc36wh9ghr4v',
      });
      const applePayInstance = await braintree.applePay.create({
        client: clientInstance,
      });
      setApplePay(applePayInstance);
    } catch (err) {
      console.log(err);
    }
    // Set up your Apple Pay button here

    /*var request = {
          countryCode: 'US',
          currencyCode: 'USD',
          supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
          merchantCapabilities: ['supports3DS'],
          total: { label: 'Your Merchant Name', amount: '10.00' },
        }*/
  };

  useEffect(() => {
    handleSetupClient();
  }, []);

  const sendToServer = async (paymentNonce) => {
    const response = await fetch('https://evuf6f5uo1.execute-api.eu-west-1.amazonaws.com/dev/apple', {
      method: 'POST',
      body: JSON.stringify(paymentNonce),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    console.log(result);
    setMessage('sendToServer : ' + result);
  };

  const handleClick = () => {
    console.log('applePay in onClick', applePay);
    const paymentRequest = applePay.createPaymentRequest({
      currencyCode: 'GBP',
      total: {
        label: 'ppl',
        amount: '0.01',
      },
    });

    const session = new window.ApplePaySession(3, paymentRequest);

    session.onvalidatemerchant = (event) => {
      applePay
        .performValidation({
          merchantIdentifier: 'ppl',
          validationURL: event.validationURL,
          displayName: 'ppl',
        })
        .then((merchantSession) => {
          session.completeMerchantValidation(merchantSession);
          //alert("completeMerchantValidation");
        })
        .catch((validationErr) => {
          // You should show an error to the user, e.g. 'Apple Pay failed to load.'
          console.error(validationErr);
          alert("validation " + validationErr);
          session.abort();
        });
    };

    session.onpaymentauthorized = (event) => {
      //console.log('shipping address:', event.payment.shippingContact);
      applePay
        .tokenize({
          token: event.payment.token,
        })
        .then((payload) => {
          //alert("payload nonce");
          // Send payload.nonce to your server
          console.log('payload:', payload);
          console.log('event:', event);

          sendToServer(payload.paymentNonce);

          // If requested, address information is accessible in event.payment
          // and may also be sent to your server.
          //alert('billingPostalCode:', event.payment.billingContact.postalCode);

          // After you have transacted with the payload.nonce,
          // call 'completePayment' to dismiss the Apple Pay sheet.
          session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
        })
        .catch((tokenizeErr) => {
          console.error(tokenizeErr);
          alert(tokenizeErr);
          setMessage('transaction failure!');
          session.completePayment(window.ApplePaySession.STATUS_FAILURE);
        });
    };

    session.begin();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button className="apple-pay-button" onClick={handleClick}></button>
        {message}
      </header>
    </div>
  );
};

export default App;

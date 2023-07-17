import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import braintree from 'braintree-web'

const App = () => {
  const [message, setMessage] = useState('test');
  // const [applePay, setApplePay] = useState(null);
  let applePay = require('braintree-web/apple-pay');

  /*if(!window.ApplePaySession)
  {
    console.log("no apple");
  }

  if (window.ApplePaySession.canMakePayments()) {
      console.error('This device is not capable of making Apple Pay payments');
    }*/

    braintree.client
      .create({
        authorization: "sandbox_4xzk58m9_475xb2xjmrfd45cc",
      }).then((clientInstance) => braintree.applePay.create({
      client: clientInstance,
    })).then((applePayInstance) => {
      applePay = applePayInstance
      // setApplePay(applePayInstance)
    }).catch(err => {
      console.log(err);
    })

  const handleClick = () => {
    console.log("applePay in onClick", applePay)
    const paymentRequest = applePay.createPaymentRequest({
      currencyCode: 'GBP',
      total: {
        label: 'merchant.uk.co.postcodelottery.rs-dv',
        amount: '0.10'
      }
    })
    
    const session = new window.ApplePaySession(3, paymentRequest);
    
    session.onvalidatemerchant = (event) => {
      applePay.performValidation({
        merchantIdentifier: 'merchant.uk.co.postcodelottery.rs-dv',
        validationURL: event.validationURL,
        displayName: 'merchant.uk.co.postcodelottery.rs-dv'
      }).then((merchantSession) => {
        session.completeMerchantValidation(merchantSession);
        //alert("completeMerchantValidation");
      }).catch((validationErr) => {
        // You should show an error to the user, e.g. 'Apple Pay failed to load.'
        console.error(validationErr);
        session.abort();
      });
    };

    session.onpaymentauthorized = (event) => {
      //console.log('shipping address:', event.payment.shippingContact);
      applePay.tokenize({
        token: event.payment.token
      }).then( (payload) => {
        //alert("payload nonce");
        // Send payload.nonce to your server
        console.log('nonce:', payload.nonce);

        // If requested, address information is accessible in event.payment
        // and may also be sent to your server.
        //alert('billingPostalCode:', event.payment.billingContact.postalCode);

        // After you have transacted with the payload.nonce,
        // call 'completePayment' to dismiss the Apple Pay sheet.
        session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
        setMessage('transaction complete! '+ window.ApplePaySession.STATUS_SUCCESS);
      }).catch((tokenizeErr) => {
        console.error(tokenizeErr);
        alert(tokenizeErr);
        setMessage("transaction failure!");
        session.completePayment(window.ApplePaySession.STATUS_FAILURE);
      });
    };

    session.begin();
  }
    
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button className='apple-pay-button' onClick={handleClick}></button>
        {message}
      </header>
    </div>
  );
}

export default App;


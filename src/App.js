import logo from './logo.svg';
import './App.css';
import React, {useState} from "react";
import braintree from 'braintree-web'

function App() {

  const [message, setMessage] = useState('test');

  /*if(!window.ApplePaySession)
  {
    console.log("no apple");
  }

  if (window.ApplePaySession.canMakePayments()) {
      console.error('This device is not capable of making Apple Pay payments');
    }*/

  var applePay = require('braintree-web/apple-pay');
   



      braintree.client
      .create({
        authorization: "sandbox_4xzk58m9_475xb2xjmrfd45cc",
      })
      .then(function (clientInstance) {
        return braintree.applePay.create({
          client: clientInstance,
        });
      })
      .then(function (applePayInstance) {

        applePay = applePayInstance;
        // Set up your Apple Pay button here        
   
        /*var request = {
          countryCode: 'US',
          currencyCode: 'USD',
          supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
          merchantCapabilities: ['supports3DS'],
          total: { label: 'Your Merchant Name', amount: '10.00' },
        }*/

        

      })
      .catch(function (err) {
        // Handle error
        console.log(err);
      });

      const handleClick = () => {
        var paymentRequest = applePay.createPaymentRequest({
          currencyCode: 'GBP',
          total: {
            label: 'merchant.uk.co.postcodelottery.rs-dv',
            amount: '0.10'
          }
        })
        
        var session = new window.ApplePaySession(3, paymentRequest);
        
        session.onvalidatemerchant = function (event) {
          applePay.performValidation({
            merchantIdentifier: 'merchant.uk.co.postcodelottery.rs-dv',
            validationURL: event.validationURL,
            displayName: 'merchant.uk.co.postcodelottery.rs-dv'
          }).then(function (merchantSession) {
            session.completeMerchantValidation(merchantSession);
            //alert("completeMerchantValidation");
          }).catch(function (validationErr) {
            // You should show an error to the user, e.g. 'Apple Pay failed to load.'
            console.error(validationErr);
            alert(validationErr)
            session.abort();
          });
        };

        session.onpaymentauthorized = function (event) {
          //console.log('shipping address:', event.payment.shippingContact);
          applePay.tokenize({
            token: event.payment.token
          }).then(function (payload) {
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
          }).catch(function (tokenizeErr) {
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



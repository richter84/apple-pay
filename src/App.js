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
   

  const handleClick = () => {

      if (window.ApplePaySession.canMakePayments()) {
        console.log('This device is capable of making Apple Pay payments');
      }

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
        // Set up your Apple Pay button here        
   
        /*var request = {
          countryCode: 'US',
          currencyCode: 'USD',
          supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
          merchantCapabilities: ['supports3DS'],
          total: { label: 'Your Merchant Name', amount: '10.00' },
        }*/

        var paymentRequest = applePayInstance.createPaymentRequest({
          total: {
            label: 'My Store',
            amount: '0.10'
          }
        })
        
        var session = new window.ApplePaySession(3, paymentRequest);
        alert("start onvalidatemerchant");
        
        session.onvalidatemerchant = function (event) {
          alert("doing onvalidatemerchant");
          applePayInstance.performValidation({
            validationURL: event.validationURL,
            displayName: 'My Store'
          }).then(function (merchantSession) {
            session.completeMerchantValidation(merchantSession);
            alert("complete");
          }).catch(function (validationErr) {
            // You should show an error to the user, e.g. 'Apple Pay failed to load.'
            console.error(validationErr);
            alert(validationErr)
            session.abort();
          });
        };

        session.begin();

        //alert("success");
        setMessage("success!");
      })
      .catch(function (err) {
        // Handle error
        console.log(err);
      });
  }
    
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={handleClick}>push me</button>
        {message}
        testing commit
      </header>
    </div>
  );
}

export default App;


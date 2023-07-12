import logo from "./logo.svg";
import "./App.css";
import braintree, { ApplePaySession } from "braintree-web";
import { ApplePayButton } from "react-apple-pay-button";

function App() {
  const handleClick = () => {
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
        const paymentRequest = applePayInstance.createPaymentRequest({
          total: {
            label: "My Store",
            amount: "19.99",
          },

          // We recommend collecting billing address information, at minimum
          // billing postal code, and passing that billing postal code with
          // all Apple Pay transactions as a best practice.
          requiredBillingContactFields: ["postalAddress"],
        });
        console.log(paymentRequest.countryCode);
        console.log(paymentRequest.currencyCode);
        console.log(paymentRequest.merchantCapabilities);
        console.log(paymentRequest.supportedNetworks);

        const session = new ApplePaySession(3, paymentRequest);
        console.log(session);
        return "success";
      })
      .catch(function (err) {
        // Handle error
        console.log("error");
        return "error";
      });
  };

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
          Do Apple Stuff YAY
        </a>
        <ApplePayButton className="apple-pay-button" onClick={handleClick}>
          Pay with
        </ApplePayButton>
      </header>
    </div>
  );
}

export default App;

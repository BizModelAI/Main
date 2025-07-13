import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Loader, CheckCircle, CreditCard, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_...",
);

interface EnhancedPaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const PaymentMethodSelector: React.FC<{
  selectedMethod: "card" | "paypal";
  onMethodChange: (method: "card" | "paypal") => void;
}> = ({ selectedMethod, onMethodChange }) => {
  return (
    <div className="space-y-3 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment</h3>
      <p className="text-sm text-gray-600 mb-4">
        All transactions are secure and encrypted.
      </p>

      {/* Credit Card Option */}
      <div
        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
          selectedMethod === "card"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onMethodChange("card")}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded-full border-2 mr-3 ${
                selectedMethod === "card"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {selectedMethod === "card" && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
            <span className="font-medium text-gray-900">Credit card</span>
          </div>
          <div className="flex items-center space-x-2">
            {/* Credit card brand icons */}
            <img
              src="https://cdn.jsdelivr.net/gh/lipis/flag-icon-css@master/flags/4x3/us.svg"
              alt="Visa"
              className="w-8 h-5 rounded"
              style={{
                background: "#1a1f71",
                color: "white",
                fontSize: "6px",
                textAlign: "center",
                lineHeight: "20px",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
              MC
            </div>
            <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
              AE
            </div>
            <div className="w-8 h-5 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
              DI
            </div>
            <span className="text-xs text-gray-500">+4</span>
          </div>
        </div>
      </div>

      {/* PayPal Option */}
      <div
        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
          selectedMethod === "paypal"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onMethodChange("paypal")}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded-full border-2 mr-3 ${
                selectedMethod === "paypal"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {selectedMethod === "paypal" && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
            <span className="font-medium text-gray-900">PayPal</span>
          </div>
          <div className="flex items-center">
            <img
              src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
              alt="PayPal"
              className="h-6"
              onError={(e) => {
                // Fallback to text if image fails
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling!.style.display = "block";
              }}
            />
            <div
              className="text-blue-600 font-bold text-lg"
              style={{ display: "none" }}
            >
              PayPal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreditCardForm: React.FC<{
  onSubmit: (event: React.FormEvent) => void;
  isProcessing: boolean;
  clientSecret: string;
}> = ({ onSubmit, isProcessing, clientSecret }) => {
  const [billingDetails, setBillingDetails] = useState({
    name: "Casey Dunham",
    useShippingAddress: true,
  });

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card number
        </label>
        <div className="relative border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement options={cardElementOptions} />
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiration date (MM / YY)
          </label>
          <input
            type="text"
            placeholder="Expiration date (MM / YY)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ backgroundColor: "#f9f9f9" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Security code
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Security code"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              style={{ backgroundColor: "#f9f9f9" }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 border border-gray-400 rounded-sm text-xs flex items-center justify-center text-gray-500">
              ?
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name on card
        </label>
        <div className="relative">
          <input
            type="text"
            value={billingDetails.name}
            onChange={(e) =>
              setBillingDetails({ ...billingDetails, name: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="use-shipping"
          checked={billingDetails.useShippingAddress}
          onChange={(e) =>
            setBillingDetails({
              ...billingDetails,
              useShippingAddress: e.target.checked,
            })
          }
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="use-shipping" className="ml-2 text-sm text-gray-900">
          Use shipping address as billing address
        </label>
      </div>

      <button
        type="submit"
        disabled={isProcessing || !clientSecret}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center shadow-lg"
      >
        {isProcessing ? (
          <>
            <Loader className="animate-spin h-4 w-4 mr-2" />
            Processing Payment...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Pay $9.99 Securely
          </>
        )}
      </button>
    </form>
  );
};

const PayPalForm: React.FC<{
  onSuccess: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}> = ({ onSuccess, onError, isProcessing, setIsProcessing }) => {
  const { user } = useAuth();

  const createOrder = async () => {
    setIsProcessing(true);
    try {
      // Determine if this is a temporary user
      const isTemporaryUser =
        user?.isTemporary || user?.id.toString().startsWith("temp_");

      const requestBody: any = {};

      if (isTemporaryUser) {
        // Extract session ID from temporary user ID
        const sessionId = user?.id.toString().replace("temp_", "");
        requestBody.sessionId = sessionId;
      } else {
        requestBody.userId = parseInt(user?.id || "0");
      }

      const response = await fetch("/api/create-paypal-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create PayPal payment");
      }

      const { orderID } = await response.json();
      return orderID;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      onError(
        (error as Error).message || "Failed to initialize PayPal payment",
      );
      setIsProcessing(false);
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch("/api/capture-paypal-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to capture PayPal payment");
      }

      const result = await response.json();
      if (result.success) {
        onSuccess();
      } else {
        throw new Error("Payment capture failed");
      }
    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
      onError((error as Error).message || "PayPal payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const onCancel = () => {
    setIsProcessing(false);
    onError("PayPal payment was cancelled");
  };

  const onErrorHandler = (err: any) => {
    console.error("PayPal error:", err);
    setIsProcessing(false);
    onError("PayPal payment failed");
  };

  return (
    <div className="space-y-4">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={onCancel}
        onError={onErrorHandler}
        disabled={isProcessing}
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
        }}
      />
    </div>
  );
};

const PaymentForm: React.FC<EnhancedPaymentFormProps> = ({
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<"card" | "paypal">(
    "card",
  );

  useEffect(() => {
    // Create payment intent when component mounts (for credit card payments)
    const createPaymentIntent = async () => {
      if (!user || selectedMethod !== "card") return;

      try {
        // Determine if this is a temporary user
        const isTemporaryUser =
          user.isTemporary || user.id.toString().startsWith("temp_");

        const requestBody: any = {};

        if (isTemporaryUser) {
          // Extract session ID from temporary user ID
          const sessionId = user.id.toString().replace("temp_", "");
          requestBody.sessionId = sessionId;
        } else {
          requestBody.userId = parseInt(user.id);
        }

        const response = await fetch("/api/create-access-pass-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create payment intent");
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        onError((error as Error).message || "Failed to initialize payment");
      }
    };

    createPaymentIntent();
  }, [user, onError, selectedMethod]);

  const handleCardSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const card = elements.getElement(CardElement);

    if (!card) {
      onError("Card element not found");
      setIsProcessing(false);
      return;
    }

    // Confirm the payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.username || user?.email || "Customer",
            email: user?.email,
          },
        },
      },
    );

    if (error) {
      console.error("Payment failed:", error);
      onError(error.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded:", paymentIntent);
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-blue-900">Total:</span>
          <span className="text-2xl font-bold text-blue-900">$9.99</span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          One-time payment • Instant access
        </p>
      </div>

      <PaymentMethodSelector
        selectedMethod={selectedMethod}
        onMethodChange={setSelectedMethod}
      />

      {selectedMethod === "card" ? (
        <CreditCardForm
          onSubmit={handleCardSubmit}
          isProcessing={isProcessing}
          clientSecret={clientSecret}
        />
      ) : (
        <PayPalForm
          onSuccess={onSuccess}
          onError={onError}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500">
          🔒 Secured by Stripe & PayPal • Your payment details are never stored
          on our servers
        </p>
      </div>
    </div>
  );
};

interface EnhancedPaymentWrapperProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const EnhancedPaymentWrapper: React.FC<EnhancedPaymentWrapperProps> = (
  props,
) => {
  const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <Elements stripe={stripePromise}>
        <PaymentForm {...props} />
      </Elements>
    </PayPalScriptProvider>
  );
};

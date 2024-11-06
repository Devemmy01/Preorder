<?php
require 'vendor/autoload.php';

// First check if it's Nigeria or Ghana
if (in_array($country, ['Nigeria', 'Ghana'])) {
    // Handle Flutterwave payment
    try {
        // Your existing Flutterwave logic here
        $flutterwaveUrl = "your_flutterwave_payment_url";
        
        return [
            'status' => 'success',
            'data' => $flutterwaveUrl
        ];
    } catch(Exception $e) {
        return [
            'status' => 'error',
            'message' => 'Failed to initialize Flutterwave payment'
        ];
    }
} else {
    // For all other countries, use Stripe
    try {
        // Set your secret key
        \Stripe\Stripe::setApiKey('your_secret_key');
        
        // Calculate amount in smallest currency unit (cents)
        $amount_in_cents = round($total_amount * 100);
        
        // Create a PaymentIntent
        $paymentIntent = \Stripe\PaymentIntent::create([
            'amount' => $amount_in_cents,
            'currency' => strtolower($currency),
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
            'metadata' => [
                'order_id' => $order_id,
                'customer_email' => $email,
                'customer_name' => $name
            ]
        ]);
        
        return [
            'status' => 'success',
            'data' => [
                'client_secret' => $paymentIntent->client_secret,
                'id' => $paymentIntent->id,
                'order_id' => $order_id
            ]
        ];
    } catch(\Stripe\Exception\ApiErrorException $e) {
        return [
            'status' => 'error',
            'message' => $e->getMessage()
        ];
    } catch(Exception $e) {
        return [
            'status' => 'error',
            'message' => 'An error occurred while processing your payment'
        ];
    }
} 
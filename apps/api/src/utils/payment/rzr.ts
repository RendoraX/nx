import Razorpay from 'razorpay';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_TK2vyHVBYCcW9v";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "PTise6oy6iXtPRx3HJC36sot";

// Initialize Razorpay client with your API key & secret
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export default razorpay;
export { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET };
import express from "express"
import { isAuthenticated } from "../middleware/isAuthenticate";
import { createCheckoutSession, getOrders, stripeWebhook } from "../contoller/order.controller";

const router = express.Router();

router.route("/").get(isAuthenticated, getOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/webhook").post(express.raw({type: 'application/json'}), stripeWebhook);

export const orderRoutes= router;
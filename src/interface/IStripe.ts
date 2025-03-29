import Stripe from "../game/stripe";

export interface IStripeEvents
{
    onStripeSpinStartedEvent:(index: number, sender: Stripe) => void; 
    onStripeSpinEndedEvent:(index: number, sender: Stripe) => void;
}
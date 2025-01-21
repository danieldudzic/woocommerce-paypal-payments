import { addDebugTools } from './debug';
import * as Onboarding from './onboarding';
import * as Common from './common';
import * as Styling from './styling';
import * as Payment from './payment';

Onboarding.initStore();
Common.initStore();
Payment.initStore();
Styling.initStore();

export const OnboardingHooks = Onboarding.hooks;
export const CommonHooks = Common.hooks;
export const PaymentHooks = Payment.hooks;
export const StylingHooks = Styling.hooks;

export const OnboardingStoreName = Onboarding.STORE_NAME;
export const CommonStoreName = Common.STORE_NAME;
export const PaymentStoreName = Payment.STORE_NAME;
export const StylingStoreName = Styling.STORE_NAME;

export * from './configuration';

addDebugTools( window.ppcpSettings, [ Onboarding, Common, Payment, Styling ] );

import { addDebugTools } from './debug';
import * as Onboarding from './onboarding';
import * as Common from './common';
import * as Payment from './payment';
import * as Settings from './settings-tab';
import * as Styling from './styling';

Onboarding.initStore();
Common.initStore();
Payment.initStore();
Settings.initStore();
Styling.initStore();

export const OnboardingHooks = Onboarding.hooks;
export const CommonHooks = Common.hooks;
export const PaymentHooks = Payment.hooks;
export const SettingsHooks = Settings.hooks;
export const StylingHooks = Styling.hooks;

export const OnboardingStoreName = Onboarding.STORE_NAME;
export const CommonStoreName = Common.STORE_NAME;
export const PaymentStoreName = Payment.STORE_NAME;
export const SettingsStoreName = Settings.STORE_NAME;
export const StylingStoreName = Styling.STORE_NAME;

export * from './configuration';

addDebugTools( window.ppcpSettings, [
	Onboarding,
	Common,
	Payment,
	Settings,
	Styling,
] );

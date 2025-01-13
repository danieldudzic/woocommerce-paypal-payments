import { addDebugTools } from './debug';
import * as Onboarding from './onboarding';
import * as Common from './common';
import * as Styling from './styling';

Onboarding.initStore();
Common.initStore();
Styling.initStore();

export const OnboardingHooks = Onboarding.hooks;
export const CommonHooks = Common.hooks;
export const StylingHooks = Styling.hooks;

export const OnboardingStoreName = Onboarding.STORE_NAME;
export const CommonStoreName = Common.STORE_NAME;
export const StylingStoreName = Styling.STORE_NAME;

export * from './constants';

addDebugTools( window.ppcpSettings, [ Onboarding, Common, Styling ] );

import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { OnboardingHooks } from '../../../../data';
import { useNavigation } from '../../../../hooks/useNavigation';
import TopNavigation from '../../../ReusableComponents/TopNavigation';

const Navigation = ( { stepDetails, onNext, onPrev } ) => {
	const { goToWooCommercePaymentsTab } = useNavigation();
	const { title, isFirst, percentage, showNext, canProceed } = stepDetails;

	const state = OnboardingHooks.useNavigationState();
	const isDisabled = ! canProceed( state );

	return (
		<TopNavigation
			title={ title }
			isMainTitle={ isFirst }
			exitOnTitleClick={ isFirst }
			onTitleClick={ onPrev }
			showProgressBar={ true }
			progressBarPercent={ percentage * 0.9 }
		>
			<Button variant="link" onClick={ goToWooCommercePaymentsTab }>
				{ __( 'Save and exit', 'woocommerce-paypal-payments' ) }
			</Button>
			{ showNext && (
				<Button
					variant="primary"
					disabled={ isDisabled }
					onClick={ onNext }
				>
					{ __( 'Continue', 'woocommerce-paypal-payments' ) }
				</Button>
			) }
		</TopNavigation>
	);
};

export default Navigation;

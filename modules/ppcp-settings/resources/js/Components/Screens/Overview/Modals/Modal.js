import { __ } from '@wordpress/i18n';
import ModalPayPal from './ModalPayPal';
import ModalFastlane from './ModalFastlane';
import ModalAcdc from './ModalAcdc';
import { useActiveModal } from '../../../../data/common/hooks';

export const MODAL_CONFIG = {
	paypal: {
		component: ModalPayPal,
		icon: 'payment-method-paypal-big',
		title: __( 'PayPal', 'woocommerce-paypal-payments' ),
	},
	fastlane: {
		component: ModalFastlane,
		icon: 'payment-method-fastlane-big',
		title: __( 'Fastlane by PayPal', 'woocommerce-paypal-payments' ),
		size: 'small',
	},
	advanced_credit_and_debit_card_payments: {
		component: ModalAcdc,
		icon: 'payment-method-cards-big',
		title: __(
			'Advanced Credit and Debit Card Payments',
			'woocommerce-paypal-payments'
		),
	},
};

const Modal = () => {
	const { activeModal, setActiveModal } = useActiveModal();

	const handleCloseModal = () => {
		setActiveModal( '' );
	};

	if ( ! activeModal || ! MODAL_CONFIG[ activeModal ] ) {
		return null;
	}

	const { component: ModalComponent, ...modalProps } =
		MODAL_CONFIG[ activeModal ];

	return (
		<ModalComponent
			setModalIsVisible={ handleCloseModal }
			{ ...modalProps }
		/>
	);
};

export default Modal;

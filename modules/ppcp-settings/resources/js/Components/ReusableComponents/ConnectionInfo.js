import { __ } from '@wordpress/i18n';
import { CommonHooks } from '../../data';

const ConnectionInfo = () => {
	const { merchant } = CommonHooks.useMerchantInfo();

	return (
        <div className="ppcp-r-connection-status__data">
            {renderStatusRow(
                __('Merchant ID', 'woocommerce-paypal-payments'),
                connectionData.merchantId
            )}
            {renderStatusRow(
                __('Email address', 'woocommerce-paypal-payments'),
                connectionData.email
            )}
            {renderStatusRow(
                __('Client ID', 'woocommerce-paypal-payments'),
                connectionData.clientId
            )}
        </div>
    );
};
export default ConnectionInfo;

    return {
        connectionStatus: merchant.isConnected || false,
        email: merchant.email || '',
        merchantId: merchant.id || '',
        clientId: merchant.clientId || '',
    };
};

const renderStatusRow = (label, value) => (
    <div className="ppcp-r-connection-status__status-row">
        <span className="ppcp-r-connection-status__status-label">{label}</span>
        <span className="ppcp-r-connection-status__status-value">{value}</span>
    </div>
);

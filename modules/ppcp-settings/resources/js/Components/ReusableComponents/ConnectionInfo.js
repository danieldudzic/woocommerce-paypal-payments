import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {CommonHooks} from "../../data";


const ConnectionInfo = () => {
    const { merchant } = CommonHooks.useMerchantInfo();
    const [connectionData, setConnectionData] = useState(getDefaultConnectionStatusData(merchant));

    useEffect(() => {
        if (merchant) {
            setConnectionData(getDefaultConnectionStatusData(merchant));
        }
    }, [merchant]);

	const toggleStatusClassName = [ 'ppcp-r-connection-status__status-toggle' ];

	if ( connectionData.showAllData ) {
		toggleStatusClassName.push(
			'ppcp-r-connection-status__status-toggle--toggled'
		);
	}

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
export const getDefaultConnectionStatusData = (merchant = null) => {
    if (!merchant) {
        const contextMerchant = CommonHooks.useMerchantInfo()?.merchant || {};
        return {
            connectionStatus: contextMerchant.isConnected || false,
            showAllData: false,
            email: contextMerchant.email || '',
            merchantId: contextMerchant.id || '',
            clientId: contextMerchant.clientId || '',
        };
    }

    return {
        connectionStatus: merchant.isConnected || false,
        showAllData: false,
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

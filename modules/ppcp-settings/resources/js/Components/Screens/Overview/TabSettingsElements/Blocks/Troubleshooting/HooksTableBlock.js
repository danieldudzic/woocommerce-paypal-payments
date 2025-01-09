import { __ } from '@wordpress/i18n';
import { CommonHooks } from '../../../../../../data';

const HooksTableBlock = () => {
	const { webhooks } = CommonHooks.useWebhooks();
	const { url, events } = webhooks;

	if ( ! url || ! events?.length ) {
		return <div>...</div>;
	}

	return (
		<table className="ppcp-r-table">
			<thead>
				<tr>
					<th className="ppcp-r-table__hooks-url">
						{ __( 'URL', 'woocommerce-paypal-payments' ) }
					</th>
					<th className="ppcp-r-table__hooks-events">
						{ __(
							'Tracked events',
							'woocommerce-paypal-payments'
						) }
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td className="ppcp-r-table__hooks-url">{ url }</td>
					<td className="ppcp-r-table__hooks-events">
						{ events.map( ( event, index ) => (
							<div key={ index }>{ event }</div>
						) ) }
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default HooksTableBlock;

import PaymentButtonPreview from '../PaymentButtonPreview';

const PreviewPanel = ( { settings } ) => (
	<div className="preview-panel">
		<div className="preview-panel-inner">
			<PaymentButtonPreview style={ settings } />
		</div>
	</div>
);

export default PreviewPanel;

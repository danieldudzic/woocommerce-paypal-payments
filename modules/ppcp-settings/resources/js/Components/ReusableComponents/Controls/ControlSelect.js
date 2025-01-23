import Select, { components } from 'react-select';

import data from '../../../utils/data';
import { Title, Action, Description } from '../Elements';

const DEFAULT_ELEMENT_ORDER = [ 'title', 'action', 'description' ];

const DropdownIndicator = ( props ) => (
	<components.DropdownIndicator { ...props }>
		{ data().getImage( 'icon-arrow-down.svg' ) }
	</components.DropdownIndicator>
);

const ELEMENT_RENDERERS = {
	title: ( { title } ) => <Title>{ title }</Title>,
	action: ( { actionProps } ) => (
		<Action>
			<Select
				className="ppcp-r-multiselect"
				classNamePrefix="ppcp-r"
				isMulti={ actionProps?.isMulti }
				options={ actionProps?.options }
				components={ { DropdownIndicator } }
			/>
		</Action>
	),
	description: ( { description } ) => (
		<Description>{ description }</Description>
	),
};

const ControlSelect = ( {
	title,
	description,
	order = DEFAULT_ELEMENT_ORDER,
	...props
} ) => (
	<Action>
		{ order.map( ( elementKey ) => {
			const RenderElement = ELEMENT_RENDERERS[ elementKey ];
			return RenderElement ? (
				<RenderElement
					key={ elementKey }
					title={ title }
					description={ description }
					actionProps={ props.actionProps }
				/>
			) : null;
		} ) }
	</Action>
);

export default ControlSelect;

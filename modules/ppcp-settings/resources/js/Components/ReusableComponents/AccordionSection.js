import { Icon } from '@wordpress/components';
import { chevronDown, chevronUp } from '@wordpress/icons';
import classNames from 'classnames';

import { useAccordionState } from '../../hooks/useAccordionState';
import {
	Content,
	Description,
	Header,
	Title,
	Action,
	TitleWrapper,
} from './Elements';

const Accordion = ( {
	title,
	id = '',
	initiallyOpen = null,
	description = '',
	children = null,
	className = '',
} ) => {
	const { isOpen, toggleOpen } = useAccordionState( { id, initiallyOpen } );
	const wrapperClasses = classNames( 'ppcp-r-accordion', className, {
		'ppcp--is-open': isOpen,
	} );

	const icon = isOpen ? chevronUp : chevronDown;

	const AccordionContent = ( { contentIsOpen, content } ) => {
		if ( ! contentIsOpen || ! content ) {
			return null;
		}

		return <Content asCard={ false }>{ content }</Content>;
	};

	return (
		<div className={ wrapperClasses } { ...( id && { id } ) }>
			<button
				type="button"
				className="ppcp--toggler"
				onClick={ toggleOpen }
			>
				<Header>
					<TitleWrapper>
						<Title noCaps={ true }>{ title }</Title>
						<Action>
							<Icon icon={ icon } />
						</Action>
					</TitleWrapper>
					<Description>{ description }</Description>
				</Header>
			</button>
			<AccordionContent contentIsOpen={ isOpen } content={ children } />
		</div>
	);
};

export default Accordion;

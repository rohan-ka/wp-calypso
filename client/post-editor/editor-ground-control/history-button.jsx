/** @format */
/**
 * External dependencies
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import { flow } from 'lodash';

/**
 * Internal dependencies
 */
import { recordTracksEvent } from 'state/analytics/actions';
import { toggleDiffVisibility } from 'state/posts/revisions/actions';
import EditorRevisionsList from 'post-editor/editor-revisions-list';
import Popover from 'components/popover';

class HistoryButton extends PureComponent {
	state = {};

	onSelectRevision = revisionPostId => {
		if ( this.state.isPopoverVisible ) {
			this.toggleShowingPopover();
		}

		// @TODO do something w/ this or don't pass it
		revisionPostId;
		//		console.log( 'loading: ' + revisionPostId );
	};

	toggleShowingPopover = () => {
		if ( ! this.state.isPopoverVisible ) {
			this.props.recordTracksEvent( 'calypso_editor_post_revisions_open', {
				source: 'ground_control_history',
			} );
		}
		this.setState( {
			isPopoverVisible: ! this.state.isPopoverVisible,
		} );
	};

	render() {
		const { translate } = this.props;
		return (
			<div className="editor-ground-control__history">
				<button
					className="editor-ground-control__save button is-link"
					onClick={ this.toggleShowingPopover }
					ref="historyPopoverButton"
				>
					{ translate( 'History' ) }
				</button>
				<Popover
					isVisible={ this.state.isPopoverVisible }
					context={ this.refs && this.refs.historyPopoverButton }
					onClose={ this.toggleShowingPopover }
				>
					<EditorRevisionsList onSelectRevision={ this.onSelectRevision } />
				</Popover>
			</div>
		);
	}
}

HistoryButton.PropTypes = {
	// connected to dispatch
	recordTracksEvent: PropTypes.func,
	toggleDiffVisibility: PropTypes.func,

	// localize
	translate: PropTypes.func,
};

export default flow( localize, connect( null, { recordTracksEvent, toggleDiffVisibility } ) )(
	HistoryButton
);

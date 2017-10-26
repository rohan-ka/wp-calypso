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
import { getSelectedSiteId } from 'state/ui/selectors';
import EditorRevisionsList from 'post-editor/editor-revisions-list';
import Popover from 'components/popover';

class HistoryButton extends PureComponent {
	state = {};

	onSelectRevision = revisionPostId => {
		if ( this.state.isPopoverVisible ) {
			this.toggleShowingPopover();
		}
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
		const { selectedSiteId, translate } = this.props;
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
					<EditorRevisionsList
						onSelectRevision={ this.onSelectRevision }
						selectedSiteId={ selectedSiteId }
					/>
				</Popover>
			</div>
		);
	}
}

HistoryButton.PropTypes = {
	// connected
	selectedSiteId: PropTypes.number,

	// localize
	translate: PropTypes.func,
};

export default flow(
	localize,
	connect(
		state => ( {
			selectedSiteId: getSelectedSiteId( state ),
		} ),
		{ recordTracksEvent }
	)
)( HistoryButton );

/**
 * External dependencies
 *
 * @format
 */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import { flow, isObject, noop } from 'lodash';

/**
 * Internal dependencies
 */
import { selectPostRevision, toggleDiffVisibility } from 'state/posts/revisions/actions';
import { isPostRevisionsDiffVisible } from 'state/selectors';
import PostTime from 'reader/post-time';

class EditorRevisionsListItem extends PureComponent {
	static defaultProps = {
		onSelectRevision: noop,
	};

	selectRevision = () => {
		const { basePostId, onSelectRevision, revision, showingDiff } = this.props;
		this.props.selectPostRevision( basePostId, revision.id );

		if ( ! showingDiff ) {
			this.props.toggleDiffVisibility();
		}

		onSelectRevision( this.props.revision.id );
	};

	render() {
		return (
			<button
				className="editor-revisions-list__button"
				onClick={ this.selectRevision }
				type="button"
			>
				<span className="editor-revisions-list__date">
					<PostTime date={ this.props.revision.date } />
				</span>
				&nbsp;
				<span className="editor-revisions-list__author">
					{ isObject( this.props.revision.author ) &&
						this.props.translate( 'by %(author)s', {
							args: { author: this.props.revision.author.display_name },
						} ) }
				</span>
				<div className="editor-revisions-list__changes">
					{ this.props.revision.changes.added > 0 && (
						<span className="editor-revisions-list__additions">
							{ this.props.translate( '%(changes)d word added', '%(changes)d words added', {
								args: { changes: this.props.revision.changes.added },
								count: this.props.revision.changes.added,
							} ) }
						</span>
					) }

					{ this.props.revision.changes.added > 0 &&
						this.props.revision.changes.removed > 0 &&
						', ' }

					{ this.props.revision.changes.removed > 0 && (
						<span className="editor-revisions-list__deletions">
							{ this.props.translate( '%(changes)d word removed', '%(changes)d words removed', {
								args: { changes: this.props.revision.changes.removed },
								count: this.props.revision.changes.removed,
							} ) }
						</span>
					) }

					{ this.props.revision.changes.added === 0 &&
					this.props.revision.changes.removed === 0 && (
						<span className="editor-revisions-list__minor-changes">
							{ this.props.translate( 'minor changes' ) }
						</span>
					) }
				</div>
			</button>
		);
	}
}

EditorRevisionsListItem.propTypes = {
	onSelectRevision: PropTypes.func,
	revision: PropTypes.object.isRequired,

	// connected to state
	showingDiff: PropTypes.bool,

	// connected to dispatcher
	selectPostRevision: PropTypes.func.isRequired,

	// localize
	translate: PropTypes.func.isRequired,
};

export default flow(
	localize,
	connect(
		state => ( {
			showingDiff: isPostRevisionsDiffVisible( state ),
		} ),
		{ selectPostRevision, toggleDiffVisibility }
	)
)( EditorRevisionsListItem );

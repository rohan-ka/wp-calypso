/**
 * External dependencies
 *
 * @format
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { head, map, noop } from 'lodash';

/**
 * Internal dependencies
 */
import EditorRevisionsListHeader from './header';
import EditorRevisionsListItem from './item';
import QueryPostRevisions from 'components/data/query-post-revisions';
import QueryUsers from 'components/data/query-users';
import { getEditedPostValue } from 'state/posts/selectors';
import { getPostRevision, getPostRevisions, getPostRevisionsAuthorsId } from 'state/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getEditorPostId } from 'state/ui/editor/selectors';
import { selectPostRevision } from 'state/posts/revisions/actions';

// @TODO move the resonsive check to the parent
// import { isWithinBreakpoint } from 'lib/viewport';

class EditorRevisionsList extends PureComponent {
	static defaultProps = {
		loadRevision: noop,
	};

	static propTypes = {
		authorsIds: PropTypes.array.isRequired,
		loadRevision: PropTypes.func,
		onSelectRevision: PropTypes.func,
		postId: PropTypes.number,
		revisions: PropTypes.array.isRequired,
		selectedRevision: PropTypes.object,
		selectedRevisionId: PropTypes.number,
		siteId: PropTypes.number,
		type: PropTypes.string,
	};

	trySelectingFirstRevision = () => {
		const { postId, revisions } = this.props;
		if ( ! revisions.length ) {
			return;
		}
		const firstRevision = head( revisions );
		if ( ! firstRevision.id ) {
			return;
		}
		this.props.selectPostRevision( postId, firstRevision.id );
	};

	componentWillMount() {
		this.trySelectingFirstRevision();
	}

	componentDidMount() {
		// Make sure that scroll position in the editor is not preserved.
		window.scrollTo( 0, 0 );
	}

	componentWillUpdate() {
		this.trySelectingFirstRevision();
	}

	render() {
		return (
			<div className="editor-revisions-list">
				<QueryPostRevisions
					postId={ this.props.postId }
					postType={ this.props.type }
					siteId={ this.props.siteId }
				/>
				<QueryUsers siteId={ this.props.siteId } userIds={ this.props.authorsIds } />
				<EditorRevisionsListHeader
					// @TODO move this to an action
					loadRevision={ this.props.loadRevision }
					selectedRevisionId={ this.props.selectedRevisionId }
				/>
				<div className="editor-revisions-list__scroller">
					<ul className="editor-revisions-list__list">
						{ map( this.props.revisions, revision => {
							const itemClasses = classNames( 'editor-revisions-list__revision', {
								'is-selected': revision.id === this.props.selectedRevisionId,
							} );
							return (
								<li className={ itemClasses } key={ revision.id }>
									<EditorRevisionsListItem
										basePostId={ this.props.postId }
										revision={ revision }
										onSelectRevision={ this.props.onSelectRevision }
										siteId={ this.props.siteId }
									/>
								</li>
							);
						} ) }
					</ul>
				</div>
			</div>
		);
	}
}

export default connect(
	( state, { selectedRevisionId } ) => {
		const siteId = getSelectedSiteId( state );
		const postId = getEditorPostId( state );
		const type = getEditedPostValue( state, siteId, postId, 'type' );
		return {
			authorsIds: getPostRevisionsAuthorsId( state, siteId, postId ),
			postId,
			revisions: getPostRevisions( state, siteId, postId, 'display' ),
			selectedRevision: getPostRevision( state, siteId, postId, selectedRevisionId, 'editing' ),
			siteId,
			type,
		};
	},
	{ selectPostRevision }
)( EditorRevisionsList );

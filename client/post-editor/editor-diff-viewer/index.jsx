/** @format */

/**
 * External dependencies
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getPostRevisionChanges } from 'state/selectors';
import EditorDiffChanges from './changes';

const EditorDiffViewer = ( { revisionChanges } ) => (
	<div className="editor-diff-viewer">
		<h1 className="editor-diff-viewer__title">
			<EditorDiffChanges changes={ revisionChanges.title } />
		</h1>
		<pre className="editor-diff-viewer__content">
			<EditorDiffChanges changes={ revisionChanges.content } />
		</pre>
	</div>
);

EditorDiffViewer.propTypes = {
	fromPostId: PropTypes.number.isRequired,
	toPostId: PropTypes.number.isRequired,

	// connected
	revisionChanges: PropTypes.shape( {
		title: PropTypes.array,
		content: PropTypes.array,
	} ).isRequired,
};

export default connect( ( state, { fromPostId, toPostId } ) => ( {
	revisionChanges: getPostRevisionChanges( state, null, fromPostId, toPostId ),
} ) )( EditorDiffViewer );

/** @format */
/**
 * External dependencies
 */
import { get, head } from 'lodash';

/**
 * Internal dependencies
 */
import { getPostRevisions } from 'state/selectors';

const getPostRevisionsCompareFromPostId = ( state, siteId, postId ) => {
	return get(
		state,
		'posts.revisions.selection.fromPostId',
		head( getPostRevisions( state, siteId, postId, 'display' ) )
	);
};
export default getPostRevisionsCompareFromPostId;

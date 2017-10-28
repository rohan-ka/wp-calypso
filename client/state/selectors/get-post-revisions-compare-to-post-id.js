/** @format */
/**
 * External dependencies
 */
import { get } from 'lodash';

const getPostRevisionsCompareToPostId = state => {
	return get( state, 'posts.revisions.selection.toPostId', 0 );
};
export default getPostRevisionsCompareToPostId;

/** @format */
/**
 * External dependencies
 */
import { get } from 'lodash';

const isPostRevisionsDiffVisible = state => {
	return get( state, 'posts.revisions.selection.showingDiff', false );
};
export default isPostRevisionsDiffVisible;

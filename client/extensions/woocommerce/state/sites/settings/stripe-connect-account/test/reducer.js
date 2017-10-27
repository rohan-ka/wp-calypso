/** @format */

/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import stripeConnectAccountReducer from '../reducer';
import {
	WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DETAILS_REQUEST,
	WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DETAILS_UPDATE,
	WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DISCONNECT,
	WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DISCONNECT_COMPLETE,
} from 'woocommerce/state/action-types';
import sitesReducer from 'woocommerce/state/sites/reducer';

describe( 'reducer', () => {
	describe( 'default stripeConnectAccount reducer behavior', () => {
		test( 'should have no change by default', () => {
			const newState = stripeConnectAccountReducer( {}, {} );
			expect( newState ).to.eql( {} );
		} );
	} );

	describe( 'connectAccountCreate', () => {
		test( 'should update state to show request in progress', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_CREATE,
				siteId: 123,
			};
			const newState = stripeConnectAccountReducer( undefined, action );
			expect( newState.isRequesting ).to.eql( true );
		} );

		test( 'should only update the request in progress flag for the appropriate siteId', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_CREATE,
				siteId: 123,
			};
			const newState = sitesReducer(
				{
					123: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: '',
								email: '',
								isActivated: false,
								isRequesting: false,
							},
						},
					},
					456: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: '',
								email: '',
								isActivated: false,
								isRequesting: false,
							},
						},
					},
				},
				action
			);
			expect( newState[ 123 ].settings.stripeConnectAccount.isRequesting ).to.eql( true );
			expect( newState[ 456 ].settings.stripeConnectAccount.isRequesting ).to.eql( false );
		} );
	} );

	describe( 'connectAccountCreateComplete', () => {
		test( 'should update state with the received account details', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_CREATE_COMPLETE,
				connectedUserID: 'acct_14qyt6Alijdnw0EA',
				email: 'foo@bar.com',
				siteId: 123,
			};
			const newState = stripeConnectAccountReducer( undefined, action );
			expect( newState ).to.eql( {
				connectedUserID: 'acct_14qyt6Alijdnw0EA',
				email: 'foo@bar.com',
				error: '',
				isActivated: false,
				isDisconnecting: false,
				isRequesting: false,
			} );
		} );

		test( 'should leave other sites state unchanged', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_CREATE_COMPLETE,
				connectedUserID: 'acct_14qyt6Alijdnw0EA',
				email: 'foo@bar.com',
				siteId: 123,
			};
			const newState = sitesReducer(
				{
					123: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: '',
								email: '',
								isActivated: false,
								isRequesting: true,
							},
						},
					},
					456: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: '',
								email: '',
								isActivated: false,
								isRequesting: true,
							},
						},
					},
				},
				action
			);
			expect( newState[ 123 ].settings.stripeConnectAccount.isRequesting ).to.eql( false );
			expect( newState[ 123 ].settings.stripeConnectAccount.connectedUserID ).to.eql(
				'acct_14qyt6Alijdnw0EA'
			);
			expect( newState[ 123 ].settings.stripeConnectAccount.email ).to.eql( 'foo@bar.com' );
			expect( newState[ 456 ].settings.stripeConnectAccount.isRequesting ).to.eql( true );
		} );
	} );

	describe( 'receivingAccountCreationError', () => {
		test( 'should reset the isRequesting flag in state', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_CREATE_COMPLETE,
				siteId: 123,
				email: 'foo@bar.com',
				error: 'My error',
			};
			const newState = stripeConnectAccountReducer( undefined, action );
			expect( newState.error ).to.eql( 'My error' );
			expect( newState.email ).to.eql( 'foo@bar.com' );
			expect( newState.isRequesting ).to.eql( false );
		} );

		test( 'should leave other sites state unchanged', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_CREATE_COMPLETE,
				siteId: 123,
				email: 'foo@bar.com',
				error: 'My error',
			};
			const newState = sitesReducer(
				{
					123: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: '',
								email: '',
								isActivated: false,
								isRequesting: true,
							},
						},
					},
					456: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: '',
								email: '',
								isActivated: false,
								isRequesting: true,
							},
						},
					},
				},
				action
			);
			expect( newState[ 123 ].settings.stripeConnectAccount.isRequesting ).to.eql( false );
			expect( newState[ 456 ].settings.stripeConnectAccount.isRequesting ).to.eql( true );
		} );
	} );

	describe( 'connectAccountFetch', () => {
		test( 'should update state to show request in progress', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DETAILS_REQUEST,
				siteId: 123,
			};
			const newState = stripeConnectAccountReducer( undefined, action );
			expect( newState.isRequesting ).to.eql( true );
		} );

		test( 'should only update the request in progress flag for the appropriate siteId', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DETAILS_REQUEST,
				siteId: 123,
			};
			const newState = sitesReducer(
				{
					123: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: '',
								email: '',
								isActivated: false,
								isRequesting: false,
							},
						},
					},
					456: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: '',
								email: '',
								isActivated: false,
								isRequesting: false,
							},
						},
					},
				},
				action
			);
			expect( newState[ 123 ].settings.stripeConnectAccount.isRequesting ).to.eql( true );
			expect( newState[ 456 ].settings.stripeConnectAccount.isRequesting ).to.eql( false );
		} );
	} );

	describe( 'connectAccountFetchComplete', () => {
		test( 'should update state with the received account details', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DETAILS_UPDATE,
				connectedUserID: 'acct_14qyt6Alijdnw0EA',
				displayName: 'Foo Bar',
				email: 'foo@bar.com',
				firstName: 'Foo',
				isActivated: false,
				lastName: 'Bar',
				logo: 'http://bar.com/foo.png',
				siteId: 123,
			};
			const newState = stripeConnectAccountReducer( undefined, action );
			expect( newState ).to.eql( {
				connectedUserID: 'acct_14qyt6Alijdnw0EA',
				displayName: 'Foo Bar',
				email: 'foo@bar.com',
				error: '',
				firstName: 'Foo',
				isActivated: false,
				isDisconnecting: false,
				isRequesting: false,
				lastName: 'Bar',
				logo: 'http://bar.com/foo.png',
			} );
		} );

		test( 'should leave other sites state unchanged', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DETAILS_UPDATE,
				connectedUserID: 'acct_14qyt6Alijdnw0EA',
				email: 'foo@bar.com',
				siteId: 123,
			};
			const newState = sitesReducer(
				{
					123: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: '',
								email: '',
								isActivated: false,
								isRequesting: true,
							},
						},
					},
					456: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: '',
								email: '',
								isActivated: false,
								isRequesting: true,
							},
						},
					},
				},
				action
			);
			expect( newState[ 123 ].settings.stripeConnectAccount.isRequesting ).to.eql( false );
			expect( newState[ 123 ].settings.stripeConnectAccount.connectedUserID ).to.eql(
				'acct_14qyt6Alijdnw0EA'
			);
			expect( newState[ 123 ].settings.stripeConnectAccount.email ).to.eql( 'foo@bar.com' );
			expect( newState[ 456 ].settings.stripeConnectAccount.isRequesting ).to.eql( true );
		} );
	} );

	describe( 'connectAccountFetchError', () => {
		test( 'should reset the isRequesting flag in state', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DETAILS_UPDATE,
				siteId: 123,
				email: 'foo@bar.com',
				error: 'My error',
			};
			const newState = stripeConnectAccountReducer( undefined, action );
			expect( newState.error ).to.eql( 'My error' );
			expect( newState.email ).to.eql( 'foo@bar.com' );
			expect( newState.isRequesting ).to.eql( false );
		} );

		test( 'should leave other sites state unchanged', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DETAILS_UPDATE,
				siteId: 123,
				email: 'foo@bar.com',
				error: 'My error',
			};
			const newState = sitesReducer(
				{
					123: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: '',
								email: '',
								isActivated: false,
								isRequesting: true,
							},
						},
					},
					456: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: '',
								email: '',
								isActivated: false,
								isRequesting: true,
							},
						},
					},
				},
				action
			);
			expect( newState[ 123 ].settings.stripeConnectAccount.isRequesting ).to.eql( false );
			expect( newState[ 456 ].settings.stripeConnectAccount.isRequesting ).to.eql( true );
		} );
	} );

	// TODO
	describe( 'connectAccountDisconnect', () => {
		test( 'should update state to show request in progress', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DISCONNECT,
				siteId: 123,
			};
			const newState = stripeConnectAccountReducer( undefined, action );
			expect( newState.isDisconnecting ).to.eql( true );
		} );

		test( 'should only update the request in progress flag for the appropriate siteId', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DISCONNECT,
				siteId: 123,
			};
			const newState = sitesReducer(
				{
					123: {
						settings: {
							stripeConnectAccount: {
								isDisconnecting: false,
							},
						},
					},
					456: {
						settings: {
							stripeConnectAccount: {
								isDisconnecting: false,
							},
						},
					},
				},
				action
			);
			expect( newState[ 123 ].settings.stripeConnectAccount.isDisconnecting ).to.eql( true );
			expect( newState[ 456 ].settings.stripeConnectAccount.isDisconnecting ).to.eql( false );
		} );
	} );

	// TODO
	describe( 'connectAccountDisconnectComplete Success', () => {
		test( 'should update state', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DISCONNECT_COMPLETE,
				siteId: 123,
			};
			const newState = stripeConnectAccountReducer( undefined, action );
			expect( newState ).to.eql( {
				connectedUserID: '',
				displayName: '',
				email: '',
				error: '',
				firstName: '',
				isActivated: false,
				isDisconnecting: false,
				isRequesting: false,
				lastName: '',
				logo: '',
			} );
		} );

		test( 'should leave other sites state unchanged', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DISCONNECT_COMPLETE,
				siteId: 123,
			};
			const newState = sitesReducer(
				{
					123: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: 'acct_25rzu7Alijdnw0FB',
								displayName: 'Bar Foo',
								email: 'bar@foo.com',
								error: '',
								firstName: 'Bar',
								isActivated: false,
								isDisconnecting: true,
								isRequesting: false,
								lastName: 'Foo',
								logo: '',
							},
						},
					},
					456: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: 'acct_14qyt6Alijdnw0EA',
								displayName: 'Foo Bar',
								email: 'foo@bar.com',
								error: '',
								firstName: 'Foo',
								isActivated: false,
								isDisconnecting: false,
								isRequesting: false,
								lastName: 'Bar',
								logo: '',
							},
						},
					},
				},
				action
			);
			expect( newState[ 123 ].settings.stripeConnectAccount.isRequesting ).to.eql( false );
			expect( newState[ 123 ].settings.stripeConnectAccount.connectedUserID ).to.eql( '' );
			expect( newState[ 456 ].settings.stripeConnectAccount.connectedUserID ).to.eql(
				'acct_14qyt6Alijdnw0EA'
			);
		} );
	} );

	// TODO
	describe( 'connectAccountDisconnectComplete w/ Error', () => {
		test( 'should set the error in state', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DISCONNECT_COMPLETE,
				siteId: 123,
				error: 'My error',
			};
			const newState = stripeConnectAccountReducer( undefined, action );
			expect( newState.error ).to.eql( 'My error' );
		} );

		test( 'should leave other sites state unchanged', () => {
			const action = {
				type: WOOCOMMERCE_SETTINGS_STRIPE_CONNECT_ACCOUNT_DISCONNECT_COMPLETE,
				siteId: 123,
				error: 'My error',
			};
			const newState = sitesReducer(
				{
					123: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: 'acct_14qyt6Alijdnw0EA',
								displayName: 'Foo Bar',
								email: 'foo@bar.com',
								error: '',
								firstName: 'Foo',
								isActivated: false,
								isDisconnecting: true,
								isRequesting: false,
								lastName: 'Bar',
								logo: '',
							},
						},
					},
					456: {
						settings: {
							stripeConnectAccount: {
								connectedUserID: 'acct_14qyt6Alijdnw0EA',
								displayName: 'Foo Bar',
								email: 'foo@bar.com',
								error: '',
								firstName: 'Foo',
								isActivated: false,
								isDisconnecting: false,
								isRequesting: false,
								lastName: 'Bar',
								logo: '',
							},
						},
					},
				},
				action
			);
			expect( newState[ 123 ].settings.stripeConnectAccount.error ).to.eql( 'My error' );
			expect( newState[ 456 ].settings.stripeConnectAccount.isDisconnecting ).to.eql( false );
		} );
	} );
} );

/**
 * @format
 * @jest-environment jsdom
 */
/**
 * External dependencies
 */
import { mount, shallow } from 'enzyme';
import React from 'react';

/**
 * Internal dependencies
 */
import PlansGrid from '../plans-grid';
import QueryPlans from 'components/data/query-plans';
import { DEFAULT_PROPS, getSitePlans, SELECTED_SITE, SITE_PLAN_PRO } from './lib/plans';
import { PLAN_JETPACK_BUSINESS } from 'lib/plans/constants';
import { PlansTestComponent as Plans } from '../plans';

jest.mock( 'components/data/query-plans', () => 'components--data--query-plans' );
jest.mock( 'components/data/query-site-plans', () => 'components--data--query-site-plans' );
jest.mock( 'jetpack-connect/happychat-button', () => 'jetpack-connect--happychat-button' );
jest.mock( 'my-sites/plan-features', () => 'my-sites--plan-features' );

describe( 'Plans', () => {
	test( 'should render with no plan (free)', () => {
		const wrapper = shallow( <Plans { ...DEFAULT_PROPS } /> );

		expect( wrapper ).toMatchSnapshot();
		expect( wrapper.find( PlansGrid ) ).toHaveLength( 1 );
		expect( wrapper.find( QueryPlans ) ).toHaveLength( 1 );
	} );

	test( 'should render empty with a paid plan', () => {
		const wrapper = shallow(
			<Plans
				{ ...DEFAULT_PROPS }
				hasPlan={ true }
				selectedSite={ { ...SELECTED_SITE, plan: SITE_PLAN_PRO } }
				sitePlans={ getSitePlans( PLAN_JETPACK_BUSINESS ) }
			/>
		);

		expect( wrapper ).toMatchSnapshot();
		expect( wrapper.find( PlansGrid ) ).toHaveLength( 0 );
		expect( wrapper.find( QueryPlans ) ).toHaveLength( 1 );
	} );

	test( 'should render with a paid plan with showFirst prop', () => {
		const wrapper = shallow(
			<Plans
				{ ...DEFAULT_PROPS }
				hasPlan={ true }
				selectedSite={ { ...SELECTED_SITE, plan: SITE_PLAN_PRO } }
				showFirst={ true }
				sitePlans={ getSitePlans( PLAN_JETPACK_BUSINESS ) }
			/>
		);

		expect( wrapper ).toMatchSnapshot();
		expect( wrapper.find( PlansGrid ) ).toHaveLength( 1 );
		expect( wrapper.find( QueryPlans ) ).toHaveLength( 1 );
	} );

	test( 'should redirect on update from free to paid plan', () => {
		const wrapper = mount( <Plans { ...DEFAULT_PROPS } /> );

		const redirect = ( wrapper.instance().redirect = jest.fn() );

		wrapper.setProps( {
			hasPlan: true,
			selectedSite: { ...SELECTED_SITE, plan: SITE_PLAN_PRO },
			sitePlans: getSitePlans( PLAN_JETPACK_BUSINESS ),
		} );

		expect( redirect.mock.calls.length ).toBe( 1 );

		wrapper.unmount();
	} );

	test( 'should redirect if Atomic', () => {
		const goBackToWpAdmin = jest.fn();

		const wrapper = mount(
			<Plans
				{ ...DEFAULT_PROPS }
				goBackToWpAdmin={ goBackToWpAdmin }
				hasPlan={ true }
				isAutomatedTransfer={ true }
				selectedSite={ {
					...SELECTED_SITE,
					plan: SITE_PLAN_PRO,
					is_automated_transfer: true,
				} }
				sitePlans={ getSitePlans( PLAN_JETPACK_BUSINESS ) }
			/>
		);

		expect( goBackToWpAdmin.mock.calls.length ).toBe( 1 );

		wrapper.unmount();
	} );
} );

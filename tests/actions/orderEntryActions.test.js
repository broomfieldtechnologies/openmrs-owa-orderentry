import {
    fetchConfigurationsFailure,
    fetchConfigurationsSuccess,
    getOrderEntryConfigurations
} from '../../app/js/actions/orderEntryActions';
import {
    FETCH_ORDER_CONFIG_FAILURE,
    FETCH_ORDER_CONFIG_LOADING,
    FETCH_ORDER_CONFIG_SUCCESS
} from '../../app/js/actions/actionTypes';


describe ('Order entry configuration actions', () => {
    it('should create an action to store fetched configurations', () => {
        const configurations = {units: [{ id: 1, name: 'kilograms'}]};
        const expectedAction = {
            type: FETCH_ORDER_CONFIG_SUCCESS,
            configurations
        };
        expect(fetchConfigurationsSuccess(configurations)).toEqual(expectedAction);
    });

    it('should create an action to log failure', () => {
        const error = 'No network connection';
        const expectedAction = {
            type: FETCH_ORDER_CONFIG_FAILURE,
            error
        };
        expect(fetchConfigurationsFailure(error)).toEqual(expectedAction);
    });

    describe ('Order Entry Configurations API call', () => {

        beforeEach(() => {
            moxios.install();
        });

        it ('should dispatch `FETCH_ORDER_CONFIG_SUCCESS` after sucessfull fetching', () => {
            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: {
                        data: []
                    },
                });
            });

            const expectedActions = [
                FETCH_ORDER_CONFIG_LOADING,
                FETCH_ORDER_CONFIG_LOADING,
                FETCH_ORDER_CONFIG_SUCCESS
            ];

            const store = mockStore({ configurations: []});

            return store.dispatch(getOrderEntryConfigurations()).then(() => {
                const dispatchedActions = store.getActions();
                const dispatchedActionTypes = dispatchedActions.map(action => action.type);
                expect(dispatchedActionTypes).toEqual(expectedActions);
            });
        });

        it ('should throw an error if status code is not 200', () => {
            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 204,
                    response: {
                        statusText: 'OK'
                    },
                });
            });

            const expectedActions = [
                FETCH_ORDER_CONFIG_LOADING,
                FETCH_ORDER_CONFIG_LOADING,
                FETCH_ORDER_CONFIG_FAILURE
            ];

            const store = mockStore({ configurations: []});

            return store.dispatch(getOrderEntryConfigurations()).then(() => {
                const dispatchedActions = store.getActions();
                const dispatchedActionTypes = dispatchedActions.map(action => action.type);
                expect(dispatchedActionTypes).toEqual(expectedActions);
            });
        });


        it ('should dispatch `FETCH_ORDER_CONFIG_FAILURE` when unauthorized', () => {
            moxios.wait(() => {
                const request = moxios.requests.mostRecent();
                request.reject({
                    status: 401,
                    response: {
                        message: 'Not authorised',
                    },
                    statusText: 'unauthorised'
                });
            });

            const expectedActions = [
                FETCH_ORDER_CONFIG_LOADING,
                FETCH_ORDER_CONFIG_LOADING,
                FETCH_ORDER_CONFIG_FAILURE
            ];

            const store = mockStore({ configurations: []});

            return store.dispatch(getOrderEntryConfigurations()).then(() => {
                const dispatchedActions = store.getActions();
                const dispatchedActionTypes = dispatchedActions.map(action => action.type);
                expect(dispatchedActionTypes).toEqual(expectedActions);
            });
        });

        afterEach(() => {
            moxios.uninstall();
        });
    });
});

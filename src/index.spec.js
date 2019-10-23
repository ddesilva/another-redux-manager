import { makeActionCreator, createReduxManager } from './index';
import { expect } from 'chai';
import sinon from 'sinon';
import { fetchTypes } from './constants';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('createReduxManager', () => {
  const sandbox = sinon.createSandbox();
  const mock = new MockAdapter(axios);

  before(() => {});

  after(() => {
    sandbox.reset();
    sandbox.restore();
    mock.restore();
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
    mock.reset();
  });

  const contentReduxManager = createReduxManager({
    name: 'CONTENT',
    resultsPropName: 'results',
    argNames: ['payload']
  });

  describe('Generate Actions', () => {
    it('should return an object of actions and actionCreators', () => {
      const { initial, success, failure, inProgress } = contentReduxManager;
      const actionTypeKeys = contentReduxManager.actionTypeKeys;

      const contentFetchInDefault = initial({ data: 'test' });
      const contentFetchSuccess = success({ data: 'test' });
      const contentFetchingProgress = inProgress();
      const contentFetchfailure = failure('error');

      const name = contentReduxManager.name;

      expect(contentFetchInDefault).to.deep.equal({
        type: 'CONTENT_FETCH_INITIAL',
        payload: { data: 'test' }
      });

      expect(contentFetchSuccess).to.deep.equal({
        type: 'CONTENT_FETCH_SUCCESS',
        payload: { data: 'test' }
      });

      expect(contentFetchingProgress).to.deep.equal({
        type: 'CONTENT_FETCH_IN_PROGRESS'
      });

      expect(contentFetchfailure).to.deep.equal({
        type: 'CONTENT_FETCH_FAILED',
        payload: 'error'
      });

      expect(actionTypeKeys).to.deep.equal({
        CONTENT_FETCH_INITIAL: 'CONTENT_FETCH_INITIAL',
        CONTENT_FETCH_IN_PROGRESS: 'CONTENT_FETCH_IN_PROGRESS',
        CONTENT_FETCH_SUCCESS: 'CONTENT_FETCH_SUCCESS',
        CONTENT_FETCH_FAILED: 'CONTENT_FETCH_FAILED'
      });

      expect(name).to.equal('CONTENT');
    });
  });

  describe('fetch', () => {
    describe('when minimum required params are not provided', () => {
      it('should reject the promise with message', () => {
        contentReduxManager.fetch().catch(err => {
          return expect(err).to.equal('Missing Config Parameters For Fetch');
        });
      });
    });

    describe('when the minimum params are provided', () => {
      describe('when required params are not provided', () => {
        it('should make an axios GET call and get the data', async () => {
          const expected = { some: 'data' };

          mock.onGet('/some-endpoint').reply(200, expected);
          const result = await contentReduxManager.fetch({ url: '/some-endpoint' });

          expect(mock.history.get[0].url).to.equal('/some-endpoint');
          expect(result).to.deep.equal(expected);
        });
      });
    });

    describe('when data is provided', () => {
      it('should make an axios GET call with data', async () => {
        const expected = { some: 'data' };
        mock.onGet('/some-endpoint').reply(200, expected);

        await contentReduxManager.fetch({
          url: '/some-endpoint',
          data: { params: { some: 'param' } }
        });

        expect(mock.history.get[0].url).to.equal('/some-endpoint');
        expect(mock.history.get[0].data).to.equal('{"params":{"some":"param"}}');
      });
    });

    describe('when the custom type is set', () => {
      it('should make an axios POST call with data', async () => {
        const expected = { data: { some: 'data' } };
        mock.onPost('/some-endpoint').reply(200, expected);

        await contentReduxManager.fetch({
          url: '/some-endpoint',
          method: fetchTypes.POST,
          data: { params: { some: 'param' } }
        });
        expect(mock.history.post[0].url).to.equal('/some-endpoint');
        expect(mock.history.post[0].data).to.equal('{"params":{"some":"param"}}');
      });
    });

    describe('when the logger property is set and there is an error', () => {
      it('should call logger.error with an error message', async () => {
        const expected = { some: 'data' };
        mock.onGet('/some-endpoint').reply(200, expected);

        const customLogger = {
          error: sinon.stub()
        };

        await contentReduxManager
          .fetch({
            url: '/some-endpoint',
            logger: customLogger
          })
          .catch(() => {
            sinon.assert.calledWith(customLogger.error, { err: 'some-reason' }, 'Fetch Failed');
          });
      });
    });

    describe('when the name property is set and there is an error', () => {
      it('should call logger.error with an error message that includes the name property', async () => {
        const expected = { some: 'data' };
        mock.onGet('/some-endpoint').reply(200, expected);

        const customLogger = {
          error: sinon.stub()
        };

        await contentReduxManager
          .fetch({
            url: '/some-endpoint',
            logger: customLogger,
            name: 'Content'
          })
          .catch(() => {
            sinon.assert.calledWith(
              customLogger.error,
              { err: 'some-reason' },
              'Fetch Content Failed'
            );
          });
      });
    });
  });
});

describe('Generate Reducers', () => {
  describe('By default', () => {
    const contentReduxManager = createReduxManager({
      name: 'CONTENT',
      resultsPropName: 'results',
      argNames: ['payload']
    });

    it('should return the initial reducer method which resets the state', () => {
      const INITIAL_STATE = {
        [contentReduxManager.name]: {
          results: {
            key1: 'value1'
          }
        }
      };
      const reducerMethod = contentReduxManager.reducerMethods.initial;
      const result = reducerMethod(INITIAL_STATE, INITIAL_STATE[contentReduxManager.name].results);

      expect(result).to.deep.equal({
        [contentReduxManager.name]: {
          results: {
            key1: 'value1'
          },
          error: null,
          status: contentReduxManager.actionTypes.initial
        }
      });
    });

    it('should return the success reducer method which merges the response payload with the state.', () => {
      const INITIAL_STATE = {
        [contentReduxManager.name]: {
          results: {
            key1: 'value1'
          }
        }
      };
      const payload = {
        key2: 'value2'
      };
      const reducerMethod = contentReduxManager.reducerMethods.success;
      const action = contentReduxManager.success(payload);
      const result = reducerMethod(INITIAL_STATE, action, {});

      expect(result).to.deep.equal({
        [contentReduxManager.name]: {
          results: { key1: 'value1', key2: 'value2' },
          error: null,
          status: contentReduxManager.actionTypes.success
        }
      });
    });

    it('should return the inProgress reducer method which sets the inProgress state only', () => {
      const INITIAL_STATE = contentReduxManager.reducerMethods.initial({}, {});
      const reducerMethod = contentReduxManager.reducerMethods.inProgress;
      const action = contentReduxManager.inProgress();
      const result = reducerMethod(INITIAL_STATE, action, {});
      expect(result).to.deep.equal({
        [contentReduxManager.name]: {
          results: {},
          error: null,
          status: contentReduxManager.actionTypes.inProgress
        }
      });
    });

    it('should return the failure reducer method which sets the error state only', () => {
      const INITIAL_STATE = contentReduxManager.reducerMethods.initial({}, {});
      const payload = 'test';
      const reducerMethod = contentReduxManager.reducerMethods.failure;
      const action = contentReduxManager.failure(payload);
      const result = reducerMethod(INITIAL_STATE, action, {});

      expect(result).to.deep.equal({
        [contentReduxManager.name]: {
          results: {},
          error: payload,
          status: contentReduxManager.actionTypes.failure
        }
      });
    });
  });

  describe('if reducerMethods function is passed in', () => {
    it('should use that function to create the shape of the reducers', () => {
      const reducersTemplate = (reduxManager, resultsPropName) => {
        return {
          success: (state, action) => {
            return {
              ...state,
              ...{
                [resultsPropName]: action.payload,
                status: reduxManager.actionTypes.success,
                error: null
              }
            };
          }
        };
      };

      const contentReduxManager = createReduxManager({
        name: 'CONTENT',
        argNames: ['payload'],
        resultsPropName: 'results',
        reducerMethods: reducersTemplate
      });

      const INITIAL_STATE = {};
      const payload = 'test';
      const reducerMethod = contentReduxManager.reducerMethods.success;
      const action = contentReduxManager.success(payload);
      const result = reducerMethod(INITIAL_STATE, action, {});
      expect(result).to.deep.equal({
        results: payload,
        error: null,
        status: contentReduxManager.actionTypes.success
      });
    });
  });
});

describe('makeActionCreator', () => {
  it('should return an action creator', () => {
    const contentActionCreator = makeActionCreator('CONTENT_FETCH', 'name');

    expect(contentActionCreator('test')).to.deep.equal({
      type: 'CONTENT_FETCH',
      name: 'test'
    });
  });
});

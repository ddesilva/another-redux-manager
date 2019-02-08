import { makeActionCreator, createReduxManager } from './index';
import { expect } from 'chai';

describe('createReduxManager', () => {
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
});

describe('Generate Reducers', () => {
  describe('By default', () => {
    const contentReduxManager = createReduxManager({
      name: 'CONTENT',
      resultsPropName: 'results',
      argNames: ['payload']
    });

    it('should return the initial reducer method', () => {
      const INITIAL_STATE = {};
      const payload = 'test';
      const reducerMethod = contentReduxManager.reducerMethods.initial;
      const action = contentReduxManager.initial(payload);
      const result = reducerMethod(INITIAL_STATE, action, {});
      expect(result).to.deep.equal({
        [contentReduxManager.name]: {
          results: {},
          error: {},
          status: contentReduxManager.actionTypes.initial
        }
      });
    });

    it('should return the success reducer method', () => {
      const INITIAL_STATE = {};
      const payload = 'test';
      const reducerMethod = contentReduxManager.reducerMethods.success;
      const action = contentReduxManager.success(payload);
      const result = reducerMethod(INITIAL_STATE, action, {});
      expect(result).to.deep.equal({
        [contentReduxManager.name]: {
          results: payload,
          error: {},
          status: contentReduxManager.actionTypes.success
        }
      });
    });

    it('should return the inProgress reducer method', () => {
      const INITIAL_STATE = {};
      const payload = 'test';
      const reducerMethod = contentReduxManager.reducerMethods.inProgress;
      const action = contentReduxManager.inProgress(payload);
      const result = reducerMethod(INITIAL_STATE, action, {});
      expect(result).to.deep.equal({
        [contentReduxManager.name]: {
          results: {},
          error: {},
          status: contentReduxManager.actionTypes.inProgress
        }
      });
    });

    it('should return the failure reducer method', () => {
      const INITIAL_STATE = {};
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
                error: {}
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
        error: {},
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

import { makeActionCreator, makeAsyncActionCreators } from './index';
import { expect } from 'chai';

describe('makeAsyncActionCreators', () => {
    it('should return an object of actions and actionCreators', () => {
        const contentActionHelper = makeAsyncActionCreators('CONTENT', 'name', 'content');

        const { initial, success, failure, inProgress } = contentActionHelper;
        const actionTypeKeys = contentActionHelper.actionTypeKeys;

        const contentFetchInDefault = initial('test', { data: 'test' });
        const contentFetchSuccess = success('test', { data: 'test' });
        const contentFetchingProgress = inProgress('test');
        const contentFetchfailure = failure('test');

        expect(contentFetchInDefault).to.deep.equal({
            type: 'CONTENT_FETCH_INITIAL',
            name: 'test',
            content: { data: 'test' }
        });

        expect(contentFetchSuccess).to.deep.equal({
            type: 'CONTENT_FETCH_SUCCESS',
            name: 'test',
            content: { data: 'test' }
        });

        expect(contentFetchingProgress).to.deep.equal({
            type: 'CONTENT_FETCH_IN_PROGRESS',
            name: 'test'
        });

        expect(contentFetchfailure).to.deep.equal({
            type: 'CONTENT_FETCH_FAILED',
            name: 'test'
        });

        expect(actionTypeKeys).to.deep.equal({
            CONTENT_FETCH_INITIAL: 'CONTENT_FETCH_INITIAL',
            CONTENT_FETCH_IN_PROGRESS: 'CONTENT_FETCH_IN_PROGRESS',
            CONTENT_FETCH_SUCCESS: 'CONTENT_FETCH_SUCCESS',
            CONTENT_FETCH_FAILED: 'CONTENT_FETCH_FAILED'
        });
    });
});

describe('makeActionCreator', () => {
    it('should return an action creator', () => {
        const contentActionHelper = makeActionCreator('CONTENT_FETCH', 'name');

        expect(contentActionHelper('test')).to.deep.equal({
            type: 'CONTENT_FETCH',
            name: 'test'
        });
    });
});

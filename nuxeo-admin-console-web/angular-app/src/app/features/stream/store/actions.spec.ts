import { Stream } from '../stream.interface';
import * as StreamActions from './actions';
import { HttpErrorResponse } from '@angular/common/http';

describe('Stream Actions', () => {
  describe('fetchStreams', () => {
    it('should create a fetchStreams action', () => {
      const action = StreamActions.fetchStreams();
      expect(action.type).toEqual('[Admin] Fetch Streams');
    });
  });

  describe('onFetchStreamsLaunch', () => {
    it('should create an onFetchStreamsLaunch action with streamsData', () => {
      const streamsData: Stream[] = [
        { name: 'stream1', partitions: 0 },
        { name: 'stream2', partitions: 1 },
      ];

      const action = StreamActions.onFetchStreamsLaunch({ streamsData });
      expect(action.type).toEqual('[Admin] On Fetch Streams Launch');
      expect(action.streamsData).toEqual(streamsData);
    });
  });

  describe('onFetchStreamsFailure', () => {
    it('should create an onFetchStreamsFailure action with error', () => {
      const error = new HttpErrorResponse({ error: '500' });
      const action = StreamActions.onFetchStreamsFailure({ error });
      expect(action.type).toEqual('[Admin] On Fetch Streams Failure');
      expect(action.error).toEqual(error);
    });
  });

  describe('resetFetchStreamsState', () => {
    it('should create a resetFetchStreamsState action', () => {
      const action = StreamActions.resetFetchStreamsState();
      expect(action.type).toEqual('[Admin] Reset Fetch Streams State');
    });
  });

  describe('fetchConsumers', () => {
    it('should create a fetchConsumers action with params', () => {
      const params = { stream: 'stream1', consumer: 'consumer1' };
      const action = StreamActions.fetchConsumers({ params });
      expect(action.type).toEqual('[Admin] Fetch Consumers');
      expect(action.params).toEqual(params);
    });
  });

  describe('onFetchConsumersLaunch', () => {
    it('should create an onFetchConsumersLaunch action with consumersData', () => {
      const consumersData = [
        { stream: 'stream1', consumer: 'consumer1' },
        { stream: 'stream2', consumer: 'consumer2' },
      ];
      const action = StreamActions.onFetchConsumersLaunch({ consumersData });
      expect(action.type).toEqual('[Admin] On Fetch Consumers Launch');
      expect(action.consumersData).toEqual(consumersData);
    });
  });

  describe('onFetchConsumersFailure', () => {
    it('should create an onFetchConsumersFailure action with error', () => {
      const error = new HttpErrorResponse({ error: '400' });
      const action = StreamActions.onFetchConsumersFailure({ error });
      expect(action.type).toEqual('[Admin] On Fetch Consumers Failure');
      expect(action.error).toEqual(error);
    });
  });

  describe('resetFetchConsumersState', () => {
    it('should create a resetFetchConsumersState action', () => {
      const action = StreamActions.resetFetchConsumersState();
      expect(action.type).toEqual('[Admin] Reset Fetch Consumers State');
    });
  });

  describe('triggerRecordsSSEStream', () => {
    it('should create a triggerRecordsSSEStream action with params', () => {
      const params = { key1: 'value1', key2: 'value2' };
      const action = StreamActions.triggerRecordsSSEStream({ params });
      expect(action.type).toEqual('[Admin] Trigger Records SSE Stream');
      expect(action.params).toEqual(params);
    });
  });

  describe('onFetchRecordsLaunch', () => {
    it('should create an onFetchRecordsLaunch action with recordsData', () => {
      const recordsData = { data: 'some data' };
      const action = StreamActions.onFetchRecordsLaunch({ recordsData });
      expect(action.type).toEqual('[Admin] On Fetch Records Launch');
      expect(action.recordsData).toEqual(recordsData);
    });
  });

  describe('onFetchRecordsFailure', () => {
    it('should create an onFetchRecordsFailure action with error', () => {
      const error = new HttpErrorResponse({ error: '403' });
      const action = StreamActions.onFetchRecordsFailure({ error });
      expect(action.type).toEqual('[Admin] On Fetch Records Failure');
      expect(action.error).toEqual(error);
    });
  });

  describe('resetFetchRecordsState', () => {
    it('should create a resetFetchRecordsState action', () => {
      const action = StreamActions.resetFetchRecordsState();
      expect(action.type).toEqual('[Admin] Reset Fetch Records State');
    });
  });

  describe('onStopFetch', () => {
    it('should create an onStopFetch action', () => {
      const action = StreamActions.onStopFetch();
      expect(action.type).toEqual('[Admin] Stop Fetching Records');
    });
  });

  describe('onStopFetchLaunch', () => {
    it('should create an onStopFetchLaunch action', () => {
      const action = StreamActions.onStopFetchLaunch();
      expect(action.type).toEqual('[Admin] On Stop Fetch Launch');
    });
  });

  describe('onStopFetchFailure', () => {
    it('should create an onStopFetchFailure action with error', () => {
      const error = { message: 'error' };
      const action = StreamActions.onStopFetchFailure({ error });
      expect(action.type).toEqual('[Admin] On Stop Fetch Failure');
      expect(action.error).toEqual(error);
    });
  });

  describe('resetStopFetchState', () => {
    it('should create a resetStopFetchState action', () => {
      const action = StreamActions.resetStopFetchState();
      expect(action.type).toEqual('[Admin] Reset Stop Fetch State');
    });
  });
});

import { streamsReducer, initialStreamsState } from './reducers';
import * as StreamActions from './actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Stream } from '../stream.interface';

describe('streamsReducer', () => {
    describe('fetchStreams', () => {
      it('should return the initial state', () => {
        const result = streamsReducer(undefined, { type: "" });
        expect(result).toEqual(initialStreamsState);
      });
  
      it('should handle fetchStreams', () => {
        const action = StreamActions.fetchStreams();
        const result = streamsReducer(initialStreamsState, action);
        expect(result.streamsError).toBeNull();
      });
  
      it('should handle onFetchStreamsLaunch', () => {
        const streamsData: Stream[] = [{ name: 'Stream 1' }, { name: 'Stream 2' }];
        const action = StreamActions.onFetchStreamsLaunch({ streamsData });
        const result = streamsReducer(initialStreamsState, action);
        expect(result.streams).toEqual(streamsData);
      });
  
      it('should handle onFetchStreamsFailure', () => {
        const error = new HttpErrorResponse({ error: 'Failed to fetch streams' });
        const action = StreamActions.onFetchStreamsFailure({ error });
        const result = streamsReducer(initialStreamsState, action);
        expect(result.streamsError).toEqual(error);
      });
  
      it('should handle resetFetchStreamsState', () => {
        const state = {
          streams: [{ name: 'Stream 1' }],
          consumers: [],
          records: [],
          recordsError: null,
          consumersError: null,
          streamsError: new HttpErrorResponse({ error: 'Some error' }),
          isFetchStopped: false,        // Added missing property
          isFetchStoppedError: null,    // Added missing property
        };
        const action = StreamActions.resetFetchStreamsState();
        const result = streamsReducer(state, action);
        expect(result.streams).toEqual(initialStreamsState.streams);
        expect(result.streamsError).toBeNull();
        expect(result.isFetchStopped).toBeFalse();   // Ensure the `isFetchStopped` is reset properly
        expect(result.isFetchStoppedError).toBeNull(); // Ensure `isFetchStoppedError` is reset properly
      });
    });
  
    describe('fetchConsumers', () => {
      it('should handle fetchConsumers with params', () => {
        const params = { key1: 'value1', key2: 'value2' };
        const action = StreamActions.fetchConsumers({ params });
        const result = streamsReducer(initialStreamsState, action);
        expect(result.consumersError).toBeNull();
      });
  
      it('should handle onFetchConsumersLaunch', () => {
        const consumersData = [{ stream: 'Stream 1', consumer: 'Consumer 1' }];
        const action = StreamActions.onFetchConsumersLaunch({ consumersData });
        const result = streamsReducer(initialStreamsState, action);
        expect(result.consumers).toEqual(consumersData);
      });
  
      it('should handle onFetchConsumersFailure', () => {
        const error = new HttpErrorResponse({ error: 'Failed to fetch consumers' });
        const action = StreamActions.onFetchConsumersFailure({ error });
        const result = streamsReducer(initialStreamsState, action);
        expect(result.consumersError).toEqual(error);
      });
  
      it('should handle resetFetchConsumersState', () => {
        const state = {
          streams: [],
          consumers: [{ stream: 'Stream 1', consumer: 'Consumer 1' }],
          records: [],
          recordsError: null,
          streamsError: null,
          consumersError: new HttpErrorResponse({ error: 'Some error' }),
          isFetchStopped: false,        // Added missing property
          isFetchStoppedError: null,    // Added missing property
        };
        const action = StreamActions.resetFetchConsumersState();
        const result = streamsReducer(state, action);
        expect(result.consumers).toEqual(initialStreamsState.consumers);
        expect(result.consumersError).toBeNull();
        expect(result.isFetchStopped).toBeFalse();   // Ensure the `isFetchStopped` is reset properly
        expect(result.isFetchStoppedError).toBeNull(); // Ensure `isFetchStoppedError` is reset properly
      });
    });
  
    describe('fetchRecords', () => {
      it('should handle triggerRecordsSSEStream with params', () => {
        const params = { key1: 'value1', key2: 'value2' };
        const action = StreamActions.triggerRecordsSSEStream({ params });
        const result = streamsReducer(initialStreamsState, action);
        expect(result.recordsError).toBeNull();
      });
  
      it('should handle onFetchRecordsLaunch', () => {
        const recordsData = [{ type: 'type1' }, { type: 'type2' }];
        const action = StreamActions.onFetchRecordsLaunch({ recordsData });
        const result = streamsReducer(initialStreamsState, action);
        expect(result.records).toEqual(recordsData);
      });
  
      it('should handle onFetchRecordsFailure', () => {
        const error = new HttpErrorResponse({ error: 'Failed to fetch records' });
        const action = StreamActions.onFetchRecordsFailure({ error });
        const result = streamsReducer(initialStreamsState, action);
        expect(result.recordsError).toEqual(error);
      });
  
      it('should handle resetFetchRecordsState', () => {
        const state = {
          streams: [],
          consumers: [],
          records: [{ type: 'type1' }],
          recordsError: new HttpErrorResponse({ error: 'Some error' }),
          streamsError: null,
          consumersError: null,
          isFetchStopped: false,        // Added missing property
          isFetchStoppedError: null,    // Added missing property
        };
        const action = StreamActions.resetFetchRecordsState();
        const result = streamsReducer(state, action);
        expect(result.records).toEqual(initialStreamsState.records);
        expect(result.recordsError).toBeNull();
        expect(result.isFetchStopped).toBeFalse();   // Ensure the `isFetchStopped` is reset properly
        expect(result.isFetchStoppedError).toBeNull(); // Ensure `isFetchStoppedError` is reset properly
      });
    });
  });
  

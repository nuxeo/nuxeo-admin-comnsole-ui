import { createReducer, on } from "@ngrx/store";
import * as StreamActions from "./actions";
import { Stream } from "../stream.interface";
import { HttpErrorResponse } from "@angular/common/http";

export interface StreamsState {
  streams: Stream[];
  consumers: { stream: string; consumer: string }[];
  records: { type?: string }[];
  isFetchStopped: boolean;
  isFetchStoppedError: unknown | null;
  streamsError: HttpErrorResponse | null;
  consumersError: HttpErrorResponse | null;
  recordsError: HttpErrorResponse | null;
}

export const initialStreamsState: StreamsState = {
  streams: [],
  consumers: [],
  records: [],
  isFetchStopped: false,
  isFetchStoppedError: null,
  streamsError: null,
  consumersError: null,
  recordsError: null,
};

export const streamsReducer = createReducer(
  initialStreamsState,

  // Fetch Streams
  on(StreamActions.fetchStreams, (state) => ({
    ...state,
    streamsError: null,
  })),
  on(StreamActions.onFetchStreamsLaunch, (state, { streamsData }) => ({
    ...state,
    streams: streamsData,
  })),
  on(StreamActions.onFetchStreamsFailure, (state, { error }) => ({
    ...state,
    streamsError: error,
  })),
  on(StreamActions.resetFetchStreamsState, (state) => ({
    ...state,
    streams: initialStreamsState.streams,
    streamsError: null,
  })),

  // Fetch Consumers
  on(StreamActions.fetchConsumers, (state) => ({
    ...state,
    consumersError: null,
  })),
  on(StreamActions.onFetchConsumersLaunch, (state, { consumersData }) => ({
    ...state,
    consumers: consumersData,
  })),
  on(StreamActions.onFetchConsumersFailure, (state, { error }) => ({
    ...state,
    consumersError: error,
  })),
  on(StreamActions.resetFetchConsumersState, (state) => ({
    ...state,
    consumers: initialStreamsState.consumers,
    consumersError: null,
  })),

  // Fetch Records via SSE
  on(StreamActions.triggerRecordsSSEStream, (state) => ({
    ...state,
    recordsError: null,
  })),
  on(StreamActions.onFetchRecordsLaunch, (state, { recordsData }) => ({
    ...state,
    records: Array.isArray(recordsData) ? recordsData : [recordsData],
  })),
  on(StreamActions.onFetchRecordsFailure, (state, { error }) => ({
    ...state,
    recordsError: error,
  })),
  on(StreamActions.resetFetchRecordsState, (state) => ({
    ...state,
    records: initialStreamsState.records,
    recordsError: null,
  })),

  // Stop SSE Fetching
  on(StreamActions.onStopFetchLaunch, (state) => ({
    ...state,
    isFetchStopped: true,
  })),
  on(StreamActions.onStopFetchFailure, (state) => ({
    ...state,
    isFetchStoppedError: false,
  })),
  on(StreamActions.resetStopFetchState, (state) => ({
    ...state,
    isFetchStopped: false,
    isFetchStoppedError: null
  })),
);
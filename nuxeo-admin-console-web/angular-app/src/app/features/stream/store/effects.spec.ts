import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Observable, of, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { Action } from "@ngrx/store";
import { StreamService } from "../services/stream.service";
import * as StreamActions from "../store/actions";
import { loadFetchStreamsEffect, loadFetchConsumersEffect, triggerRecordsSSEStream$ } from "./effects";

describe("StreamEffects", () => {
  let actions$: Observable<Action>;
  let loadFetchStreams: typeof loadFetchStreamsEffect;
  let loadFetchConsumers: typeof loadFetchConsumersEffect;
  let triggerRecordsSSEStream: typeof triggerRecordsSSEStream$;
  let streamService: jasmine.SpyObj<StreamService>;

  beforeEach(() => {
    const streamServiceSpy = jasmine.createSpyObj("StreamService", [
      "getStreams",
      "getConsumers",
      "startSSEStream",
      "stopSSEStream",
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: StreamService, useValue: streamServiceSpy },
      ],
    });
    streamService = TestBed.inject(StreamService) as jasmine.SpyObj<StreamService>;
    loadFetchStreams = TestBed.runInInjectionContext(() => loadFetchStreamsEffect);
    loadFetchConsumers = TestBed.runInInjectionContext(() => loadFetchConsumersEffect);
    triggerRecordsSSEStream = TestBed.runInInjectionContext(() => triggerRecordsSSEStream$);
  });

  describe("loadFetchStreamsEffect", () => {
    it("should return onFetchStreamsLaunch on success", (done) => {
      const streamsData = [{ name: "stream1" }, { name: "stream2" }];
      const action = StreamActions.fetchStreams();
      streamService.getStreams.and.returnValue(of(streamsData));
      const outcome = StreamActions.onFetchStreamsLaunch({ streamsData });
      actions$ = of(action);
      loadFetchStreams(actions$, streamService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it("should return onFetchStreamsFailure on error", (done) => {
      const error = new HttpErrorResponse({
        error: "500",
        status: 500,
        statusText: "Server Error",
      });
      const action = StreamActions.fetchStreams();
      streamService.getStreams.and.returnValue(throwError(() => error));
      const outcome = StreamActions.onFetchStreamsFailure({ error });
      actions$ = of(action);
      loadFetchStreams(actions$, streamService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe("loadFetchConsumersEffect", () => {
    it("should return onFetchConsumersLaunch on success", (done) => {
      const consumersData = [{ stream: "stream1", consumer: "consumer1" }];
      const action = StreamActions.fetchConsumers({ params: { stream: "stream1" } });
      streamService.getConsumers.and.returnValue(of(consumersData));
      const outcome = StreamActions.onFetchConsumersLaunch({ consumersData });
      actions$ = of(action);
      loadFetchConsumers(actions$, streamService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it("should return onFetchConsumersFailure on error", (done) => {
      const error = new HttpErrorResponse({
        error: "404",
        status: 404,
        statusText: "Not Found",
      });
      const action = StreamActions.fetchConsumers({ params: { stream: "stream1" } });
      streamService.getConsumers.and.returnValue(throwError(() => error));
      const outcome = StreamActions.onFetchConsumersFailure({ error });
      actions$ = of(action);
      loadFetchConsumers(actions$, streamService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });

  describe("triggerRecordsSSEStream$", () => {
    it("should return onFetchRecordsLaunch on success", (done) => {
      const recordsData = [{ record: "record1" }];
      const action = StreamActions.triggerRecordsSSEStream({ params: { streamId: "1" } });
      streamService.startSSEStream.and.returnValue(of(JSON.stringify({ record: "record1" })));
      const outcome = StreamActions.onFetchRecordsLaunch({ recordsData });
      actions$ = of(action);
      triggerRecordsSSEStream(actions$, streamService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });

    it("should return onFetchRecordsFailure on error", (done) => {
      const error = new HttpErrorResponse({
        error: "500",
        status: 500,
        statusText: "Server Error",
      });
      const action = StreamActions.triggerRecordsSSEStream({ params: { streamId: "1" } });
      streamService.startSSEStream.and.returnValue(throwError(() => error));
      const outcome = StreamActions.onFetchRecordsFailure({ error });
      actions$ = of(action);
      triggerRecordsSSEStream(actions$, streamService).subscribe((result: Action) => {
        expect(result).toEqual(outcome);
        done();
      });
    });
  });
});

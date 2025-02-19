import { HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, EMPTY, from, of } from "rxjs";
import {
  catchError,
  map,
  mergeMap,
  scan,
  switchMap,
  takeUntil,
  tap
} from "rxjs/operators";
import { createEffect } from "@ngrx/effects";
import { Actions, ofType } from "@ngrx/effects";
import * as StreamActions from "../store/actions";
import { inject } from "@angular/core";
import { StreamService } from "../services/stream.service";
import { Stream } from "../stream.interface";

export const loadFetchStreamsEffect = createEffect(
  (actions$ = inject(Actions), streamService = inject(StreamService)) => {
    return actions$.pipe(
      ofType(StreamActions.fetchStreams),
      switchMap(() => {
        return streamService.getStreams().pipe(
          map((data: Stream[]) => {
            return StreamActions.onFetchStreamsLaunch({
              streamsData: data,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              StreamActions.onFetchStreamsFailure({
                error,
              })
            );
          })
        );
      })
    );
  },
  { functional: true }
);

export const loadFetchConsumersEffect = createEffect(
  (actions$ = inject(Actions), streamService = inject(StreamService)) => {
    return actions$.pipe(
      ofType(StreamActions.fetchConsumers),
      switchMap((action) => {
        return streamService.getConsumers(action?.params).pipe(
          map((data: { stream: string; consumer: string }[]) => {
            return StreamActions.onFetchConsumersLaunch({
              consumersData: data,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              StreamActions.onFetchConsumersFailure({
                error,
              })
            );
          })
        );
      })
    );
  },
  { functional: true }
);

const streamState$ = new BehaviorSubject<boolean>(true);

export const triggerRecordsSSEStream$ = createEffect(
  (
    actions$ = inject(Actions),
    streamService = inject(StreamService)
  ) => {
    return actions$.pipe(
      ofType(StreamActions.triggerRecordsSSEStream),
      tap(() => {
        streamState$.next(true);
      }),
      mergeMap((action) =>
        streamService.startSSEStream(action.params).pipe(
          scan((acc: unknown[], response: unknown) => {
            let parsedResponse;
            try {
              parsedResponse =
                typeof response === "string" ? JSON.parse(response) : response;
            } catch (error) {
              console.error("Error parsing response:", error);
              return acc;
            }
            return [...acc, parsedResponse];
          }, []),
          map((recordsArray) =>
            StreamActions.onFetchRecordsLaunch({ recordsData: recordsArray })
          ),
          takeUntil(
            actions$.pipe(
              ofType(StreamActions.onStopFetch),
              mergeMap(() => {
                return from(streamService.stopSSEStream()).pipe(
                  tap(() => {
                    streamState$.next(false);
                  }),
                  map(() => StreamActions.onStopFetchLaunch()),
                  catchError((error) => {
                    console.error("Error stopping SSE stream:", error);
                    return of(StreamActions.onStopFetchFailure({ error }));
                  })
                );
              })
            )
          ),
          catchError((error) => {
            console.error("SSE Stream Error:", error);
            streamState$.next(false);
            return of(StreamActions.onFetchRecordsFailure({ error }));
          })
        )
      )
    );
  },
  { functional: true, dispatch: true }
);


export const stopRecordsSSEStream$ = createEffect(
  (actions$ = inject(Actions), streamService = inject(StreamService)) => {
    return actions$.pipe(
      ofType(StreamActions.onStopFetch),
      mergeMap(() => {
        if (!streamState$.getValue()) {
          console.warn("SSE stream already stopped.");
          return EMPTY;
        }
        return from(streamService.stopSSEStream()).pipe(
          tap(() => {
            console.log("SSE stream successfully stopped.");
            streamState$.next(false);
          }),
          map(() => {
            return StreamActions.onStopFetchLaunch()
          }),
          catchError((error) => {
            console.error("Error pausing SSE stream:", error);
            return of(StreamActions.onStopFetchFailure({ error }));
          })
        );
      })
    );
  },
  { functional: true, dispatch: true }
);







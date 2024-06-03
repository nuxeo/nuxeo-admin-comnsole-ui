import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { HomeService } from "../services/home.service";
import * as HomeActions from "./actions";

export const loadVersionInfoEffect = createEffect(
  (actions$ = inject(Actions), homeService = inject(HomeService)) => {
    return actions$.pipe(
      ofType(HomeActions.fetchversionInfo),
      switchMap(() => {
        return homeService.getversionInfo().pipe(
          map((data) => {
            return HomeActions.fetchversionInfoSuccess({
              versionInfo: {
                version: data?.version,
                clusterEnabled: data?.clusterEnabled,
              },
            });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(HomeActions.fetchversionInfoFailure({ error }));
          })
        );
      })
    );
  },
  { functional: true }
);

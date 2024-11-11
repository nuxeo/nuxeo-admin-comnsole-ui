import { CustomSnackBarComponent } from "./../../../../shared/components/custom-snack-bar/custom-snack-bar.component";
import { CommonService } from "../../../../shared/services/common.service";
import { PROBES, PROBES_LABELS } from "../probes-data.constants";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { ProbeState, ProbesInfo } from "../store/reducers";
import * as ProbeActions from "../store/actions";
import { ProbeDataService } from "../services/probes-data.service";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "probes-data",
  templateUrl: "./probes-data.component.html",
  styleUrls: ["./probes-data.component.scss"],
})
export class ProbesDataComponent implements OnInit, OnDestroy {
  @Input() summary = false;
  probesData: ProbesInfo[] = [];
  fetchProbesSubscription = new Subscription();
  fetchProbes$: Observable<ProbesInfo[]>;
  PROBES_LABELS = PROBES_LABELS;
  columnsToDisplay: string[] = [];

  defaultColumns = [
    { propertyName: "probe", label: "Probe", summaryOnly: true },
    { propertyName: "success", label: "Success", summaryOnly: true },
    {
      propertyName: "neverExecuted",
      label: "Last Executed",
      summaryOnly: true,
    },
    { propertyName: "information", label: "Information", summaryOnly: true },
    { propertyName: "run", label: "Run", summaryOnly: false },
    {
      propertyName: "successCount",
      label: "Success Count",
      summaryOnly: false,
    },
    {
      propertyName: "failureCount",
      label: "Failure Count",
      summaryOnly: false,
    },
    { propertyName: "time", label: "Time", summaryOnly: false },
    { propertyName: "history", label: "History", summaryOnly: false },
    { propertyName: "actions", label: "Actions", summaryOnly: false },
  ];
  hideTitle = true;
  probeLaunchedSuccessSubscription = new Subscription();
  probeLaunchedErrorSubscription = new Subscription();
  probeLaunchedSuccess$: Observable<ProbesInfo[]>;
  probeLaunchedError$: Observable<HttpErrorResponse | null>;
  probeLaunched: ProbesInfo = {} as ProbesInfo;

  constructor(
    private store: Store<{ probes: ProbeState }>,
    private probeService: ProbeDataService,
    private commonService: CommonService,
    private _snackBar: MatSnackBar
  ) {
    this.fetchProbes$ = this.store.pipe(
      select((state) => state.probes?.probesInfo)
    );
    this.probeLaunchedSuccess$ = this.store.pipe(
      select((state) => state.probes?.probesInfo)
    );
    this.probeLaunchedError$ = this.store.pipe(
      select((state) => state.probes?.error)
    );
  }
  ngOnInit(): void {
    this.columnsToDisplay = this.defaultColumns
      .filter((column) => (this.summary ? column.summaryOnly : true))
      .map((column) => column.propertyName);
    this.hideTitle = !this.defaultColumns.some(
      (col) => col.summaryOnly && this.summary
    );

    this.fetchProbesSubscription = this.fetchProbes$.subscribe(
      (data: ProbesInfo[]) => {
        if (data?.length !== 0) {
          this.probesData = data;
        } else {
          this.store.dispatch(ProbeActions.loadProbesData());
        }
      }
    );

    this.probeLaunchedSuccessSubscription =
      this.probeLaunchedSuccess$.subscribe((data) => {
        if (
          data &&
          data?.length > 0 &&
          Object.entries(this.probeLaunched).length > 0
        ) {
          this._snackBar.openFromComponent(CustomSnackBarComponent, {
            data: {
              message: PROBES_LABELS.PROBE_LAUNCHED_SUCCESS.replaceAll(
                "{probeName}",
                this.probeLaunched?.name
              ),
              panelClass: "success-snack",
            },
            duration: 5000,
            panelClass: ["success-snack"],
          });
        }
      });

    this.probeLaunchedErrorSubscription = this.probeLaunchedError$.subscribe(
      (error) => {
        if (error) {
          this._snackBar.openFromComponent(CustomSnackBarComponent, {
            data: {
              message: PROBES_LABELS.PROBE_LAUNCHED_ERROR.replaceAll(
                "{probeName}",
                this.probeLaunched?.name
              ),
              panelClass: "error-snack",
            },
            duration: 5000,
            panelClass: ["error-snack"],
          });
        }
      }
    );
  }

  deriveProbeDisplayName(probeName: string): string {
    const probe = PROBES.find((probe) => probe.name === probeName);
    return probe ? probe.displayName : probeName;
  }

  determineImageSource(neverExecuted: boolean, successStatus: boolean): string {
    if (neverExecuted) {
      return PROBES_LABELS.SUCCESS_STATUS_ICONS.UNKNOWN;
    }
    return successStatus
      ? PROBES_LABELS.SUCCESS_STATUS_ICONS.TRUE
      : PROBES_LABELS.SUCCESS_STATUS_ICONS.FALSE;
  }

  formatTooltipText(probeStatus: string | boolean): string {
    return this.probeService.formatToTitleCase(probeStatus.toString());
  }

  isColumnVisible(propertyName: string): boolean {
    return this.columnsToDisplay.some((column) => column === propertyName);
  }

  viewDetails(): void {
    this.commonService.redirectToProbesDetails();
  }

  launchProbe(probe: ProbesInfo): void {
    this.probeLaunched = probe;
    this.store.dispatch(ProbeActions.launchProbe({ probeName: probe.name }));
  }

  ngOnDestroy(): void {
    this.fetchProbesSubscription?.unsubscribe();
    this.probeLaunchedSuccessSubscription?.unsubscribe();
    this.probeLaunchedErrorSubscription?.unsubscribe();
  }
}

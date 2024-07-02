import { NuxeoJSClientService } from './../../../../shared/services/nuxeo-js-client.service';
import { ElasticSearchReindexModalComponent } from "../elastic-search-reindex-modal/elastic-search-reindex-modal.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import {
  ReindexModalClosedInfo,
  ReindexInfo,
} from "../../elastic-search-reindex.interface";
import { Component, SecurityContext } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ELASTIC_SEARCH_LABELS,
  ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS,
} from "../../elastic-search-reindex.constants";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as ReindexActions from "../../store/actions";
import { ElasticSearchReindexService } from "../../services/elastic-search-reindex.service";
import { NXQLReindexState } from "../../store/reducers";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "nxql-es-reindex",
  templateUrl: "./nxql-es-reindex.component.html",
  styleUrls: ["./nxql-es-reindex.component.scss"],
})
export class NXQLESReindexComponent {
  nxqlReindexForm: FormGroup;
  nxqlReindexingLaunched$: Observable<ReindexInfo>;
  nxqlReindexingError$: Observable<HttpErrorResponse | null>;
  nxqlReindexingLaunchedSubscription = new Subscription();
  nxqlReindexingErrorSubscription = new Subscription();
  reindexDialogClosedSubscription = new Subscription();
  nxqlQueryHintSanitized: SafeHtml = "";
  confirmDialogClosedSubscription = new Subscription();
  launchedDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
  launchedDialogRef: MatDialogRef<
    ElasticSearchReindexModalComponent,
    ReindexModalClosedInfo
  > = {} as MatDialogRef<
    ElasticSearchReindexModalComponent,
    ReindexModalClosedInfo
  >;
  confirmDialogRef: MatDialogRef<
    ElasticSearchReindexModalComponent,
    ReindexModalClosedInfo
  > = {} as MatDialogRef<
    ElasticSearchReindexModalComponent,
    ReindexModalClosedInfo
  >;
  errorDialogRef: MatDialogRef<
    ElasticSearchReindexModalComponent,
    ReindexModalClosedInfo
  > = {} as MatDialogRef<
    ElasticSearchReindexModalComponent,
    ReindexModalClosedInfo
  >;
  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS;
  nuxeo: Nuxeo;

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private store: Store<{ nxqlReindex: NXQLReindexState }>,
    private sanitizer: DomSanitizer,
    private nuxeoJSClientService: NuxeoJSClientService
  ) {
    this.nxqlReindexForm = this.fb.group({
      nxqlQuery: ["", Validators.required],
    });
    this.nxqlReindexingLaunched$ = this.store.pipe(
      select((state) => state.nxqlReindex?.nxqlReindexInfo)
    );
    this.nxqlReindexingError$ = this.store.pipe(
      select((state) => state.nxqlReindex?.error)
    );
  }

  ngOnInit(): void {
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    this.elasticSearchReindexService.pageTitle.next(
      `${ELASTIC_SEARCH_LABELS.NXQL_QUERY_REINDEX_TITLE}`
    );
    this.nxqlQueryHintSanitized = this.sanitizer.bypassSecurityTrustHtml(
      ELASTIC_SEARCH_LABELS.NXQL_INPUT_HINT
    );

    this.nxqlReindexingLaunchedSubscription =
      this.nxqlReindexingLaunched$.subscribe((data) => {
        if (data?.commandId) {
          this.showReindexLaunchedModal(data?.commandId);
        }
      });

    this.nxqlReindexingErrorSubscription = this.nxqlReindexingError$.subscribe(
      (error) => {
        if (error) {
          this.showReindexErrorModal(error);
        }
      }
    );
  }

  showReindexLaunchedModal(commandId: string | null): void {
    this.launchedDialogRef = this.dialogService.open(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.height,
        width: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.width,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.launched,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_LAUNCHED_MODAL_TITLE}`,
          launchedMessage: `${ELASTIC_SEARCH_LABELS.REINDEX_LAUNCHED} ${commandId}. ${ELASTIC_SEARCH_LABELS.COPY_MONITORING_ID}`,
          closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE_LABEL}`,
          commandId,
          copyActionId: `${ELASTIC_SEARCH_LABELS.COPY_ACTION_ID_BUTTON_LABEL}`,
          isLaunchedModal: true,
        },
      }
    );

    this.launchedDialogClosedSubscription = this.launchedDialogRef
      .afterClosed()
      .subscribe(() => {
          this.onReindexLaunchedModalClose();
      });
  }

  onReindexLaunchedModalClose(): void {
    this.nxqlReindexForm?.reset();
    document.getElementById("nxqlQuery")?.focus();
  }

  showReindexErrorModal(error: HttpErrorResponse): void {
    this.errorDialogRef = this.dialogService.open(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.height,
        width: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.width,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.error,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_ERRROR_MODAL_TITLE}`,
          errorMessageHeader: `${ELASTIC_SEARCH_LABELS.REINDEXING_ERROR}`,
          error: error,
          closeLabel: `${ELASTIC_SEARCH_LABELS.CLOSE_LABEL}`,
          isErrorModal: true,
        },
      }
    );
    this.errorDialogClosedSubscription = this.errorDialogRef
      .afterClosed()
      .subscribe(() => {
          this.onReindexErrorModalClose();
      });
  }

  onReindexErrorModalClose(): void {
    document.getElementById("nxqlQuery")?.focus();
  }

  getErrorMessage(): string | null {
    if (this.nxqlReindexForm?.get("nxqlQuery")?.hasError("required")) {
      return ELASTIC_SEARCH_LABELS.INVALID_NXQL_QUERY_ERROR;
    }
    return null;
  }

  onReindexFormSubmit(): void {
    if (this.nxqlReindexForm.valid) {
      const sanitizedInput = this.sanitizer.sanitize(
        SecurityContext.HTML,
        this.nxqlReindexForm?.get("nxqlQuery")?.value
      );
      this.fetchNoOfDocuments(sanitizedInput);
    }
  }

  fetchNoOfDocuments(query: string | null): void {
    this.nuxeo
      .repository()
      .query({ query, pageSize: 1 })
      .then((document: unknown) => {
        if (
          typeof document === "object" &&
          document !== null &&
          "resultsCount" in document
        ) {
          const documentCount = document.resultsCount
            ? document.resultsCount
            : 0;
          this.showConfirmationModal(documentCount as number, query);
        }
      })
      .catch((err: unknown) => {
        if (this.checkIfErrorHasResponse(err)) {
          return (
            err as { response: { json: () => Promise<unknown> } }
          ).response.json();
        } else {
          return Promise.reject(ELASTIC_SEARCH_LABELS.UNEXPECTED_ERROR);
        }
      })
      .then((errorJson: unknown) => {
        if (typeof errorJson === "object" && errorJson !== null) {
          this.store.dispatch(
            ReindexActions.onNxqlReindexFailure({
              error: errorJson as HttpErrorResponse,
            })
          );
        }
      });
  }

  showConfirmationModal(documentCount: number, query: string | null): void {
    this.confirmDialogRef = this.dialogService.open(
      ElasticSearchReindexModalComponent,
      {
        disableClose: true,
        height: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.height,
        width: ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS.width,
        data: {
          type: ELASTIC_SEARCH_LABELS.MODAL_TYPE.confirm,
          title: `${ELASTIC_SEARCH_LABELS.REINDEX_CONFIRMATION_MODAL_TITLE}`,
          message: `${ELASTIC_SEARCH_LABELS.REINDEX_WARNING}`,
          isConfirmModal: true,
          abortLabel: `${ELASTIC_SEARCH_LABELS.ABORT_LABEL}`,
          continueLabel: `${ELASTIC_SEARCH_LABELS.CONTINUE}`,
          impactMessage: `${ELASTIC_SEARCH_LABELS.IMPACT_MESSAGE}`,
          confirmContinue: `${ELASTIC_SEARCH_LABELS.CONTINUE_CONFIRMATION}`,
          documentCount,
          timeTakenToReindex: `${
            documentCount / ELASTIC_SEARCH_LABELS.REFERENCE_POINT
          }`,
        },
      }
    );

    this.confirmDialogClosedSubscription = this.confirmDialogRef
      .afterClosed()
      .subscribe((data) => {
        this.onConfirmationModalClose(data as ReindexModalClosedInfo, query);
      });
  }

  onConfirmationModalClose(
    data: ReindexModalClosedInfo,
    query: string | null
  ): void {
    if (data?.continue) {
      this.store.dispatch(
        ReindexActions.performNxqlReindex({
          nxqlQuery: query,
        })
      );
    } else {
      document.getElementById("nxqlQuery")?.focus();
    }
  }

  checkIfErrorHasResponse(err: unknown): boolean {
    return (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as { response: unknown }).response === "object" &&
      (err as { response: { json: unknown } }).response !== null &&
      "json" in (err as { response: { json: unknown } }).response &&
      typeof (err as { response: { json: () => Promise<unknown> } }).response
        .json === "function"
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(ReindexActions.resetNxqlReindexState());
    this.nxqlReindexingLaunchedSubscription?.unsubscribe();
    this.nxqlReindexingErrorSubscription?.unsubscribe();
    this.reindexDialogClosedSubscription?.unsubscribe();
    this.confirmDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
  }
}

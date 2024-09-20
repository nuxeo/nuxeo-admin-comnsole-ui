import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
// import * as ReindexActions from "../../store/actions";
import { HttpErrorResponse } from "@angular/common/http";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";
import { ERROR_MESSAGES, ERROR_MODAL_LABELS, ERROR_TYPES, GENERIC_LABELS, MODAL_DIMENSIONS } from '../../generic-multi-feature-layout.constants';
import { GenericModalComponent } from '../generic-modal/generic-modal.component';
import { ActionInfo, ErrorDetails, GenericModalClosedInfo } from '../../generic-multi-feature-layout.interface';
import { GenericMultiFeatureUtilitiesService } from '../../services/generic-multi-feature-utilities.service';
import { ErrorModalComponent } from '../../../../../shared/components/error-modal/error-modal.component';
import { ErrorModalClosedInfo } from '../../../../../shared/types/common.interface';
import { ELASTIC_SEARCH_LABELS } from '../../../../elastic-search-reindex/elastic-search-reindex.constants';
import { NuxeoJSClientService } from '../../../../../shared/services/nuxeo-js-client.service';

@Component({
  selector: "folder-tab",
  templateUrl: "./folder-tab.component.html",
  styleUrls: ["./folder-tab.component.scss"],
})
export class FolderTabComponent implements OnInit, OnDestroy {
  inputForm: FormGroup;
  // actionLaunched$: Observable<ActionInfo>;
  // actionError$: Observable<HttpErrorResponse | null>;
  actionLaunchedSubscription = new Subscription();
  actionErrorSubscription = new Subscription();
  actionDialogClosedSubscription = new Subscription();
  confirmDialogClosedSubscription = new Subscription();
  launchedDialogClosedSubscription = new Subscription();
  errorDialogClosedSubscription = new Subscription();
  launchedDialogRef: MatDialogRef<
    GenericModalComponent,
    GenericModalClosedInfo
  > = {} as MatDialogRef<
    GenericModalComponent,
    GenericModalClosedInfo
  >;
  errorDialogRef: MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo> =
  {} as MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo>;
  confirmDialogRef: MatDialogRef<
    GenericModalComponent,
    GenericModalClosedInfo
  > = {} as MatDialogRef<
    GenericModalComponent,
    GenericModalClosedInfo
  >;
  GENERIC_LABELS = GENERIC_LABELS;
  nuxeo: Nuxeo;
  isSubmitBtnDisabled = false;
  ELASTIC_SEARCH_LABELS = ELASTIC_SEARCH_LABELS
  spinnerVisible = false;
  spinnerStatusSubscription: Subscription = new Subscription();
  userInput = "";
  decodedUserInput = "";

  constructor(
    private genericEndUtilitiesService: GenericMultiFeatureUtilitiesService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
   // private store: Store<{ folderReindex: FolderReindexState }>,
    private nuxeoJSClientService: NuxeoJSClientService,
  ) {
    this.inputForm = this.fb.group({
      inputIdentifier: ["", Validators.required],
    });
   /* this.actionLaunched$ = this.store.pipe(
      select((state) => state.folderReindex?.folderReindexInfo)
    );
    this.actionError$ = this.store.pipe(
      select((state) => state.folderReindex?.error)
    ); */
  }

  ngOnInit(): void {
    this.nuxeo = this.nuxeoJSClientService.getNuxeoInstance();
    this.genericEndUtilitiesService.pageTitle.next(
      `${ELASTIC_SEARCH_LABELS.FOLDER_REINDEX_TITLE}`
    );
  /*  this.actionLaunchedSubscription =
      this.actionLaunched$.subscribe((data) => {
        if (data?.commandId) {
          this.showActionLaunchedModal(data?.commandId);
        }
      });

      this.actionErrorSubscription =
      this.actionError$.subscribe((error) => {
        if (error) {
          this.showActionErrorModal({
            type: ERROR_TYPES.SERVER_ERROR,
            details: { status: error.status, message: error.message },
          });
        }
      }); */

    this.spinnerStatusSubscription =
      this.genericEndUtilitiesService.spinnerStatus.subscribe((status) => {
        this.spinnerVisible = status;
      });
  }

  showActionErrorModal(error: ErrorDetails): void {
    this.genericEndUtilitiesService.spinnerStatus.next(false);
    this.errorDialogRef = this.dialogService.open(ErrorModalComponent, {
      disableClose: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error,
        userInput: this.userInput
      },
    });
    this.errorDialogClosedSubscription = this.errorDialogRef
      ?.afterClosed()
      ?.subscribe(() => {
        this.onActionErrorModalClose();
      });
  }

  onActionErrorModalClose(): void {
    this.isSubmitBtnDisabled = false;
    this.genericEndUtilitiesService.spinnerStatus.next(false);
    document.getElementById("inputIdentifier")?.focus();
  }

  showActionLaunchedModal(commandId: string | null): void {
    this.launchedDialogRef = this.dialogService.open(
      GenericModalComponent,
      {
        disableClose: true,
        height: MODAL_DIMENSIONS.HEIGHT,
        width: MODAL_DIMENSIONS.WIDTH,
        data: {
          type: GENERIC_LABELS.MODAL_TYPE.launched,
          title: `${GENERIC_LABELS.ACTION_LAUNCHED_MODAL_TITLE}`,
          launchedMessage: `${GENERIC_LABELS.ACTION_LAUNCHED} ${commandId}. ${GENERIC_LABELS.COPY_MONITORING_ID}`,
          commandId,
        },
      }
    );

    this.launchedDialogClosedSubscription = this.launchedDialogRef
      .afterClosed()
      .subscribe(() => {
        this.onActionLaunchedModalClose();
      });
  }

  onActionLaunchedModalClose(): void {
    this.isSubmitBtnDisabled = false;
    this.inputForm?.reset();
    document.getElementById("inputIdentifier")?.focus();
  }

  getErrorMessage(): string | null {
    if (
      this.inputForm?.get("inputIdentifier")?.hasError("required")
    ) {
      return GENERIC_LABELS.REQUIRED_DOCID_OR_PATH_ERROR;
    }
    return null;
  }

  onFormSubmit(): void {
    if (this.inputForm?.valid && !this.isSubmitBtnDisabled) {
      this.isSubmitBtnDisabled = true;
      this.genericEndUtilitiesService.spinnerStatus.next(true);
      this.userInput = this.genericEndUtilitiesService.removeLeadingCharacters(
        this.inputForm?.get("inputIdentifier")?.value.trim()
      );
      /* The single quote is decoded and replaced with encoded backslash and single quotes, to form the request query correctly
          for elasticsearch reindex endpoint, for paths containing single quote e.g. /default-domain/ws1/Harry's-file will be built like
          /default-domain/workspaces/ws1/Harry%5C%27s-file
          Other special characters are encoded by default by nuxeo js client, but not single quote */
      try {
        this.decodedUserInput =
          this.genericEndUtilitiesService.decodeAndReplaceSingleQuotes(
            decodeURIComponent(this.userInput)
          );
        const requestQuery = `${GENERIC_LABELS.SELECT_BASE_QUERY} ecm:uuid='${this.decodedUserInput}' OR ecm:ancestorId='${this.decodedUserInput}'`;
        this.fetchNoOfDocuments(requestQuery);
      } catch (error) {
        this.showActionErrorModal({
          type: ERROR_TYPES.INVALID_DOC_ID,
          details: {
            message: ERROR_MESSAGES.INVALID_DOC_ID_MESSAGE,
          },
        });
      }
    }
  }

  fetchNoOfDocuments(query: string | null): void {
    this.nuxeo
      .repository()
      .query({ query, pageSize: 1 })
      .then((document: unknown) => {
        this.genericEndUtilitiesService.spinnerStatus.next(false);
        if (
          typeof document === "object" &&
          document !== null &&
          "resultsCount" in document
        ) {
          const documentCount = document.resultsCount
            ? (document.resultsCount as number)
            : 0;
          if (documentCount === 0) {
            this.showActionErrorModal({
              type: ERROR_TYPES.NO_DOCUMENT_ID_FOUND,
              details: {
                message: ERROR_MESSAGES.NO_DOCUMENT_ID_FOUND_MESSAGE,
              },
            });
          } else {
            this.showConfirmationModal(documentCount);
          }
        }
      })
      .catch((err: unknown) => {
        this.genericEndUtilitiesService.spinnerStatus.next(false);
        if (this.checkIfErrorHasResponse(err)) {
          return (
            err as { response: { json: () => Promise<unknown> } }
          ).response.json();
        } else {
          return Promise.reject(ERROR_MODAL_LABELS.UNEXPECTED_ERROR);
        }
      })
      .then((errorJson: unknown) => {
        if (typeof errorJson === "object" && errorJson !== null) {
        /*  this.store.dispatch(
            ReindexActions.onFolderReindexFailure({
              error: errorJson as HttpErrorResponse,
            })
          ); */
        }
      });
  }

  showConfirmationModal(documentCount: number): void {
    this.confirmDialogRef = this.dialogService.open(
      GenericModalComponent,
      {
        disableClose: true,
        height: MODAL_DIMENSIONS.HEIGHT,
        width: MODAL_DIMENSIONS.WIDTH,
        data: {
          type: GENERIC_LABELS.MODAL_TYPE.confirm,
          title: `${GENERIC_LABELS.ACTION_CONFIRMATION_MODAL_TITLE}`,
          message: `${GENERIC_LABELS.ACTION_WARNING}`,
          documentCount,
          timeTakenForAction: this.getHumanReadableTime(
            documentCount / GENERIC_LABELS.REFERENCE_POINT
          ),
        },
      }
    );

    this.confirmDialogClosedSubscription = this.confirmDialogRef
      .afterClosed()
      .subscribe((data) => {
        this.onConfirmationModalClose(data);
      });
  }

  onConfirmationModalClose(modalData: unknown): void {
    this.isSubmitBtnDisabled = false;
    const data = modalData as GenericModalClosedInfo;
    if (data?.continue) {
      const requestQuery = `${ELASTIC_SEARCH_LABELS.SELECT_BASE_QUERY} ecm:uuid='${this.decodedUserInput}' OR ecm:ancestorId='${this.decodedUserInput}'`;
     /* this.store.dispatch(
        ReindexActions.performFolderReindex({
          requestQuery,
        })
      ); */
    } else {
      document.getElementById("inputIdentifier")?.focus();
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

  getHumanReadableTime(seconds: number): string {
    return this.genericEndUtilitiesService.secondsToHumanReadable(seconds);
  }

  ngOnDestroy(): void {
   // this.store.dispatch(ReindexActions.resetFolderReindexState());
    this.actionLaunchedSubscription?.unsubscribe();
    this.actionErrorSubscription?.unsubscribe();
    this.confirmDialogClosedSubscription?.unsubscribe();
    this.launchedDialogClosedSubscription?.unsubscribe();
    this.errorDialogClosedSubscription?.unsubscribe();
    this.spinnerStatusSubscription?.unsubscribe();
  }
}

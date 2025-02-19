import {
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { STREAM_LABELS } from "../../stream.constants";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as StreamActions from "../../store/actions";
import { Store, select } from "@ngrx/store";
import { StreamsState } from "../../store/reducers";
import { Observable, Subscription } from "rxjs";
import { Stream } from "../../stream.interface";
import { StreamService } from "../../services/stream.service";
import { GENERIC_LABELS } from "./../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";

@Component({
  selector: "stream-form",
  templateUrl: "./stream-form.component.html",
  styleUrls: ["./stream-form.component.scss"]
})

export class StreamFormComponent implements OnInit, OnDestroy {
  STREAM_LABELS = STREAM_LABELS;
  GENERIC_LABELS = GENERIC_LABELS;
  streamForm: FormGroup;
  isSubmitBtnDisabled = false;
  fetchStreamsSuccess$: Observable<Stream[]>;
  fetchStreamsError$: Observable<unknown>;
  fetchConsumersSuccess$: Observable<{ stream: string; consumer: string }[]>;
  fetchConsumersError$: Observable<unknown>;
  streams: Stream[] = [];
  records: unknown[] = [];
  consumers: { stream: string; consumer: string }[] = [];
  fetchStreamsErrorSubscription = new Subscription();
  fetchStreamsSuccessSubscription = new Subscription();
  fetchConsumersErrorSubscription = new Subscription();
  fetchConsumersSuccessSubscription = new Subscription();
  isClearBtnDisabledSubscription = new Subscription();
  isStopFetchBtnDisabledSubscription = new Subscription();
  isViewRecordsDisabledSubscription = new Subscription();
  selectedConsumer = "";
  isClearBtnDisabled = true;
  isStopFetchBtnDisabled = true;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ streams: StreamsState }>,
    private streamService: StreamService
  ) {
    this.streamForm = this.fb.group({
      stream: ["", Validators.required],
      position: [null, Validators.required],
    });

    this.fetchStreamsSuccess$ = this.store.pipe(
      select((state) => state.streams?.streams)
    );

    this.fetchStreamsError$ = this.store.pipe(
      select((state) => state.streams?.streamsError)
    );

    this.fetchConsumersSuccess$ = this.store.pipe(
      select((state) => state.streams?.consumers)
    );

    this.fetchConsumersError$ = this.store.pipe(
      select((state) => state.streams?.consumersError)
    );
  }

  ngOnInit(): void {
    this.isClearBtnDisabledSubscription = this.streamService.isClearRecordsDisabled.subscribe((isDisabled: boolean) => {
      this.isClearBtnDisabled = isDisabled;
    });
    this.isStopFetchBtnDisabledSubscription = this.streamService.isStopFetchDisabled.subscribe((isDisabled: boolean) => {
      this.isStopFetchBtnDisabled = isDisabled;
    });
    this.isViewRecordsDisabledSubscription = this.streamService.isViewRecordsDisabled.subscribe((isDisabled: boolean) => {
      this.isSubmitBtnDisabled = isDisabled;
    });
    this.fetchStreamsSuccessSubscription = this.fetchStreamsSuccess$.subscribe(
      (data: Stream[]) => {
        if (data?.length > 0) {
          this.streams = data;
          this.streamForm.patchValue({
            stream: data[0]?.name,
          });
          const params = {
            stream: this.streamForm?.controls["stream"]?.value,
          };

          this.store.dispatch(StreamActions.fetchConsumers({ params }));
        } else {
          this.store.dispatch(StreamActions.fetchStreams());
        }
      }
    );

    this.fetchStreamsErrorSubscription = this.fetchStreamsError$.subscribe(
      (error) => {
        if (error) {
          console.log(error);
        }
      }
    );

    this.fetchConsumersSuccessSubscription =
      this.fetchConsumersSuccess$.subscribe(
        (data: { stream: string; consumer: string }[]) => {
          if (data?.length > 0) {
            this.consumers = data;
            this.selectedConsumer = this.consumers
              ? this.consumers[0]?.consumer
              : "";
            this.streamForm.get("position")?.setValue(this.selectedConsumer);
          }
        }
      );

    this.fetchConsumersErrorSubscription = this.fetchConsumersError$.subscribe(
      (error) => {
        if (error) {
          console.log(error);
        }
      }
    );
  }

  onConsumerOptionChange(selectedValue: string): void {
    this.selectedConsumer = selectedValue;
    this.streamForm.get("position")?.setValue(selectedValue);
  }

  onStreamChange(value: string): void {
    this.isSubmitBtnDisabled = false;
    this.streamForm.patchValue({
      stream: value,
    });
    const params = {
      stream: this.streamForm.controls["stream"]?.value,
    };
    this.store.dispatch(StreamActions.fetchConsumers({ params }));
  }

  onStreamFormSubmit(): void {
    if (this.streamForm?.valid && !this.isSubmitBtnDisabled) {
      this.isSubmitBtnDisabled = true;
      // TODO: Use form values instead of hardcoded values for rewind, limit & timeout. Dynamically add position param
      const params = {
        stream: this.streamForm?.get("stream")?.value,
        fromGroup: this.streamForm?.get("position")?.value,
        rewind: 0,
        timeout: "1ms",
        limit: 1,
      };

      this.store.dispatch(StreamActions.triggerRecordsSSEStream({ params }));
      this.streamService.isFetchingRecords.next(true);
      this.streamService.isStopFetchDisabled.next(false);
    }
  }

  onStopFetch(): void {
    this.store.dispatch(StreamActions.onStopFetch());
  }

  onClearRecords(): void {
    this.store.dispatch(StreamActions.resetFetchRecordsState());
    this.isSubmitBtnDisabled = false;
    this.isClearBtnDisabled = true;
    this.streamService.clearRecordsDisplay.next(true);
    document.getElementById("stream")?.focus();
  }


  ngOnDestroy(): void {
    this.store.dispatch(StreamActions.resetFetchStreamsState());
    this.store.dispatch(StreamActions.resetFetchConsumersState());
    this.store.dispatch(StreamActions.resetFetchRecordsState());
    this.store.dispatch(StreamActions.resetStopFetchState());
    this.fetchStreamsSuccessSubscription?.unsubscribe();
    this.fetchStreamsErrorSubscription?.unsubscribe();
    this.fetchConsumersSuccessSubscription?.unsubscribe();
    this.fetchConsumersErrorSubscription?.unsubscribe();
    this.isClearBtnDisabledSubscription?.unsubscribe();
    this.isStopFetchBtnDisabledSubscription?.unsubscribe();
    this.isViewRecordsDisabledSubscription?.unsubscribe();
  }
}

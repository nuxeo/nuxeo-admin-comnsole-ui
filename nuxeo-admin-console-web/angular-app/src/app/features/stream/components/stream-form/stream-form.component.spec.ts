import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamFormComponent } from './stream-form.component';
import { StoreModule, Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { StreamService } from '../../services/stream.service';
import { BehaviorSubject, of } from 'rxjs';
import * as StreamActions from '../../store/actions';
import { StreamsState } from '../../store/reducers';
import { STREAM_LABELS } from '../../stream.constants';
import { GENERIC_LABELS } from '../../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

interface StreamServiceMock {
    getStreams: jasmine.Spy;
    getConsumers: jasmine.Spy;
    getRecords: jasmine.Spy;
    startSSEStream: jasmine.Spy;
    isFetchingRecords: { next: jasmine.Spy };
    isClearRecordsDisabled: BehaviorSubject<boolean>;
    isStopFetchDisabled: BehaviorSubject<boolean>;
    isViewRecordsDisabled: BehaviorSubject<boolean>;
    clearRecordsDisplay: { next: jasmine.Spy };
}

describe('StreamFormComponent', () => {
    let component: StreamFormComponent;
    let fixture: ComponentFixture<StreamFormComponent>;
    let store: Store<{ streams: StreamsState }>;
    let streamServiceMock: StreamServiceMock;

    beforeEach(async () => {
        streamServiceMock = {
            getStreams: jasmine.createSpy('getStreams').and.returnValue(of([])),
            getConsumers: jasmine.createSpy('getConsumers').and.returnValue(of([])),
            getRecords: jasmine.createSpy('getRecords').and.returnValue(of([])),
            startSSEStream: jasmine.createSpy('startSSEStream').and.returnValue(of({})),
            isFetchingRecords: { next: jasmine.createSpy() },
            isClearRecordsDisabled: new BehaviorSubject(false),
            isStopFetchDisabled: new BehaviorSubject(false),
            isViewRecordsDisabled: new BehaviorSubject(false),
            clearRecordsDisplay: { next: jasmine.createSpy() }
        };

        const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'pipe']);

        storeSpy.pipe.and.returnValue(of([]));
        storeSpy.pipe.and.returnValues(
            of([]),
            of(null),
            of([]),
            of(null)
        );

        await TestBed.configureTestingModule({
            declarations: [StreamFormComponent],
            imports: [
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                MatSelectModule,
                MatRadioModule,
                StoreModule.forRoot({})
            ],
            providers: [
                { provide: StreamService, useValue: streamServiceMock },
                { provide: Store, useValue: storeSpy },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(StreamFormComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store);
        component.STREAM_LABELS = STREAM_LABELS;
        component.GENERIC_LABELS = GENERIC_LABELS;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form group with controls', () => {
        expect(component.streamForm.contains('stream')).toBeTruthy();
        expect(component.streamForm.contains('position')).toBeTruthy();
    });

    it('should dispatch fetchStreams action on ngOnInit if no streams are fetched', () => {
        component.fetchStreamsSuccess$ = of([]);
        component.ngOnInit();
        expect(store.dispatch).toHaveBeenCalledWith(StreamActions.fetchStreams());
    });

    it('should dispatch fetchConsumers action when a stream is selected', () => {
        const stream = { name: 'stream1' };
        component.streams = [stream];
        component.streamForm.patchValue({ stream: 'stream1' });
        component.onStreamChange('stream1');
        expect(store.dispatch).toHaveBeenCalledWith(
            StreamActions.fetchConsumers({ params: { stream: 'stream1' } })
        );
        expect(component.isSubmitBtnDisabled).toBeFalse();
    });

    it('should update selectedConsumer on consumer option change', () => {
        const selectedValue = 'consumer1';
        component.onConsumerOptionChange(selectedValue);
        expect(component.selectedConsumer).toBe(selectedValue);
        expect(component.streamForm.get('position')?.value).toBe(selectedValue);
    });

    it('should call onStreamFormSubmit and dispatch triggerRecordsSSEStream', () => {
        const isFetchingRecordsSpy = streamServiceMock.isFetchingRecords.next.and.callThrough();
        component.isSubmitBtnDisabled = false;
        const stream = { name: 'stream1' };
        component.streams = [stream];
        component.streamForm.patchValue({ stream: 'stream1', position: 'consumer1' });
        component.onStreamFormSubmit();
        expect(store.dispatch).toHaveBeenCalledWith(
            StreamActions.triggerRecordsSSEStream({
                params: {
                    stream: component.streamForm.get('stream')?.value,
                    fromGroup: component.streamForm.get('position')?.value,
                    rewind: 0,
                    timeout: '1ms',
                    limit: 1
                }
            })
        );
        expect(isFetchingRecordsSpy).toHaveBeenCalledWith(true);
    });


    it('should handle fetchStreamsError correctly', () => {
        const error = { message: 'An error occurred' };
        component.fetchStreamsError$ = of(error);
        const logSpy = spyOn(console, 'log');
        component.ngOnInit();
        expect(logSpy).toHaveBeenCalledWith(error);
        logSpy.calls.reset();
    });


    it('should unsubscribe from all subscriptions on ngOnDestroy', () => {
        const unsubscribeSpy = jasmine.createSpy('unsubscribe');
        component.fetchStreamsSuccessSubscription.unsubscribe = unsubscribeSpy;
        component.fetchStreamsErrorSubscription.unsubscribe = unsubscribeSpy;
        component.fetchConsumersSuccessSubscription.unsubscribe = unsubscribeSpy;
        component.fetchConsumersErrorSubscription.unsubscribe = unsubscribeSpy;
        component.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalledTimes(4);
    });

    it('should dispatch onStopFetch action when onStopFetch is called', () => {
        component.onStopFetch();
        expect(store.dispatch).toHaveBeenCalledWith(StreamActions.onStopFetch());
    });

    it('should dispatch resetFetchRecordsState and clear records on onClearRecords', () => {
        component.onClearRecords();
        expect(store.dispatch).toHaveBeenCalledWith(StreamActions.resetFetchRecordsState());
    });

    it('should dispatch reset actions and unsubscribe from all subscriptions on ngOnDestroy', () => {
        const unsubscribeSpy = jasmine.createSpy('unsubscribe');

        component.fetchStreamsSuccessSubscription.unsubscribe = unsubscribeSpy;
        component.fetchStreamsErrorSubscription.unsubscribe = unsubscribeSpy;
        component.fetchConsumersSuccessSubscription.unsubscribe = unsubscribeSpy;
        component.fetchConsumersErrorSubscription.unsubscribe = unsubscribeSpy;
        component.isClearBtnDisabledSubscription.unsubscribe = unsubscribeSpy;
        component.isStopFetchBtnDisabledSubscription.unsubscribe = unsubscribeSpy;
        component.isViewRecordsDisabledSubscription.unsubscribe = unsubscribeSpy;
        component.ngOnDestroy();
        expect(store.dispatch).toHaveBeenCalledWith(StreamActions.resetFetchStreamsState());
        expect(store.dispatch).toHaveBeenCalledWith(StreamActions.resetFetchConsumersState());
        expect(store.dispatch).toHaveBeenCalledWith(StreamActions.resetFetchRecordsState());
        expect(store.dispatch).toHaveBeenCalledWith(StreamActions.resetStopFetchState());
        expect(unsubscribeSpy).toHaveBeenCalledTimes(7);
    });

    it('should subscribe to button state observables in ngOnInit', () => {
        expect(component.isClearBtnDisabled).toBeTrue();
        expect(component.isStopFetchBtnDisabled).toBeTrue();
        expect(component.isSubmitBtnDisabled).toBeFalse();
    });
});

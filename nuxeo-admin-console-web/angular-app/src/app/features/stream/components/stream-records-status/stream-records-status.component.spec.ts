import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamRecordsStatusComponent } from './stream-records-status.component';
import { SimpleChanges } from '@angular/core';

describe('StreamRecordsStatusComponent', () => {
  let component: StreamRecordsStatusComponent;
  let fixture: ComponentFixture<StreamRecordsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamRecordsStatusComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamRecordsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test 1: Should create the component
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Should update recordsFetchedStatus when input changes
  it('should update recordsFetchedStatus when input changes', () => {
    const newStatus = 'Records Fetched';
    const changes: SimpleChanges = {
      recordsFetchedStatus: {
        currentValue: newStatus,
        previousValue: '',
        firstChange: true,
        isFirstChange: () => true
      }
    };

    // Trigger ngOnChanges manually
    component.ngOnChanges(changes);

    // Assert that the recordsFetchedStatus has been updated
    expect(component.recordsFetchedStatus).toBe(newStatus);
  });

  // Test 3: Should update the view when recordsFetchedStatus changes
  it('should update the view when recordsFetchedStatus changes', () => {
    component.recordsFetchedStatus = 'Records Fetching';
    fixture.detectChanges();

    const statusElement: HTMLElement = fixture.nativeElement.querySelector('.stream-records-status p');

    // Assert that the text content reflects the updated recordsFetchedStatus
    expect(statusElement.textContent).toContain('Records Fetching');
  });

  // Test 4: Should handle initial input values correctly
  it('should display the initial recordsFetchedStatus value correctly', () => {
    component.recordsFetchedStatus = 'Initial Status';
    fixture.detectChanges();

    const statusElement: HTMLElement = fixture.nativeElement.querySelector('.stream-records-status p');

    // Assert initial value is displayed correctly
    expect(statusElement.textContent).toContain('Initial Status');
  });

});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamRecordsComponent } from './stream-records.component';
import { MatCardModule } from '@angular/material/card';

describe('StreamRecordsComponent', () => {
    let component: StreamRecordsComponent;
    let fixture: ComponentFixture<StreamRecordsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StreamRecordsComponent],
            imports: [MatCardModule],
        }).compileComponents();

        fixture = TestBed.createComponent(StreamRecordsComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});

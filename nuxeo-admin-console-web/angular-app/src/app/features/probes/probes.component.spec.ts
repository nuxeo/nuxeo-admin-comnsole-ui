import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProbesComponent } from "./probes.component";
import { StoreModule } from "@ngrx/store";
import { ProbeDataReducer } from "../sub-features/probes-data/store/reducers";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HyContentListModule } from "@hyland/ui/content-list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { By } from "@angular/platform-browser";
import { ProbesDataComponent } from "../sub-features/probes-data/components/probes-data.component";
import { HyToastService } from "@hyland/ui";

describe("ProbesComponent", () => {
  let component: ProbesComponent;
  let fixture: ComponentFixture<ProbesComponent>;

  beforeEach(async () => {
    const toastServiceSpy = jasmine.createSpyObj("HyToastService", [
      "success",
      "error",
    ]);
    await TestBed.configureTestingModule({
      declarations: [ProbesComponent, ProbesDataComponent],
      imports: [
        StoreModule.forRoot({ probes: ProbeDataReducer }),
        HttpClientTestingModule,
        CommonModule,
        MatCardModule,
        HyContentListModule,
        MatTooltipModule,
        BrowserAnimationsModule,
      ],
      providers: [{ provide: HyToastService, useValue: toastServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProbesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create the ProbesComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should render the title in the template", () => {
    const PROBES_TITLE = "Probes";
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector("#page-title");
    expect(titleElement).toBeTruthy();
    expect(titleElement?.textContent).toContain(PROBES_TITLE);
  });

  it("should include the ProbesDataComponent", () => {
    const probesDataElement = fixture.debugElement.query(
      By.directive(ProbesDataComponent)
    );
    expect(probesDataElement).toBeTruthy();
    const probesDataComponent =
      probesDataElement.componentInstance as ProbesDataComponent;
    expect(probesDataComponent.summary).toBe(false);
  });
});

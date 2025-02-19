import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";

@Component({
  selector: "stream-records-status",
  templateUrl: "./stream-records-status.component.html",
  styleUrls: ["./stream-records-status.component.scss"]
})

export class StreamRecordsStatusComponent implements OnChanges {
  @Input() recordsFetchedStatus = '';
  @Input() recordCount = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.recordsFetchedStatus = changes["recordsFetchedStatus"].currentValue;
  }
}
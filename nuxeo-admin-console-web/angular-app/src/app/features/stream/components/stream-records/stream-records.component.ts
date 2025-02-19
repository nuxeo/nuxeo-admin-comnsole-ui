import {
  Component,
  Input
} from "@angular/core";

@Component({
  selector: "stream-records",
  templateUrl: "./stream-records.component.html",
  styleUrls: ["./stream-records.component.scss"]
})

export class StreamRecordsComponent {
  @Input() records: { type?: string }[] = [];
}

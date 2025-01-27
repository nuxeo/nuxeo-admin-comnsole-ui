import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StreamComponent } from "./components/stream.component";
import { StreamFormComponent } from "./components/stream-form/stream-form.component";
import { StreamRoutingModule } from "./stream-routing.module";
import { StreamRecordsComponent } from "./components/stream-records/stream-records.component";
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import {MatRadioModule} from '@angular/material/radio';
import { MatCardModule } from "@angular/material/card";

@NgModule({
  declarations: [StreamComponent, StreamFormComponent, StreamRecordsComponent],
  imports: [
    CommonModule,
    StreamRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule
  ],
})
export class StreamModule {}

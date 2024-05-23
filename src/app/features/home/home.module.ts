import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { HomeComponent } from "./components/home.component";
import { ProbesSummaryComponent } from "./components/probes-summary/probes-summary.component";
import { RegistrationVersionComponent } from "./components/registration-version/registration-version.component";

@NgModule({
  declarations: [
    HomeComponent,
    ProbesSummaryComponent,
    RegistrationVersionComponent,
  ],
  imports: [CommonModule, MatCardModule, MatButtonModule],
})
export class HomeModule {}

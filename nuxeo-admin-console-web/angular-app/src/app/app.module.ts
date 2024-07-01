import { BaseLayoutModule } from "./layouts/base-layout/base-layout.module";
import { BaseLayoutComponent } from "./layouts/base-layout/components/base-layout.component";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { StoreRouterConnectingModule, routerReducer } from "@ngrx/router-store";
import { EffectsModule } from "@ngrx/effects";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { AppRoutingModule } from "./app-routing.module";
import { AuthRoutingModule } from "./auth/auth-routing.module";
import { VideoRenderGenerationModule } from "./features/video-render-generation/video-render-generation.module";
import { PictureRenderGenerationModule } from "./features/picture-render-generation/picture-render-generation.module";
import { ThumbnailGenerationModule } from "./features/thumbnail-generation/thumbnail-generation.module";
import { FullTextReindexModule } from "./features/full-text-reindex/full-text-reindex.module";
import { ElasticSearchReindexModule } from "./features/elastic-search-reindex/elastic-search-reindex.module";
import { BulkActionMonitoringModule } from "./features/bulk-action-monitoring/bulk-action-monitoring.module";
import { HomeModule } from "./features/home/home.module";
import { WarningComponent } from "./features/warning/warning.component";
import { HylandSSOManagerComponent } from "./auth/components/SSO/hylandSSOManager.component";
import { BackendErrorMessagesComponent } from "./shared/components/backendErrorMessages/backendErrorMessages.component";
import { AppComponent } from "./app.component";
import { AuthInterceptorService } from "./auth/services/auth-interceptor.service";
import { authReducer } from "./auth/store/reducers";
import * as authEffects from "./auth/store/effects";
import { ngrxDevtools } from "../devtools/ngrx-devtools";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { HeaderBarComponent } from "./layouts/header-bar/header-bar.component";
import { MenuBarComponent } from "./layouts/menu-bar/menu-bar.component";
import { SystemInformationModule } from "./features/system-information/system-information.module";
import { HyDialogBoxModule, HyDialogModule } from "@hyland/ui";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatListModule } from "@angular/material/list";
import { homeReducer } from "./features/home/store/reducers";
import * as HomeEffects from "./features/home/store/effects";
import * as ReindexEffects from "./features/elastic-search-reindex/store/effects";
import { reindexReducer } from "./features/elastic-search-reindex/store/reducers";
import { ElasticSearchReindexModalComponent } from "./features/elastic-search-reindex/components/elastic-search-reindex-modal/elastic-search-reindex-modal.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderBarComponent,
    MenuBarComponent,
    WarningComponent,
    BackendErrorMessagesComponent,
    HylandSSOManagerComponent,
    BaseLayoutComponent,
    ElasticSearchReindexModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
    AppRoutingModule,
    AuthRoutingModule,
    StoreModule.forRoot({
      router: routerReducer,
      auth: authReducer,
      home: homeReducer,
      reindex: reindexReducer,
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot(authEffects, HomeEffects, ReindexEffects),
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    HomeModule,
    MatListModule,
    SystemInformationModule,
    BulkActionMonitoringModule,
    ElasticSearchReindexModule,
    FullTextReindexModule,
    ThumbnailGenerationModule,
    PictureRenderGenerationModule,
    VideoRenderGenerationModule,
    BaseLayoutModule,
    HyDialogModule,
    MatSidenavModule,
    MatButtonModule,
    HyDialogBoxModule,
    FormsModule,
    MatCheckboxModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    ngrxDevtools,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

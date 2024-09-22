import { ElasticSearchReindexService } from "./services/elastic-search-reindex.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DocumentReindexDataResolver {
  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService
  ) {}

  resolve(): Observable<any> {
    return this.elasticSearchReindexService.getDocumentTabData();
  }
}

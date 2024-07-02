import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { ReindexInfo } from "../elastic-search-reindex.interface";

@Injectable({
  providedIn: "root",
})
export class ElasticSearchReindexService {
  private url = "/management/elasticsearch";
  private suburl = "/reindex";
  baseUrl = "/api";
  pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
  constructor(private http: HttpClient) {}

  performDocumentReindex(requestQuery: string | null): Observable<ReindexInfo> {
    return this.http.post<ReindexInfo>(
      `${this.baseUrl}${this.url}${this.suburl}?query=${requestQuery}`,
      {}
    );
  }

  performFolderReindex(documentID: string | null): Observable<ReindexInfo> {
    return this.http.post<ReindexInfo>(
      `${this.baseUrl}${this.url}/${documentID}${this.suburl}`,
      {}
    );
  }
}

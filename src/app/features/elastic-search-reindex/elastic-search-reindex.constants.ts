import { ElasticSearchType } from "./elastic-search-reindex.interface";

export const ELASTIC_SEARCH_REINDEX_TYPES: ElasticSearchType[] = [
  { label: "Document", path: "document", isSelected: true },
  { label: "Folder", path: "folder", isSelected: false },
  { label: "NXQL Query", path: "nxql", isSelected: false },
];

export const ELASTIC_SEARCH_REINDEX_MODAL_EVENT = {
  isConfirmed: 0,
  isLaunched: 1,
  isFailed: 2,
};

export const ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS = {
  height: "320px",
  width: "550px"
};

export const ELASTIC_SEARCH_LABELS = {
  INVALID_DOCID_OR_PATH_ERROR: "Please provide a document id or a document path",
  INVALID_DOCID_ERROR: "Please provide a document id",
  INVALID_NXQL_QUERY_ERROR: "Please provide a valid NXQL query",
  REINDEX_WARNING:
    "This action will impact 10 documents. This action could take approximately 1d 2h 30m. Continue?",
  REINDEX_LAUNCHED: "Congratulations! Your action is launched with ID",
  COPY_MONITORING_ID:
    "Remember to take note of the ID if you want to monitor it later on.",
  REINDEX_CONFIRMATION_MODAL_TITLE: "Confirm Reindex",
  ABORT_LABEL: "Abort",
  CLOSE_LABEL: "Close",
  CONTINUE: "Continue",
  REINDEX_LAUNCHED_MODAL_TITLE: "Action launched",
  REINDEX_ERRROR_MODAL_TITLE: "An error occurred",
  REINDEXING_ERROR: "Your action was not executed due to an error. ",
  DOCUMENT_REINDEX_TITLE: "Reindex a single document",
  FOLDER_REINDEX_TITLE: "Reindex a document and all of its children",
  NXQL_QUERY_REINDEX_TITLE: "Reindex the results of a NXQL query",
  ERROR_DETAILS: "Details:",
  ERROR_STATUS: "Status:",
  CONTINUE_CONFIRMATION: "Would you like to continue?",
  COPY_ACTION_ID_BUTTON_LABEL: "Copy action ID",
  IMPACT_MESSAGE:
    "The query could impact performance if it involves high volumes. Documents will not be available for search while reindexing is in progress.",
  MODAL_TYPE: {
    confirm: 1,
    launched: 2,
    error: 3,
  },
  REFERENCE_POINT: 2000,
  NO_DOCUMENTS: "There are no documents to be reindexed.",
  DOCUMENT_ID_OR_PATH: "Document ID or Path",
  DOCUMENT_ID: "Document ID",
  REINDEX_BUTTON_LABEL: "Reindex",
  ACTION_ID_COPIED_ALERT: "Action ID copied to clipboard!",
  SELECT_BASE_QUERY: "SELECT * FROM Document WHERE",
  NXQL_QUERY_PLACEHOLDER: "SELECT * FROM Document WHERE ecm:mixinType != 'HiddenInNavigation' AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0 AND dc:title = 'A document to reindex'",
  NXQL_QUERY: "NXQL Query",
  NXQL_INPUT_HINT: "See <a href='https://doc.nuxeo.com/nxdoc/nxql/' target='_blank'>NXQL documentation</a> for available options",
};

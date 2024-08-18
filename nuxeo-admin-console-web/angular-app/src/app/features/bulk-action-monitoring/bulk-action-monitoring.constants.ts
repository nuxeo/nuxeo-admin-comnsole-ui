export const BULK_ACTION_LABELS = {
  REQUIRED_BULK_ACTION_ID_ERROR: "Please provide a bulk action ID",
  BULK_ACTION_TITLE: "Monitor a bulk action",
  BULK_ACTION_ID: "Bulk Action ID",
  BULK_ACTION_BUTTON_LABEL: "Submit",
  BULK_ACTION_SUMMARY_TEXT:
    "Bulk Action ID - {commandId} launched by '{username}' on",
  FULLFILLED_TEXT: "- {fulfilled} with {errorCount} error",
  SCROLL_START: "Scroll start",
  SCROLL_END: "Scroll end",
  PROCESSING_START: "Processing start",
  PROCESSING_END: "Processing end",
  COMPLETED_ON: "Completed on",
  PROCESSING_TIME: "Processing time (ms)",
  ADDITIONAL_INFORMATION: "Additional Information",
  DETAILS_TITLE: "Details",
  REFRESH: "Refresh",
  INFORMATION_UPDATED: "Information updated",
  DOCUMENTS_PROCESSED: "{noOfDocs} document processed",
  ERRORS_FOUND: "{errorCount} error found",
  DOCUMENTS_SKIPPED: "{skipCount} document skipped",
  STATUS_TEXT: "- {Running} {processed}/{total} document - {errorCount} error",
  NO_ERRORS: "No errors",
  ERROR: "error",
  DOCUMENT: "document",
  STATUS_INFO_TEXT: {
    "UNKNOWN": {
      label: "Unknown",
      tooltip: "State is unknown.",
    },
    "SCHEDULED": { label: "Scheduled", tooltip: "Bulk action is pending." },
    "SCROLLING_RUNNING": {
      label: "Scrolling running",
      tooltip: "Creating the list of documents to execute the action on.",
    },
    "RUNNING": { label: "Running", tooltip: "Bulk action is being processed." },
    "COMPLETED": { label: "Completed", tooltip: "Bulk action is finished." },
    "ABORTED": {
      label: "Aborted",
      tooltip:
        "Bulk action was interrupted and may have been executed partially on the documents. Check the details.",
    },
  },
};

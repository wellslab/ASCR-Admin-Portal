User Flow

User clicks on Curation in navigation bar -> User gets taken to the page

User is presented with a list of TranscriptionRecords that exist in the database.

This should be presented as a table where each row is a TR

Each TR has columns: PubMed ID, Approx. Tokens, Date Created, Date Modified, Curation Status

There must also be an initial column for checkboxes, where the User can select multiple TRs

The User can then select which TRs they want to curate

There must be a primary Call To Action, positioned at the bottom of the table, called "Start Curation"

When the User clicks Start Curation the Curation Status of all the TRs they selected should turn blue.

Successful curation

Once the curation is finished successfully, the curation status should turn light green.

The User can then navigate to the CellLine browser app to work with the curated cell lines.

Failed curation 

If a curation request fails we show a red exclamation icon that is clickable 

When the icon is clicked we open a modal and show the details of the error message

Extra

A TR that is currently being curated cannot be retried for curation, "Please wait for the request to be finished before trying again."

Backend

Additional fields in data models 

CellLineTemplate

curation_source: (hpscreg, LLM, institution, manual)

In the cell line browser, the User should be able to filter by curation_source to view and work with the cell lines that have been obtained from a particular source. This helps the User inspect all LLM curated cell lines.

TranscriptionRecords

curation_status


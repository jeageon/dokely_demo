# Dokely Demo

Public-safe demo of the Dokely patient discovery experience.

This repository intentionally contains only a static frontend demo:

- no backend source code
- no API keys, tokens, credentials, or environment files
- no production data, scraped data, cached records, or real clinician profiles
- no admin, investor, physician portal, data pipeline, or internal tooling code

All clinician rows, locations, publications, and match explanations in this demo are synthetic fixtures for product demonstration only.

## Run Locally

Open `index.html` in a browser, or serve the folder with any static file server:

```sh
python3 -m http.server 8080
```

Then visit `http://127.0.0.1:8080`.


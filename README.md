# Dokely Demo

Copyright (c) 2026 Jeageon Lee. All rights reserved.

This repository is public only for demonstration and review purposes. It is not
open source. Commercial use, resale, redistribution, hosted use, competing
products, provider-referral products, medical-advice products, or derivative
commercial services are prohibited without prior written permission.

Public-safe demo of the Dokely patient discovery experience.

This repository intentionally contains only a static frontend demo:

- no backend source code
- no API keys, tokens, credentials, or environment files
- no production data, scraped data, cached records, or real clinician profiles
- no admin, investor, physician portal, data pipeline, or internal tooling code

All clinician rows, locations, publications, and match explanations in this demo
are synthetic fixtures for product demonstration only.

Dokely does not provide diagnosis, treatment, prescriptions, emergency triage,
provider recommendations, referrals, or booking services.

See [LICENSE](LICENSE), [COMMERCIAL.md](COMMERCIAL.md), and
[TRADEMARKS.md](TRADEMARKS.md) for details.

## Run Locally

Open `index.html` in a browser, or serve the folder with any static file server:

```sh
python3 -m http.server 8080
```

Then visit `http://127.0.0.1:8080`.

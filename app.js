const doctors = [
  {
    id: "DEMO-ORTHO-01",
    name: "Maya Chen",
    credential: "MD",
    specialty: "Sports Medicine",
    city: "San Jose",
    setting: "Community clinic",
    distance: 8.4,
    papers: 42,
    citations: 1180,
    confidence: "High",
    tags: ["knee", "running", "ligament", "rehab"],
    topics: ["Runner knee patterns", "Non-surgical recovery", "Return-to-play timing"],
    evidence: [
      ["Publications", "Synthetic paper cluster on overuse knee pain and rehabilitation."],
      ["Procedures", "Synthetic outpatient sports medicine volume."],
      ["Access", "Lower-intensity setting shown before hospital-based options."]
    ],
    note: "A practical starting point when the patient describes running-related knee pain without emergency warning signs."
  },
  {
    id: "DEMO-CARD-02",
    name: "Elena Patel",
    credential: "DO",
    specialty: "Cardiology",
    city: "Palo Alto",
    setting: "Specialty group",
    distance: 17.2,
    papers: 76,
    citations: 2410,
    confidence: "Medium",
    tags: ["chest", "heart", "family", "blood pressure"],
    topics: ["Preventive cardiology", "Risk stratification", "Hypertension"],
    evidence: [
      ["Publications", "Synthetic work on preventive cardiology and risk models."],
      ["Procedures", "Synthetic outpatient diagnostic cardiology signals."],
      ["Access", "Verify referral and network status before booking."]
    ],
    note: "Surfaces when the patient mentions chest discomfort, family history, or cardiovascular risk factors."
  },
  {
    id: "DEMO-NEURO-03",
    name: "Sarah Morgan",
    credential: "MD",
    specialty: "Neurology",
    city: "San Francisco",
    setting: "Academic clinic",
    distance: 48.6,
    papers: 121,
    citations: 3920,
    confidence: "High",
    tags: ["migraine", "headache", "light", "sensitivity"],
    topics: ["Migraine prevention", "Headache phenotyping", "Light sensitivity"],
    evidence: [
      ["Publications", "Synthetic headache medicine publication profile."],
      ["Procedures", "Synthetic migraine-focused outpatient treatment pattern."],
      ["Access", "Academic setting may require referral and longer lead time."]
    ],
    note: "A higher-intensity specialist option for persistent migraine-like symptoms."
  },
  {
    id: "DEMO-PCP-04",
    name: "Daniel Brooks",
    credential: "MD",
    specialty: "Family Medicine",
    city: "Oakland",
    setting: "Primary care",
    distance: 12.8,
    papers: 9,
    citations: 180,
    confidence: "Medium",
    tags: ["general", "first visit", "follow up", "screening"],
    topics: ["Primary evaluation", "Care coordination", "Routine follow-up"],
    evidence: [
      ["Publications", "Small synthetic public-evidence footprint."],
      ["Procedures", "Synthetic primary-care visit pattern."],
      ["Access", "Good first stop for non-urgent broad symptoms."]
    ],
    note: "Shown as a starting point when the symptom description is broad or uncertain."
  },
  {
    id: "DEMO-GI-05",
    name: "Nora Williams",
    credential: "MD",
    specialty: "Gastroenterology",
    city: "Los Angeles",
    setting: "Specialty group",
    distance: 338.1,
    papers: 58,
    citations: 1640,
    confidence: "Medium",
    tags: ["stomach", "reflux", "abdominal", "digestive"],
    topics: ["Reflux evaluation", "Abdominal pain workup", "Endoscopy appropriateness"],
    evidence: [
      ["Publications", "Synthetic gastroenterology topic overlap."],
      ["Procedures", "Synthetic outpatient endoscopy-related pattern."],
      ["Access", "Farther option shown after closer starting points."]
    ],
    note: "Appears for digestive symptoms when the query is more specialty-specific."
  }
];

const state = {
  query: "Persistent migraine with light sensitivity",
  sort: "relevance",
  selectedId: "DEMO-NEURO-03",
  results: []
};

const chatLog = document.querySelector("#chatLog");
const resultList = document.querySelector("#resultList");
const profileView = document.querySelector("#profileView");
const symptomInput = document.querySelector("#symptomInput");
const searchForm = document.querySelector("#searchForm");
const sortRelevance = document.querySelector("#sortRelevance");
const sortDistance = document.querySelector("#sortDistance");
const resetButton = document.querySelector("#resetButton");

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z]+/g) || []).filter((word) => word.length > 2);
}

function scoreDoctor(doctor, query) {
  const queryTokens = new Set(tokenize(query));
  let score = 0;
  for (const tag of doctor.tags) {
    const tagTokens = tokenize(tag);
    for (const token of tagTokens) {
      if (queryTokens.has(token)) score += 4;
    }
  }
  for (const topic of doctor.topics) {
    const topicTokens = tokenize(topic);
    for (const token of topicTokens) {
      if (queryTokens.has(token)) score += 2;
    }
  }
  if (score === 0 && doctor.specialty === "Family Medicine") score = 1;
  return score + Math.min(doctor.papers / 100, 1.5);
}

function runSearch(query) {
  const ranked = doctors
    .map((doctor) => ({ doctor, score: scoreDoctor(doctor, query) }))
    .sort((a, b) => b.score - a.score || a.doctor.distance - b.doctor.distance)
    .map((entry) => entry.doctor);

  state.query = query;
  state.results = ranked;
  state.selectedId = ranked[0].id;
  render();
}

function sortedResults() {
  const list = [...state.results];
  if (state.sort === "distance") {
    list.sort((a, b) => a.distance - b.distance);
  }
  return list;
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderChat() {
  chatLog.innerHTML = `
    <div class="bubble bot">Dokely translates patient language into public-evidence signals and keeps the result framed as discovery, not referral.</div>
    <div class="bubble user">${escapeHtml(state.query)}</div>
    <div class="bubble bot">I found ${state.results.length} synthetic demo doctors. The list balances topic overlap, care setting, and distance.</div>
  `;
}

function renderResults() {
  sortRelevance.classList.toggle("active", state.sort === "relevance");
  sortDistance.classList.toggle("active", state.sort === "distance");

  resultList.innerHTML = sortedResults()
    .map((doctor) => {
      const selected = doctor.id === state.selectedId ? " selected" : "";
      return `
        <article class="doctor-card${selected}">
          <div class="doctor-top">
            <div class="avatar" aria-hidden="true">${initials(doctor.name)}</div>
            <div>
              <p class="doctor-name">${escapeHtml(doctor.name)}, ${doctor.credential}</p>
              <p class="doctor-meta">${escapeHtml(doctor.specialty)} - ${escapeHtml(doctor.city)} - ${escapeHtml(doctor.setting)}</p>
            </div>
          </div>
          <div class="metrics">
            <div class="metric"><strong>${doctor.papers}</strong><span>synthetic papers</span></div>
            <div class="metric"><strong>${doctor.citations.toLocaleString()}</strong><span>synthetic citations</span></div>
            <div class="metric"><strong>${doctor.distance.toFixed(1)} mi</strong><span>demo distance</span></div>
          </div>
          <div class="chip-row">
            <span class="chip good">${doctor.confidence} overlap</span>
            ${doctor.tags.slice(0, 3).map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}
          </div>
          <button type="button" data-select="${doctor.id}">View profile</button>
        </article>
      `;
    })
    .join("");
}

function renderProfile() {
  const doctor = doctors.find((item) => item.id === state.selectedId);
  if (!doctor) {
    profileView.innerHTML = `<div class="empty-profile"><p class="small-text">Select a doctor to view the profile.</p></div>`;
    return;
  }

  profileView.innerHTML = `
    <div class="profile-cover" aria-hidden="true"></div>
    <div class="profile-body">
      <div class="profile-head">
        <div class="profile-avatar" aria-hidden="true">${initials(doctor.name)}</div>
        <div class="profile-title">
          <h3>${escapeHtml(doctor.name)}, ${doctor.credential}</h3>
          <p class="small-text">${escapeHtml(doctor.specialty)} - ${escapeHtml(doctor.city)}</p>
        </div>
      </div>

      <div class="section">
        <h3>Why this doctor surfaced</h3>
        <p class="small-text">${escapeHtml(doctor.note)}</p>
        <div class="chip-row" style="margin-top: 10px">
          ${doctor.topics.map((topic) => `<span class="chip good">${escapeHtml(topic)}</span>`).join("")}
        </div>
      </div>

      <div class="section">
        <h3>Evidence snapshot</h3>
        <div class="evidence-list">
          ${doctor.evidence
            .map(
              ([label, body]) => `
                <div class="evidence-row">
                  <span>${escapeHtml(label)}</span>
                  <p class="small-text">${escapeHtml(body)}</p>
                </div>
              `
            )
            .join("")}
        </div>
      </div>

      <div class="section">
        <h3>Booking checks</h3>
        <p class="small-text">Confirm availability, insurance network status, referral rules, and setting-specific billing before making any appointment decision.</p>
        <div class="profile-actions">
          <button type="button">Call script</button>
          <button type="button" class="secondary">Compare</button>
        </div>
      </div>

      <div class="section">
        <span class="chip warn">Demo fixture</span>
        <p class="small-text" style="margin-top: 8px">This profile is synthetic and does not describe a real clinician, license, publication record, location, or insurance relationship.</p>
      </div>
    </div>
  `;
}

function render() {
  renderChat();
  renderResults();
  renderProfile();
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = symptomInput.value.trim();
  if (query) runSearch(query);
});

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    symptomInput.value = button.dataset.query;
    runSearch(button.dataset.query);
  });
});

resultList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-select]");
  if (!button) return;
  state.selectedId = button.dataset.select;
  render();
});

sortRelevance.addEventListener("click", () => {
  state.sort = "relevance";
  render();
});

sortDistance.addEventListener("click", () => {
  state.sort = "distance";
  render();
});

resetButton.addEventListener("click", () => {
  symptomInput.value = "Persistent migraine with light sensitivity";
  state.sort = "relevance";
  runSearch(symptomInput.value);
});

runSearch(state.query);

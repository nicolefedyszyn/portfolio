// ===== Prescription / Vaccine Booking — Script =====
document.addEventListener('DOMContentLoaded', () => {
  // Guard: if required elements are missing, abort silently
  const step1El = document.getElementById('step1');
  const step2El = document.getElementById('step2');
  const step3El = document.getElementById('step3');
  const progressWrap = document.getElementById('progress');
  if (!step1El || !step2El || !step3El || !progressWrap) return;

  // Simple state
  const state = {
    service: "",
    location: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  };

  // Steps & progress
  const steps = [step1El, step2El, step3El];
  const progress = progressWrap.children;

// Step 1
const service = document.getElementById("service");
const locationSel = document.getElementById("location");
document.getElementById("to2").addEventListener("click", () => {
  if (!service.value || !locationSel.value)
    return alert("Please choose a service and location.");
  state.service = service.value;
  state.location = locationSel.value;
  go(2);
  initDateAndSlots();
});

// Step 2
const date = document.getElementById("date");
const slots = document.getElementById("slots");
document.getElementById("back1").addEventListener("click", () => go(1));
document.getElementById("to3").addEventListener("click", () => {
  if (!state.time) return alert("Please pick a time.");
  go(3);
  renderReview();
});

// Step 3
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const phoneEl = document.getElementById("phone");
const notesEl = document.getElementById("notes");
const err = document.getElementById("err");
document.getElementById("back2").addEventListener("click", () => go(2));

// Simple field-level validators
function isValidEmail(v) {
  // intentionally permissive for prototype; accepts most common emails
  return /.+@.+\..+/.test(v);
}

// When inputs change, hide the error to keep the button interactive and feedback fresh
[nameEl, emailEl, phoneEl, notesEl].forEach((el) => {
  el.addEventListener("input", () => {
    err.hidden = true;
  });
});

document.getElementById("confirm").addEventListener("click", () => {
  state.name = nameEl.value.trim();
  state.email = emailEl.value.trim();
  state.phone = phoneEl.value.trim();
  state.notes = notesEl.value.trim();

  // Validate and focus first invalid field
  if (!state.name) {
    err.hidden = false;
    nameEl.focus();
    return;
  }
  if (!isValidEmail(state.email)) {
    err.hidden = false;
    emailEl.focus();
    return;
  }
  if (!state.time) {
    // If somehow no time is set, take user back to step 2 and hint to pick a time
    err.hidden = false;
    go(2);
    slots.focus();
    return;
  }

  err.hidden = true;
  go("done");
});

document.getElementById("new").addEventListener("click", (e) => {
  e.preventDefault();
  reset();
});

// ---------- Flow helpers ----------
function go(step) {
  // step: 1,2,3 or 'done'
  steps.forEach((s, i) => {
    s.hidden = i !== step - 1;
  });
  if (step === "done") {
    steps.forEach((s) => (s.hidden = true));
    document.getElementById("done").hidden = false;
  } else {
    document.getElementById("done").hidden = true;
  }
  // progress UI
  Array.from(progress).forEach((d, i) => {
    d.classList.remove("active", "done");
    if (step === "done" || i < step - 1) d.classList.add("done");
    if (step !== "done" && i === step - 1) d.classList.add("active");
  });
  // focus first field of step for a11y
  if (step === 1) service.focus();
  if (step === 2) date.focus();
  if (step === 3) {
    // clear any previous error when arriving on confirm step
    if (err) err.hidden = true;
    nameEl.focus();
  }
}

function initDateAndSlots() {
  // Set min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Set max date (3 months from today)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  // Format dates for HTML date input (YYYY-MM-DD)
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Set the min and max attributes
  date.min = formatDate(tomorrow);
  date.max = formatDate(maxDate);

  // Default to tomorrow
  date.value = formatDate(tomorrow);
  state.date = date.value;
  renderSlots();
}

date.addEventListener("change", () => {
  state.date = date.value;
  renderSlots();
});

function renderSlots() {
  // Fake slot generation: 9:00–16:30 every 30 minutes, with some disabled
  const base = [
    "09:00",
    "09:30", 
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];
  slots.innerHTML = "";
  state.time = "";
  base.forEach((t, i) => {
    const btn = document.createElement("button");
    btn.className = "slot";
    btn.type = "button";
    btn.setAttribute("aria-pressed", "false");
    btn.textContent = t;
    // Only disable a couple slots
    if (i === 2 || i === 7) {
      btn.disabled = true;
      btn.title = "Unavailable";
    }
    btn.addEventListener("click", () => {
      Array.from(slots.children).forEach((b) =>
        b.setAttribute("aria-pressed", "false")
      );
      btn.setAttribute("aria-pressed", "true");
      state.time = t;
      // hide any lingering error once a valid time is picked
      err.hidden = true;
    });
    slots.appendChild(btn);
  });
  // Auto-select first available
  const first = Array.from(slots.children).find((b) => !b.disabled);
  if (first) {
    first.click();
  }
}

function renderReview() {
  const review = document.getElementById("review");
  review.innerHTML = "";
  const fields = [
    ["Service", state.service],
    ["Location", state.location],
    ["Date", state.date],
    ["Time", state.time],
  ];
  fields.forEach(([k, v]) => {
    const d = document.createElement("div");
    d.innerHTML = `<strong>${k}</strong><br>${v || "-"}`;
    review.appendChild(d);
  });
}

function reset() {
  Object.keys(state).forEach((k) => (state[k] = ""));
  service.value = "";
  locationSel.value = "";
  nameEl.value = "";
  emailEl.value = "";
  phoneEl.value = "";
  notesEl.value = "";
  go(1);
}

  // init
  go(1);
});

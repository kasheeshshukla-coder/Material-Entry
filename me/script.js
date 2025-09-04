let entries = [];
let currentSelectId = null;

const defaultOptions = {
  material: ["Steel", "Wood", "Plastic"],
  location: ["Warehouse A", "Warehouse B"],
  receiver: ["John", "Alice", "Mary"]
};

// 🔗 Replace this with your actual Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwSP66pai7pb5NqOJHccHlSIxn7xz4rtO9-g0fCTD_Prgy2f1B42q9CivLDMkvg5Lo/exec';

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "admin" && pass === "password") {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-app").style.display = "block";
    addEntry(); // Add first form on login
  } else {
    alert("Incorrect credentials");
  }
}

function addEntry() {
  const container = document.getElementById("form-container");
  const index = entries.length;

  const div = document.createElement("div");
  div.className = "entry";
  div.innerHTML = `
    <select id="material-${index}" onchange="checkAddOption(this, 'material')">
      ${renderOptions('material')}
      <option value="add_new">+ Add New</option>
    </select>
    <input type="number" id="quantity-${index}" placeholder="Quantity" />
    <select id="location-${index}" onchange="checkAddOption(this, 'location')">
      ${renderOptions('location')}
      <option value="add_new">+ Add New</option>
    </select>
    <input type="date" id="date-${index}" />
    <select id="receiver-${index}" onchange="checkAddOption(this, 'receiver')">
      ${renderOptions('receiver')}
      <option value="add_new">+ Add New</option>
    </select>
    <hr/>
  `;
  container.appendChild(div);
  entries.push(index);
}

function renderOptions(type) {
  return defaultOptions[type]
    .map(opt => `<option value="${opt}">${opt}</option>`)
    .join("");
}

function checkAddOption(selectEl, type) {
  if (selectEl.value === "add_new") {
    currentSelectId = selectEl.id;
    document.getElementById("modal-title").innerText = `Add new ${type}`;
    document.getElementById("modal").style.display = "block";
  }
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("new-option").value = "";
}

function addOption() {
  const newOpt = document.getElementById("new-option").value.trim();
  if (!newOpt) return;

  const [type] = currentSelectId.split("-");
  defaultOptions[type].push(newOpt);

  const select = document.getElementById(currentSelectId);
  select.innerHTML = renderOptions(type) + `<option value="add_new">+ Add New</option>`;
  select.value = newOpt;
  closeModal();
}

function submitEntries() {
  const data = entries.map(i => ({
    material: document.getElementById(`material-${i}`).value,
    quantity: document.getElementById(`quantity-${i}`).value,
    location: document.getElementById(`location-${i}`).value,
    date: document.getElementById(`date-${i}`).value,
    receiver: document.getElementById(`receiver-${i}`).value
  }));

  fetch(WEB_APP_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.text())
    .then(response => {
      alert("Submitted successfully!");
      console.log(response);
    })
    .catch(err => {
      console.error(err);
      alert("Error submitting: " + err);
    });
}

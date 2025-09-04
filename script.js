const PASSWORD = "1234"; // Change this to your own password
const dropdownOptions = {
  material: ["Steel", "Wood"],
  location: ["Warehouse 1", "Warehouse 2"],
  receiver: ["John", "Jane"]
};

let entryCount = 0;

function login() {
  const input = document.getElementById("password").value;
  if (input === PASSWORD) {
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("main-form").classList.remove("hidden");
  } else {
    document.getElementById("login-error").innerText = "Incorrect password.";
  }
}

function addEntry() {
  const form = document.getElementById("entry-form");

  const div = document.createElement("div");
  div.className = "entry";
  div.id = `entry-${entryCount}`;

  div.innerHTML = `
    <label>Material:</label>
    ${dropdownHTML('material', entryCount)}
    <label>Quantity:</label>
    <input type="number" name="quantity-${entryCount}" required><br>
    <label>Location:</label>
    ${dropdownHTML('location', entryCount)}
    <label>Date:</label>
    <input type="date" name="date-${entryCount}" required><br>
    <label>Receiver:</label>
    ${dropdownHTML('receiver', entryCount)}
    <hr>
  `;

  form.appendChild(div);
  entryCount++;
}

function dropdownHTML(type, id) {
  const options = dropdownOptions[type].map(opt => `<option value="${opt}">${opt}</option>`).join('');
  return `
    <select name="${type}-${id}" onchange="checkAddOption(this, '${type}', ${id})">
      ${options}
      <option value="__add_new__">+ Add New</option>
    </select><br>
  `;
}

function checkAddOption(select, type, id) {
  if (select.value === "__add_new__") {
    const newVal = prompt(`Enter new ${type}:`);
    if (newVal) {
      dropdownOptions[type].push(newVal);
      updateDropdown(select, type, id, newVal);
    } else {
      select.value = dropdownOptions[type][0];
    }
  }
}

function updateDropdown(select, type, id, newVal) {
  const options = dropdownOptions[type].map(opt => `<option value="${opt}">${opt}</option>`).join('');
  select.innerHTML = `${options}<option value="__add_new__">+ Add New</option>`;
  select.value = newVal;
}

function submitEntries() {
  const data = [];

  for (let i = 0; i < entryCount; i++) {
    const entry = {
      material: document.querySelector(`[name="material-${i}"]`).value,
      quantity: document.querySelector(`[name="quantity-${i}"]`).value,
      location: document.querySelector(`[name="location-${i}"]`).value,
      date: document.querySelector(`[name="date-${i}"]`).value,
      receiver: document.querySelector(`[name="receiver-${i}"]`).value,
    };
    data.push(entry);
  }

  fetch('https://script.google.com/macros/s/AKfycbwB-VvY5E4UmP3vaDaR1CR1csf4MtSj4qV8ojDOemrNjVJs0pcbumTl5mC6wdC4nKU/exec', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => alert('Entries submitted!'))
    .catch(err => alert('Error submitting data.'));
}

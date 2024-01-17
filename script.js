class CrudOperation {
  constructor() {
    this.data = [];
    this.editingIndex = null;
    this.loggedInUser = null;
    this.users = JSON.parse(localStorage.getItem('users')) || [];
  }

  saveUsersToStorage() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  login(username, password) {
    const user = this.users.find(u => u.username === username && u.password === password);

    if (user) {
      this.loggedInUser = username;
      this.showLoggedInView();
    } else {
      alert("Invalid username or password");
    }
  }

  register(username, password) {
    if (!this.users.find(u => u.username === username)) {
      this.users.push({ username, password });
      this.saveUsersToStorage();
      alert("Registration successful! You can now log in.");
      this.showLoginForm();
    } else {
      alert("Username already exists. Please choose another.");
    }
  }

  logout() {
    this.loggedInUser = null;
    this.showLoginForm();
  }

  showLoginForm() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("crudForm").style.display = "none";
    document.getElementById("itemTable").style.display = "none";
  }

  showLoggedInView() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("crudForm").style.display = "block";
    document.getElementById("itemTable").style.display = "block";
    this.renderTable();
  }

  showRegisterForm() {
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("crudForm").style.display = "none";
    document.getElementById("itemTable").style.display = "none";
  }

  create(item) {
    this.data.push(item);
    this.saveDataToStorage();
  }

  read() {
    return this.data;
  }

  update(index, newItem) {
    this.data[index] = newItem;
    this.saveDataToStorage();
  }

  delete(index) {
    this.data.splice(index, 1);
    this.saveDataToStorage();
  }

  saveDataToStorage() {
    localStorage.setItem('crudData', JSON.stringify(this.data));
  }

  // Additional methods for handling UI changes...
}

const crud = new CrudOperation();
const tableBody = document.querySelector("#itemTable tbody");

function renderTable() {
  tableBody.innerHTML = "";
  crud.read().forEach((item, index) => {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>
        <button onclick="editItem(${index})">Update</button>
        <button onclick="deleteItem(${index})">Delete</button>
      </td>
    `;
  });
}

function addItem() {
  if (crud.loggedInUser) {
    const itemNameInput = document.getElementById("itemName");
    const itemName = itemNameInput.value.trim();

    if (itemName) {
      if (crud.editingIndex !== null) {
        crud.update(crud.editingIndex, { name: itemName });
        crud.editingIndex = null;
      } else {
        crud.create({ name: itemName });
      }

      itemNameInput.value = "";
      renderTable();
    }
  } else {
    alert("Please log in to add items.");
  }
}

function editItem(index) {
  if (crud.loggedInUser) {
    const item = crud.read()[index];
    const itemNameInput = document.getElementById("itemName");
    itemNameInput.value = item.name;
    crud.editingIndex = index;
  } else {
    alert("Please log in to edit items.");
  }
}

function deleteItem(index) {
  if (crud.loggedInUser) {
    if (confirm("Are you sure you want to delete this item?")) {
      crud.delete(index);
      renderTable();
    }
  } else {
    alert("Please log in to delete items.");
  }
}

function login() {
  const usernameInput = document.getElementById("loginUsername");
  const passwordInput = document.getElementById("loginPassword");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username && password) {
    crud.login(username, password);
    // Redirect to the "Add Item" section
    document.getElementById("crudForm").scrollIntoView({ behavior: "smooth" });
  } else {
    alert("Please enter a valid username and password.");
  }
}

function register() {
  const usernameInput = document.getElementById("registerUsername");
  const passwordInput = document.getElementById("registerPassword");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username && password) {
    crud.register(username, password);
  } else {
    alert("Please enter both username and password.");
  }
}

function logout() {
  crud.logout();
  // After logout, show the registration form again
  crud.showRegisterForm();
}

// Initial rendering
crud.showRegisterForm();

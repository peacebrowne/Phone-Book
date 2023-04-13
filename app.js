/**
 * Searches for an html element based on specified attribute value [class or id]
 * @param {*} ele
 * @returns {object} - an element
 */
const find_element = (ele) => {
  return document.querySelector(`${ele}`);
};

const storage = (data) => localStorage.setItem("db", JSON.stringify(data));
const get_storage = () => {
  return JSON.parse(localStorage.getItem("db"));
};

const reset_form = (form) => form.forEach((ele) => (ele.value = ""));

// Database
let PHONEBOOK = [];
const form = find_element(".popup-banner");
let mode = "add";

/**
 * Toggle a css style on the specified html element.
 * If class value is available it removes it else it adds it
 * @param {*} ele
 * @param {*} clas
 * @returns {void} - an element
 */
const toggleEl = (ele, clas) => ele.classList.toggle(clas);
const contact_list = find_element(".contact-list ul");

/**
 * Handles all click event
 */
document.addEventListener("click", (event) => {
  const targetEl = event.target;
  const targetElClas = Array.from(targetEl.classList);

  if (targetElClas.includes("open-book")) open_phoneBook(targetEl);
  if (targetElClas.includes("add-contact-btn")) display_form(targetEl);
  if (targetElClas.includes("edit-contact-btn")) stabler(targetEl);
  if (targetElClas.includes("delete-contact-btn")) delete_contact(targetEl);
  if (targetElClas.includes("exit-form")) toggleEl(form, "hidden");
  if (targetElClas.includes("save-btn"))
    mode === "add"
      ? add_contact(form_validation())
      : edit_contact(form_validation());
});

/**
 * Open phone book
 * @param {*} target
 * @returns {void} - an element
 */
const open_phoneBook = (target) => {
  const element = target.closest(".banner");
  toggleEl(element, "hidden");
};

// const photoEl = find_element('.upload-photo')
let photo = "";
let id = "";
let current_target = "";

function upload_photo(ele) {
  const element = ele;
  const selectedFiles = ele.files;
  const reader = new FileReader();

  reader.onload = function (event) {
    const photo_path = event.target.result;
    element.closest(
      ".upload-photo"
    ).nextElementSibling.innerHTML = `<img src="${photo_path}" alt="">`;
    photo = photo_path;
  };

  reader.readAsDataURL(selectedFiles[0]);
}

function form_validation() {
  const inputs = find_element("form").querySelectorAll("input");
  const data = {};
  const contact = {};

  for (let i = 1; i < inputs.length; i++) {
    const ele = inputs[i];
    if (ele.name === "orange" || ele.name === "lonestar")
      contact[ele.name] = ele.value;
    if (!ele.value) return;
    else data[ele.name] = ele.value;
  }

  data.contacts = contact;
  data.photo = photo;
  data.note = find_element("textarea").value;
  reset_form([...inputs, find_element("textarea")]);
  find_element(".photo").innerHTML = "";
  return data;
}

const add_contact = (data) => {
  if (!data) return;
  data.id = PHONEBOOK.length + 1 * Math.floor(Math.random() * 100);
  PHONEBOOK.push(data);
  storage(PHONEBOOK);
  display_contact(data);
  mode = "add";
};

function contact_validation(ele) {
  const contact = ele.value;
  if (
    (!contact.startsWith("077") && contact.length <= 3) ||
    (!contact.startsWith("088") && contact.length <= 3) ||
    (!contact.startsWith("055") && contact.length <= 3)
  ) {
    ele.classList.add("wrongNumber");
  } else {
    ele.classList.remove("wrongNumber");
  }
}

function stabler(target) {
  mode = "edit";
  id = contact_id(target);
  current_target = target;
  const data = PHONEBOOK.find((val) => val.id === id);
  photo = data.photo;
  display_form(data);
}

function contact_id(targetEl) {
  return +targetEl.closest(".contact-item").dataset.id;
}

function delete_contact(targetEl) {
  id = contact_id(targetEl);
  for (let i = 0; i < PHONEBOOK.length; i++) {
    if (PHONEBOOK[i].id === id) {
      PHONEBOOK.splice(i, 1);
      storage(PHONEBOOK);
      targetEl.closest(".contact-item").remove();
    }
  }
}

function edit_contact(data) {
  for (let i = 0; i < PHONEBOOK.length; i++) {
    data.id = id;

    if (PHONEBOOK[i].id === data.id) {
      PHONEBOOK[i] = data;
      current_target
        .closest(".contact-item")
        .querySelector(".name").textContent = PHONEBOOK[i].name;
      current_target
        .closest(".contact-item")
        .querySelector(".email").textContent = PHONEBOOK[i].email;
      current_target
        .closest(".contact-item")
        .querySelector(".orange").textContent = PHONEBOOK[i].contacts.orange;
      current_target
        .closest(".contact-item")
        .querySelector(".lonestar").textContent =
        PHONEBOOK[i].contacts.lonestar;
      storage(PHONEBOOK);
      mode = "add";
      return;
    }
  }

  id = "";
  current_target = "";
}

function display_form(data) {
  const contact_form = find_element(".popup-banner").querySelector("form");

  if (mode === "add") {
    contact_form.innerHTML = `
           
        <div class="upload-photo">
        <i class="fa fa-camera"></i>
        <input type="file" onchange="upload_photo(this)" name="photo" id="">
        </div>

        <div class="form-group photo"></div>

        <div class="form-group">
            <input type="text" name="name" required placeholder="Name">
        </div>
        <div class="form-group">
            <input type="email" name="email" placeholder="Email">
        </div>
        
        <div class="form-group">
            <input type="tel"  onkeyup="contact_validation(this)" name="orange"  placeholder="Orange Number" maxlength="10">
        </div>

        <div class="form-group">
            <input type="tel"  onkeyup="contact_validation(this)" name="lonestar"  placeholder="Lonestar Number" maxlength="10">
        </div>

        <div class="form-group">
            <input type="date" name="data">
        </div>

        <div class="form-group">
            <textarea name="" id="" cols="30" rows="3" required placeholder="Note"></textarea>
        </div>

        <div class="form-group">
            <button type="button" name="" id="" class="save-btn">Save</button>
        </div>
        `;
  } else {
    contact_form.innerHTML = `
        <div class="upload-photo">
        <i class="fa fa-camera"></i>
        <input type="file" value="${data.photo}" onchange="upload_photo(this)" name="photo" id="">
        </div>

        <div class="form-group photo">
            <img src="${data.photo} " />
        </div>

        <div class="form-group">
            <input type="text" value="${data.name}" name="name" required placeholder="Name">
        </div>
        <div class="form-group">
            <input type="email" value="${data.email}" name="email" placeholder="Email">
        </div>
        
        <div class="form-group">
            <input type="tel" onkeyup="contact_validation(this)" name="orange"  value="${data.contacts.orange}"  placeholder="Orange Number" maxlength="10">
        </div>

        <div class="form-group">
            <input type="tel" onkeyup="contact_validation(this)" name="lonestar" value="${data.contacts.lonestar}"  placeholder="Lonestar Number" maxlength="10">
        </div>

        <div class="form-group">
            <input type="date" value="${data.data}" name="data">
        </div>

        <div class="form-group">
            <textarea name="" id="" cols="30" rows="3" required placeholder="Note">${data.note}</textarea>
        </div>

        <div class="form-group">
            <button type="button" name="" id="" class="save-btn">Save</button>
        </div>
    `;
  }

  toggleEl(form, "hidden");
}

function display_contact(data) {
  contact_list.insertAdjacentHTML(
    "beforeend",
    ` <li class="contact-item" data-id="${data.id}">
        <img class="contact-photo" src="${data.photo}" alt="">
        <span class="contact-info">
            <h5 class="name">${data.name}</h5>
            <h6 class="email">${data.email}</h6>
        </span>

        <span class="contact">
            <h5 class="orange">${data.contacts.orange} </h5>
            
            <h5 class="lonestar">${data.contacts.lonestar}</h5>
        </span>

        <span class="contact-action">
            <i class="fa fa-ellipsis-vertical"></i>
            <div class="contact-action-menu">
                <ul>
                    <li class="edit-contact-btn">
                        <i class="fa fa-pen"></i>
                        <span>Edit</span>
                    </li>
                    <li class="delete-contact-btn">
                        <i class="fa fa-trash"></i>
                        <span>Delete</span>
                    </li>
                </ul>
            </div>
        </span>
    </li>`
  );
}

const search = find_element(".search");
search.addEventListener("keyup", search_contact);

function search_contact(event) {
  const terms = search.value.toLowerCase();
  Array.from(contact_list.children).forEach((ele) => {
    if (ele.innerText.toLowerCase().includes(terms)) {
      ele.closest(".contact-item").style.display = "flex";
    } else {
      ele.closest(".contact-item").style.display = "none";
    }
  });
}

window.onload = () => {
  if (!get_storage()) storage(PHONEBOOK);
  PHONEBOOK = get_storage();
  if (!get_storage()) return;
  PHONEBOOK.forEach((contact) => display_contact(contact));
};

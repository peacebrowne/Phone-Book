
/**
 * Searches for an html element based on specified attribute value [class or id]
 * @param {*} ele 
 * @returns {object} - an element
 */
const find_element = ele => {
    return document.querySelector(`${ele}`)
}

const storage = data => localStorage.setItem('db',JSON.stringify(data))
const get_storage = () => {
    return JSON.parse(localStorage.getItem('db'))
}

const reset_form = form => form.forEach(ele => ele.value = '');

// Database
let PHONEBOOK = []
const form = find_element('.popup-banner')
let mode = 'add'

/**
 * Toggle a css style on the specified html element. 
 * If class value is available it removes it else it adds it
 * @param {*} ele 
 * @param {*} clas 
 * @returns {void} - an element
 */
const toggleEl = (ele,clas) => ele.classList.toggle(clas)
const contact_list = find_element('.contact-list ul')

/**
 * Handles all click event
 */
document.addEventListener('click', event => {

    const targetEl = event.target;
    const targetElClas = Array.from(targetEl.classList)

    if(targetElClas.includes('open-book')) open_phoneBook(targetEl)
    if(targetElClas.includes('add-contact-btn')) display_form(targetEl)
    if(targetElClas.includes('edit-contact-btn')) stabler(targetEl) 
    if(targetElClas.includes('delete-contact-btn')) delete_contact(targetEl) 
    if(targetElClas.includes('exit-form')) toggleEl(form,'hidden')
    if(targetElClas.includes('save-btn')) mode === 'add' ? add_contact(form_validation()) : edit_contact(form_validation())

})

/**
 * Open phone book
 * @param {*} target 
 * @returns {void} - an element
 */
const open_phoneBook = target => {

    const element = target.closest('.banner')
    toggleEl(element,'hidden')

}

// const photoEl = find_element('.upload-photo')
let photo = ''
let id;

const upload_photo = event =>{

    const element = event;
    const photo_path = URL.createObjectURL(element.files[0])
    element.closest('.upload-photo').nextElementSibling.innerHTML = `<img src="${photo_path}" alt="">`
    photo = photo_path;

}

// photoEl.addEventListener('change',upload_photo)

function form_validation() {

    const inputs = find_element('form').querySelectorAll('input')
    const data = {}
    const contact = {}

    for(let i = 1; i < inputs.length; i++){

        const ele = inputs[i]

        if(ele.name === 'orange' || ele.name === 'lonestar') contact[ele.name] = ele.value
        if(!ele.value) return
        else data[ele.name] = ele.value
        
    };

    data.contacts = contact
    data.photo = photo
    data.note = find_element('textarea').value
    reset_form([...inputs,find_element('textarea')])
    find_element('.photo').innerHTML = ''
    return data

}

const add_contact = data => {

    if(!data) return;
    data.id = PHONEBOOK.length+1 * (Math.floor(Math.random() * 100))
    PHONEBOOK.push(data)
    storage(PHONEBOOK)
    display_contact(data)
    mode = 'add'

}


function stabler(target) {

    mode = 'edit'
    id = contact_id(target)
    const contact = PHONEBOOK.find(val => val.id === id)
    display_form(contact)
    id = ''

}

function contact_id(targetEl){
    return +targetEl.closest('.contact-item').dataset.id
}


function delete_contact(targetEl){

    id = contact_id(targetEl)
    for (let i = 0; i < PHONEBOOK.length; i++) {
        if(PHONEBOOK[i].id === id) {

            PHONEBOOK.splice(i,1)
            storage(PHONEBOOK)
            targetEl.closest('.contact-item').remove()

        }
    }
}


function edit_contact(data){
    
    for (let i = 0; i < PHONEBOOK.length; i++) {
        data.id = id

        if(PHONEBOOK[i].id === data.id) {

            PHONEBOOK[i] = data
            contact_list.querySelector('.name').textContent = PHONEBOOK[i].name
            contact_list.querySelector('.email').textContent = PHONEBOOK[i].email
            storage(PHONEBOOK)
            mode = 'add'
            return;
        }
        
    }
}

function display_form (data) {
    const contact_form = find_element('.popup-banner').querySelector('form');
    
    if(mode === 'add'){
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
            <input type="tel" name="orange"  placeholder="Orange Number" maxlength="10">
        </div>

        <div class="form-group">
            <input type="tel" name="lonestar"  placeholder="Lonestar Number" maxlength="10">
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
        `
    }else{
        contact_form.innerHTML = `
        <div class="upload-photo">
        <i class="fa fa-camera"></i>
        <input type="file" onchange="upload_photo(this)" name="photo" id="">
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
            <input type="tel" name="orange" value="${data.contacts.orange}"  placeholder="Orange Number" maxlength="10">
        </div>

        <div class="form-group">
            <input type="tel" name="lonestar" value="${data.contacts.lonestar}"  placeholder="Lonestar Number" maxlength="10">
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
        `
    }

    toggleEl(form,'hidden')

}

function display_contact(data){
    contact_list.insertAdjacentHTML(
        "beforeend"
        ,

        ` <li class="contact-item" data-id="${data.id}">
        <img class="contact-photo" src="${data.photo}" alt="">
        <span class="contact-info">
            <h5 class="name">${data.name}</h5>
            <h6 class="email">${data.email}</h6>
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
    )
}

const search = find_element('.search')
search.addEventListener('keydown', search_contact)

function search_contact(event){
    const key = event.key.toLowerCase();
    Array.form(contact_list).forEach(contact => {

        // if(contact.te)
    })
}


window.onload = () => {

    if (!get_storage()) storage(PHONEBOOK)
    PHONEBOOK = get_storage()
    if(!get_storage()) return
    PHONEBOOK.forEach(contact => display_contact(contact))

}
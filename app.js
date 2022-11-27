const banner = document.querySelector('.banner')
const hideEle = ele => ele.style.display = 'none';
const showEle = ele => ele.style.display = 'flex';
const popup_banner = document.querySelector('.popup-banner')
const contact_form = document.querySelectorAll('.contact-form input')
const desktop_view = document.querySelector('.deskop-view table tbody')
const mobile_view = document.querySelector('.mobile-view table')
const delete_form = document.querySelector('.delete-contact')
const add_form = document.querySelector('.contact-form')

let transaction,target;

// Phone book => array of contacts
// let phoneBook = [
//     {
//         id: 1,
//         name:'peace browne',
//         contact:"0770237596",
//         email:'eman@gmail.com'
//     },
//     {
//         id: 2,
//         name:'badio kyne',
//         contact:"0770237596",
//         email:'eman@gmail.com'
//     },
//     {
//         id: 3,
//         name:'victoria doe',
//         contact:"0770237596",
//         email:'eman@gmail.com'
//     }

// ];
let phoneBook = [];

// Handling all click events.
document.body.addEventListener('click', ev => {
    ev.preventDefault()
    target = ev.target;

    if(target.className.includes('open-book')) open_book();
    else if(target.className.includes('add-contact')) toggle('add',popup_banner,'display-flex');
    else if(target.className.includes('cancel-form')) cancel_form();
    else if(target.className.includes('save-btn')) {
        if(transaction == 'add'){
            add_contact(contact_form)
        }else if(transaction == 'edit'){
            edit_contact(contact_form)
        }
    }
    else if(target.className.includes('mobile-contact-info')) mobile_contact_info(target);
    else if(target.className.includes('edit-btn')) edit_target(target)
    else if(target.className.includes('delete-btn')) delete_target(target);
    else if(target.className.includes('yes-btn')) delete_contact()
    
})

/**
 * Display and hide forms depending on user interation
 * between add, edit or delete contact
 *  *  @param msg - transction message
 *  *  @param ele - popup banner
 *  *  @param clas - class to toggle
 */
const toggle = (msg,ele,clas) =>{

    ele.classList.toggle(clas);
    transaction = msg;
    if(msg =='add' || msg == 'edit'){

        hideEle(delete_form)
        ele.children[1].classList.toggle(clas)

    }else if(msg == 'delete'){
        hideEle(add_form)
        ele.children[2].classList.toggle(clas)
    }

}

/**
 * Remove toggled class from each forms if present or not 
 * and hide popup banner
 *  *  @param element - popup banner
 *  *  @param clas - class to toggle
 */
const remove_toggle = (element,clas) =>{

    [element.children[1],element.children[2]].forEach(ele =>{
        ele.classList.remove('display-flex')
    });
    element.classList.toggle(clas)
}

// Opens phone book
const open_book = ()=>  setTimeout(()=>hideEle(banner),1000);

// Cancel and reset form
const cancel_form = () =>{
    reset_form(contact_form)
    remove_toggle(popup_banner,'display-flex')
}

let number = 1, index = 0;

/**
 * Display all contacts on mobile and desktop view 
 * They both have differnt interfaces
 *  *  @param {object} - object of new contact
 * 
 */
const display = () =>{
        mobile_view.innerHTML = '' , desktop_view.innerHTML = ''
        number = 1

    phoneBook.forEach(contact => {

        // mobile view display
        const mobile_display = `
        <tbody class="mobile-row">
            <tr class="contact-row">
                <td class="mobile-contact-info">${number}</td>
                <td class="mobile-contact-info name">${contact.name}</td>
                <td class="mobile-contact-info opt"><i class="fa fa-angle-down mobile-contact-info"></i></td>
            </tr>
            <tr class="mobile-list"  id="${contact.id}" data-index="${index}">
                <td colspan="3">
                    <li>${contact.contact}</li>
                    <li>${contact.email}</li>
                    <li>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </li>
                </td>
            </tr>
        </tbody>
        `
        // desktop view display
        const desktop_display = `
        <tr class="contact-row desktop-row"  data-index="${index}" id="${contact.id}">
            <td>${number}</td>
            <td class="name">${contact.name}</td>
            <td>${contact.contact}</td>
            <td>${contact.email}</td>
            <td><button class="edit-btn">Edit</button></td>
            <td><button class="delete-btn">Delete</button></td>
        </tr>
        `
        number++ , index++

        mobile_view.innerHTML += mobile_display
        desktop_view.innerHTML += desktop_display

    })

    // number = 1, index = 0;

}

const angles = {
    down:'fa-angle-down',
    up:'fa-angle-up'
}

/** 
*   when phonebook is open on mobile provides user with different interaction
*  *   @param target- either of tr or td elements
*/
const mobile_contact_info = target =>{

    let contact_info = target.parentElement;
    let contact;
    if(contact_info.className.includes('contact-row')){

        contact = contact_info.parentElement.children[1]
        contact.classList.toggle('mobile-list-on')

    }else{

        contact = contact_info.parentElement.parentElement.children[1]
        contact.classList.toggle('mobile-list-on')

    }
        
}

/**
 * Getting data from contact form and validating.
 * If form is not complete, cancel form execution,
 * else store new contact into phone book.
 *  *  @param data [html input collection]- contact form data
 * 
 */
const add_contact = data =>{

    let contact = {};

    for(datum of data){
        if (datum.value === '') return;
        contact[datum.name] = datum.value
    }
    contact['id'] = number;

    reset_form(data)
    phoneBook.push(contact)
    localStorage.setItem('phoneBook',JSON.stringify(phoneBook))
    display()

}


/**
 *  Edit target fetch targeted contact and prepare contact for edit...
 *  *  @param data [html input collection]- contact form data
 */
let id;
let element;
let contact;

const edit_target = data =>{

    element = data.parentElement.parentElement;

    if(element.className.includes('contact-row')){
        id = element.id;
        contact = phoneBook.find(ele => ele.id == id)
    }else{
        id = element.parentElement.id
        contact = phoneBook.find(ele => ele.id == id)
    }

    contact_form[0].value = contact.name;
    contact_form[1].value = contact.contact;
    contact_form[2].value = contact.email;

    toggle('edit',popup_banner,'display-flex')
}

/**
 * If form is not complete, cancel form execution,
 * else add replace edited contact in phone book.
 *  *  @param data [html input collection]- contact form data
 * 
 */
const edit_contact = data =>{

    let target_contact = {};

    for(datum of data){
        if (datum.value === '') return;
        target_contact[datum.name] = datum.value
    }
    target_contact['id'] = id;

    for (let i = 0; i < phoneBook.length; i++) {
        const item = phoneBook[i];
        if (item.id == id) {
            phoneBook[i] = target_contact;
        }
        
    }
    localStorage.setItem('phoneBook',JSON.stringify(phoneBook))
    display()

}

/**
 * Delete contact from db and remove it from screen.
 *  *  @param data [html input collection]- contact form data
 * 
 */

 const delete_target = data =>{

    element = data.parentElement.parentElement; 

    if(element.className.includes('contact-row')){
        id = element.id;
        contact = phoneBook.find(ele => ele.id == id)
    }else{
        id = element.parentElement.id
        contact = phoneBook.find(ele => ele.id == id)
    }

    toggle('delete',popup_banner,'display-flex')

}

const delete_contact = () => {

    for (let i = 0; i < phoneBook.length; i++) {
        const item = phoneBook[i];
        if (item.id == id) {
            phoneBook.splice(i,1);
        }
    }
    localStorage.setItem('phoneBook',JSON.stringify(phoneBook))
    display()
    remove_toggle(popup_banner,'display-flex')
}

/**
 * Removing old data from forms and resetting it to normal.
 *  *  @param data [html input collection]- contact form input
 */
const reset_form = data => data.forEach(datum => datum.value = '')

/**
 * Search contact 
 *  *  @param key - any keyboard character
 * 
 */
const search = document.querySelector('.search')

const search_contact = ev => {

    const char = ev.target.value.toLocaleLowerCase()
    const names = document.querySelectorAll('.name')

    names.forEach(name => {

        let element = name.parentElement
        let text = name.textContent.toLocaleLowerCase()

        if(text.includes(char)){

            if(element.className.includes('desktop-row') || element.className.includes('contact-row')){
                
                element.style.display = 'table-row'
            }

        }else{
            element.style.display = 'none'
        }

    })

}

search.addEventListener('keyup',search_contact)

/**
    fetching all contacts from database to display
    when the page is loading.
    if contact exist, display it, else move on
*/
window.onload = ()=>{
        if(localStorage.getItem('phoneBook') == null){
            localStorage.setItem('phoneBook',JSON.stringify([]))
        }else{
            phoneBook = JSON.parse(localStorage.getItem('phoneBook'))
        }

        display()
}





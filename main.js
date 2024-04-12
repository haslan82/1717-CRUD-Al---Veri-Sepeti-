/* Gerekli HTML elementlerini Seç */
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

// Düzenleme Seçenekleri

let editElement ;
let editFlag = false; // düzenleme modunda olup olmadığını belirtir
let editID = ""; // Düzenleme yapılan öğenin benzersiz kimliği


// Fonksiyonlar

const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Ekle";
}


const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};

// Tıkladığımız "article" etiketini ekrandan kaldıracak fonksiyondur

const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement; // article etiketine eriştik
  const id = element.dataset.id
  list.removeChild(element); // list etiketi içerisinden article etiketini kaldırdık
  displayAlert("Öğe kaldırıldı", "danger")
  setBackToDefault();
  removeFromLocalStorage(id)
};


const editItem = (e) => {

const element = e.currentTarget.parentElement.parentElement ;// article etiketine parentElement sayesinde eriştik
editElement = e.currentTarget.parentElement.previousElementSibling;

//Tıkladığım "article" etiketi içerisindeki p etiketinin textini inputun içerisine gönderme
grocery.value = editElement.innerText;

editFlag = true;
editID = element.dataset.id; // düzenlenen ögenin kimliğine erişme
submitBtn.textContent = "Düzenle"; // Düzenleme işleminde submitBtnin içerik kısmını güncelledik

};


const addItem = (e) => {
  e.preventDefault(); // Formun Gönderilmesini engeller
  const value = grocery.value; // Form içerisindeki inputun değerini aldık
  const id = new Date().getTime().toString(); // Benzersiz bir id oluşturduk

  // Eğer input boş değilsa ve düzenleme modunda değilse çalışacak blok yapısı
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); // Yeni bir "article" etiketi oluşturduk
    let attr = document.createAttribute("data-id"); // Yeni bir veri kimliği oluşturur.
    attr.value = id;
    element.setAttributeNode(attr); // oluşturduğumuz id yi "article etiketine ekledik"
    element.classList.add("grocery-item"); // oluşturdugumuz article etiketine class ekledik

    element.innerHTML = `
            <p class="title">${value}  </p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
`;

const deleteBtn = element.querySelector(".delete-btn");
deleteBtn.addEventListener("click", deleteItem );
const editBtn = element.querySelector(".edit-btn");
editBtn.addEventListener("click", editItem);


// kapsayıcıya oluşturduğumuz article etiketini ekledik

    list.appendChild(element);
    displayAlert("Başarıyla eklenildi", "success");
    container.classList.add("show-container");

    // Localstorage ekleme yapma
// yerel depoya öğe ekleme işlemi

addToLocalStorage(id, value);

    // Değerleri Varsayılana değiştir.

    setBackToDefault();
  }
  else if(value !== "" && editFlag){

    // Değiştireceğimiz p etiketinin içerik kısmına kullanıcının inputa girdiği değeri gönderdik

    editElement.innerText = value;
    // Ekrana alert yapısını bastırdık

    displayAlert("Değer Değiştirildi", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  }
};


const clearItems = () => {
 const items =  document.querySelectorAll(".grocery-item");

 // Listede öğe varsa çalışır
 if(items.length > 0) {
  items.forEach((item) => list.removeChild(item));
 }

 // container yapısını gizledik
 container.classList.remove("show-container");

 displayAlert("Liste Boş", "danger");
 setBackToDefault();

};


const createListItem = (id, value) => {
  const element = document.createElement("article"); // Yeni bir "article" etiketi oluşturduk
    let attr = document.createAttribute("data-id"); // Yeni bir veri kimliği oluşturur.
    attr.value = id;
    element.setAttributeNode(attr); // oluşturduğumuz id yi "article etiketine ekledik"
    element.classList.add("grocery-item"); // oluşturdugumuz article etiketine class ekledik

    element.innerHTML = `
            <p class="title">${value}  </p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
`;

const deleteBtn = element.querySelector(".delete-btn");
deleteBtn.addEventListener("click", deleteItem );
const editBtn = element.querySelector(".edit-btn");
editBtn.addEventListener("click", editItem);


// kapsayıcıya oluşturduğumuz article etiketini ekledik

    list.appendChild(element);
 
    container.classList.add("show-container");

   
};


const setupItems = () => {
let items = getLocalStorage();
if (items.lenght > 0) {
  items.forEach((item) => {
   createListItem(item.id, item.value);
  });
}

};



/* local storage  */
// yerel depoya öğe ekleme işlemi
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};


// Yerel depodan öğeleri alma işlemi

const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};


// localStoragedan veriyi silme

const removeFromLocalStorage = (id) => {
  // localStorageda bulunan verileri getir
  let items = getLocalStorage();
  // tıkladığım etiketin idsi ile localStorageda ki id eşit değilse bunu diziden çıkar ve yeni bir elemana aktar
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStorage = (id, value) => {
  let items = getLocalStorage();


  // yerel depodaki verilerin id ile güncellenecek olan verinin id si biribirne eşit ise inputa girilen value değişkenini al
  // localStorageda bulunan verinin value suna aktar
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
};

// Olay İzleyicileri

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);


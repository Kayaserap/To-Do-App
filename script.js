// let gorevListesi = [{
//         'id': 1, 
//         'gorevAdi': 'Görev 1','durum':'completed'
//     },
//     {
//         'id': 2,
//         'gorevAdi': 'Görev 2','durum':'pending'
//     },
//     {
//         'id': 3,
//         'gorevAdi': 'Görev 3','durum':'completed'
//     },
//     {
//         'id': 4,
//         'gorevAdi': 'Görev 4','durum':'pending'
//     },
// ];


let gorevListesi = [];
if (localStorage.getItem('gorevListesi') !== null) {

    gorevListesi = JSON.parse(localStorage.getItem('gorevListesi'));
}





let editId;
let isEditTask = false; //mod bilgisini tutacak bi mob tanıımlıycaz
const taskInput = document.querySelector('#txtTaskName');
const btnClear = document.querySelector('#btnClear');
const filters = document.querySelectorAll('.filters span');
displayTasks('all'); //fonksıyonu ilk basta yukluyoruzkı yuklenmıs olsun yoksa elemanlar yuklenmez


function displayTasks(filter) {
    let ul = document.getElementById('task-list');

    ul.innerHTML = '' //ulnın ıcındekı bılgıler tekrar sılınmıs olsunkı ekle dedıgımızde hepsı ekleemesın


    if (gorevListesi.length == 0) {
        ul.innerHTML = '<p class="p-3 m-0"> Görev Listeniz Boş</p>'

    } else {

        // !bu bilgiyi dinamik hale getireceğiz id bilgisini sayalım
        for (let gorev of gorevListesi) {
            let completed = gorev.durum == 'completed' ? 'checked' : '' //turner operatoru ıle
            if (filter == gorev.durum || filter == 'all') {
                let li = `
    <li class="task list-group-item">   
    <div class="form-check">
        <input type="checkbox" onclick="updateStatus(this)" id="${gorev.id }" class="form-check-input" ${completed}>
    
        <label for="${gorev.id}" class="form-check-label ${completed}"> ${gorev.gorevAdi}</label>
    
    </div>
    <div class="dropdown">
    <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
   
    <i class="fa-solid fa-ellipsis"></i>
    </button>
    <ul class="dropdown-menu">
      <li><a  onclick="deleteTask(${gorev.id })" class="dropdown-item " href="#"> <i class="fa-solid fa-trash-can"></i> Sil </a></li>
      <li><a onclick="editTask(${gorev.id} ,'${gorev.gorevAdi }')" class="dropdown-item" href="#"> <i class="fa-solid fa-pen"></i> Düzenle</a></li>
 
    </ul>
  </div>
    </li>
    
    
    
    `;

                ul.insertAdjacentHTML('beforeend', li); //!olusturdugumuz yeni liyi ulye tasıyoruz.yeni bir gmörev kutusu sayfada görev 2 olarak gelıyor

            }


        }

    }
}

document.querySelector('#btnAddNewTask').addEventListener('click', newTask);
document.querySelector('#btnAddNewTask').addEventListener('keypress', function () { //enter tusu ıle klavye kullanımı
    if (event.key == 'Enter') {
        document.getElementById('btnAddNewTask').click() //onkeypress eventi her tusa basıldıgında cagrılıyor
    }

});

//!elemanlar arası gecısı
for (let span of filters) {
    span.addEventListener('click', function () { //elemanlar arası gecısı sağladık yapılacaklar,tamamlananlar listesine tıklamamızı saglıyor   
        document.querySelector('span.active').classList.remove('active');
        span.classList.add('active');
        displayTasks(span.id);
    })

}

function newTask(event) {

    if (taskInput.value == '') {
        alert('görev girmelisiniz')
    } else {
        if (!isEditTask) {

            //ekleme
            gorevListesi.push({
                'id': gorevListesi.length + 1,
                'gorevAdi': taskInput.value,
                'durum': 'pending'
            });
        } else {
            //güncelleme
            for (let gorev of gorevListesi) {
                if (gorev.id == editId) {
                    gorev.gorevAdi = taskInput.value
                }
                isEditTask = false;
            }
        }

        taskInput.value = ''; //input içindeki bilgide silinmiş olur
        displayTasks(document.querySelector('span.active').id);


        localStorage.setItem('gorevListesi', JSON.stringify(gorevListesi));

    }


    event.preventDefault();
} //sayfanın yenılenmesını engeller



// !silme özelliği

function deleteTask(id) { //index numarasına gore sılıcez oyuzden idsini bulacagız
    let deletedId;
    for (let index in gorevListesi) {
        if (gorevListesi[index].id == id) {
            deletedId = index;
        }

    }

    // !ALTARNATİFİ

    // deletedId=gorevListesi.findIndex(function(gorev){

    //     return gorev.id==id;  //görevlistesindeki id ile dısarıdan gonderılen ıd esıt ıse döndür
    // })


    // !3.ALTARNATİFİ ARROW FUNCTİON

    // deletedId=gorevListesi.findIndex(gorev=>gorev.id==id)


    gorevListesi.splice(deletedId, 1); //belirtilen indexden itibaren 1 tane sil splice bu işe yarıyordu
    displayTasks(document.querySelector('span.active').id); //1 ELEMANI SİLİNCE KALAN 3 ELEMAN SAYFA UZERINE TEKRAR YOKLENSIN DIYE
    localStorage.setItem('gorevListesi', JSON.stringify(gorevListesi));
}

// !düzenleme özelliği
function editTask(taskId, taskName) {

    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
    taskInput.focus(); //inputextine konumlanacak
    taskInput.classList.add('active');
    console.log('edit id:', editId);
    console.log('edit mode', isEditTask);
}

// !hepsnini sil özelliği
btnClear.addEventListener('click', function () {



    gorevListesi.splice(0, gorevListesi.length)
    localStorage.setItem('gorevListesi', JSON.stringify(gorevListesi));
    displayTasks('all');

});

function updateStatus(selectedTask) {
    // console.log(selectedTask.parentElement.lastElementChild);
    let label = selectedTask.nextElementSibling;
    let durum;

    if (selectedTask.checked) {
        label.classList.add('checked'); //artık tıklayınca yazının uzerı cızgılı olacak
        durum = 'completed';

    } else {
        label.classList.remove('checked'); //bu else sayesındede ıkıncı kez tıkladıgımızda cızgı kalkacak
        durum = 'pending';
    }

    for (let gorev of gorevListesi) {

        if (gorev.id == selectedTask.id) {
            gorev.durum = durum; //gorevın durum bılgısını yukarıda yazdıgımız durum ıle uncelledık
        }
    }
    displayTasks(document.querySelector('span.active').id);
    localStorage.setItem('gorevListesi', JSON.stringify(gorevListesi));
}
let work = [];

let gallery = document.querySelector('.gallery');
let filters = document.querySelector('.filters');
let Button = document.querySelector('.button');


// recuperation des donnees de l'api
const getWork = () => {
    fetch('http://localhost:5678/api/works').then((reponse) => reponse.json())
        .then((data) => {
            work = data;
            getPictures('.gallery', work, false);
            getCategory();
        })
}


const getPictures = (elem, data, edit) => {
    const image = document.querySelector(elem)
    image.innerHTML = '';
    data.forEach((w) => {

        const figure = document.createElement('figure');
        const img = document.createElement('img')
        img.setAttribute('src', w.imageUrl)
        if (edit) {
            const i = document.createElement('i')
            i.className = "fa-solid fa-trash-can"
            figure.appendChild(i)
            i.addEventListener('click', (event) => {
                const deletePic = event.target.parentNode
                deletePic.remove()
                console.log(w.id)

                fetch(`http://localhost:5678/api/works/${w.id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }

                }).then((reponse) => {
                    if (!reponse.ok) {
                        console.log('not allowed');
                        if (reponse.status === 401) {
                            throw new Error('Erreur dans l’identifiant ou le mot de passe');
                        }
                        throw new Error('erreur')
                    }
                    getWork();//verifier le statut 200 204 avant de lancer la fonction
                    return reponse.json()


                }).then((data) => {
                    console.log(data)
                })
                    .catch((error) => {
                        console.log(error.message)

                    })
            })
        }
        else {
            const figcaption = document.createElement('figcaption')
            figcaption.textContent = w.title
            figure.appendChild(figcaption)
        }
        figure.prepend(img)
        image.appendChild(figure)
    })
}


const getCategory = () => {
    filters.innerHTML = ''
    let cat = [];//Creation d'un tableau pour stocker les categories et eviter les doublons
    let allFilters = document.createElement('button');
    allFilters.className = 'button_selected';
    allFilters.innerText = 'Tous';
    filters.appendChild(allFilters);

    work.forEach((w) => {
        if (!cat[w.category.name]) {//Si dans la boucle le nom de cette categorie n'existe pas dans la variable 'cat',alors on l'ajoute dans celle-ci et on cree son bouton 
            cat[w.category.name] = Number(w.category.id);//j'utiliste number pour m'assurer qu'il passe en 'int' dans le tableau
            let Button = document.createElement('button');
            Button.innerText = w.category.name;
            Button.id = w.category.id;
            filters.appendChild(Button);

        }
    })
}

filters.addEventListener("click", (event) => {
    //Je m'assure d'etre dans le bouton de la class '.filters'
    if (event.target.tagName === 'BUTTON') {
        let BtnSelected = document.querySelector('.button_selected');//Je pointe sur l'element DOM qui a la class 'button_selected'
        BtnSelected.classList.remove(`button_selected`);//Je retire la class de l'element DOM selectionne precedemment
        event.target.classList.add(`button_selected`);//J'ajoute la class a l'objet DOM sur lequel j'ai cliqué
        console.log(BtnSelected)
        if (event.target.id) {//Si un id est existant, alors je filtre les categories 
            const ClickFilter = work.filter(function (item) {
                return item.category.id == event.target.id;//Je compare les id des item a l'id de la categorie(event.target.id)pour uniquement retourner ceux qui correspondent
            })
            getPictures('.gallery', ClickFilter, false);//J'apelle la fonction pour afficher les resultat filtrees dans ClickFilter

        } else {//Si aucun id est existant, j'affiche tout
            getPictures('.gallery', work, false);
        }
    }
})


const header = document.querySelector('header')
const portfolio = document.getElementById('portfolio')
const h2 = document.querySelector('h2')
const token = sessionStorage.getItem('token')
const modal = document.querySelector('.modal');
const modalAdd = document.querySelector('.modal_add')
//sessionStorage.removeItem('token')
if (token) {
    const login = document.querySelector('a[href="./login.html"]')
    login.innerText = 'logout'

    const admin = document.createElement('div')
    admin.className = 'admin'
    portfolio.prepend(admin)
    admin.appendChild(h2)

    const modifierPhoto = document.createElement('span')
    modifierPhoto.innerHTML = `modifier <i class='fa-regular fa-pen-to-square'></i>`
    modifierPhoto.style.cursor = 'pointer'
    admin.appendChild(modifierPhoto)

    modifierPhoto.addEventListener('click', () => {
        modal.style.display = 'block'
        getPictures('.image', work, true)
    })
    /*
        const clickFerme = document.querySelectorAll('.cross')
    
        clickFerme.addEventListener('click', ()=> {
            modal.style.display= 'none';
            modalAdd.style.display='none';
            console.log(modalAdd)
        })*/
    document.querySelectorAll('.cross').forEach((cross) => {
        cross.addEventListener('click', () => {
            modal.style.display = 'none';
            modalAdd.style.display = 'none';
            console.log(modalAdd)
        })
    })

    const arrowLeft = document.querySelector('.gauche')
    arrowLeft.addEventListener('click', () => {
        modalAdd.style.display = 'none';
        modal.style.display = 'block';
    })


    const ajoutPhoto = document.querySelector('.button_selectedx')
    ajoutPhoto.addEventListener('click', () => {
        modal.style.display = 'none'
        modalAdd.style.display = 'block'
    })

    const bandeNoire = document.createElement('div')
    bandeNoire.className = 'bande_noire'
    bandeNoire.innerHTML = `<span><i class="fa-regular fa-pen-to-square"></i> Mode édition</span>`
    header.prepend(bandeNoire)

    const modalSend = document.querySelector('.photo-upload')
    modalSend.addEventListener("submit", (event) => {
        event.preventDefault();
        const elemModal = {
            image: document.getElementById('btn_add').value,
            title: document.getElementById('title').value,
            category: parseInt(document.getElementById('Categorie').value)
        }
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(elemModal)
        })
        console.log(elemModal)

    })
}




getWork();

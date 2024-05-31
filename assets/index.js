let work = [];

let gallery = document.querySelector('.gallery');
let filters = document.querySelector('.filters');
let Button = document.querySelector('.button');

let Categorie = document.getElementById('Categorie');
const header = document.querySelector('header')
const portfolio = document.getElementById('portfolio');
const h2 = document.querySelector('.projet');

const token = sessionStorage.getItem('token');

const modal = document.querySelector('.modal');
const modalAdd = document.querySelector('.modal_add');
const modalSend = document.querySelector('.photo-upload');

const arrowLeft = document.querySelector('.gauche');
const ajoutPhoto = document.querySelector('.button_selectedx');

const inputPhoto = document.getElementById('btn_add');
const images = document.getElementById('images');
const target = document.getElementById('Categorie');

const fichier = document.getElementById('btn_add');
const titre = document.getElementById('title');
const valider = document.getElementById('valider');

const login = document.querySelector('a[href="./login.html"]')
const sombre = document.querySelector('.sombre')

let allFilters = document.createElement('button');
allFilters.className = 'button_selected';
allFilters.innerText = 'Tous';
filters.appendChild(allFilters);

// recuperation des donnees de l'api
const getWork = () => {
    fetch('http://localhost:5678/api/works').then((reponse) => reponse.json())
        .then((data) => {
            work = data;
            getPictures('.gallery', work, false);
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
                let BtnSelected = document.querySelector('.button_selected');
                BtnSelected.classList.remove(`button_selected`)
                allFilters.classList.add(`button_selected`);

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
                    // console.log(data)
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
    fetch('http://localhost:5678/api/categories', {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
    }).then((rep) => {

        return rep.json();
    }).then((data) => {
        console.log('tableau complet')
        console.log(data)

        data.forEach((w) => {
            let Button = document.createElement('button');
            Button.innerText = w.name;
            Button.id = w.id;
            filters.appendChild(Button);

            const option = document.createElement('option')
            option.value = w.id
            option.innerText = w.name
            target.appendChild(option)
        })
    }
    )
}


filters.addEventListener("click", (event) => {
    //Je m'assure d'etre dans le bouton de la class '.filters'
    if (event.target.tagName === 'BUTTON') {
        let BtnSelected = document.querySelector('.button_selected');//Je pointe sur l'element DOM qui a la class 'button_selected'
        BtnSelected.classList.remove(`button_selected`);//Je retire la class de l'element DOM selectionne precedemment
        event.target.classList.add(`button_selected`);//J'ajoute la class a l'objet DOM sur lequel j'ai cliqué

        if (event.target.id) {//Si un id est existant, alors je filtre les categories 
            const ClickFilter = work.filter(function (item) {
                return item.category.id == event.target.id;//Je compare les id des item a l'id de la categorie(event.target.id)pour uniquement retourner ceux qui correspondent
            })
            getPictures('.gallery', ClickFilter, false);//J'apelle la fonction pour afficher les resultat filtrees dans ClickFilter

        } else {//Si aucun id est existant, j'affiche tout

            return getPictures('.gallery', work, false);
        }
    }
})

if (token) {

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
        sombre.style.display = 'block'
        getPictures('.image', work, true)
    })

    document.querySelectorAll('.cross').forEach((cross) => {
        cross.addEventListener('click', () => {
            modal.style.display = 'none';
            modalAdd.style.display = 'none';
            sombre.style.display = 'none'
            console.log(modalAdd)
        })
    })

    arrowLeft.addEventListener('click', () => {
        modalAdd.style.display = 'none';
        modal.style.display = 'block';
    })


    ajoutPhoto.addEventListener('click', () => {
        images.style.display = 'none'
        modalSend.reset()
        modal.style.display = 'none'
        modalAdd.style.display = 'block'
        valider.style.backgroundColor = 'rgb(203, 214, 220)'
        let BtnSelected = document.querySelector('.button_selected');
        BtnSelected.classList.remove(`button_selected`)
        allFilters.classList.add(`button_selected`);
    })

    const bandeNoire = document.createElement('div')
    bandeNoire.className = 'bande_noire'
    bandeNoire.innerHTML = `<span><i class="fa-regular fa-pen-to-square"></i> Mode édition</span>`
    header.prepend(bandeNoire)

    modalSend.addEventListener("submit", (event) => {
        event.preventDefault();

        image = document.getElementById('btn_add').files[0],
            title = document.getElementById('title').value,
            categoryId = parseInt(document.getElementById('Categorie').value)

        const Data = new FormData();

        Data.append('image', image)
        Data.append('title', title)
        Data.append('category', categoryId)

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: { "Authorization": `Bearer ${token}` },
            body: Data
        }).then((rep) => {
            if ((rep.ok) && (rep.status === 201)) {
                getWork()
                modalAdd.style.display = 'none'
                sombre.style.display = 'none'
            }
            return rep.json();
        }).then((data) => {

            console.log(data)
        })
    })

    inputPhoto.addEventListener("change", (event) => {

        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            images.src = e.target.result;

        };
        reader.readAsDataURL(file);
        images.style.display = 'block';
    });
}

const play = () => {

    if ((fichier.files.length > 0) && (titre.value.length > 0)) {
        valider.style.backgroundColor = '#1D6154'
        valider.disabled = false
    } else {
        valider.style.backgroundColor = '#CBD6DC'
        valider.disabled = true
    }
}
titre.addEventListener('input', play)
fichier.addEventListener('change', play)

getCategory();
getWork();

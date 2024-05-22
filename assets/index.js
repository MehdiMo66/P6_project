let work = [];
let gallery = document.querySelector('.gallery');
let filters = document.querySelector('.filters');
let Button = document.querySelector('.button');

// recuperation des donnees de l'api
const getWork = () => {
    fetch('http://localhost:5678/api/works').then((reponse) => reponse.json())
        .then((data) => {
            work = data;
            getPictures(data);
            getCategory();
        })
}

const getPictures = (picture) => {
    gallery.innerHTML = '';//Je vide le contenu de ma fonction f
    picture.forEach((w) => {
        gallery.innerHTML += `<figure>
        <img src="${w.imageUrl}" alt="${w.title}">
        <figcaption>${w.title}</figcaption>
    </figure>`
    })
}

const getCategory = () => {
    let cat = [];//Creation d'un tableau pour stocker les categories et eviter les doublons
    let allFilters = document.createElement('button');
    allFilters.className='button_selected';
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
        
        if (event.target.id) {//Si un id est existant, alors je filtre les categories 
            const ClickFilter = work.filter(function (item) {
                return item.category.id == event.target.id;//Je compare les id des item a l'id de la categorie(event.target.id)pour uniquement retourner ceux qui correspondent
            })
            getPictures(ClickFilter);//J'apelle la fonction pour afficher les resultat filtrees dans ClickFilter
            
        } else {//Si aucun id est existant, j'affiche tout
            getPictures(work);
        }
    }
})

getWork()

   

const connect = document.querySelector(".connexion");

connect.addEventListener("submit", (event) => {
    event.preventDefault();
    const User = {
        email: document.getElementById('name').value,
        password: document.getElementById('password').value
    }

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(User)
    }).then((reponse) => {
        if (!reponse.ok) {
            if (reponse.status === 401) {
                throw new Error('Erreur dans l’identifiant ou le mot de passe');
            }
            throw new Error('erreur')
        }
        return reponse.json()

    }).then((data) => {
        if (data.token) {
            sessionStorage.setItem('token', data.token);
            window.location.href = "/index.html";
        }
    })

        .catch((error) => {
            const id = document.querySelector('.error')
                .innerHTML = error.message

        })
})

if(sessionStorage.getItem('token')) {
    window.location.href = "/index.html";
}



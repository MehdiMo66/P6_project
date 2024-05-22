function connectionUtilisateur() {
    const Connect = document.querySelector(".connexion")
    Connect.addEventListener("submit",(event)=>{
        event.preventDefault();
        const Login = {
            User : event.target.querySelector('[name=name]').value,
            Password : event.target.querySelector('[name=password]').value,
        }
    const ChargeUtile = JSON.stringify(Login)
    fetch("http://localhost:5678/api/users/login", {
    method:"POST",
    headers:{ "Content-Type": "application/json" },
    body: ChargeUtile ,
    })
    console.log('connect')
    })
    }
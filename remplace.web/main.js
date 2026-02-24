function remplaceTexte(element) {
    element.textContent = element.textContent.replace(/information/g, "***")
}


document.addEventListener("DOMContentLoaded", remplaceTexte(document.body));
function remplaceTexte(element) {
    element.textContent = element.textContent.replace(/il/g, "***")
}

remplaceTexte(document.body)


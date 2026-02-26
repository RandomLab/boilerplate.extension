function ready(body) {
    
   for (const child of body) {
        if (child.tagName === 'IMG') {
            child.src = "https://upload.wikimedia.org/wikipedia/commons/c/c3/Chat_mi-long.jpg"
        }
    }

}


document.addEventListener("DOMContentLoaded", ready(document.body.children));
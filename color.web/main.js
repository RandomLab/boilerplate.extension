function ready(node) {

    for (const child of node) {
        for (const subchild of child.children) {
            if (subchild.className === "right") {
                subchild.style.backgroundColor = "red"
            } else {
                subchild.style.backgroundColor = "blue"
            }
        }
    }


}


document.addEventListener("DOMContentLoaded", ready(document.body.children));
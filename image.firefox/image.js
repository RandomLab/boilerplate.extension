function remplaceImage(body) {
    
   for (const child of body) {
        if (child.tagName === 'IMG') {
            localStorage.setItem('image', JSON.stringify({ data: child }));
        }
    }

}

remplaceImage(document.body.children)
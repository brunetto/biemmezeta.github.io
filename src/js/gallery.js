import PhotoSwipeLightbox from '/js/photoswipe/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
    gallery: 'body',
    children: '.gallery-item',
    pswpModule: () => import('/js/photoswipe/photoswipe.esm.js')
});

function justifiedLayout() {

    const galleries = document.querySelectorAll(".gallery");

    galleries.forEach(gallery => {
        const items = Array.from(gallery.querySelectorAll(".gallery-item"));

        // reset layout
        // più veloce ma perde gli event listener, meglio rimuovere solo le righe
        // gallery.innerHTML = ""; 
        gallery.querySelectorAll(".gallery-row").forEach(row => row.remove());
        items.forEach(i => i.style.flex = "");

        let row = document.createElement("div");
        row.className = "gallery-row";

        let rowWidth = 0;
        const targetHeight = 260;
        const maxWidth = gallery.clientWidth;
        if (!maxWidth) return;

        // per ogni immagine calcolo la larghezza mantenendo l'altezza target, 
        // e la aggiungo alla riga finché non supero la larghezza massima
        items.forEach(item => {

            // calcolo la larghezza dell'immagine mantenendo l'altezza target
            const img = item.querySelector("img");
            const w = Number(img.getAttribute("width"));
            const h = Number(img.getAttribute("height"));
            const ratio = w && h ? w / h : 1;

            const width = targetHeight * ratio;

            // item.style.flex = `0 0 ${width}px`;

            // row.appendChild(item);
            // rowWidth += width;

            // if (rowWidth > maxWidth) {
            //     gallery.appendChild(row);
            //     row = document.createElement("div");
            //     row.className = "gallery-row";
            //     rowWidth = 0;
            // }

            // se aggiungendo l'immagine supero la larghezza massima,
            // ridimensiono tutte le immagini della riga per farle stare esattamente, 
            // aggiungo la riga al gallery e ne inizio una nuova
            if (rowWidth + width > maxWidth && row.children.length) {

                const scale = maxWidth / rowWidth;

                Array.from(row.children).forEach(child => {
                    const basis = parseFloat(child.style.flex.split(" ")[2]);
                    child.style.flex = `0 0 ${basis * scale}px`;
                });

                gallery.appendChild(row);
                row = document.createElement("div");
                row.className = "gallery-row";
                rowWidth = 0;
            }

            item.style.flex = `0 0 ${width}px`;

            row.appendChild(item);
            rowWidth += width;

        });

        // if (row.children.length) {
        //     gallery.appendChild(row);
        // }

        // aggiungo l'ultima riga anche se è più stretta, 
        // ridimensionandola per farla stare esattamente
        if (row.children.length) {

            const scale = maxWidth / rowWidth;

            Array.from(row.children).forEach(child => {
                const basis = parseFloat(child.style.flex.split(" ")[2]);
                child.style.flex = `0 0 ${basis * scale}px`;
            });

            gallery.appendChild(row);
        }

    });
}

// window.addEventListener("DOMContentLoaded", () => {
//     const imgs = document.querySelectorAll(".gallery img");
//     let loaded = 0;

//     imgs.forEach(img => {

//         if (img.complete) {
//             loaded++;
//             if (loaded === imgs.length) justifiedLayout();
//         } else {

//             img.addEventListener("load", () => {
//                 loaded++;
//                 if (loaded === imgs.length) justifiedLayout();
//             });
//         }
//     });
// });

// window.addEventListener("DOMContentLoaded", justifiedLayout);
// eseguo il layout dopo un breve timeout per essere sicuro 
// che tutte le immagini siano caricate
requestAnimationFrame(justifiedLayout);

// window.addEventListener("resize", () => {
//     clearTimeout(window.galleryResize);
//     window.galleryResize = setTimeout(justifiedLayout, 250);
// });

let resizeTimer;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(justifiedLayout, 150);
});

lightbox.init();
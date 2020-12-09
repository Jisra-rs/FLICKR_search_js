// Javascript Document
'use strict'

const URL_FLICKR_REST = "https://api.flickr.com/services/rest/";
const FLICKR_METHOD = "?method=flickr.photos.search";
const APP_API_KEY = "711fee89a5c0c9b86b046e640eb1ec3b";
const URL_FETCH = URL_FLICKR_REST + FLICKR_METHOD + '&api_key=';

// Inicialización        
document.addEventListener('DOMContentLoaded', () => {

    let _picturesResult     = [];
    let _searchPagination   = 1;
    let _picIdArray         = 0;
    let _searchFlickrPhotos = document.getElementById("_search");

    // Gestión de vistas HTML
    const _photosView = (picture) => {

        picture.photo.map((picture, i) => {
            let _div_Photos = document.getElementById('_fotos');
            _div_Photos.innerHTML += `
            <div class="_divphoto">
                <img id="_idImage" class="_photo" data-id-array="${i}" 
                src="https://farm${picture.farm}.staticflickr.com/${picture.server}/${picture.id}_${picture.secret}.jpg" 
                alt="${picture.title}">
            <div>
            `;
        });
    }

    const _deletePreviousResult = () => {

        if (_picturesResult.length !== 0) {

            _picturesResult = [];
            let _fotosDiv = document.getElementById('_fotos');
            let _divPhotos = document.createElement('div');
            _divPhotos.id = "_fotos";
            _fotosDiv.remove();
            document.getElementById('main').appendChild(_divPhotos);
          }
    }

    const _resultZero = () => {
        let _spanNoResult = document.createElement('span');
        document.getElementById('_fotos').appendChild(_spanNoResult);
        _spanNoResult.innerHTML = "No se han encontrado resultados de la búsqueda";
    }
    // Búsqueda de imagen
    _searchFlickrPhotos.addEventListener("click", () => {

        _deletePreviousResult()

        const SEARCH_PICTURE = document.getElementById('_text_label').value;

        // FETCH : Petición a servicios/apis rest
        fetch(URL_FETCH + APP_API_KEY + '&tags=' + SEARCH_PICTURE + '&format=json&nojsoncallback=1' + _searchPagination)

            // Promesas
            .then(data => data.json())
            .then(pictures => {
                _picturesResult = pictures.photos;

                if (_picturesResult.total === "0") {
                    _resultZero();
                } else {
                    _photosView (_picturesResult);
                    
                }
            });
    });
});

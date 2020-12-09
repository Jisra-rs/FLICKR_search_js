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
            let _div_Photos = document.getElementById('fotos');
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
            let _fotosDiv = document.getElementById('fotos');
            let _divPhotos = document.createElement('div');
            _divPhotos.id = "fotos";
            _fotosDiv.remove();
            document.getElementById('main').appendChild(_divPhotos);
          }
    }

    const _resultZero = () => {
        let _spanNoResult = document.createElement('span');
        document.getElementById('fotos').appendChild(_spanNoResult);
        _spanNoResult.innerHTML = "No se han encontrado resultados de la búsqueda";
    }

    // Vista modal
    const _openModal = (imgToShow) => {
        _picIdArray = Number(imgToShow.dataset.idArray);
        let modal = document.getElementById('popUp');
        modal.style.display = "block";
        _isfirstOrLastIDArray();
        modal.innerHTML += _expandImageSelected(_picIdArray);
        
    }

    const _expandImageSelected = (IdArray) => {
        let pictureToShow= _picturesResult.photo[IdArray];
        let view = `<div id="caption">${pictureToShow.title}</div>
                    <img class="modal-content" id="img01" src="https://farm${pictureToShow.farm}.staticflickr.com/${pictureToShow.server}/${pictureToShow.id}_${pictureToShow.secret}.jpg">`
        return view;
    }

    const _closeModal = () => {
        let modal = document.getElementById('popUp');
        modal.style.display = "none";
        document.getElementById('caption').remove();
        document.getElementById('img01').remove();
    }

    const _isfirstOrLastIDArray = () => {
        // Renew the standard behaviour
        let _btnPrevious = document.getElementById('previous');
        let _btnNext     = document.getElementById('next');
        _btnPrevious.className = "btn";
        _btnPrevious.disabled=false;
        _btnNext.className = "btn";
        _btnNext.disabled=false;
        // bloquea el botón en caso de ser la primera o la última imagen
        if (_picIdArray === 0) {
            _btnPrevious.className = "btnDisabled";
            _btnPrevious.disabled=true;
          } else if (_picIdArray === (_picturesResult.photo.length - 1)) {
            _btnNext.className = "btnDisabled";
            _btnNext.disabled=true;
          } 
    }

    const _btnsNextPreviousPic = (sel) => {
        if (sel === 1) {
            _picIdArray = _picIdArray + 1;
        } else {
            _picIdArray = _picIdArray - 1;
        }
        document.getElementById('caption').remove();
        document.getElementById('img01').remove();
        let modal = document.getElementById('popUp');
        _isfirstOrLastIDArray();
        modal.innerHTML += _expandImageSelected(_picIdArray);
    }


    /* Búsqueda de imagen */
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
                    
                    document.addEventListener('click', ev => {
                        if      (ev.target.matches('#close')) _closeModal();
                        else if (ev.target.matches('#_idImage')) _openModal(ev.target);
                        else if (ev.target.matches('#next')) _btnsNextPreviousPic(1);
                        else if (ev.target.matches('#previous')) _btnsNextPreviousPic(0);
                    });
                }
            });
    });

});



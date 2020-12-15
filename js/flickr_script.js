// Javascript Document
'use strict'

const URL_FLICKR_REST = "https://api.flickr.com/services/rest/";
const FLICKR_METHOD = "?method=flickr.photos.search";
const APP_API_KEY = "711fee89a5c0c9b86b046e640eb1ec3b";
const URL_FETCH = URL_FLICKR_REST + FLICKR_METHOD + '&api_key=';

// Inicialización        
document.addEventListener('DOMContentLoaded', () => {

    let _picturesResult     = [];
    let _searchPagination   = 0;
    let _theLastPagination  = 0;
    let _picIdArray         = 0;

    /* 
    Gestión de vistas HTML 
    */
    // Página principal
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

        let _divPhotos = document.getElementById('_paginationInfo');
        if (_divPhotos !== null) {
            _divPhotos.remove();
        }
        _searchPagination   = 0;
        _theLastPagination  = 0;
        let _spanNoResult = document.createElement('span');
        document.getElementById('fotos').appendChild(_spanNoResult);
        _spanNoResult.innerHTML = "No se han encontrado resultados de la búsqueda";
    }

    // Paginación
    const _generatePagination = () => {
        let _div_pagination = document.getElementById('_pagination');
        _div_pagination.innerHTML = ` 
                        <div id="_paginationInfo">
                            <button id="_previousPag" > Previous </button>
                            <span id="_pagSpan" class="_pagSpan">Page ${_searchPagination} of ${_theLastPagination}</span>
                            <button id="_nextPag" > Next </button>
                        </div>
                    `
    }
        
    const _btnsNextPreviousPagination = (sel) => {
        if (sel === 1) {
            _searchPagination = _searchPagination + 1;
        } else {
            _searchPagination = _searchPagination - 1;
        }
        _searchFlickrPhotos(_searchPagination);
    }

    const _isfirstOrLastPage = () => { _isFirstOrLastVal ("_previousPag", "_nextPag", "pag")}

    function _isFirstOrLastVal (uno, dos, tres) {
        let _btnPreviousId  = uno;
        let _btnNextId      = dos;
        let _validation     = tres;
        // Establecer valores por defecto
        let _btnPrevious = document.getElementById(_btnPreviousId);
        let _btnNext     = document.getElementById(_btnNextId);
        _btnPrevious.className  = "btn";
        _btnPrevious.disabled   = false;
        _btnNext.className      = "btn";
        _btnNext.disabled       = false;
        // bloquea el botón en caso de ser la primera o la última página
        if ((_searchPagination === 1 && _validation === "pag") || (_picIdArray === 0 && _validation === "pho")) {
            _btnPrevious.className = "btnDisabled";
            _btnPrevious.disabled=true;
          } else if ((_searchPagination === _theLastPagination && _validation === "pag") || (_picIdArray === (_picturesResult.photo.length - 1) && _validation === "pho")) {
            _btnNext.className = "btnDisabled";
            _btnNext.disabled=true;
          } 
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

    const _isfirstOrLastIDArray = () => { _isFirstOrLastVal ("previous", "next", "pho")}

    /* Búsqueda de fotos */

    function _searchFlickrPhotos(_pag) {
        _searchPagination = _pag;
        _deletePreviousResult()

        const SEARCH_PICTURE = document.getElementById('_text_label').value;

        // FETCH : Petición a servicios/apis rest
        fetch(URL_FETCH + APP_API_KEY + '&text=' + SEARCH_PICTURE + '&page=' + _searchPagination + '&privacy_filter=1&format=json&nojsoncallback=1')

            // Promesas
            .then(data => data.json())
            .then(pictures => {
                _picturesResult = pictures.photos;

                if (_picturesResult.total === "0") {
                    _resultZero();
                } else {
                    _theLastPagination = _picturesResult.pages;
                    _generatePagination();
                    _isfirstOrLastPage();
                    _photosView (_picturesResult);
                }
            });
    }

    // Eventos click
    document.addEventListener('click', ev => {
        if      (ev.target.matches('#close'))       _closeModal();
        else if (ev.target.matches('#_idImage'))    _openModal(ev.target);
        else if (ev.target.matches('#next'))        _btnsNextPreviousPic(1);
        else if (ev.target.matches('#previous'))    _btnsNextPreviousPic(0);
        else if (ev.target.matches('#_nextPag'))    _btnsNextPreviousPagination(1);
        else if (ev.target.matches('#_previousPag')) _btnsNextPreviousPagination(0);
        else if (ev.target.matches('#_search'))     _searchFlickrPhotos(1);
    });

});

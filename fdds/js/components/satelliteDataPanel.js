import { dragElement } from '../util.js';

export class satelliteDataPanel extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div id="satellite-data-panel-container" class="feature-controller hidden">
                <div id="satellite-data-panel-header">
                    <span id="media-title">Media Viewer</span>
                    <button id="close-media" class="interactive-button close-panel">×</button>
                </div>
                <div id="media-controls">
                    <label for="media-select">Select Media:</label>
                    <select id="media-select"></select>
                </div>
                <div id="media-content">
                    <!-- Media content will be inserted here -->
                </div>
            </div>
        `;

        //set up media storage
        this.media = [];
        this.currentMediaIndex = 0;

        this.show();
    }

    connectedCallback() {
        const panel = this.querySelector('#satellite-data-panel-container');
        const closeBtn = this.querySelector('#close-media');
        const mediaSelect = this.querySelector('#media-select');

        // Make panel draggable 
        if (panel) {
            dragElement(panel);
        } else {
            console.error('Panel element not found');
        }
        L.DomEvent.disableClickPropagation(panel);
        L.DomEvent.disableScrollPropagation(panel);

        // Close button handler
        closeBtn.onclick = () => {
            this.hide();
        };

        if (mediaSelect) {
            L.DomEvent.disableClickPropagation(mediaSelect);
            L.DomEvent.disableScrollPropagation(mediaSelect);

            //watching for a change, we want to swap to the correct image.
            mediaSelect.addEventListener('change', (event) => {
                this.currentMediaIndex = Number(event.target.value);
                this.updateImage();
            });
        }
        
        /*
        const placeholder_media = `
        <img class="satellite-img" src="https://placecats.com/150/150" alt="Satellite Image"/>
        `;
        this.setMedia(placeholder_media);
        */
    }

    // show(mediaContent, title = 'Satellite Data') {
    show(mediaItems = [], title = 'True Fire Borders') {
        const popup = this.querySelector('#satellite-data-panel-container');
        const titleElem = this.querySelector('#media-title');
        const mediaSelect = this.querySelector('#media-select');

        titleElem.textContent = title;
        // content.innerHTML = mediaContent;
        popup.classList.remove('hidden');

        //The media is a bunch of media items
        this.media = mediaItems;
        mediaSelect.innerHTML = '';

        //If there are some, we make options for the select for all of them, else there is none.
        if (this.media.length > 0){
            this.media.forEach((item, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = item.name;
                mediaSelect.appendChild(option);
            });

            this.currentMediaIndex = 0;
            mediaSelect.value = this.currentMediaIndex;
            this.updateImage();
        } else {
            this.setMedia('<p>No media data available.</p>');
            mediaSelect.innerHTML = '<option value="">No Media</option>';
        }
    }

    hide() {
        const popup = this.querySelector('#satellite-data-panel-container');
        popup.classList.add('hidden');
    }

    //We update the correct image to appear for the correct tab... if the tab was working???
    updateImage() {
        const content = this.querySelector('#media-content');
        if (this.media.length > 0 && this.currentMediaIndex !== undefined){
            const selectedItem = this.media[this.currentMediaIndex];
            if(selectedItem && selectedItem.imageUrl) {
                content.innerHTML = `<img class="satellite-img" src="${selectedItem.imageUrl}" alt="${selectedItem.name} Media"/>`;
            } else {
                content.innerHTML = `<p>Image not found.</p>`;
            }
        } else {
            content.innerHTML = `<p>Select media.</p>`;
        }
    }

    setMedia(mediaContent) {
        const content = this.querySelector('#media-content');
        content.innerHTML = mediaContent;
    }
}

window.customElements.define('satellite-data-panel', satelliteDataPanel);

//This should list the all the loadable images.
window.addEventListener('DOMContentLoaded', () =>{
    const imageList = [
        {name: 'Palisades Border', imageUrl: 'media/palisadesBorder.png'},
        {name: 'Caldor Border', imageUrl: 'media/caldorBorder.png'}
    ];
    let panel = document.querySelector('satellite-data-panel');
    if(!panel){
        panel = document.createElement('satellite-data-panel');
        document.body.appendChild(panel);
    }

    panel.show(imageList);
});
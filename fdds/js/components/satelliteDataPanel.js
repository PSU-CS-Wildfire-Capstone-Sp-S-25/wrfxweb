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
                <div id="media-content">
                    <!-- Media content will be inserted here -->
                </div>
            </div>
        `;

        this.media = [];

        this.show();
    }

    connectedCallback() {
        const panel = this.querySelector('#satellite-data-panel-container');
        const closeBtn = this.querySelector('#close-media');

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
        
    }

    // show(mediaContent, title = 'Satellite Data') {
    show(mediaItems = [], title = 'True Fire Borders') {
        const popup = this.querySelector('#satellite-data-panel-container');
        const titleElem = this.querySelector('#media-title');
        const content = this.querySelector('#media-content');

        titleElem.textContent = title;
        popup.classList.remove('hidden');

        this.media = mediaItems;

        //Showing the right images
        if (this.media.length > 0){
            const firstItem = this.media[0];
            if(firstItem && firstItem.imageUrl){
                content.innerHTML = `<img class="satellite-img" src="${firstItem.imageUrl}" alt="${firstItem.name} Media"/>`;
            } else {
                content.innerHTML = `<p>Image Not Found</p>`;
            }
        } else {
            content.innerHTML = `<p>No media available</p>`;
        }
    }

    hide() {
        const popup = this.querySelector('#satellite-data-panel-container');
        popup.classList.add('hidden');
    }
}

window.customElements.define('satellite-data-panel', satelliteDataPanel);


//Looking for the media
window.addEventListener('DOMContentLoaded', () => {
    const satellitePanel = document.querySelector('satellite-data-panel');
    const catalogMenu = document.querySelector('catalog-menu');

    if (!satellitePanel) {
        console.error('satellite-data-panel element not found.');
        return;
    }
    if (!catalogMenu) {
        console.error('catalog-menu element not found.');
        return;
    }

    // Attach the event listener
    document.body.addEventListener('simulation-selected', (event) => {
        console.log("Document body caught simulation-selected event.");
        const {media} = event.detail;
        satellitePanel.show(media);
    });
});
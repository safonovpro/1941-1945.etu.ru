import 'babel-polyfill';

class Exposition {
    constructor(target, url) {
        this.urlAPI = (url !== undefined) ? url : 'https://lk.etu.ru/api/immortal-division-soldiers';
        this.wrap = document.querySelector(target);
        this.wrapWidth = this.wrap.offsetWidth;
        this.wrapHeight = this.wrap.offsetHeight;
        this.data = [];
    }

    async init() {
        this.data = await this._getData();

        this._render();
    }

    _render() {
        const width = 100;
        const height = 150;
        let index = 0;
        
        for(let h = 0; h < this.wrapHeight; h += height) {
            for(let w = 0; w < this.wrapWidth; w += width) {
                const veteran = document.createElement('div');

                veteran.className = 'veteran';
                veteran.style.cssText = `top: ${h}px; left: ${w}px;`;
                veteran.style.cssText += `width: ${width}px; height: ${height}px;`;
                veteran.style.cssText += `background-image: url("${this.data[index++].photo.url}")`;

                this.wrap.appendChild(veteran);
            }
        }
    }
    
    async _getData() {
        const pageSize = 100;
        let data = [];

        try {
            const firstPage = await this._getOnePage(pageSize);
            const totalPages = firstPage[0].total_pages;
            
            data = data.concat(firstPage[1]);

            for(let i = 1; i < totalPages + 1; i++) {
                data = data.concat((await this._getOnePage(pageSize, i))[1]);
            }
        } catch(e) {
            console.error(e);
        }

        return data;
    }

    _getOnePage(pageSize = 100, currentPage = 0) {
        return window.fetch(`${this.urlAPI}?page_size=${pageSize}&current_page=${currentPage}`)
        .then(response => response.json())
        .then(json => json)
        .catch(e => console.error(e));
    }
}

export default Exposition;
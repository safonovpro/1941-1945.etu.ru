import 'babel-polyfill';

class Exposition {
    constructor(target, url) {
        this.urlAPI = (url !== undefined) ? url : 'https://lk.etu.ru/api/immortal-division-soldiers';
        this.wrap = document.querySelector(target);
        this.data = [];
    }

    async init() {
        this.data = await this._getData();

        this._render();
        window.addEventListener('resize', () => this._render());
    }

    _render() {
        const wrapWidth = this.wrap.offsetWidth;
        const wrapHeight = this.wrap.offsetHeight;
        const veteranWidth = 100;
        const veteranHeight = 150;
        let index = 0;
        
        while (this.wrap.lastChild) {
            this.wrap.removeChild(this.wrap.lastChild);
        }

        console.log(this.data);
        
        for(let h = 0; h < wrapHeight; h += veteranHeight) {
            for(let w = 0; w < wrapWidth; w += veteranWidth) {
                const veteran = document.createElement('div');

                veteran.className = 'veteran';
                veteran.id = this.data[index].id;
                veteran.style.cssText = `top: ${h}px; left: ${w}px;`;
                veteran.style.cssText += `width: ${veteranWidth}px; height: ${veteranHeight}px;`;
                veteran.style.cssText += `background-image: url("${this.data[index].photo.url}")`;
                index++;

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

            for(let i = 2; i < totalPages + 1; i++) {
                data = data.concat((await this._getOnePage(pageSize, i))[1]);
            }
        } catch(e) {
            console.error(e);
        }

        return data;
    }

    _getOnePage(pageSize = 100, currentPage = 1) {
        return window.fetch(`${this.urlAPI}?page_size=${pageSize}&current_page=${currentPage}`)
        .then(response => response.json())
        .then(json => json)
        .catch(e => console.error(e));
    }
}

export default Exposition;
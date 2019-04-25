import 'babel-polyfill';

class Exposition {
    constructor(target, url = 'https://lk.etu.ru/api/immortal-division-soldiers') {
        this.urlAPI = url;
        this.wrap = document.querySelector(target);
        this.itemSize = { width: 75, height: 100 };
        this.data = [];
        this.usedIds = new Set();
    }

    async init() {
        this.data = await this._getData();

        this._render();
        window.addEventListener('resize', () => this._render());
    }

    _render() {
        const wrapWidth = this.wrap.offsetWidth;
        const wrapHeight = this.wrap.offsetHeight;
        
        while (this.wrap.lastChild) {
            this.wrap.removeChild(this.wrap.lastChild);
        }
        
        for(let h = 0; h < wrapHeight; h += this.itemSize.height) {
            for(let w = 0; w < wrapWidth; w += this.itemSize.width) {
                const id = this._getNotUsededId();

                this._renderItem(id, h, w);
                this.usedIds.add(id);
            }
        }
    }

    _renderItem(index, top, left) {
        const veteran = document.createElement('div');

        veteran.className = 'veteran';
        veteran.id = this.data[index].id;
        veteran.style.cssText = `top: ${top}px; left: ${left}px;`;
        veteran.style.cssText += `width: ${this.itemSize.width}px; height: ${this.itemSize.height}px;`;
        veteran.style.cssText += `background-image: url("${this.data[index].photo.url}")`;

        this.wrap.appendChild(veteran);
        veteran.addEventListener('click', (e) => {
            e.target.style.cssText += 'z-index: 101;';
            this._renderItem(this._getNotUsededId(), top, left);

            this._animateCSS(e.target, 'fadeOutUp', () => {
                this.usedIds.delete(e.target.id);
                this.wrap.removeChild(e.target);
            });
        });
    }

    _animateCSS(node, animationName, callback) {
        node.classList.add('animated', animationName)

        function handleAnimationEnd() {
            node.classList.remove('animated', animationName)
            node.removeEventListener('animationend', handleAnimationEnd)

            if (typeof callback === 'function') callback()
        }

        node.addEventListener('animationend', handleAnimationEnd)
    }

    _getNotUsededId() {
        let id = Math.floor(Math.random() * this.data.length);

        return this.usedIds.has(id) ? this._getNotUsededId() : id;
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
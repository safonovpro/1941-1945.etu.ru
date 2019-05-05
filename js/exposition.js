import 'babel-polyfill';

class Exposition {
    constructor(target, url = 'https://lk.etu.ru/api/immortal-division-soldiers') {
        this.urlAPI = url;
        this.wrap = document.querySelector(target);
        this.itemSize = { width: 75, height: 100 };
        this.data = [];
        this.usedIndexFromData = new Set();
        this.interval = null;
        this.intervalDelay = 500;
    }

    async init() {
        this.data = await this._getData();

        this._render();
        window.addEventListener('resize', () => this._render());
    }

    _render() {
        const wrapWidth = this.wrap.offsetWidth;
        const wrapHeight = this.wrap.offsetHeight;
        
        this.usedIndexFromData = new Set();
        while (this.wrap.lastChild) {
            this.wrap.removeChild(this.wrap.lastChild);
        }
        
        for(let h = 0; h < wrapHeight; h += this.itemSize.height) {
            for(let w = 0; w < wrapWidth; w += this.itemSize.width) {
                this._renderItem(this._getNotUsededIndexFromData(), h, w);
            }
        }

        if(!this.interval) clearInterval(this.interval);
        this.interval = setInterval(this._changeItem.bind(this), this.intervalDelay);
    }

    _renderItem(indexFromData, top, left) {
        const veteran = document.createElement('div');

        veteran.className = 'veteran';
        veteran.id = indexFromData;
        veteran.style.cssText = `top: ${top}px; left: ${left}px;`;
        veteran.style.cssText += `width: ${this.itemSize.width}px; height: ${this.itemSize.height}px;`;
        veteran.style.cssText += `background-image: url("${this.data[indexFromData].photo.url}")`;

        this.wrap.appendChild(veteran);
        this.usedIndexFromData.add(indexFromData);

        veteran.addEventListener('click', (e) => console.log(e.target));
    }

    _changeItem() {
        const target = document.getElementById(this._getRandomUsededIndexFromData());
        const targetTop = parseInt(target.style.top);
        const targetLeft = parseInt(target.style.left);

        target.style.cssText += 'z-index: 101;';
        
        this.usedIndexFromData.delete(parseInt(target.id));
        this._renderItem(this._getNotUsededIndexFromData(), targetTop, targetLeft);
        this._animateCSS(target, 'fadeOutUp', () => this.wrap.removeChild(target));
    }

    _animateCSS(target, animationName, callback) {
        target.classList.add('animated', animationName);

        function handleAnimationEnd() {
            target.classList.remove('animated', animationName);
            target.removeEventListener('animationend', handleAnimationEnd);

            if (typeof callback === 'function') callback();
        }

        target.addEventListener('animationend', handleAnimationEnd);
    }

    _getNotUsededIndexFromData() {
        let indexInData = Math.floor(Math.random() * this.data.length);

        return this.usedIndexFromData.has(indexInData) ? this._getNotUsededIndexFromData() : indexInData;
    }

    _getRandomUsededIndexFromData() {
        const arrayUsedIds = Array.from(this.usedIndexFromData);
        const indexInArrayUsedIds = Math.floor(Math.random() * arrayUsedIds.length);

        return arrayUsedIds[indexInArrayUsedIds];
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
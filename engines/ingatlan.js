import fetch from 'node-fetch'
import { parse } from 'node-html-parser'
import Engine from '../engine.js'

const DEPTH = 5
const TIMEOUT = 350
const URL = 'https://ingatlan.com'
const LIST = '/szukites'
const SEARCH = 'elado+lakas'

export default class IngatlanEngine extends Engine
{

    name() { return "Ingtatlancom" }


    async scrap(settings)
    {
        return this._processPage(this._init(settings), Array(), 1)
    }

    async offlineScrap(body, settings)
    {
        return Promise.resolve(this._parsePage(body))
    }

    settings()
    {
        return {
            search:         {type: "String",    required: true},
            depht:          {type: "Number",    required: false},
            timeout:        {type: "Number",   required: false}
        }
    }

    default()
    {
        return {
            depht:      DEPTH,
            timeout:    TIMEOUT,
        }
    }

    result()
    {
        return {
            id:     {type: "String"},
            image:  {type: "String"},
            url:    {type: "String"},
            where:  {type: "String"},
            price:  {type: "Number"},
            area:   {type: "String"},
        }
    }

    async _processPage(settings, items, page)
    {
        return new Promise((res) => setTimeout(res, settings.timeout))
        .then(() => fetch(this._buildUrl(settings, page), { headers: { 'User-Agent' : this._randomBrowser() } }))
        .then(res => res.text())
        .then(res => this._parsePage(res))
        .then(list => this._populateItems(items, list))
        .then(list => list.length > 0 && settings.depth > page ? this._processPage(settings, items, ++page) : Promise.resolve(items))
    }
    
    _parsePage(plain)
    {
        const domRoot = parse(plain)
        const itemList = new Array()
        for(const domItem of domRoot.querySelectorAll('.listing'))
        {
            try
            {
                let item = this._parseItem(domItem)
                itemList.push(item)
            } 
            catch(err){}
        }   
        return itemList 
    }
    
    _parseItem(item)
    {
        return {
            id: this._uniqueItemID(item.querySelector('.listing__link')?.getAttribute('href')),
            image: item.querySelector('.listing__image')?.getAttribute('src'),
            url: `${URL}${item.querySelector('.listing__link')?.getAttribute('href')}`,
            where: item.querySelector('.listing__address')?.innerHTML.trim(),
            price: this._getPrice(item.querySelector('.price')?.innerHTML),
            area: Number(item.querySelector('.listing__data--area-size')?.innerHTML.trim().split(' ')[0]),
        }  
    }
    
    _getPrice(element)
    {
        if(!element) return null
    
        let price = Number(element.trim().split(' ')[0])
        let multiplier = element.trim().split(' ')[1] === 'M';
        return Math.floor(price * (multiplier ? 1000000 : 1000))
    }
    
    _populateItems(items, list)
    {
        items.push(...list)
        return Promise.resolve(list)
    }
    
    _buildUrl(settings, page)
    {
        let final = `${URL}${LIST}/${settings.search}`
        return `${final}?${new URLSearchParams({'page' : page})}`
    }
}




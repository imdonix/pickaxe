import fetch from 'node-fetch'
import { parse } from 'node-html-parser'
import Engine from '../engine.js'

const URL = 'https://www.hasznaltauto.hu/talalatilista'
const DEPTH = 1
const TIMEOUT = 1250


export default class HasznaltAutoEngine extends Engine
{
    name() { return "HasznaltAuto" }

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
            key:         {type: "String",    required: true},
            depht:       {type: "Number",    required: false},
            timeout:     {type: "Number",   required: false}
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
            name:         {type: "String"},
            image:        {type: "String"},
            url:          {type: "String"},
            price:        {type: "Number"},
            ad:           {type: "Boolean"},
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
        for(const domItem of domRoot.querySelectorAll('.talalati-sor'))
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
            id : this._uniqueItemID(item.querySelector('.img-responsive')?.parentNode?.getAttribute('href')),
            name :  item.querySelector('h3').firstChild.innerText,
            image: this._qualityImage(item.querySelector('.img-responsive')?.getAttribute('src')),
            url: item.querySelector('.img-responsive')?.parentNode?.getAttribute('href'),
            price: this._getPrice(item.querySelector('.vetelar')?.innerText),
            ad: item.querySelector('.label-hasznaltauto') != null
        }  
    }

    _getPrice(element)
    {
        if(!element) return null

        let trimmed = element.replace(/\s/g,'')
        return Number(trimmed.substring(0, trimmed.length - 2));
    }

    _populateItems(items, list)
    {
        items.push(...list)
        return Promise.resolve(list)
    }

    _buildUrl(settings, page)
    {
        return `${URL}/${settings.key}/page${page}`
    }

    _qualityImage(url)
    {
        return url.replace('t.jpg', '.jpg')
    }
}
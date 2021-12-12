import fetch from 'node-fetch'
import { parse } from 'node-html-parser'
import Engine from '../engine.js'

const DEFAULT_DEPHT = 5
const DOMAIN_NAME = "https://www.jofogas.hu/magyarorszag"
const SLEEP = 200

export default class JofogasEngine extends Engine
{
    name() { return "Jofogas" }

    async scrap(settings)
    {
        let proper = this._init(settings)
        return new Promise((resolve, _) => 
        {
            this._processPage(this._buildUrl(proper), [], proper.depht, proper, resolve)
        })
    }
    
    async offlineScrap(body, settings)
    {
        let items = []
        this._parseBody(body, settings, items)
        return Promise.resolve(items)
    }

    settings()
    {
        return {
            keywords:       {type: "String",    required: true},
            depht:          {type: "Number",    required: false},
            domain:         {type: "String",    required: false},
            minPrice :      {type: "Number",    required: false},
            maxPrice :      {type: "Number",    required: false},
            sleep :         {type: "Number",    required: false},
            enableCompany : {type: "Boolean",   required: false},
            enablePost:     {type: "Boolean",   required: false}
        }
    }

    default()
    {
        return {
            depht:          DEFAULT_DEPHT,
            domain:         DOMAIN_NAME,
            minPrice :      null,
            maxPrice :      null,
            sleep :         SLEEP,
            enableCompany : false,
            enablePost:     false
        }
    }

    result()
    {
        return {
            id:         {type: "String"},
            pos:        {type: "String"},
            name:       {type: "String"},
            price:      {type: "Number"},
            image:      {type: "String"},
            url:        {type: "String"},
            company:    {type: "String"},
            post:       {type: "String"}
        }
    }

    _processPage(url, items, iterations, settings, finalize)
    {
        fetch(url, { headers : {'Content-Type' : 'text/plain; charset=iso-8859-2', 'User-Agent' : this._randomBrowser()}})
        .then(res => res.text())
        .then(body => 
        {
            this._parseBody(body, settings, items)
            this._next(domRoot, items, iterations, settings, finalize)
        })
        .catch(_ => this._next(null, items, iterations, settings, finalize))
    }

    _next(root, items, iterations, settings, finalize)
    {
        let next = this._nextPage(root)
        if(iterations > 0 && next)
            setTimeout(() => this._processPage(next, items, --iterations, settings, finalize), settings.sleep) 
        else
            finalize(items)
    }

    _parseBody(body, settings, acc)
    {
        const domRoot = parse(body)
        for(const domItem of domRoot.querySelectorAll('.list-item'))
        {
            let item = this._processDomItem(domItem)
            if(item)
                if(!settings.minPrice || settings.minPrice < item.price)
                    if(!settings.maxPrice || settings.maxPrice > item.price)
                        if(settings.enableCompany || !item.company)
                            if(settings.enablePost || !item.post)
                                acc.push(item)
        }
    }

    _processDomItem(item)
    {   
        try
        {
            const itemRoot = parse(item);
            const metaAttributes = itemRoot.querySelectorAll('meta').map(dom => dom.attributes)

            return {
                id: this._uniqueItemID(this._toId(metaAttributes.find(prop => prop.itemprop == 'url').content)),
                pos: parseInt(metaAttributes.find(prop => prop.itemprop == 'position').content),
                name: metaAttributes.find(prop => prop.itemprop == 'name').content,
                price: parseInt(itemRoot.querySelector('.price-value').attributes.content),
                image: itemRoot.querySelector('img').attributes['src'],
                url: itemRoot.querySelector('.subject').attributes.href,
                company: itemRoot.querySelector('.badge-company_ad') != null,
                post: itemRoot.querySelector('.badge-box') != null
            }
        } catch(_){ return null }
    }

    _toId(url)
    {
        return url.slice(url.indexOf('#')+1)
    }

    _nextPage(root)
    {
        if(root)
            return root.querySelector('.ad-list-pager-item-next').attributes.href
        else 
            return null
    }

    _buildUrl(settings)
    {
        return settings.domain + '?' +
        new URLSearchParams(
        {
            'q' : settings.keywords,
            'max_price' : settings.maxPrice ? settings.maxPrice : '',
            'min_price' : settings.minPrice ? settings.minPrice : ''
        });
    }
}
import sha256 from "crypto-js/sha256.js"
import { getRandom } from "random-useragent"

//Define an interface for the scrap Engines
export default class Engine
{
    async scrap(settings) { return Promise.resolve()}

    // Return the default settings for the engine
    default() { return Object() }

    // Return an Object of the needed settings for the scrapping
    settings() { return Object() }

    // Return a Object of the expected fields of the resoult
    result() { return Object() }

    name() { throw Error("This is an abstract object") }

    _init(settings) 
    {
        let usr = settings ? settings : {}
        let def = this.default();

        let real = Object()
        for (const [key, value] of Object.entries(this.settings())) 
        {
            if(value.required)
            {
                if(usr[key])
                    real[key] = usr[key]
                else
                    throw new Error(`A required parameter is missing [${key}]`)
            }
            else
            {
                real[key] = usr[key] || def[key]
            }
        } 
        
        return real
    }

    _randomBrowser()
    {
        return getRandom(ua =>  parseFloat(ua.browserVersion) >= 20 && ua.browserName === 'Firefox');
    }

    _uniqueItemID(id)
    {
        return `${this.name()}-${sha256(id).toString()}`
    }
}
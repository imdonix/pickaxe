import { Ingatlan } from "../app.js";
import { readFile } from "fs/promises"


const settings = {
     search: "kiado+lakas+budapest" 
    }

describe("ingatlan scrapper", () => 
{
  let scrapper = new Ingatlan()

  it("should scrap the offline page", async () => 
  {
      let text = await readFile("resources/ingatlan-all", 'utf-8')
      let items = await scrapper.offlineScrap(text, {depht : 1})
      expect(items.length).toBeGreaterThan(0)
      expect(items[0]).toEqual({
        id: 'Ingtatlancom-7fc7859a3dc3bade3715b1e6e141c7c1b8360ec984c79ecdbd241d1c75405cc8',
        image: 'https://mt.ingatlancdn.com/ef/25/117710595_m_0.jpg',
        url: 'https://ingatlan.com/xiii-ker/elado+lakas/tegla-epitesu-lakas/32186791',      
        where: 'Csata utca 3-7, XIII. kerület',
        price: 86100000,
        area: 74
    })
  })

  it("should scrap the online page", async () => 
  {
    let items = await scrapper.scrap(settings)
    expect(items.length).toBeGreaterThan(0)
  })
})


import { Jofogas } from "../app.js";
import { readFile } from "fs/promises"


const settings = {
    keywords: "iphone",
    depht: 10,                                  // Check the first X page. Default: 5
    domain: "https://www.jofogas.hu/budapest",  // Domain. Default: "https://www.jofogas.hu/magyarorszag"
    minPrice : 100000,                          // Min price. Default: null
    maxPrice : 300000,                          // Max price. Default: null
    sleep : 0,                                  // Time to waint before next page is scrapped (in ms). Default: 200 
    enableCompany : true,                       // Enable company ads. Default: false
    enablePost: false                           // Enable post option. Default: false
}



describe("Jofogas scrapper", () => 
{
  let scrapper = new Jofogas()

  it("should scrap online page", async () => 
  {
    let text = await readFile("resources/jofogas-iphone", 'utf-8')
    let items = await scrapper.offlineScrap(text, settings)
    expect(items.length).toBeGreaterThan(0)
    expect(items[0]).toEqual({
      id: '123893965',
      pos: 7,
      name: 'Iphone SE 2020 256 GB product red kitun� �llapotban elad�!',
      price: 125000,
      image: 'https://img.jofogas.hu/bigthumbs/Iphone_SE_2020_256_GB_product_red_kitun__allapotban_elado__886962067010782.jpg',
      url: 'https://www.jofogas.hu/baranya/Iphone_SE_2020_256_GB_product_red_kitun__allapotban_elado__123893965.htm',
      company: false,
      post: false
    })
  })

  it("should scrap online page", async () => 
  {
    let items = await scrapper.scrap(settings)
    expect(items.length).toBeGreaterThan(0)
  })
})


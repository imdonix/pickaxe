import { HasznaltAuto } from "../app.js"
import { readFile } from "fs/promises"

//Key for searching All cars
const key = `PCOG2VG3V3RDADH4S56ADVYDDMPHPBIWNGCY45FEPWWQYNJFGSEVDESWA4IP7PSOKNFMX4UEGW3
OX4LYALEOSUW6XQOE7JBIEFQECTWBCZV3CYTMFSC37ISBPWASUUADZWSAAPJM3QZL5FDCI62QUGCCAJRG7DIBGW4
MYKH3A2CO6FU4JOAZLS76V57E25A5JTRAR7TKIGD6YBGOKQGTKKOGZXXUFCQCDTML2AVN7SNYESK4BM2NSNZZT24
UHB72RCA55JHDMTSXEZXENPEJTA2Y5XSGREFBGWOAFHFA4U5JFYWA6S4XNE6TKODBMG3K2OAY6TLZCWD35UWBY7U
VGZRRDI2TZFVPHR7HU53YZLDOV7BGQNP6Q2VVI6PREE46WCXXYIHTI747B2OIKBIGIN3ZJJ7TI3L7G7NXNYJU5CD
RJSVPLXVFDNSYFMO5A5KHG7QEVSCUDZVVTVXJEIDNYYZII6WZWRC3DHKLT4RH2SYYANLZ7AFWWFQZYJIIODXM5FI
KU2BP3ULPDLADLMZIJUXULID6RI4X3FKGYYVQC4ULVL4B2ZYCN5RKZC43ZKLUYLTMQSUOKM6IT4JEYXJRQT2THSF
7CLGFOOY3U46AQ442ELOQKWXL7SIQ53OMW7PMCAVDGNVBQET7KSVDY4A4VVCZGGG6MSTFUTFFLN2GZT4BYDIE5CP
YVC6J7NV4T3RN7P4EPPBADXKPPYFORSRMMMSEC74AY5Q2AZGXDBVO3CHVNPOAAHGTTTQ6PSWXSUORNTLZF3FF53T
VQBHU44L2ENKZHKJKHIUPF7JJ6A573Q7MU3ROWUZIGVPDCPTWS2BP5CZQHOICWTU7DPBHSHM43P3IL4M3IPNS657
TSYEO4E`

describe("hasznaltauto scrapper", () => 
{
    const scrapper = new HasznaltAuto()

    it("should scrap the offline page", async () => 
    {
        let text = await readFile("resources/hasznaltauto-ferrari", 'utf-8')
        let items = await scrapper.offlineScrap(text, {depht : 1})
        expect(items.length).toBeGreaterThan(0)
        expect(items[0]).toEqual({
            id: 'HasznaltAuto-38834779703b94a25c7abb439bd5b2758ac8d9950020dbac693dee4fce22a0f0',
            name: 'FERRARI 612 Scaglietti (Automata) Full extra/ Konyakbarna bőr/ Elektr. ülések/ 81e km!/ Márkaszervizben szervizelt',
            image: 'https://hasznaltauto.medija.hu/11072/17683665_1.jpg',
            url: 'https://www.hasznaltauto.hu/szemelyauto/ferrari/612/ferrari_612_scaglietti_automata_full_extra_konyakbarna_bor_elektr_ulesek_81e_km_markaszervizben_szervizelt-17683665',
            price: 21900000,
            ad: false
          })
    })

    it("should scrap the online page", async () => 
    {
        const items = await scrapper.scrap({ key });
        expect(items.length).toBeGreaterThan(0)
    })
})
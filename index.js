import nodeFetch from 'node-fetch'
import { CookieJar } from 'tough-cookie';
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent';
import cheerio from 'cheerio'

const jar = new CookieJar();

const httpAgent = new HttpCookieAgent({ jar });
const httpsAgent = new HttpsCookieAgent({ jar });

var $

var FetchData = async(page) => {
    var viewState = ''
    await nodeFetch("https://www.ftustsc.org.hk/enro2/view.aspx", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0) Gecko/20100101 Firefox/95.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-GB,en;q=0.5",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1"
        },
        "method": "GET",
        "mode": "cors",
        agent: ({ protocol }) => {
            return protocol === 'https:' ? httpsAgent : httpAgent;
          },
    })
    .then(async FirstGetResponse => {
        return await FirstGetResponse.text()
    })
    .then(async done1 => {
        $ = cheerio.load(done1)
        viewState = $('#_VIEWSTATE').val()
        console.log(`The viewstate is : ${viewState}`)
    })
    await nodeFetch("https://www.ftustsc.org.hk/enro2/view.aspx", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0) Gecko/20100101 Firefox/95.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-GB,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin"
        },
        // "referrer": "https://www.ftustsc.org.hk/enro2/view.aspx",
        "body": "__EVENTTARGET=GridView1&__EVENTARGUMENT=Page%24" + page + "&__VIEWSTATE=%2FwEPDwULLTEyMjcyODc5NjYPZBYCAgMPZBYGAgUPDxYCHgdWaXNpYmxlaGRkAgkPPCsAEQMADxYIHgxEYXRhU291cmNlSUQFDlNxbERhdGFTb3VyY2UyHgtfIURhdGFCb3VuZGceC18hSXRlbUNvdW50ArcNHhdGaXJzdERpc3BsYXllZFBhZ2VJbmRleAIyZAEQFgICAQICFgI8KwAFAQEWBB4FV2lkdGgbAAAAAACAa0ABAAAAHgRfIVNCAoACPCsABQEBFgQfBRsAAAAAAABJQAEAAAAfBgKAAhYCZmYMFCsAABYCZg9kFiACAQ9kFhhmDw8WAh4EVGV4dAUIS0szNDA4OEJkZAIBDw8WAh8HBSHnlJznlJzlnIjpppnolrDooJ%2Fnh61ESVnoo73kvZznj61kZAICDw8WAh8HBQnmmJ%2FmnJ%2Flha1kZAIDDw8WBh8HBQoxMeaciDI35pelHglGb3JlQ29sb3IKIx8GAgRkZAIEDw8WAh8HBQbkuIvljYhkZAIFDw8WAh8HBQsyOjMwLTU6MzAgIGRkAgYPDxYCHwcFCuWFqOacnzHoqrJkZAIHDw8WAh8HBQcz5bCP5pmCZGQCCA8PFgIfBwUGNDIw5YWDZGQCCQ8PFgIfBwUGMzc45YWDZGQCCg8PFgYfBwUS57ay5LiK5ZCN6aGN5bey5ru%2FHwgKjQEfBgIEZGQCCw8PFgIeB0VuYWJsZWRoZGQCAg9kFhhmDw8WAh8HBQhLSzM0MDg5QmRkAgEPDxYCHwcFJOW9qeiJsuWkmuiCiemmmeiWsOign%2BeHrURJWeijveS9nOePrWRkAgIPDxYCHwcFCeaYn%2Bacn%2BS6lGRkAgMPDxYGHwcFCjEy5pyIMTfml6UfCAojHwYCBGRkAgQPDxYCHwcFBuaZmuS4imRkAgUPDxYCHwcFCzc6MDAtMTA6MDAgZGQCBg8PFgIfBwUK5YWo5pyfMeiqsmRkAgcPDxYCHwcFBzPlsI%2FmmYJkZAIIDw8WAh8HBQYzMjDlhYNkZAIJDw8WAh8HBQYyODjlhYNkZAIKDw8WBh8HBRLntrLkuIrlkI3poY3lt7Lmu78fCAqNAR8GAgRkZAILDw8WAh8JaGRkAgMPZBYWZg8PFgIfBwUJTlAzNDA5NkFRZGQCAQ8PFgIfBwUX6Jyc6KCf6Iqx5bel6Jed54%2BtKOS4gClkZAICDw8WAh8HBQnmmJ%2FmnJ%2FkuoxkZAIDDw8WBh8HBQoxMOaciDE55pelHwgKIx8GAgRkZAIEDw8WAh8HBQbkuIrljYhkZAIFDw8WAh8HBQoxMDowMC0xOjAwZGQCBg8PFgIfBwUL5YWo5pyfMTDoqrJkZAIHDw8WAh8HBQwx5bCP5pmCMzDliIZkZAIIDw8WAh8HBQY2MTDlhYNkZAIJDw8WAh8HBQY1NDnlhYNkZAIKDw8WBh8HBQ%2Flj6%2FmjqXlj5floLHlkI0fCAojHwYCBGRkAgQPZBYWZg8PFgIfBwUHS0EzNDE5MGRkAgEPDxYCHwcFD%2Bearumdqembu%2BeDmeeVq2RkAgIPDxYCHwcFCeaYn%2Bacn%2BS4iWRkAgMPDxYGHwcFCjEx5pyIMjTml6UfCAojHwYCBGRkAgQPDxYCHwcFBuS4i%2BWNiGRkAgUPDxYCHwcFCzM6NDAtNToxMCAgZGQCBg8PFgIfBwUK5YWo5pyfMuiqsmRkAgcPDxYCHwcFDDHlsI%2FmmYIzMOWIhmRkAggPDxYCHwcFBjIzMOWFg2RkAgkPDxYCHwcFBjIwN%2BWFg2RkAgoPDxYGHwcFD%2BWPr%2BaOpeWPl%2BWgseWQjR8ICiMfBgIEZGQCBQ9kFhZmDw8WAh8HBQdLWjM0MTkwZGQCAQ8PFgIfBwUP55qu6Z2p6Zu754OZ55WrZGQCAg8PFgIfBwUJ5pif5pyf5pelZGQCAw8PFgYfBwUKMTHmnIgyOOaXpR8ICiMfBgIEZGQCBA8PFgIfBwUG5LiK5Y2IZGQCBQ8PFgIfBwULMTE6MTUtMTI6NDVkZAIGDw8WAh8HBQrlhajmnJ8y6KqyZGQCBw8PFgIfBwUMMeWwj%2BaZgjMw5YiGZGQCCA8PFgIfBwUGMjMw5YWDZGQCCQ8PFgIfBwUGMjA35YWDZGQCCg8PFgYfBwUP5Y%2Bv5o6l5Y%2BX5aCx5ZCNHwgKIx8GAgRkZAIGD2QWFmYPDxYCHwcFCEtLMzQyNDlBZGQCAQ8PFgIfBwUb5rC05LuZ6Iqx5b2r5Yi75oqA5ben5Yid6ZqOZGQCAg8PFgIfBwUJ5pif5pyf5LiJZGQCAw8PFgYfBwUKMTHmnIgxN%2BaXpR8ICiMfBgIEZGQCBA8PFgIfBwUG5pma5LiKZGQCBQ8PFgIfBwULNzowMC05OjAwICBkZAIGDw8WAh8HBQrlhajmnJ816KqyZGQCBw8PFgIfBwUHMuWwj%2BaZgmRkAggPDxYCHwcFBjcxMOWFg2RkAgkPDxYCHwcFBjYzOeWFg2RkAgoPDxYGHwcFD%2BWPr%2BaOpeWPl%2BWgseWQjR8ICiMfBgIEZGQCBw9kFhZmDw8WAh8HBQhLSzM0MjQ5QmRkAgEPDxYCHwcFG%2BawtOS7meiKseW9q%2BWIu%2BaKgOW3p%2BWInemajmRkAgIPDxYCHwcFCeaYn%2Bacn%2BWFrWRkAgMPDxYGHwcFCjEy5pyIMTHml6UfCAojHwYCBGRkAgQPDxYCHwcFBuS4i%2BWNiGRkAgUPDxYCHwcFCzI6MDAtNDowMCAgZGQCBg8PFgIfBwUK5YWo5pyfNeiqsmRkAgcPDxYCHwcFBzLlsI%2FmmYJkZAIIDw8WAh8HBQY3MTDlhYNkZAIJDw8WAh8HBQY2MznlhYNkZAIKDw8WBh8HBQ%2Flj6%2FmjqXlj5floLHlkI0fCAojHwYCBGRkAggPZBYWZg8PFgIfBwUHS0szNDI1MGRkAgEPDxYCHwcFG%2BawtOS7meiKseW9q%2BWIu%2BaKgOW3p%2BmAsumajmRkAgIPDxYCHwcFCeaYn%2Bacn%2BWFrWRkAgMPDxYGHwcFCjEy5pyIMTHml6UfCAojHwYCBGRkAgQPDxYCHwcFBuS4i%2BWNiGRkAgUPDxYCHwcFCzQ6MTUtNTo0NSAgZGQCBg8PFgIfBwUK5YWo5pyfNeiqsmRkAgcPDxYCHwcFDDHlsI%2FmmYIzMOWIhmRkAggPDxYCHwcFBjYzMOWFg2RkAgkPDxYCHwcFBjU2N%2BWFg2RkAgoPDxYGHwcFD%2BWPr%2BaOpeWPl%2BWgseWQjR8ICiMfBgIEZGQCCQ9kFhZmDw8WAh8HBQdLSzM0MjUxZGQCAQ8PFgIfBwUe5rC05LuZ6Iqx5b2r5Yi75oqA5ben5rex6YCg54%2BtZGQCAg8PFgIfBwUJ5pif5pyf5pelZGQCAw8PFgYfBwUKMTLmnIgxOeaXpR8ICiMfBgIEZGQCBA8PFgIfBwUG5LiK5Y2IZGQCBQ8PFgIfBwULOTozMC0xMTowMCBkZAIGDw8WAh8HBQrlhajmnJ816KqyZGQCBw8PFgIfBwUMMeWwj%2BaZgjMw5YiGZGQCCA8PFgIfBwUGNjkw5YWDZGQCCQ8PFgIfBwUGNjIx5YWDZGQCCg8PFgYfBwUP5Y%2Bv5o6l5Y%2BX5aCx5ZCNHwgKIx8GAgRkZAIKD2QWFmYPDxYCHwcFB0tLMzQyNTJkZAIBDw8WAh8HBR7msLTku5noirHlvavliLvmioDlt6fpq5jntJrnj61kZAICDw8WAh8HBQnmmJ%2FmnJ%2Fml6VkZAIDDw8WBh8HBQoxMuaciDE55pelHwgKIx8GAgRkZAIEDw8WAh8HBQbkuIrljYhkZAIFDw8WAh8HBQsxMToxNS0xMjo0NWRkAgYPDxYCHwcFCuWFqOacnzXoqrJkZAIHDw8WAh8HBQwx5bCP5pmCMzDliIZkZAIIDw8WAh8HBQY5MTDlhYNkZAIJDw8WAh8HBQY4MTnlhYNkZAIKDw8WBh8HBQ%2Flj6%2FmjqXlj5floLHlkI0fCAojHwYCBGRkAgsPZBYWZg8PFgIfBwUHS0szNDI1M2RkAgEPDxYCHwcFKeawtOS7meiKseW9q%2BWIu%2BaKgOW3p%2BmrmOe0muW7tue6jOePrSjkuIApZGQCAg8PFgIfBwUJ5pif5pyf5pelZGQCAw8PFgYfBwUKMTLmnIgxOeaXpR8ICiMfBgIEZGQCBA8PFgIfBwUG5LiL5Y2IZGQCBQ8PFgIfBwULMjozMC00OjAwICBkZAIGDw8WAh8HBQrlhajmnJ816KqyZGQCBw8PFgIfBwUMMeWwj%2BaZgjMw5YiGZGQCCA8PFgIfBwUGNzIw5YWDZGQCCQ8PFgIfBwUGNjQ45YWDZGQCCg8PFgYfBwUP5Y%2Bv5o6l5Y%2BX5aCx5ZCNHwgKIx8GAgRkZAIMD2QWFmYPDxYCHwcFB0tLMzQyNTRkZAIBDw8WAh8HBSnmsLTku5noirHlvavliLvmioDlt6fpq5jntJrlu7bnuoznj60o5LqMKWRkAgIPDxYCHwcFCeaYn%2Bacn%2BaXpWRkAgMPDxYGHwcFCjEy5pyIMTnml6UfCAojHwYCBGRkAgQPDxYCHwcFBuS4i%2BWNiGRkAgUPDxYCHwcFCzQ6MTUtNTo0NSAgZGQCBg8PFgIfBwUK5YWo5pyfNeiqsmRkAgcPDxYCHwcFDDHlsI%2FmmYIzMOWIhmRkAggPDxYCHwcFBjczMOWFg2RkAgkPDxYCHwcFBjY1N%2BWFg2RkAgoPDxYGHwcFD%2BWPr%2BaOpeWPl%2BWgseWQjR8ICiMfBgIEZGQCDQ9kFhhmDw8WAh8HBQdLSzM0MjY2ZGQCAQ8PFgIfBwUi5rSL6JitKOWcsOeUn%2BiYrSnmoL3ln7nmioDlt6fnj60gKmRkAgIPDxYCHwcFCeaYn%2Bacn%2BaXpWRkAgMPDxYGHwcFCjEw5pyIMTfml6UfCAojHwYCBGRkAgQPDxYCHwcFBuS4iuWNiGRkAgUPDxYCHwcFCzk6MzAtMTI6MzAgZGQCBg8PFgIfBwUK5YWo5pyfMeiqsmRkAgcPDxYCHwcFBzPlsI%2FmmYJkZAIIDw8WAh8HBQYyNjDlhYNkZAIJDw8WAh8HBQYyMzTlhYNkZAIKDw8WBh8HBQ%2FoqrLnqIvlt7Llj5bmtogfCAolHwYCBGRkAgsPDxYCHwloZGQCDg9kFhZmDw8WAh8HBQdLSzM0MjY3ZGQCAQ8PFgIfBwUi5rSL6JitKOmZhOeUn%2BiYrSnmoL3ln7nmioDlt6co5LiAKWRkAgIPDxYCHwcFCeaYn%2Bacn%2BaXpWRkAgMPDxYGHwcFCjEw5pyIMjTml6UfCAojHwYCBGRkAgQPDxYCHwcFBuS4iuWNiGRkAgUPDxYCHwcFCzk6MzAtMTI6MzAgZGQCBg8PFgIfBwUK5YWo5pyfMeiqsmRkAgcPDxYCHwcFBzPlsI%2FmmYJkZAIIDw8WAh8HBQYyNjDlhYNkZAIJDw8WAh8HBQYyMzTlhYNkZAIKDw8WBh8HBQ%2Flj6%2FmjqXlj5floLHlkI0fCAojHwYCBGRkAg8PZBYWZg8PFgIfBwUHS0szNDI2OGRkAgEPDxYCHwcFIua0i%2BiYrSjpmYTnlJ%2FomK0p5qC95Z%2B55oqA5benKOS6jClkZAICDw8WAh8HBQnmmJ%2FmnJ%2Fml6VkZAIDDw8WBh8HBQoxMOaciDMx5pelHwgKIx8GAgRkZAIEDw8WAh8HBQbkuIrljYhkZAIFDw8WAh8HBQs5OjMwLTEyOjMwIGRkAgYPDxYCHwcFCuWFqOacnzHoqrJkZAIHDw8WAh8HBQcz5bCP5pmCZGQCCA8PFgIfBwUGMjYw5YWDZGQCCQ8PFgIfBwUGMjM05YWDZGQCCg8PFgYfBwUP5Y%2Bv5o6l5Y%2BX5aCx5ZCNHwgKIx8GAgRkZAIQDw8WAh8AaGRkAgsPD2QPEBYBZhYBFgIeDlBhcmFtZXRlclZhbHVlZRYBZmRkGAIFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYBBQlDaGVja0JveDEFCUdyaWRWaWV3MQ88KwAMAgICOwgCc2Sx86WvFFqt3RQmUKuezrt%2FRlrowTA%2Fwk2K%2B0WZ38Ycmw%3D%3D&__VIEWSTATEGENERATOR=DB6BBFAE&__EVENTVALIDATION=%2FwEdAB5KrW%2FRmLDjUZ6rL1CMACBKESCFkFW%2FRuhzY1oLb%2FNUVM34O%2FGfAV4V4n0wgFZHr3ehEKvuPXQE3IwHHll3A7iHfAAQTv%2F3827vwY6ohZ%2FhFPA5b1OflfP7SAzRjj0qJr3RERXMbF77OTkoh8%2FF%2BLs8heg5mNsfEqnDvedSfcjTEzDKya%2BhwH%2FPKgugjD%2BHCuYrFxQntWfQBiFTO6BtAgK5Mz%2Fs1Dew%2BAKLFisnXMQZ3olgS%2BkUpWBhqLBxTWhCDU6%2BuO8cy0mjO0%2F7AeZpg%2BnWdl3aKjexRPYPWoXhMGsmAhuM%2BKCZy60yvZyZ%2B%2F8p8iT%2Bir2GgVQwf0%2FkiS1sOalxzBUifCfsZl2gOS9USoZxnENg90bAqEB13LPEIOY1Kalzm33ToZc%2B4ZV6OT8AvFTBw%2B40r5VHrh%2Bf5MHO23D2xsY3AxgR%2Fg6bTW%2BB%2B%2B1v7f44%2FtPH58KQAI2SUypk1uIu1vxWgUEaGjV%2Fnu%2BhN6EQF3Ko3JYoo7Wf0FW5B4C4F%2FZKGeAsWbgTHBlSKwh5jbEPkgK0hayeElfbPoCxB3hFdvgzqmHyG%2F%2B1d%2FYiOv1Ef9AviEdqWOEiFG8A6bX5q%2BFzPOxzm0YH72OaksRUTS6lroCc%2BRHkCI5KbW6HxSqX1ACp0lw7%2FOsVA%2BqX1U5OyhLFvshfPWLZ1cfaBhpKaA5fiw%3D%3D&TextBox1=&CheckBox1=on",
        "method": "POST",
        "mode": "cors",
        agent: ({ protocol }) => {
            return protocol === 'https:' ? httpsAgent : httpAgent;
          },
    })
    .then(async ScrapeDataHTMLResponse => {
        return await ScrapeDataHTMLResponse.text()
    })
    .then(async done => {
        // console.log(done)
        // $ = cheerio.load(done)
        // console.log($)
    })
    .catch(async err=>{
        console.error(err)
    })
}

var i
// for(i = 0; i < 100; i++){
//     FetchData(i)
// }
FetchData(10)

import nodeFetch from 'node-fetch'
import { CookieJar } from 'tough-cookie';
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent';
import cheerio from 'cheerio'
import csv from 'csv-parser'
import fs, { copyFileSync } from 'fs'
import csvWriter from 'csv-writer'

const jar = new CookieJar();

const httpAgent = new HttpCookieAgent({ jar });
const httpsAgent = new HttpsCookieAgent({ jar });

var $
var dataToWrite = '課程編號,課程名稱,上課日,開課日期,上/下午,上課時間,課程,每課,費用,會員費用,狀況'
var viewState = ''
var viewStateGenerator = ''
var eventValidation = ''
var re1 = new RegExp('(Page.)([0-9]+)')
var re2 = new RegExp('^[a-zA-Z]{2}[0-9]+')

var FetchData = async(page) => {
    
    // This is the part where the content would be parsed
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
        "body": "__EVENTTARGET=GridView1&__EVENTARGUMENT=Page%24" + page + "&__VIEWSTATE="
         + encodeURIComponent(viewState)
        // "%2FwEPDwULLTEyMjcyODc5NjYPZBYCAgMPZBYGAgUPDxYCHgdWaXNpYmxlaGRkAgkPPCsAEQMADxYIHgxEYXRhU291cmNlSUQFDlNxbERhdGFTb3VyY2UyHgtfIURhdGFCb3VuZGceC18hSXRlbUNvdW50ArcNHhdGaXJzdERpc3BsYXllZFBhZ2VJbmRleAIyZAEQFgICAQICFgI8KwAFAQEWBB4FV2lkdGgbAAAAAACAa0ABAAAAHgRfIVNCAoACPCsABQEBFgQfBRsAAAAAAABJQAEAAAAfBgKAAhYCZmYMFCsAABYCZg9kFiACAQ9kFhhmDw8WAh4EVGV4dAUIS0szNDA4OEJkZAIBDw8WAh8HBSHnlJznlJzlnIjpppnolrDooJ%2Fnh61ESVnoo73kvZznj61kZAICDw8WAh8HBQnmmJ%2FmnJ%2Flha1kZAIDDw8WBh8HBQoxMeaciDI35pelHglGb3JlQ29sb3IKIx8GAgRkZAIEDw8WAh8HBQbkuIvljYhkZAIFDw8WAh8HBQsyOjMwLTU6MzAgIGRkAgYPDxYCHwcFCuWFqOacnzHoqrJkZAIHDw8WAh8HBQcz5bCP5pmCZGQCCA8PFgIfBwUGNDIw5YWDZGQCCQ8PFgIfBwUGMzc45YWDZGQCCg8PFgYfBwUS57ay5LiK5ZCN6aGN5bey5ru%2FHwgKjQEfBgIEZGQCCw8PFgIeB0VuYWJsZWRoZGQCAg9kFhhmDw8WAh8HBQhLSzM0MDg5QmRkAgEPDxYCHwcFJOW9qeiJsuWkmuiCiemmmeiWsOign%2BeHrURJWeijveS9nOePrWRkAgIPDxYCHwcFCeaYn%2Bacn%2BS6lGRkAgMPDxYGHwcFCjEy5pyIMTfml6UfCAojHwYCBGRkAgQPDxYCHwcFBuaZmuS4imRkAgUPDxYCHwcFCzc6MDAtMTA6MDAgZGQCBg8PFgIfBwUK5YWo5pyfMeiqsmRkAgcPDxYCHwcFBzPlsI%2FmmYJkZAIIDw8WAh8HBQYzMjDlhYNkZAIJDw8WAh8HBQYyODjlhYNkZAIKDw8WBh8HBRLntrLkuIrlkI3poY3lt7Lmu78fCAqNAR8GAgRkZAILDw8WAh8JaGRkAgMPZBYWZg8PFgIfBwUJTlAzNDA5NkFRZGQCAQ8PFgIfBwUX6Jyc6KCf6Iqx5bel6Jed54%2BtKOS4gClkZAICDw8WAh8HBQnmmJ%2FmnJ%2FkuoxkZAIDDw8WBh8HBQoxMOaciDE55pelHwgKIx8GAgRkZAIEDw8WAh8HBQbkuIrljYhkZAIFDw8WAh8HBQoxMDowMC0xOjAwZGQCBg8PFgIfBwUL5YWo5pyfMTDoqrJkZAIHDw8WAh8HBQwx5bCP5pmCMzDliIZkZAIIDw8WAh8HBQY2MTDlhYNkZAIJDw8WAh8HBQY1NDnlhYNkZAIKDw8WBh8HBQ%2Flj6%2FmjqXlj5floLHlkI0fCAojHwYCBGRkAgQPZBYWZg8PFgIfBwUHS0EzNDE5MGRkAgEPDxYCHwcFD%2Bearumdqembu%2BeDmeeVq2RkAgIPDxYCHwcFCeaYn%2Bacn%2BS4iWRkAgMPDxYGHwcFCjEx5pyIMjTml6UfCAojHwYCBGRkAgQPDxYCHwcFBuS4i%2BWNiGRkAgUPDxYCHwcFCzM6NDAtNToxMCAgZGQCBg8PFgIfBwUK5YWo5pyfMuiqsmRkAgcPDxYCHwcFDDHlsI%2FmmYIzMOWIhmRkAggPDxYCHwcFBjIzMOWFg2RkAgkPDxYCHwcFBjIwN%2BWFg2RkAgoPDxYGHwcFD%2BWPr%2BaOpeWPl%2BWgseWQjR8ICiMfBgIEZGQCBQ9kFhZmDw8WAh8HBQdLWjM0MTkwZGQCAQ8PFgIfBwUP55qu6Z2p6Zu754OZ55WrZGQCAg8PFgIfBwUJ5pif5pyf5pelZGQCAw8PFgYfBwUKMTHmnIgyOOaXpR8ICiMfBgIEZGQCBA8PFgIfBwUG5LiK5Y2IZGQCBQ8PFgIfBwULMTE6MTUtMTI6NDVkZAIGDw8WAh8HBQrlhajmnJ8y6KqyZGQCBw8PFgIfBwUMMeWwj%2BaZgjMw5YiGZGQCCA8PFgIfBwUGMjMw5YWDZGQCCQ8PFgIfBwUGMjA35YWDZGQCCg8PFgYfBwUP5Y%2Bv5o6l5Y%2BX5aCx5ZCNHwgKIx8GAgRkZAIGD2QWFmYPDxYCHwcFCEtLMzQyNDlBZGQCAQ8PFgIfBwUb5rC05LuZ6Iqx5b2r5Yi75oqA5ben5Yid6ZqOZGQCAg8PFgIfBwUJ5pif5pyf5LiJZGQCAw8PFgYfBwUKMTHmnIgxN%2BaXpR8ICiMfBgIEZGQCBA8PFgIfBwUG5pma5LiKZGQCBQ8PFgIfBwULNzowMC05OjAwICBkZAIGDw8WAh8HBQrlhajmnJ816KqyZGQCBw8PFgIfBwUHMuWwj%2BaZgmRkAggPDxYCHwcFBjcxMOWFg2RkAgkPDxYCHwcFBjYzOeWFg2RkAgoPDxYGHwcFD%2BWPr%2BaOpeWPl%2BWgseWQjR8ICiMfBgIEZGQCBw9kFhZmDw8WAh8HBQhLSzM0MjQ5QmRkAgEPDxYCHwcFG%2BawtOS7meiKseW9q%2BWIu%2BaKgOW3p%2BWInemajmRkAgIPDxYCHwcFCeaYn%2Bacn%2BWFrWRkAgMPDxYGHwcFCjEy5pyIMTHml6UfCAojHwYCBGRkAgQPDxYCHwcFBuS4i%2BWNiGRkAgUPDxYCHwcFCzI6MDAtNDowMCAgZGQCBg8PFgIfBwUK5YWo5pyfNeiqsmRkAgcPDxYCHwcFBzLlsI%2FmmYJkZAIIDw8WAh8HBQY3MTDlhYNkZAIJDw8WAh8HBQY2MznlhYNkZAIKDw8WBh8HBQ%2Flj6%2FmjqXlj5floLHlkI0fCAojHwYCBGRkAggPZBYWZg8PFgIfBwUHS0szNDI1MGRkAgEPDxYCHwcFG%2BawtOS7meiKseW9q%2BWIu%2BaKgOW3p%2BmAsumajmRkAgIPDxYCHwcFCeaYn%2Bacn%2BWFrWRkAgMPDxYGHwcFCjEy5pyIMTHml6UfCAojHwYCBGRkAgQPDxYCHwcFBuS4i%2BWNiGRkAgUPDxYCHwcFCzQ6MTUtNTo0NSAgZGQCBg8PFgIfBwUK5YWo5pyfNeiqsmRkAgcPDxYCHwcFDDHlsI%2FmmYIzMOWIhmRkAggPDxYCHwcFBjYzMOWFg2RkAgkPDxYCHwcFBjU2N%2BWFg2RkAgoPDxYGHwcFD%2BWPr%2BaOpeWPl%2BWgseWQjR8ICiMfBgIEZGQCCQ9kFhZmDw8WAh8HBQdLSzM0MjUxZGQCAQ8PFgIfBwUe5rC05LuZ6Iqx5b2r5Yi75oqA5ben5rex6YCg54%2BtZGQCAg8PFgIfBwUJ5pif5pyf5pelZGQCAw8PFgYfBwUKMTLmnIgxOeaXpR8ICiMfBgIEZGQCBA8PFgIfBwUG5LiK5Y2IZGQCBQ8PFgIfBwULOTozMC0xMTowMCBkZAIGDw8WAh8HBQrlhajmnJ816KqyZGQCBw8PFgIfBwUMMeWwj%2BaZgjMw5YiGZGQCCA8PFgIfBwUGNjkw5YWDZGQCCQ8PFgIfBwUGNjIx5YWDZGQCCg8PFgYfBwUP5Y%2Bv5o6l5Y%2BX5aCx5ZCNHwgKIx8GAgRkZAIKD2QWFmYPDxYCHwcFB0tLMzQyNTJkZAIBDw8WAh8HBR7msLTku5noirHlvavliLvmioDlt6fpq5jntJrnj61kZAICDw8WAh8HBQnmmJ%2FmnJ%2Fml6VkZAIDDw8WBh8HBQoxMuaciDE55pelHwgKIx8GAgRkZAIEDw8WAh8HBQbkuIrljYhkZAIFDw8WAh8HBQsxMToxNS0xMjo0NWRkAgYPDxYCHwcFCuWFqOacnzXoqrJkZAIHDw8WAh8HBQwx5bCP5pmCMzDliIZkZAIIDw8WAh8HBQY5MTDlhYNkZAIJDw8WAh8HBQY4MTnlhYNkZAIKDw8WBh8HBQ%2Flj6%2FmjqXlj5floLHlkI0fCAojHwYCBGRkAgsPZBYWZg8PFgIfBwUHS0szNDI1M2RkAgEPDxYCHwcFKeawtOS7meiKseW9q%2BWIu%2BaKgOW3p%2BmrmOe0muW7tue6jOePrSjkuIApZGQCAg8PFgIfBwUJ5pif5pyf5pelZGQCAw8PFgYfBwUKMTLmnIgxOeaXpR8ICiMfBgIEZGQCBA8PFgIfBwUG5LiL5Y2IZGQCBQ8PFgIfBwULMjozMC00OjAwICBkZAIGDw8WAh8HBQrlhajmnJ816KqyZGQCBw8PFgIfBwUMMeWwj%2BaZgjMw5YiGZGQCCA8PFgIfBwUGNzIw5YWDZGQCCQ8PFgIfBwUGNjQ45YWDZGQCCg8PFgYfBwUP5Y%2Bv5o6l5Y%2BX5aCx5ZCNHwgKIx8GAgRkZAIMD2QWFmYPDxYCHwcFB0tLMzQyNTRkZAIBDw8WAh8HBSnmsLTku5noirHlvavliLvmioDlt6fpq5jntJrlu7bnuoznj60o5LqMKWRkAgIPDxYCHwcFCeaYn%2Bacn%2BaXpWRkAgMPDxYGHwcFCjEy5pyIMTnml6UfCAojHwYCBGRkAgQPDxYCHwcFBuS4i%2BWNiGRkAgUPDxYCHwcFCzQ6MTUtNTo0NSAgZGQCBg8PFgIfBwUK5YWo5pyfNeiqsmRkAgcPDxYCHwcFDDHlsI%2FmmYIzMOWIhmRkAggPDxYCHwcFBjczMOWFg2RkAgkPDxYCHwcFBjY1N%2BWFg2RkAgoPDxYGHwcFD%2BWPr%2BaOpeWPl%2BWgseWQjR8ICiMfBgIEZGQCDQ9kFhhmDw8WAh8HBQdLSzM0MjY2ZGQCAQ8PFgIfBwUi5rSL6JitKOWcsOeUn%2BiYrSnmoL3ln7nmioDlt6fnj60gKmRkAgIPDxYCHwcFCeaYn%2Bacn%2BaXpWRkAgMPDxYGHwcFCjEw5pyIMTfml6UfCAojHwYCBGRkAgQPDxYCHwcFBuS4iuWNiGRkAgUPDxYCHwcFCzk6MzAtMTI6MzAgZGQCBg8PFgIfBwUK5YWo5pyfMeiqsmRkAgcPDxYCHwcFBzPlsI%2FmmYJkZAIIDw8WAh8HBQYyNjDlhYNkZAIJDw8WAh8HBQYyMzTlhYNkZAIKDw8WBh8HBQ%2FoqrLnqIvlt7Llj5bmtogfCAolHwYCBGRkAgsPDxYCHwloZGQCDg9kFhZmDw8WAh8HBQdLSzM0MjY3ZGQCAQ8PFgIfBwUi5rSL6JitKOmZhOeUn%2BiYrSnmoL3ln7nmioDlt6co5LiAKWRkAgIPDxYCHwcFCeaYn%2Bacn%2BaXpWRkAgMPDxYGHwcFCjEw5pyIMjTml6UfCAojHwYCBGRkAgQPDxYCHwcFBuS4iuWNiGRkAgUPDxYCHwcFCzk6MzAtMTI6MzAgZGQCBg8PFgIfBwUK5YWo5pyfMeiqsmRkAgcPDxYCHwcFBzPlsI%2FmmYJkZAIIDw8WAh8HBQYyNjDlhYNkZAIJDw8WAh8HBQYyMzTlhYNkZAIKDw8WBh8HBQ%2Flj6%2FmjqXlj5floLHlkI0fCAojHwYCBGRkAg8PZBYWZg8PFgIfBwUHS0szNDI2OGRkAgEPDxYCHwcFIua0i%2BiYrSjpmYTnlJ%2FomK0p5qC95Z%2B55oqA5benKOS6jClkZAICDw8WAh8HBQnmmJ%2FmnJ%2Fml6VkZAIDDw8WBh8HBQoxMOaciDMx5pelHwgKIx8GAgRkZAIEDw8WAh8HBQbkuIrljYhkZAIFDw8WAh8HBQs5OjMwLTEyOjMwIGRkAgYPDxYCHwcFCuWFqOacnzHoqrJkZAIHDw8WAh8HBQcz5bCP5pmCZGQCCA8PFgIfBwUGMjYw5YWDZGQCCQ8PFgIfBwUGMjM05YWDZGQCCg8PFgYfBwUP5Y%2Bv5o6l5Y%2BX5aCx5ZCNHwgKIx8GAgRkZAIQDw8WAh8AaGRkAgsPD2QPEBYBZhYBFgIeDlBhcmFtZXRlclZhbHVlZRYBZmRkGAIFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYBBQlDaGVja0JveDEFCUdyaWRWaWV3MQ88KwAMAgICOwgCc2Sx86WvFFqt3RQmUKuezrt%2FRlrowTA%2Fwk2K%2B0WZ38Ycmw%3D%3D"
         + "&__VIEWSTATEGENERATOR=" + encodeURIComponent(viewStateGenerator)
         + "&__EVENTVALIDATION=" + encodeURIComponent(eventValidation)
         + "&TextBox1="
         + "&CheckBox1=on",
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
        $ = cheerio.load(done)
        // $('tr[style="color:#284775;background-color:White;"]').each((idx, val) => {
        //     console.log(`The tr at ${idx} is : `)
        //     console.log(val)
        // })
        // console.log($('tr[style="color:#333333;background-color:#F7F6F3;"] > td').contents().children().each((idx,val) => {
        //     console.log(val.data)
        // }))
        viewState = $('#__VIEWSTATE').val()
        // console.log(`The viewstate is : ${viewState}`)
        viewStateGenerator = $('#__VIEWSTATEGENERATOR').val()
        // console.log(`The viewstateGenerator is : ${viewStateGenerator}`)
        eventValidation = $('#__EVENTVALIDATION').val()
        var tmp_data = ''
        $('tr[style="color:#333333;background-color:#F7F6F3;"] > td').contents().map(function(idx,val) {
            // console.log($(this).text().trim() == '')
            if (this.type === 'text'){
                if(re2.exec($(this).text().trim()) != null && re2.exec($(this).text().trim()) != undefined){
                    // console.log(`The text is : ${$(this).text().trim()}`)
                    // console.log(re2.exec($(this).text().trim()))
                    tmp_data += '\r\n'
                }
                tmp_data += $(this).text().trim()
                tmp_data += ','
                // if(
                //     // dataToWrite.replace('\r\n','').split(',').length > 11 && 
                //     tmp_data.replace('\r\n','').split(',').length % 11 == 0){
                //         tmp_data += '\r\n'
                // }
                // console.log(`Current dataToWrite is : ${dataToWrite}`)
                // return $(this).text().trim()
            }
        })
        $('tr[style="color:#284775;background-color:White;"] > td').contents().map(function(idx,val) {
            // console.log($(this).text().trim() == '')
            if (this.type === 'text'){
                if(re2.exec($(this).text().trim()) != null && re2.exec($(this).text().trim()) != undefined){
                    // console.log(`The text is : ${$(this).text().trim()}`)
                    // console.log(re2.exec($(this).text().trim()))
                    tmp_data += '\r\n'
                }
                tmp_data += $(this).text().trim()
                tmp_data += ','
                // if(
                //     // dataToWrite.replace('\r\n','').split(',').length > 11 && 
                //     tmp_data.replace('\r\n','').split(',').length % 11 == 0){
                //         tmp_data += '\r\n'
                // }
                
                // console.log(`Current dataToWrite is : ${dataToWrite}`)
                // return $(this).text().trim()
            }
        })
        fs.appendFileSync('./data/Courses.csv', tmp_data.replaceAll('名,','名').replaceAll('滿,','滿').replaceAll('消,','消'))
        $('td[colspan="12"] > table > tbody > tr > td')
        .each(async (idx, val) => {
            val.children.forEach(async (val1,idx1)=>{
                // console.log(val1.children[0].data)
                // console.log(val1.attribs.href)
                if(val1.attribs.href == undefined){
                    // console.log(`The current page is : ${val1.children[0].data}`)
                    await FetchData(parseInt(val1.children[0].data) + 1)
                }
            })
        })
        // .get()
        // console.log(text)
    })
    .catch(async err=>{
        console.error(err)
    })
}



// var i

// for(i = 2; i < 3; i++){
//     FetchData(i,viewState, viewStateGenerator, eventValidation)
// }
// FetchData(10)



var firstFunction = async () => {
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
        viewState = $('#__VIEWSTATE').val()
        // console.log(`The viewstate is : ${viewState}`)
        viewStateGenerator = $('#__VIEWSTATEGENERATOR').val()
        // console.log(`The viewstateGenerator is : ${viewStateGenerator}`)
        eventValidation = $('#__EVENTVALIDATION').val()
        // console.log(`The Event Validation value is : ${eventValidation}`)
        // console.log($('td[colspan="12"] > table > tbody > tr > td:last-child')[0].children[0].attribs.href)
        var tmp_data = ''
        $('tr[style="color:#333333;background-color:#F7F6F3;"] > td').contents().map(function(idx,val) {
            // console.log($(this).text().trim() == '')
            if (this.type === 'text'){
                if(re2.exec($(this).text().trim()) != null && re2.exec($(this).text().trim()) != undefined){
                    // console.log(`The text is : ${$(this).text().trim()}`)
                    // console.log(re2.exec($(this).text().trim()))
                    tmp_data += '\r\n'
                }
                tmp_data += $(this).text().trim()
                tmp_data += ','
                // if(
                //     // dataToWrite.replace('\r\n','').split(',').length > 11 && 
                //     // tmp_data.replace('\r\n','').split(',').length % 11 == 0
                //     re
                //     ){
                //     tmp_data += '\r\n'
                // }
                // console.log(`Current dataToWrite is : ${dataToWrite}`)
                // return $(this).text().trim()
            }
        })
        $('tr[style="color:#284775;background-color:White;"] > td').contents().map(function(idx,val) {
            // console.log($(this).text().trim() == '')
            if (this.type === 'text'){
                if(re2.exec($(this).text().trim()) != null && re2.exec($(this).text().trim()) != undefined){
                    // console.log(`The text is : ${$(this).text().trim()}`)
                    // console.log(re2.exec($(this).text().trim()))
                    tmp_data += '\r\n'
                }
                tmp_data += $(this).text().trim()
                tmp_data += ','
                // if(
                //     // dataToWrite.replace('\r\n','').split(',').length > 11 && 
                //     tmp_data.replace('\r\n','').split(',').length % 11 == 0){
                //     tmp_data += '\r\n'
                // }
                
                // console.log(`Current dataToWrite is : ${dataToWrite}`)
                // return $(this).text().trim()
            }
        })
        // var tmp_href = $('td[colspan="12"] > table > tbody > tr > td:last-child')[0].children[0].attribs.href
        // var result = re1.exec(tmp_href[2])
        fs.appendFileSync('./data/Courses.csv',tmp_data.replaceAll('名,','名').replaceAll('滿,','滿').replaceAll('消,','消'))
        $('td[colspan="12"] > table > tbody > tr > td')
        .each(async (idx, val) => {
            val.children.forEach(async (val1,idx1)=>{
                // console.log(val1.children[0].data)
                // console.log(val1.attribs.href)
                if(val1.attribs.href == undefined){
                    console.log(`The current page is : ${val1.children[0].data}`)
                    await FetchData(parseInt(val1.children[0].data) + 1)
                }
            })
        })
        // [0].children.forEach((val, idx) => {
        //     console.log(val.attribs.href)
        // })
    })
}

fs.appendFileSync('./data/Courses.csv',dataToWrite)
firstFunction()
// .then(async done => {
//     dataToWrite = dataToWrite.replaceAll('名,','名').replaceAll('滿,','滿').replaceAll('消,','消')
//     console.log(dataToWrite)
// })

// console.log(dataToWrite)


// dataToWrite.replaceAll('名,','名').replaceAll('滿,','滿').replaceAll('消,','消')
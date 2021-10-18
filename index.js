import nodeFetch from 'node-fetch'
import { CookieJar } from 'tough-cookie';
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent';
import cheerio from 'cheerio'
import csv from 'csv-parser'
import fs, { copyFileSync } from 'fs'
import csvWriter from 'csv-writer'
import client from 'webdriverio'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

const jar = new CookieJar();

const httpAgent = new HttpCookieAgent({ jar });
const httpsAgent = new HttpsCookieAgent({ jar });

var $
var dataToWrite = '課程編號,課程名稱,上課日,開課日期,上/下午,上課時間,課程,每課,費用,會員費用,狀況'
var viewState = ''
var viewStateGenerator = ''
var eventValidation = ''
var dataSiteKey = '6LefOo8aAAAAAGYSm9NPQ0Ak7qH4tzmSPm704U4R'
var re1 = new RegExp('(Page.)([0-9]+)')
var re2 = new RegExp('^[a-zA-Z]{2}[0-9]+')
var re3 = new RegExp('(enro.)([0-9]+)')
var enrollTheCourse = async(enrolNum,viewState, viewStateGenerator,eventValidation) => {
    await nodeFetch("https://www.ftustsc.org.hk/enro2/view.aspx", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "application/x-www-form-urlencoded",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1"
        },
        // "referrer": "https://www.ftustsc.org.hk/enro2/view.aspx",
        "body": "__EVENTTARGET=GridView1&__EVENTARGUMENT=enro%24" + enrolNum + "&__VIEWSTATE=" + encodeURIComponent(viewState)
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
    .then(async enrolCourseResponse => {
        console.log(enrolCourseResponse.headers)
        return await enrolCourseResponse.text()
    })
    .then(async done1 => {
        // console.log(done1)
    })
}
var FetchData = async(page, tmp_newDate) => {
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
        "body": "__EVENTTARGET=GridView1&__EVENTARGUMENT=Page%24" + page + "&__VIEWSTATE="
         + encodeURIComponent(viewState)
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
        $ = cheerio.load(done)
        viewState = $('#__VIEWSTATE').val()
        viewStateGenerator = $('#__VIEWSTATEGENERATOR').val()
        eventValidation = $('#__EVENTVALIDATION').val()
        var tmp_data = ''
        $('tr[style="color:#333333;background-color:#F7F6F3;"] > td').contents().map(function(idx,val) {
            if (this.type === 'text'){
                if(re2.exec($(this).text().trim()) != null && re2.exec($(this).text().trim()) != undefined){
                    tmp_data += '\r\n'
                }
                tmp_data += $(this).text().trim()
                tmp_data += ','
            }
            else {
                if(this.attribs['onclick'] != undefined){
                    console.log(`The enrol number is : ${re3.exec(this.attribs['onclick'])[2]}`)
                    var enrollmentNum = parseInt(re3.exec(this.attribs['onclick'])[2])
                    // enrollTheCourse(enrollmentNum, viewState, viewStateGenerator, eventValidation)
                }
            }
        })
        $('tr[style="color:#284775;background-color:White;"] > td').contents().map(function(idx,val) {
            if (this.type === 'text'){
                if(re2.exec($(this).text().trim()) != null && re2.exec($(this).text().trim()) != undefined){
                    tmp_data += '\r\n'
                }
                tmp_data += $(this).text().trim()
                tmp_data += ','
            }
            else {
                if(this.attribs['onclick'] != undefined){
                    console.log(`The enrol number is : ${re3.exec(this.attribs['onclick'])[2]}`)
                    var enrollmentNum = parseInt(re3.exec(this.attribs['onclick'])[2])
                    // enrollTheCourse(enrollmentNum, viewState, viewStateGenerator, eventValidation)
                }
            }
        })
        fs.appendFileSync('./data/Courses' +tmp_newDate +'.csv', tmp_data.replaceAll('名,','名').replaceAll('滿,','滿').replaceAll('消,','消'))
        $('td[colspan="12"] > table > tbody > tr > td')
        .each(async (idx, val) => {
            val.children.forEach(async (val1,idx1)=>{
                // console.log(val1.children[0].data)
                // console.log(val1.attribs.href)
                if(val1.attribs.href == undefined){
                    // console.log(`The current page is : ${val1.children[0].data}`)
                    await FetchData(parseInt(val1.children[0].data) + 1, tmp_newDate)
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

var firstFunction = async (url) => {
    var tmp_newDate = uuidv4()
    fs.writeFileSync(`./data/Courses${tmp_newDate}.csv`,dataToWrite)
    await nodeFetch(url, {
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
            else {
                if(this.attribs['onclick'] != undefined){
                    console.log(`The enrol number is : ${re3.exec(this.attribs['onclick'])[2]}`)
                    var enrollmentNum = parseInt(re3.exec(this.attribs['onclick'])[2])
                    // enrollTheCourse(enrollmentNum, viewState, viewStateGenerator, eventValidation)
                }
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
            else {
                if(this.attribs['onclick'] != undefined){
                    console.log(`The enrol number is : ${re3.exec(this.attribs['onclick'])[2]}`)
                    var enrollmentNum = parseInt(re3.exec(this.attribs['onclick'])[2])
                    // enrollTheCourse(enrollmentNum, viewState, viewStateGenerator, eventValidation)
                }
            }
        })
        // var tmp_href = $('td[colspan="12"] > table > tbody > tr > td:last-child')[0].children[0].attribs.href
        // var result = re1.exec(tmp_href[2])
        fs.appendFileSync('./data/Courses' +tmp_newDate +'.csv',tmp_data.replaceAll('名,','名').replaceAll('滿,','滿').replaceAll('消,','消'))
        $('td[colspan="12"] > table > tbody > tr > td')
        .each(async (idx, val) => {
            val.children.forEach(async (val1,idx1)=>{
                // console.log(val1.children[0].data)
                // console.log(val1.attribs.href)
                if(val1.attribs.href == undefined){
                    console.log(`The current page is : ${val1.children[0].data}`)
                    await FetchData(parseInt(val1.children[0].data) + 1, tmp_newDate)
                }
            })
        })
        // [0].children.forEach((val, idx) => {
        //     console.log(val.attribs.href)
        // })
    })
}






var bookTheCourse = async(courseName) => {
    var btn
    function simulateClick(element) {
        var clickEvent = document.createEvent("MouseEvents");
        clickEvent.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0,
            false, false, false, false, 0, null);
    
        // var element = document.getElementById(id);
        element.dispatchEvent(clickEvent);
    }

    const browser = await client.remote({
        maxInstances: 10,
        capabilities: {
            browserName: 'chrome',
            pageLoadStrategy: 'eager',
            'goog:chromeOptions': { 
                    binary: 'D:/Users/imctw/Downloads/chrome-win/chrome.exe',
                    args: [
                        // "--headless", 
                        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
                        "--ChromeOSMemoryPressureHandling",
                        "--incognito",
                        "--silent",
                    ]
            }
        },
        services: ['devtools']
    })
    var abortEle = async (url) => {
        var mock1 = await browser.mock(url)
        mock1.abort('Failed')
    }
    var blockElements = async() => {
        await abortEle(/.+.css/)
        await abortEle(/.+.woff/)
        await abortEle(/.+.svg/)
        await abortEle(/.+.jpg/)
        await abortEle(/.+.gif/)
        await abortEle(/.+.png/)
    }
    await blockElements()
    await browser.url('https://www.ftustsc.org.hk/enro2/view.aspx')
    btn = await browser.$('#read')
    await btn.click()
    // await browser.executeAsync(simulateClick, btn)
    btn = await browser.$('#getc')
    // await browser.executeAsync(simulateClick, btn)
    await btn.click()
    btn = await browser.$('#TextBox1')
    await btn.setValue(courseName)
    btn = await browser.$('#Button1')
    await btn.click()
    btn = await browser.$('input[value="報名"]')
    await btn.click()
    btn = await browser.$('#email_t')
    await btn.setValue('tonywong11373@hotmail.com')
    btn = await browser.$('#password_t')
    await btn.setValue('835026')
    btn = await browser.$('button[data-action="submit"]')
    await btn.click()
    btn = await browser.$('#id_t')
    await btn.setValue('Y244642')
    btn = await browser.$('#idchecknumber_t')
    await btn.setValue('A')
    btn = await browser.$('#cname_t')
    await btn.setValue('黃慶生')
    btn = await browser.$('#ename_t')
    await btn.setValue('WONG HING SANG')
    // This is the setting for the Sex
    // M for male; F for female
    btn = await browser.$('#M')
    await btn.click()
    btn = await browser.$('#birthmonth_t option[value="10"]')
    await btn.click()
    btn = await browser.$('#birthyear_t')   
    await btn.setValue('1992')
    btn = await browser.$('#education5')
    await btn.click()
    btn = await browser.$('#address1_1')
    await btn.setValue('2031 flat')
    btn = await browser.$('#address1_2')
    await btn.setValue('Wah Hing House, Wah Fu Estate')
    btn = await browser.$('#address1_3')
    await btn.setValue('HK')
    // SSP 深水埗
    // HTK 紅磡 何文田 土瓜灣 九龍城
    // HKC 中西區
    // NTS 新界 離島
    // YMT 旺角 油麻地 尖沙咀
    // KTG 黃大仙 慈雲山 彩虹 牛頭角 觀塘
    // HKN 灣仔 銅鑼灣 北角 筲箕灣 香港南區
    btn = await browser.$('#area_t option[value="HKN"]')
    await btn.click()
    btn = await browser.$('#otel_t')
    await btn.setValue('51604525')
    btn = await browser.$('#occupation2')
    await btn.click()
    // Payment Options Selection
    // VISA or Master pay3
    // PPS pay2
    // 中銀工聯VISA pay1
    btn = await browser.$('#pay3')
    await btn.click()
    btn = await browser.$('#Button2')
    await btn.click()
    btn = await browser.$('#confirmcheck')
    await btn.click()
    btn = await browser.$('input[value="確定"]')
    await btn.click()
    btn = await browser.$('input[value="付款按鈕"]')
    await btn.click()
    btn = await browser.$('input[value="VISA"]')
    await btn.click()
    btn = await browser.$('input[value="Confirm"]')
    await btn.click()
    btn = await browser.$('#cardNo2')
    await btn.setValue('5408062000670759')
    btn = await browser.$('#epMonth2 option[value="09"]')
    await btn.click()
    btn = await browser.$('#epYear2 option[value="2026"]')
    await btn.click()
    btn = await browser.$('#cardHolder2')
    await btn.setValue('WONG HING SANG')
    btn = await browser.$('input[name="securityCode2"]')
    await btn.setValue('999')
    btn = await browser.$('input[name="submitBut"]')
    await btn.click()

    // await browser.executeAsync(simulateClick, btn)
}

// bookTheCourse()



// $$('li[class*="weba"] > a').filter(x => x.text.includes('課程') && x.href.includes('hkftustsc')).forEach(ele => {
//     console.log(ele.href)
// })


// getAllCourseURL()

["https://www.ftustsc.org.hk/enro2/view.aspx", "https://www.ftustsc.org.hk/enro/view.aspx"].forEach(async(val,idx) => {
    await firstFunction(val)
})



const request = require("request");
const cheerio = require("cheerio");
const scorecardObj = require("./scorecard");

function getAllMatchesLink(url) {
    request(url, function (err, response, html) {
        if(err){
            console.log(err);
        }else{
            extractAllLinks(html);
        }
    })
}

function extractAllLinks(html){
    let $ = cheerio.load(html);
    let scorecardElems = $("a[data-hover='Scorecard']");
    for(let i = 0; i < scorecardElems.length; i++){
        let link = $(scorecardElems[i]).attr("href");
        let flink = "https://www.espncricinfo.com" + link;
        // console.log(flink);
        scorecardObj.ps(flink);
    }
}

module.exports = {
    getAllMatch : getAllMatchesLink
}

// extracts all matches links and loops scorecard.js for different matches
// Command: node main.js
// If u don't enter year number, default is IPL 2021

// For customising year, Command: node main.js xxxx 
//                     (where xxxx = 2008 to 2021)

const request = require("request");
const cheerio = require("cheerio");
const allMatchObj = require("./allmatch");
const fs = require("fs");
const path = require("path");
inputArr = process.argv.slice(2);
var url;
// by default 2021 is on, you can change it.
// const url = "https://www.espncricinfo.com/series/ipl-2021-1249214"; // ipl 2021
// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"; // ipl 2020
// const url = "https://www.espncricinfo.com/series/ipl-2019-1165643"; // ipl 2019
// const url = "https://www.espncricinfo.com/series/ipl-2018-1131611"; // ipl 2018
// const url = "https://www.espncricinfo.com/series/ipl-2017-1078425"; // ipl 2017
// const url = "https://www.espncricinfo.com/series/ipl-2016-968923"; // ipl 2016
// const url = "https://www.espncricinfo.com/series/pepsi-indian-premier-league-2015-791129"; // ipl 2015
// const url = "https://www.espncricinfo.com/series/pepsi-indian-premier-league-2014-695871"; // ipl 2014
// const url = "https://www.espncricinfo.com/series/indian-premier-league-2013-586733"; // ipl 2013
// const url = "https://www.espncricinfo.com/series/indian-premier-league-2012-520932"; // ipl 2012
// const url = "https://www.espncricinfo.com/series/indian-premier-league-2011-466304"; // ipl 2011
// const url = "https://www.espncricinfo.com/series/indian-premier-league-2009-10-418064"; // ipl 2010
// const url = "https://www.espncricinfo.com/series/indian-premier-league-2009-374163"; // ipl 2009
// const url = "https://www.espncricinfo.com/series/indian-premier-league-2007-08-313494"; // ipl 2008

switch (inputArr[0]) {

    case "2020": url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"; // ipl 2020 
    case "2019": url = "https://www.espncricinfo.com/series/ipl-2019-1165643"; // ipl 2019
    case "2018": url = "https://www.espncricinfo.com/series/ipl-2018-1131611"; // ipl 2018
    case "2017": url = "https://www.espncricinfo.com/series/ipl-2017-1078425"; // ipl 2017
    case "2016": url = "https://www.espncricinfo.com/series/ipl-2016-968923"; // ipl 2016
    case "2015": url = "https://www.espncricinfo.com/series/pepsi-indian-premier-league-2015-791129"; // ipl 2015
    case "2014": url = "https://www.espncricinfo.com/series/pepsi-indian-premier-league-2014-695871"; // ipl 2014
    case "2013": url = "https://www.espncricinfo.com/series/indian-premier-league-2013-586733"; // ipl 2013
    case "2012": url = "https://www.espncricinfo.com/series/indian-premier-league-2012-520932"; // ipl 2012
    case "2011": url = "https://www.espncricinfo.com/series/indian-premier-league-2011-466304"; // ipl 2011
    case "2010": url = "https://www.espncricinfo.com/series/indian-premier-league-2009-10-418064"; // ipl 2010
    case "2009": url = "https://www.espncricinfo.com/series/indian-premier-league-2009-374163"; // ipl 2009
    case "2008": url = "https://www.espncricinfo.com/series/indian-premier-league-2007-08-313494"; //ipl 2008
    default: url = "https://www.espncricinfo.com/series/ipl-2021-1249214"; // ipl 2021
                    inputArr[0] = "2021";

}

const folderName = "IPL " + inputArr[0];
const iplPath = path.join(__dirname, folderName);
dirCreator(iplPath);

request(url, cb);

function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        // console.log(html);
        extractLink(html);
    }
}

function extractLink(html) {
    let $ = cheerio.load(html);
    let anchorElem = $("a[data-hover='View All Results']");
    let link = anchorElem.attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    // console.log(fullLink);
    allMatchObj.getAllMatch(fullLink, folderName);
}

function dirCreator(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }
}

// from main page, take to all match page

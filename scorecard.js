const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

function processScorecard(url) {
    request(url, cb);
}

function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        // console.log(html);
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html) {
    let $ = cheerio.load(html);
    // 
    let descElem = $(".match-info .description").text();
    let result = $(".match-info-MATCH .status-text").text();
    let stringArr = descElem.split(",");
    let venue = stringArr[1].trim();
    let date = stringArr[2].trim();

    //segregated both scorecards
    let innings = $(".card.content-block.match-scorecard-table .Collapsible");
    for (let i = 0; i < innings.length; i++) {

        let teamName = $(innings[i]).find("h5").text().split("INNINGS")[0].trim();
        let oppidx = i == 0 ? 1 : 0;
        let oppName = $(innings[oppidx]).find("h5").text().split("INNINGS")[0].trim();
        // let arr = {venue, date, teamName, oppName, result};
        // console.table(arr);
        if (i == 0) {
            console.log(`${venue} | ${date} | ${teamName} | ${oppName} | ${result}`);
        }
        let currInn = $(innings[i]);
        let allRows = currInn.find("tr");
        for (let j = 0; j < allRows.length; j++) {
            let isbatsman = $(allRows[j]).find("td");
            if ($(isbatsman[0]).hasClass("batsman-cell")) {

                let name = $(isbatsman[0]).text().trim();
                let runs = $(isbatsman[2]).text().trim();
                let balls = $(isbatsman[3]).text().trim();
                let fours = $(isbatsman[5]).text().trim();
                let sixes = $(isbatsman[6]).text().trim();
                let sr = $(isbatsman[7]).text().trim();


                console.log(`${name} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                processPlayer(teamName, name, runs, balls, fours, sixes, sr, oppName, venue, date, result);
            }
        }

    }


}

function processPlayer(teamName, name, runs, balls, fours, sixes, sr, oppName, venue, date, result) {
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreator(teamPath);
    let filePath = path.join(teamPath, name + ".xlsx");
    let content = excelReader(filePath, name);

    let playerObj = {
        teamName,
        name,
        runs,
        balls,
        fours,
        sixes,
        sr,
        oppName,
        venue,
        date,
        result
    }
    content.push(playerObj);

    excelWriter(filePath, content, name);

}

function dirCreator(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
}

function excelWriter(filePath, json, sheetName) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);

}

function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}



module.exports = {
    ps: processScorecard
}

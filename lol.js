const cheerio = require('cheerio');
const axios = require('axios');
const url = "https://www.counterstats.net";

const cleanVsChampionUrl = (url) => {
    return url.split("/")[3].replace("vs-", "").padEnd(20, " ");
}

module.exports.getAllChampions = async (criteria) => {
    try {
        let response = await axios.get(url);
        const $ = cheerio.load(response.data);
        let list = [];
        $("#champions").find("div").each((i, div) => {
            let name = $(div).attr("url");
            let style = $(div).attr("style");
            if(style === "display:none;" && (!criteria || name.includes(criteria))){
                list.push(name);
            }
        });
        return list;
    } catch(error){
        console.error(error);
    }
}

module.exports.getAllCounters = async (champion, lane) => {
    try {
        let response = await axios.get(url + "/league-of-legends/" + champion);
        const $ = cheerio.load(response.data);
        let counters = "";
        $(".champ-box__wrap").each((i, div) => {
            let title = $(div).find("h2").clone().children().remove().end().text();
            if(lane && !title.toLowerCase().includes(lane.toLowerCase())){
                return true;
            }
            counters += "**" + title.trim() + "**\n";

            $(div).find(".champ-box").first().find("a").each((i, a) => {
                if(i === 10){
                    return false;
                }
                let percent = $(a).find(".percentage").text();
                if(!percent){
                    percent = $(a).find("b").text();
                }
                let percentNumber = parseFloat(percent.replace("%", ""));
                if(percentNumber >= 50){
                    counters += cleanVsChampionUrl($(a).attr("href"));
                    counters += " " + percent + "\n";
                }
            });
            counters += "\n";
        });
        return counters ? counters : "No result.";
    } catch(err){
        console.error(err);
        if(err.response.status === 404){
            return "Unknown champion " + champion + ". Try !champions.";
        } else {
            return "Unknown error...";
        }
    }
}
const cheerio = require('cheerio');
const axios = require('axios');
const url = "https://www.counterstats.net";

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

module.exports.getAllCounters = async (champion) => {
    return ["Annie", "Janna"];
}

this.getAllChampions();
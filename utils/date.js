class DateUtil{
    convertMilisecondtoDay = (s) => {
        return s/1000/3600/24;
    }
}

module.exports = new DateUtil();
import React from "react";

enum Month {
    Janvier,
    Février,
    Mars,
    Avril,
    Mai,
    Juin,
    Juillet,
    Août,
    Septembre,
    Octobre,
    Novembre,
    Décembre,
}

const display = (intro: string, date: string) => {
    return intro + 'le ' + date.split(/ /)[0].split(/-/)[2] + ' ' +
    Month[parseInt(date.split(/-/)[1]) - 1] + ' ' +
    date.split(/-/)[0] + ' à ' +
    date.split(/ /)[1].split(/:/)[0] + 'h' +
    date.split(/ /)[1].split(/:/)[1]
}

export {Month, display};

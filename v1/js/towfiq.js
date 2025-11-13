$(document).ready(function yearOfExp() {

    const joiningDate = "September, 1, 2019";

    const careerStarted = new Date(joiningDate);
    const today = new Date();

    const currentYear = new Date().getFullYear();
    let yearOfExp = parseInt(DateDiff.inMonths(careerStarted, today) / 12);
    let monthOfExp = parseInt((DateDiff.inMonths(careerStarted, today) + 1) % 12);
    yearOfExp += monthOfExp/12;
    monthOfExp = monthOfExp%12;
    if(monthOfExp === 0) yearOfExp++;
    const totalExperience = parseInt(yearOfExp) + "Y " + monthOfExp + "M ";
    $("#currentYear").html(currentYear);
    $("#totalExperienceCV").html(totalExperience);
    $("#totalExperienceMain").html(totalExperience);
    $("#totalExperienceSummary").html(totalExperience);

});


const DateDiff = {

    inDays: function (d1, d2) {
        const t2 = d2.getTime();
        const t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000));
    },

    inWeeks: function (d1, d2) {
        const t2 = d2.getTime();
        const t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
    },

    inMonths: function (d1, d2) {
        const d1Y = d1.getFullYear();
        const d2Y = d2.getFullYear();
        const d1M = d1.getMonth();
        const d2M = d2.getMonth();

        return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
    },

    inYears: function (d1, d2) {
        return d2.getFullYear() - d1.getFullYear();
    }
}

function includeHTML(fileName) {
    let customElements, index, customElement, file, xhttp;
    customElements = document.getElementsByTagName("*");
    for (index = 0; index < customElements.length; index++) {
        customElement = customElements[index];
        file = customElement.getAttribute(fileName);
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {customElement.innerHTML = this.responseText;}
                    if (this.status == 404) {customElement.innerHTML = "Page not found.";}
                    /* Remove the attribute, and call this function once more: */
                    customElement.removeAttribute(fileName);
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}
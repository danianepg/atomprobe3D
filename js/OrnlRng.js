// @author Daniane P. Gomes
// @version 1.0 29/04/2013
/**
 * Define IonDef Class
 */
function IonDef() {

    var numberLines;
    var numberGroups;
    // Matrix type GroupDef
    var matGroupDef = new Array();

}

/**
 * IonDef Class getters
 */

IonDef.prototype = {

    getNumberLines: function () {
        return this.numberLines;
    },
    getNumberGroups: function () {
        return this.numberGroups;
    },
    //getNumberRange 	: function() { return this.numberRange; 	} ,
    getMatGroupDef: function () {
        return this.matGroupDef;
    }

}

/**
 * Define GroupDef Class
 */
function GroupDef() {

    var fullName;
    var shortName;
    var r;
    var g;
    var b;

}

/**
 * GroupDef Class getters
 */

GroupDef.prototype = {

    getFullName: function () {
        return this.fullName;
    },
    getShortName: function () {
        return this.shortName;
    },
    getR: function () {
        return this.r;
    },
    getG: function () {
        return this.g;
    },
    getB: function () {
        return this.b;
    }
}

/**
 * Define RngDef Class
 */
function RngDef() {

    var rngIni;
    var rngEnd;
    // Matrix type int
    var matRngValues = new Array();
}

/**
 * RngDef Class getters
 */
RngDef.prototype = {

    getRngIni: function () {
        return this.rngIni;
    },
    getRngEnd: function () {
        return this.rngEnd;
    },
    getMatRngValues: function () {
        return this.matRngValues;
    }
}

/**
 * Define ORNLDef Class
 */
function ORNLDef() {

    var ionDef = new IonDef();
    // Matrix type RngDef
    var matRngDef = new Array();
}

/**
 * ORNLDef Class getters
 */
ORNLDef.prototype = {

    getIonDef: function () {
        return this.ionDef;
    },
    getMatRngDef: function () {
        return this.matRngDef;
    }

}


/**
 * Read the file contents and save it in a hidden field on the screen
 */
function readRngFile(evt, idField) {

    var oRNLDefGlb = new ORNLDef();

    var contents;
    var files = document.getElementById(idField).files;
    var f = files[0];
    var r = new FileReader();

    r.onload = (function (f) {
        return function (e) {

            contents = e.target.result;
            document.getElementById('fileContent').value = contents;

        };
    })(f);

    r.onloadend = endReading;
    r.readAsText(f);

}


/**
 * Interpret a range file content
 * Create buttons with the ranges on the screen
 * Define colors to each group
 */
function endReading() {

    try {
        oRNLDefGlb = intepretContent(document.getElementById('fileContent').value);
    } catch (e) {
        alert(e.stack);
    }

    if (oRNLDefGlb != null) {
        //writeObj(oRNLDefGlb);

        // Display range buttons
        var rngDef = new RngDef();
        var matRngDef = new Array();
        matRngDef = oRNLDefGlb.getMatRngDef();
        newHTML = "";

        var ionDef = new IonDef();
        ionDef = oRNLDefGlb.getIonDef();

        var matGroupDef = new Array();
        matGroupDef = ionDef.getMatGroupDef();

        for (j = 0; j < matRngDef.length; j++) {

            rngDef = matRngDef[j];
            nameBtn = "btnRng_" + j;
            ini = parseFloat(rngDef.getRngIni());
            end = parseFloat(rngDef.getRngEnd());
            valueBtn = ini + " - " + end;

            var matRngValues = new Array();
            matRngValues = rngDef.getMatRngValues();

            var matGroupDefAux = new Array();

            // Save the information about the groups that this ION belongs to
            for (k = 0; k < matRngValues.length; k++) {
                if (parseInt(matRngValues[j]) > 0) {
                    matGroupDefAux.push(matGroupDef[k]);
                }
            }

            var groupDef1 = new GroupDef();
            var r;
            var g;
            var b;

            if (matGroupDefAux.length == 1) {
                groupDef1 = matGroupDefAux[0];
                r = parseFloat(groupDef1.getR());
                g = parseFloat(groupDef1.getG());
                b = parseFloat(groupDef1.getB());
            } else {

                // Generating color, when the group has more than 1 ION
                var sumR = 0;
                var sumG = 0;
                var sumB = 0;

                for (k = 0; k < matGroupDefAux.length; k++) {
                    var groupDef1 = new GroupDef();
                    groupDef1 = matGroupDefAux[j];

                    sumR += parseFloat(groupDef1.getR());
                    sumG += parseFloat(groupDef1.getG());
                    sumB += parseFloat(groupDef1.getB());
                }

                r = parseFloat(sumR / matGroupDefAux.length);
                g = parseFloat(sumG / matGroupDefAux.length);
                b = parseFloat(sumB / matGroupDefAux.length);

            }

            newHTML += "<input type='button' id='" + nameBtn + "'";
            newHTML += " name='" + nameBtn + "' value='" + valueBtn + "'";
            newHTML += " onclick='filterRange(" + ini + "," + end + "," + r + "," + g + "," + b + ")' /></br>";

        }

        document.getElementById('rangeButtons').innerHTML = newHTML;

    }
}

/**
 * Write the content of an object ORNLDef
 */
function writeObj(oRNLDefGlb2) {

    var ionDef3 = new IonDef();

    // ION DEFINITION
    ionDef3 = oRNLDefGlb2.getIonDef();
    document.write("<br>getNumberLines " + ionDef3.getNumberLines());
    document.write("<br>getNumberGroups " + ionDef3.getNumberGroups());
    var matGroupDef = new Array();
    matGroupDef = ionDef3.getMatGroupDef();

    for (i = 0; i < matGroupDef.length; i++) {
        var groupDef2 = new GroupDef();
        groupDef2 = matGroupDef[i];

        document.write("<br> getFullName " + groupDef2.getFullName());
        document.write("<br> getShortName " + groupDef2.getShortName());
        document.write("<br> getR " + groupDef2.getR());
        document.write("<br> getG " + groupDef2.getG());
        document.write("<br> getB " + groupDef2.getB());
    }

    // RANGE DEFINITION
    var rngDef = new RngDef();
    var matRngDef = new Array();
    matRngDef = oRNLDefGlb2.getMatRngDef();

    for (j = 0; j < matRngDef.length; j++) {

        rngDef = matRngDef[j];

        document.write("<br> getRngIni " + rngDef.getRngIni());
        document.write("<br> getRngEnd " + rngDef.getRngEnd());

        var matRangeDef = new Array();
        matRangeDef = rngDef.getMatRngValues();
        document.write("[");
        for (i = 0; i < matRangeDef.length; i++) {
            document.write(" " + matRangeDef[i]);
        }
        document.write("]");
    }

}

/**
 * Interpret the content of a range file and transfer all the data to a JS class
 */
function intepretContent(contents) {

    try {
        var oRNLDef = new ORNLDef();
        var ionDef = new IonDef();
        var rngDef = new RngDef();
        var matGroupDef = new Array();
        var matRngDef = new Array();

        // Split the new lines in the content
        var arrLin = contents.split("\n");

        if (!arrLin.length > 0) {
            alert("Invalid number of lines in file!");
            return null;
        }


        // 1st line indicates the number of lines that the file must have
        var arrChar = arrLin[0].split(" ");

        if (!arrChar.length > 0) {
            alert("Invalid header format!");
            return null;
        }

        var numberLinesHeader = (parseInt(arrChar[0]) * 2);
        var numberLinesGroup = parseInt(arrChar[1]);

        if (isNaN(numberLinesHeader) == true || isNaN(numberLinesGroup) == true) {
            alert("Invalid format data!");
            return null;
        }

        var numberLines = numberLinesHeader + numberLinesGroup + 2;
        ionDef.numberLines = numberLinesHeader;
        ionDef.numberGroups = numberLinesGroup;

        if (arrLin.length < numberLines) {
            alert("Invalid number of lines in file!");
            return null;
        }

        // Getting the header definition
        var i = 1;
        while (i <= numberLinesHeader) {

            var groupDef2 = new GroupDef();
            groupDef2.fullName = arrLin[i];

            var strArr = arrLin[i + 1].replaceAll("  ", " ");
            var arrCol = strArr.split(" ");
            if (arrCol.length == 4) {

                groupDef2.shortName = arrCol[0];
                groupDef2.r = parseFloat(arrCol[1]);
                groupDef2.g = parseFloat(arrCol[2]);
                groupDef2.b = parseFloat(arrCol[3]);
                matGroupDef.push(groupDef2);

            } else {
                alert("Invalid header format!");
                return null;
            }

            i += 2;

        }

        ionDef.matGroupDef = matGroupDef;
        oRNLDef.ionDef = ionDef;

        // Getting the group definition
        for (i = numberLinesHeader + 2; i < numberLines; i++) {

            var strArr = arrLin[i].replaceAll("  ", " ");
            arrCol = strArr.split(" ");

            // . rangeIni rangeFim group
            requiredColNumb = 3 + (numberLinesHeader / 2);
            if (arrCol.length == requiredColNumb) {

                rngDef2 = new RngDef();
                rngDef2.rngIni = parseFloat(arrCol[1]);
                rngDef2.rngEnd = parseFloat(arrCol[2]);

                var matRngValues2 = new Array();
                for (j = 3; j < arrCol.length; j++) {
                    matRngValues2.push(parseInt(arrCol[j]));
                }
                rngDef2.matRngValues = matRngValues2;
                matRngDef.push(rngDef2);

            } else {
                alert("Invalid range format!");
                return null;
            }

        }

        oRNLDef.matRngDef = matRngDef;
        return oRNLDef;

    } catch (e) {
        alert(e.stack);
    }

}

String.prototype.replaceAll = function (de, para) {
    var str = this;
    var pos = str.indexOf(de);
    while (pos > -1) {
        str = str.replace(de, para);
        pos = str.indexOf(de);
    }
    return (str);
}
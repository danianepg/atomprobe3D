function readBlobXYZ(opt_startByte, opt_stopByte) {

    var files = document.getElementById('files').files;
    var file = files[0];

    var r = new FileReader();
    r.onload = function (e) {
        var contents = e.target.result;
        //alert(contents);  
        convertTextToMat3D(contents);
    }
    r.readAsText(file);

}

function convertTextToMat3D(readResult) {

    var vetLin = readResult.split("\n");
    var mat3D = new Array();
    var count = 0;

    for (i = 0; i < vetLin.length; i++) {

        var lin = vetLin[i];

        isComment = lin.substr(0, 1);
        if (isComment == "#") {
            isComment = true;
        } else {
            isComment = false;
        }

        if (!isComment) {

            lin = lin.replace("  ", " ");
            var vetNum = lin.split(" ");

            if (vetNum.length > 2) {

                var vetNumFrmt = new Array();

                for (j = 0; j < vetNum.length; j++) {
                    if (vetNum[j] != "" && vetNum[j] != " ") {
                        vetNumFrmt.push(vetNum[j]);
                    }
                }

                mat3D[count] = vetNumFrmt;
                count++;

            }
        }
    }

    drawFile(mat3D);
}

function readBytesClickXYZ() {

    progress = document.querySelector('.percent');

    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    var startByte = parseInt(document.getElementById('dataStartByte').value);
    var endByte = parseInt(document.getElementById('dataEndByte').value);

    readBlobXYZ(startByte, endByte);

}

function loadEntireFileXYZ() {

    var fileSize = checkSizeFile('files');

    // Split in groups of 100000
    var groupSize = parseInt(100000);
    var countSlices = fileSize / groupSize;

    for (i = 0; i < countSlices; i++) {

        // Reset progress indicator on new file selection.
        progress = document.querySelector('.percent');
        progress.style.width = '0%';
        progress.textContent = '0%';

        startByte = parseInt(i * groupSize);
        endByte = startByte + groupSize;

        document.getElementById('dataStartByte').value = startByte;
        document.getElementById('dataEndByte').value = endByte;

        //document.write("<br> ["+i+"] = Reading bytes from "+ startByte + " to " + endByte);
        //document.getElementById('byte_range').value = document.getElementById('byte_range').value + '\n Reading bytes from ' + startByte + ' to ' + endByte;

        readBlobXYZ(startByte, endByte);

    }

}
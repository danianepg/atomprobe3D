var reader;
var progress = document.querySelector('.percent');

function abortRead() {
    reader.abort();
}

function errorHandler(evt) {
    switch (evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
    case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
    case evt.target.error.ABORT_ERR:
        break; // noop
    default:
        alert('An error occurred reading this file.');
    };
}

function updateProgress(evt) {

    if (evt.lengthComputable) {
        progress = document.querySelector('.percent');
        var percentLoaded = Math.round((evt.loaded / evt.total) * 100);

        // Increase the progress bar length.
        if (percentLoaded < 100) {
            progress.style.width = percentLoaded + '%';
            progress.textContent = percentLoaded + '%';
        }
    }
}


function convertBinaryDataToNumbers(evt) {

    var opt_startByte = parseInt(document.getElementById('dataStartByte').value);
    var opt_stopByte = parseInt(document.getElementById('dataEndByte').value);
    var size = opt_stopByte - opt_startByte;

    if (evt.target.readyState == FileReader.LOADING) { // DONE == 2

        updateProgress(evt);

        //store the binary array buffer in the buff variable
        var buff = evt.target.result;

        //create a new instance of the jDataView
        var dv = new jDataView(buff);

        var linArray = new Array();
        var mat3D = new Array();
        var posArray = 0;
        var posMat = 0;
        var ini = 0;
        var end = size / 4;

        for (var k = ini; k < end; k++) {

            var offset = k * 4;
            var numberRead;

            //document.write("<br>["+k+"] offset "+offset);

            try {
                numberRead = dv.getFloat32(offset, false);
                //document.write(" # number "+numberRead);
            } catch (e) {
                numberRead = 0;
                //document.write(" # number NULL "+numberRead+" exc "+e.stack);
            }

            linArray[posArray] = numberRead;
            posArray++;

            if (posArray == 4) {

                // Validate line to display only atoms that have 1 in the 4th column
                if (validateLine(linArray) == true) {
                    mat3D[posMat] = linArray;
                    posMat++;
                }

                linArray = new Array(4);
                posArray = 0;

            }
        }

        gbMat3D = mat3D;
        drawFile(mat3D);
        //writeMat(mat3D);
        progress = document.querySelector('.percent');
        progress.style.visible = false;
    }
}

function readBlob(opt_startByte, opt_stopByte) {

    var files = document.getElementById('files').files;
    var file = files[0];
    var size = file.size;
    var sizeRead = opt_stopByte - opt_startByte;
    var start = parseInt(opt_startByte);
    var stop = parseInt(opt_stopByte);

    var reader = new FileReader();
    var blob;

    //progress = document.getElementById('percent');
    //progress = document.querySelector('.percent');

    // Reset progress indicator on new file selection.
    //progress.style.width = '0%';
    //progress.textContent = '0%';

    reader.onprogress = convertBinaryDataToNumbers; //updateProgress;		
    reader.onerror = errorHandler;

    reader.onloadstart = function (e) {
        document.getElementById('progress_bar').className = 'loading';
    };

    // If we use onloadend, we need to check the readyState.
    //reader.onloadend = convertBinaryDataToNumbers;
    reader.onloadend = function (e) {
        progress = document.getElementById('percent');
        progress = document.querySelector('.percent');
        progress.style.width = '100%';
        progress.textContent = '100%';
    }

    if (file.slice) {
        var blob = file.slice(start, stop);
    } else if (file.mozSlice) {
        var blob = file.mozSlice(start, stop);
    } else if (file.webkitSlice) {
        var blob = file.webkitSlice(start, stop);
    }

    reader.readAsBinaryString(blob);
    //reader.readAsBinaryString(file);

}


function readBytesClick() {
    progress = document.querySelector('.percent');

    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    var startByte = parseInt(document.getElementById('dataStartByte').value);
    var endByte = parseInt(document.getElementById('dataEndByte').value);

    readBlob(startByte, endByte);

}

function loadEntireFile() {

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

        readBlob(startByte, endByte);

    }

}


/**
 * Maximum scale will change when you are slicing the reading of a file
 */

function convertCoordMat(mat3D) {

    var mat3DNew = new Array();
    maxScale = 0;

    // Get minimum and maximum numbers
    for (i = 0; i < mat3D.length; i++) {

        var linArray = new Array();
        linArray = mat3D[i];

        curX = linArray[0];
        if (curX < 0)
            curX = curX * -1;

        curY = linArray[1];
        if (curY < 0)
            curY = curY * -1;

        curZ = linArray[2];
        if (curZ < 0)
            curZ = curZ * -1;

        // Biggest between X, Y and Z
        biggest = curX;

        if (curY > biggest)
            biggest = curY;
        if (curZ > biggest)
            biggest = curZ;

        if (biggest > maxScale)
            maxScale = biggest;

    }

    // Convert all the X and Y to points from  -1 to 1
    for (i = 0; i < mat3D.length; i++) {

        var linArray = new Array();
        linArray = mat3D[i];

        var linArrayNew = new Array(4);
        linArrayNew[0] = linArray[0] / maxScale;
        linArrayNew[1] = linArray[1] / maxScale;
        linArrayNew[2] = linArray[2] / maxScale;
        linArrayNew[3] = linArray[3] / maxScale;

        mat3DNew[i] = linArrayNew;

    }

    gbMat3D = new Array();
    gbMat3D = mat3DNew;

    return mat3DNew;

}
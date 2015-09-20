/**
 * @author Daniane
 * octogonalView Receives an array containing 3 dimensions and extract only 2 dimensions from it
 * @param array3D Array with 3 positions, indicating x, y and z
 * @param posIgnore Position to be ignored from array. Ignores the last one when received null
 * @return array2D New array with 2 dimensions
 *
 */
function octhogonalView(array3D, posIgnore) {

    var array2D = new Array();
    arraySize = array3D.length;
    count = 0;

    if (posIgnore == null || posIgnore >= arraySize) {
        posIgnore = arraySize - 1;
    }

    for (i = 0; i < arraySize; i++) {
        if (i != posIgnore) {
            array2D[count] = array3D[i];
            count++;
        }
    }

    return array2D;

}

/**
 * @author Daniane
 * drawPixelsFrom3DMat Receives a matrix with 3 dimensions and draw 2D points on the screen
 * @param mat3D Matrix with 3D values
 * @param canvas
 * @param program
 * @param shapeSizes Size of the shapes to draw
 */
function drawPixelsFrom3DMat(mat3D, canvas, gl, program, shapeSize, posIgnore) {

    var row;

    if (shapeSize == null) {
        shapeSize = 1;
    }

    if (posIgnore == null) {
        posIgnore = 2;
    }

    for (row = 0; row < mat3D.length; ++row) {

        var vetLin = new Array();
        vetLin = mat3D[row];

        array3D = new Array(vetLin[0], vetLin[1], vetLin[2]);
        array2D = octhogonalView(array3D, posIgnore);

        coordX = getPixelsFromCoord(array2D[0], canvas.width, shapeSize);
        coordY = getPixelsFromCoord(array2D[1], canvas.height, shapeSize);

        r = 0;
        g = 0;
        b = 0;

        if (vetLin.length > 4) {
            r = vetLin[4];
            g = vetLin[5];
            b = vetLin[6];

            //alert(r + ","  + g + "," + "," + b);
        }

        drawSquareInPixels(gl, program, coordX, coordY, shapeSize, shapeSize, r, g, b);

    }

}

/**
 * @author Daniane
 * getPixelsFromCoord Convertes coordinates between -1 and 1 to pixels related to the canvas size
 * @param coord Number between -1 and 1
 * @param canvasSize Size of the canvas (width or heght)
 * @param shapeSize Size of the shape that will be draw
 *
 */
function getPixelsFromCoord(coord, canvasSize, shapeSize) {

    coord = parseFloat(coord);
    canvasSize = parseFloat(canvasSize);

    coordPixel = coord * canvasSize;

    if (coordPixel < 0) {
        coordPixel = coordPixel * -1;

        if (coordPixel < canvasSize) {
            coordPixel = canvasSize - coordPixel;
        }

    }

    if (coordPixel > shapeSize) {
        coordPixel = coordPixel - parseFloat(shapeSize);
    }

    return coordPixel;

}


//Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

    // Drawing related to the canvas size
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1,
        y2, x1, y2, x2, y1, x2, y2
    ]), gl.STATIC_DRAW);

}


function toScreenXY(position, camera, div) {
    var pos = position.clone();
    projScreenMat = new THREE.Matrix4();
    projScreenMat.multiply(camera.projectionMatrix,
        camera.matrixWorldInverse);
    projScreenMat.multiplyVector3(pos);

    var offset = findOffset(div);

    return {
        x: (pos.x + 1) * div.width / 2 + offset.left,
        y: (-pos.y + 1) * div.height / 2 + offset.top
    };
}

function findOffset(element) {
    var pos = new Object();
    pos.left = pos.top = 0;
    if (element.offsetParent) {
        do {
            pos.left += element.offsetLeft;
            pos.top += element.offsetTop;
        } while (element = element.offsetParent);
    }
    return pos;
}

function drawSquareInPixels(gl, program, coordX, coordY, width, height, r, g, b) {

    var colorLocation = gl.getUniformLocation(program, "u_color");
    setRectangle(gl, coordX, coordY, width, height);


    if (r == null) r = 1;
    if (g == null) b = 1;
    if (b == null) b = 1;

    // Set a color.
    gl.uniform4f(colorLocation, r, g, b, 1);

    // Draw the square/rectangule
    gl.drawArrays(gl.TRIANGLES, 0, 6);

}


/**
 * This function was used to display only atom with the number 1 in the 4th position.
 * When a range configuration file is used, it doesn't make sense to apply this validation, otherwise, none atoms would be shown
 */
function validateLine(linArray) {

    if (linArray != null && linArray.length == 4) {
        return true;
    }

    return false;

}


function checkSizeFile(id) {

    var files = document.getElementById(id).files;
    if (!files.length) {
        alert('Please select a file!');
        return 0;
    }

    var file = files[0];
    var size = file.size;

    return parseInt(size);

}
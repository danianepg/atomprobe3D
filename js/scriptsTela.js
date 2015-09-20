function validaCampos() {

    pos = document.getElementById('fileType_pos').checked;
    xyz = document.getElementById('fileType_xyz').checked;

    dataStartByte = document.getElementById('dataStartByte');
    dataEndByte = document.getElementById('dataEndByte');
    loadBytes = document.getElementById('loadBytes');
    configFile = document.getElementById('configFile');
    loadConf = document.getElementById('loadConf');

    if (pos == true) {
        habDesab = false;
    } else if (xyz == true) {
        habDesab = true;
    }

    dataStartByte.disabled = habDesab;
    dataEndByte.disabled = habDesab;
    loadBytes.disabled = habDesab;
    configFile.disabled = habDesab;
    loadConf.disabled = habDesab;

}

function habDesabBotoesXyz() {

    persp_0 = document.getElementById('persp_0');
    persp_1 = document.getElementById('persp_1');
    persp_2 = document.getElementById('persp_2');

    habDesab = false;

    persp_0.disabled = habDesab;
    persp_1.disabled = habDesab;
    persp_2.disabled = habDesab;

}

function loadConf2(evt) {
    readRngFile(evt, 'configFile');
    document.getElementById('loadRangeInfo').style.display = 'none';
}

function readPosXyz(readEntireFile) {

	clearScene();
    fileTypePos = document.getElementById("fileType_pos").checked;

    if (fileTypePos == true) {

		if(validaExtensaoPosXyz('pos')) {
			if (readEntireFile == true) {
				loadEntireFile();
			} else {
				readBytesClick();
			}
		}

    } else {
		if(validaExtensaoPosXyz('xyz')) {
			loadEntireFileXYZ();
		}
    }
}

function changeButtonsStyle(perspHide) {

    if (perspHide == 0) {
        document.getElementById('persp_0').className = 'buttonsDisabled';
        document.getElementById('persp_1').className = 'buttons';
        document.getElementById('persp_2').className = 'buttons';

    } else if (perspHide == 1) {
        document.getElementById('persp_0').className = 'buttons';
        document.getElementById('persp_1').className = 'buttonsDisabled';
        document.getElementById('persp_2').className = 'buttons';

    } else if (perspHide == 2) {
        document.getElementById('persp_0').className = 'buttons';
        document.getElementById('persp_1').className = 'buttons';
        document.getElementById('persp_2').className = 'buttonsDisabled';

    }
}

function drawFile(mat3D) {
    createObjects(mat3D);
}

function writeMat(mat3D) {

    document.write("<br> write Mat <br><br>");
    //mat3D = document.getElementById('matData').value;

    if (mat3D != null) {
        document.write(" mat3D.length " + mat3D.length + "<br>");

        for (i = 0; i < mat3D.length; i++) {
            vetLin = mat3D[i];
            for (j = 0; j < vetLin.length; j++) {
                document.write(vetLin[j] + "|");
            }
            document.write("<br> \n");
        }

    } else {
        document.write("<br> mat null");
    }
}

function validaExtensaoPosXyz(tipo) {

	nome = document.getElementById('files').files[0].name;
	posPonto = nome.indexOf(".")+1;
	extensao = nome.substr(posPonto, 3);

	if(extensao == tipo) {
		return true;
	} else {
		alert('Invalid file type!');
		return false;
	}
}

function verificaBrowser() {

	nomedobrowser = window.navigator.appName;
	codigodobrowser = window.navigator.appCodeName;
	//versaodobrowser = window.navigator.appVersion
	//sistema = window.navigator.platform
	//alert(nomedobrowser);
	
	if(codigodobrowser != "Mozilla" ) {
		alert('Your browser does not support this application! Try to use Mozilla Firefox or Google Chrome!');
	}

}

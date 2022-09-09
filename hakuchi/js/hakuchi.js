var g_hakuchi = 0;

//--------------------------------------------------------------------

function loadUTF8(fileName)
{
	var sr = new ActiveXObject('ADODB.Stream');
	sr.Type = 2;
	sr.charset = 'UTF-8';
	sr.Open();
	sr.LoadFromFile(fileName);
	var text = sr.ReadText(-1);
	sr.Close();
	return text;
}

function saveUTF8(fileName, text)
{
	// ファイル関連の操作を提供する（ストリーム）オブジェクトを取得
	var fh = new ActiveXObject( "ADODB.Stream" );
	fh.Type = 2;         // -1:Binary, 2:Text
	fh.charset = "UTF-8";   // Shift_JIS, EUC-JP, UTF-8、等々
	fh.LineSeparator = 10;  // ' -1 CrLf , 10 Lf , 13 Cr
	fh.Open();
	fh.WriteText(text, 1);  // 第2引数が 0:改行なし, 1:改行あり

	// BOMなしのバイナリデータを取得
	fh.Position = 0;
	fh.Type = 1; 
	fh.Position = 3;
	var bin = fh.Read();
 
	// 一旦ストリームをクローズ＆オブジェクトを破棄
	fh.Close();
	fh = null;
 
	// 新たにストリームオブジェクトを作り直して
	fh = new ActiveXObject( "ADODB.Stream" );
	fh.Type = 1; // バイナリモードに設定して
	fh.Open();
	fh.Write(bin);  // 退避しておいたデータを読み込み直して
	fh.SaveToFile(fileName, 2);
	fh.Close();
	fh = null;
}

//--------------------------------------------------------------------

function mkdir_r(path) {
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var make_r = function (path) {
    var parent = fso.GetParentFolderName(path);
    if (parent != "" && !fso.FolderExists(parent)) {
      make_r(parent);
    }
    if (!fso.FolderExists(path)) {
      try { fso.CreateFolder(path); } catch (e) { }
    }
  };
  make_r(path);
}

function moveFile(src, dst)
{
	var fso = new ActiveXObject("Scripting.FileSystemObject");

	var dir = fso.GetParentFolderName(dst);
	mkdir_r(dir);

	if (fso.FolderExists(src))
	{
		fso.MoveFolder(src, dst);
	}
	else if (fso.FileExists(src))
	{
		fso.MoveFile(src, dst);
	}
}

function backupFile(path)
{
	moveFile(path, 'backup\\' + path);
}

function restoreFile(path)
{
	moveFile('backup\\' + path, path);
}

function loadFile()
{
	var fileName = 'metas.json';

	try {
		var to_json = loadUTF8(fileName);
		var json = JSON.parse(to_json);
	} catch (e) {
		alert(fileName + ' を開けませんでした');
		return;
	}

	$('.style').each(function(index)
	{
		var id = g_hakuchi.styles[index].styleId;

		function hasId(id)
		{
			for (var i in json.styles) {
				if (json.styles[i].styleId == id)
					return true;
			}

			return false;
		}

		if (hasId(id)) {
			$(this).removeClass('inactive');
		}
		else {
			$(this).addClass('inactive');
		}
	});
}

function saveFile()
{
	var fileName = 'metas.json';

	// JSON オブジェクトを作成する。
	var json =
	{
		"speakerName": g_hakuchi.speakerName,
		"speakerUuid": g_hakuchi.speakerUuid,
		"styles": []
	};

	$('.style').each(function(index)
	{
		if ($(this).hasClass('inactive'))
		{
			var id = g_hakuchi.styles[index].styleId;

			backupFile('icons\\' + id + '.png');
			backupFile('voice_samples\\' + id + '_001.wav');
			backupFile('voice_samples\\' + id + '_002.wav');
			backupFile('voice_samples\\' + id + '_003.wav');
			backupFile('model\\' + id);
		}
		else
		{
			var id = g_hakuchi.styles[index].styleId;

			restoreFile('icons\\' + id + '.png');
			restoreFile('voice_samples\\' + id + '_001.wav');
			restoreFile('voice_samples\\' + id + '_002.wav');
			restoreFile('voice_samples\\' + id + '_003.wav');
			restoreFile('model\\' + id);

			var style =
			{
				"styleName": g_hakuchi.styles[index].styleName,
				"styleId": g_hakuchi.styles[index].styleId
			};

			json.styles.push(style);
		}
	});

	// JSON オブジェクトを JSON 文字列に変換する。
	var from_json = JSON.stringify(json, null , '\t');

	// JSON 文字列をファイルに保存する。
	saveUTF8(fileName, from_json);
}

$(function(){

$(document).ready(function()
{
	// カレントディレクトリを変更する。
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var shell = new ActiveXObject('WScript.Shell');
	var path = document.URL.replace('file://', '');
	path = fso.GetFile(path).ParentFolder.ParentFolder.Path;
	shell.currentDirectory = path;

	// オリジナルの metas.json を読み込む。

	var fileName = 'hakuchi\\orig_metas.json';

	try {
		// JSON 文字列を読み込む。
		var to_json = loadUTF8(fileName);
		// JSON 文字列を JSON オブジェクトに変換する。
		g_hakuchi = JSON.parse(to_json);
	} catch (e) {
		alert(fileName + ' を開けませんでした');
		return;
	}

	var html = '';

	for (var i in g_hakuchi['styles'])
	{
		var style = g_hakuchi['styles'][i];

		if (1)
		{
			html += '<div class="style">';
			html += '<span>' + style.styleName + '</span>';
			html += '</div>';
		}
		else
		{
			html += '<span class="tooltip">';
			html += '<div class="style">';
			html += '<span>' + style.styleName + '</span>';
			html += '</div>';
			html += '<div class="tooltip-text">' + style.styleId + '</div>';
			html += '</span>';
		}
	}

	$('#styles').html(html);

	$('.style').click(function()
	{
		$(this).toggleClass('inactive');
	});

	// ファイルを読み込む。
	loadFile();
});

$('#load').click(function()
{
	loadFile();
});

$('#save').click(function()
{
	saveFile();
});

$('input[type="reset"]').click(function()
{
	$('.style').each(function()
	{
		$(this).removeClass('inactive');
	});
});

});

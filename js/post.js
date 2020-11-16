var postData = null;
var pushed = false;

function getRank() {
	var thing = new XMLHttpRequest();
	thing.open("GET", "https://api.stibarc.com/getuser.sjs?id=" + window.localStorage.getItem("username"), false);
	thing.send(null);
	var postData = thing.responseText;
	var tmp = postData.split("\n");
	var rank = tmp[4].split(":")[1];
	return rank;
}

function postcomment(id) {
	try {
	var again = window.localStorage.getItem("cancommentagain");
	if (again == null || again == "" || again == undefined) again = 0;
	var content = document.getElementById("comtent").value;
	if (content != "" && content != undefined && title != "" && title != undefined) {
		if (new Date().getTime() >= again) {
			pushed = true;
			var n = new Date().getTime() + 15000;
			window.localStorage.setItem("cancommentagain", n);
			//var cookie = toJSON(document.cookie);
			//var sess = cookie.sess;
			document.getElementById("comtent").value = "";
			var sess = window.localStorage.getItem("sess");
			var thing = new XMLHttpRequest();
			thing.open("POST", "https://api.stibarc.com/newcomment.sjs", false);
			thing.send("sess=" + sess + "&postid=" + id + "&content=" + encodeURIComponent(content).replace(/%0A/g, "%0D%0A"));
			location.reload();
		} else {
			var left = again - new Date().getTime();
			left = Math.round(left/1000);
			document.getElementById("wait").innerHTML = "Please wait " + left + " more seconds before posting again";
			document.getElementById("wait").style.display = "";
		}
	}
	} catch(err) {
		senderr(err);
	}
}

function getAttach(postData) {
	var images = ["png","jpg","gif","webp","svg"];
	var videos = ["mov","mp4","m4a","webm"];
	var audio = ["spx","m3a","wma","wav","mp3"];
	$("attachmentBtn").style.display = "none";
	if (postData['real_attachment'] != undefined && postData['real_attachment'] != "" && postData['real_attachment'] != "none") {
		var ext = postData['real_attachment'].split(".")[1];
		if (images.indexOf(ext) != -1) {
			var img = document.createElement("IMG");
			img.setAttribute("id", "image");
			img.setAttribute("src", "https://cdn.stibarc.com/images/"+postData['real_attachment']);
			$("attachment").appendChild(img);
		} else if (videos.indexOf(ext) != -1) {
			var video = document.createElement("VIDEO");
			video.setAttribute("controls", null);
			video.setAttribute("autoplay", null);
			video.setAttribute("id", "image");
			var source = document.createElement("SOURCE");
			source.setAttribute("src", "https://cdn.stibarc.com/images/"+postData['real_attachment']);
			video.appendChild(source);
			$("attachment").appendChild(video);
		} else if (audio.indexOf(ext) != -1) {
			var audio = document.createElement("AUDIO");
			audio.setAttribute("controls", null);
			audio.setAttribute("autoplay", null);
			audio.setAttribute("id", "image");
			var source = document.createElement("SOURCE");
			source.setAttribute("src", "https://cdn.stibarc.com/images/"+postData['real_attachment']);
			audio.appendChild(source);
			$("attachment").appendChild(audio);
		} else {
			$("attachmentBtn").style.display = "";
			window.open("https://cdn.stibarc.com/images/"+postData['real_attachment']);
		}
	} else {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onload = function() {
            var media = xmlHttp.responseText;
            if (media.substring(5,10) == "image") {
                var img = document.createElement("IMG");
                img.setAttribute("id", "image");
                img.setAttribute("src", media);
                $("attachment").appendChild(img);
            } else if (media.substring(5,10) == "video" || media.substring(5,20) == "application/mp4") {
                var video = document.createElement("VIDEO");
                video.setAttribute("controls", null);
                video.setAttribute("autoplay", null);
                video.setAttribute("id", "image");
                var source = document.createElement("SOURCE");
                source.setAttribute("src", media);
                video.appendChild(source);
                $("attachment").appendChild(video);
            } else if (media.substring(5,10) == "audio" || media.substring(5,20) == "application/mp3" || media.substring(5,20) == "application/wav") {
                var audio = document.createElement("AUDIO");
                audio.setAttribute("controls", null);
                audio.setAttribute("autoplay", null);
                audio.setAttribute("id", "image");
                var source = document.createElement("SOURCE");
                source.setAttribute("src", media);
                audio.appendChild(source);
                $("attachment").appendChild(audio);
            } else {
                $("attachmentBtn").style.display = "";
                window.open(media);
            }
        }
		xmlHttp.open("GET", "https://api.stibarc.com/getimage.sjs?id="+postData['attachment'], true);
		xmlHttp.send();
	}
}

function replyto(guy) {
	var sess = window.localStorage.getItem("sess");
	if (sess != undefined && sess != "" && sess != null) {
		$("comtent").value = $("comtent").value + "@" + guy + " ";
		$("comtent").focus();
	} else {
		location.href="login.html?redir=post.html%3Fid%3D"+getAllUrlParams().id;
	}
}

function reloadvotes() {
	var id = getAllUrlParams().id;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.com/v2/getpost.sjs?id="+id, true);
	xmlHttp.onload = function() {
		var data = JSON.parse(xmlHttp.responseText);
		$("upvotes").innerHTML = data['upvotes'];
		$("downvotes").innerHTML = data['downvotes'];
	}
	xmlHttp.send();
}

function upvote() {
	var sess = window.localStorage.getItem("sess");
	var id = getAllUrlParams().id;
	if (sess != undefined && sess != "") {
		var xhr = new XMLHttpRequest();
		xhr.open("post", "https://api.stibarc.com/upvote.sjs", true);
		xhr.onload = function() {
			reloadvotes();
		}
		xhr.send("id="+id+"&sess="+sess);
	}
}

function downvote() {
	var sess = window.localStorage.getItem("sess");
	var id = getAllUrlParams().id;
	if (sess != undefined && sess != "") {
		var xhr = new XMLHttpRequest();
		xhr.open("post", "https://api.stibarc.com/downvote.sjs", true);
		xhr.onload = function(evt) {
			reloadvotes();
		}
		xhr.send("id="+id+"&sess="+sess);
	}
}

function doneLoading() {
    $("load").style.display = "none";
    $("page").style.display = "";
}

function greenify() {
	var content = $("postContent").innerHTML;
	var tmp = content.split("<br>");
	for (var i = 0; i < tmp.length; i++) {
		if (tmp[i].split("")[0] == "&" && tmp[i].split("")[1] == "g" && tmp[i].split("")[2] == "t" && tmp[i].split("")[3] == ";" && tmp[i].split("")[4] != " ") {
			console.log(i);
			tmp[i] = '<span style="color:green;">'+tmp[i]+"</span>"
		}
	}
	$("postContent").innerHTML = tmp.join("<br>");
}

var emojiIndex = {};

function emojis() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onload = function() {
		emojiIndex = JSON.parse(this.responseText);
		var content = $("postContent").innerHTML;
		var title = $("postTitle").innerHTML;
		for (var emoji in emojiIndex) {
			var re = new RegExp("\\:"+emoji+"\\:","g");
			content = content.replace(re, '<img src="https://cdn.stibarc.com/emojis/'+emojiIndex[emoji].filename+'" class="emoji" title=":'+emoji+':"></img>');
			title = title.replace(re, '<img src="https://cdn.stibarc.com/emojis/'+emojiIndex[emoji].filename+'" class="emoji" title=":'+emoji+':"></img>');
		}
		$("postContent").innerHTML = content;
		$("postTitle").innerHTML = title;
	}
	xmlHttp.open("GET","https://cdn.stibarc.com/emojis/index.json", true);
	xmlHttp.send("");
}

function emojiComment(commentText) {
	for (var emoji in emojiIndex) {
		var re = new RegExp("\\:"+emoji+"\\:","g");
		commentText = commentText.replace(re, '<img src="https://cdn.stibarc.com/emojis/'+emojiIndex[emoji].filename+'" class="emoji" title=":'+emoji+':"></img>');
	}
	return commentText;
}

window.onload = function () {
	var id = getAllUrlParams().id;
	loadPost(id);
	loadComments(id);
}

function loadComments(id) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onload = function() {
		if (xmlHttp.responseText != "undefined\n") {
			var comments = JSON.parse(xmlHttp.responseText);
			var commentsHTML = '';
			for (var key in comments) {
				var image = "";
				image = '<img src="' + comments[key].pfp + '"style="width:48px;height:48px;border-radius:50%;vertical-align:middle;margin-right:5px;" />';
				commentsHTML += '<div id="comment"><div><a class="comment-username" href="user.html?id=' + comments[key]['poster'] + '">'+image+comments[key]['poster'].replace(/&/g, "&amp;") + '</a></div><div>' + emojiComment(comments[key]['content'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n/g, "<br/>")) + '</div><a class="replyto" href="javascript:replyto('+"'"+comments[key]['poster']+"'"+')"><i>Reply</i></a></div><br/>';
			}
			$('comments').innerHTML = commentsHTML;
		} else {
			$("comments").innerHTML = document.getElementById("comments").innerHTML + '<div id="comment">No comments</div>';
		}
	}
	xmlHttp.open("GET", "https://api.stibarc.com/getcomments.sjs?id=" + id, true);
	xmlHttp.send(null);
}

var htmlAbleUsernames = ["herronjo", "DomHupp", "Aldeenyo", "savaka", "alluthus", "Bunnbuns", "Merkle"];

function buildPost(data, id) {
    document.title = data.title + " - STiBaRC";
    $("postTitle").innerHTML = data.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    $("postUsername").innerHTML = '<a href="user.html?id=' + data.poster + '">' + data.poster + '</a><span id="verified" title="Verified user" style="display:none">' + "&#10004;&#65039;</span>";
    $("postDate").innerHTML = data.postdate;
    getUserPfp('post', data.poster);
    if (htmlAbleUsernames.indexOf(data.poster) > -1) {
        $("postContent").innerHTML = data.content.replace(/\r\n/g, "<br/>");
    } else {
        $("postContent").innerHTML = data.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n/g, "<br/>");
	}
	if (data['edited'] == true) {
		$("edited").style.display = "";
	}
	if (data.poster == window.localStorage.username) {
		$("editlinkcontainer").style.display = "";
		$("editlink").href = "editpost.html?id=" + id;
	}
	if (data["attachment"] != "none" && data["attachment"] != undefined && data["attachment"] != null) {
		$("attachment").style.display = "";
	}
	$("upvotes").innerHTML = postData['upvotes'];
	$("downvotes").innerHTML = postData['downvotes'];
	if (data.client != undefined) {
		$("client").innerHTML = "<i>Posted using "+data.client+"</i>";
		$("client").style.display = "";
	}
}

function loadPost(id){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function() {
        postData = JSON.parse(xmlHttp.responseText);
		buildPost(postData, id);
		emojis();
		greenify();
    };
    xmlHttp.open("GET", "https://api.stibarc.com/v2/getpost.sjs?id=" + id, true);
    xmlHttp.send();
}
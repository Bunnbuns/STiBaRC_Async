$("global").onclick = function() {
    $("blob").style.display = "";
    $("followblob").style.display = "none";
    $("global").classList.add("unsel");
    $("global").classList.remove("sel");
    $("followed").classList.add("sel");
    $("followed").classList.remove("unsel");
}
$("followed").onclick = function() {
    $("blob").style.display = "none";
    $("followblob").style.display = "";
    $("global").classList.add("sel");
    $("global").classList.remove("unsel");
    $("followed").classList.add("unsel");
    $("followed").classList.remove("sel");
}

function emojiPost(text) {
	for (var emoji in emojiIndex) {
		var re = new RegExp("\\:"+emoji+"\\:","g");
		text = text.replace(re, '<img src="https://cdn.stibarc.com/emojis/'+emojiIndex[emoji].filename+'" class="emoji" title=":'+emoji+':"></img>');
	}
	return text;
}

var postsHTML = '';
function toLink(id, item){
    try{
        if (item["deleted"]){
            item["title"] = "Post deleted";
        }
        var title = item['title'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        postsHTML += '<div class="post" onclick="goToPost('+id+');"><a style="font-size:100%;text-decoration:none;" href="post.html?id='+id+'"><b>'+emojiPost(title)+'</b></a><div class="meta"><span>Posted by: <a href="user.html?id='+item['poster']+'">'+item['poster']+'</a><br>&#8679; '+item['upvotes']+' &#8681; '+item['downvotes']+'</a></span></div></div>';
        lastid = id;
      
    }catch (err){
        console.log(err);
    }
}

var toFollowHTML = "";
function toFollowLink(id, item) {
	try {
		if (item['deleted']) {item['title'] = "Post deleted"}
		var title = item['title'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        toFollowHTML += '<div class="post" onclick="goToPost('+id+');"><a style="font-size:100%;text-decoration:none;" href="post.html?id='+id+'"><b>'+emojiPost(title)+'</b></a><div class="meta"><span>Posted by: <a href="user.html?id='+item['poster']+'">'+item['poster']+'</a><br>&#8679; '+item['upvotes']+' &#8681; '+item['downvotes']+'</a></span></div></div>';
		lastfollowid = id;
	} catch (err) {
		console.log(err);
	}
}


function loadPosts(){
    $("posts").innerHTML = '<center><div id="load" style="display: block;"> <div class="loader"></div> </div></center>';
    updateEmojiIndex();
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var tmp = JSON.parse(this.responseText);
        $("posts").innerHTML = '';
        $("loadmorecontainer").style.display = "";
		for (var i = tmp['totalposts']; i > tmp['totalposts']-20; i--) {
			toLink(i,tmp[i]);
        }
        $("posts").innerHTML = postsHTML;
    };
    xhttp.open("GET", "https://api.stibarc.com/v2/getposts.sjs", true);
    xhttp.send();
}

function loadFollowedPosts() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.responseText != "No posts\n") {
            var followtmp = JSON.parse(this.responseText);
            $("followedposts").innerHTML = "";
            var tmpposts = [];
            for (var key in followtmp) {
                tmpposts.push(key);
            }
            for (var i = tmpposts.length-1; i >= 0; i--) {
                toFollowLink(tmpposts[i], followtmp[tmpposts[i]]);
            }
            $("followedposts").innerHTML = toFollowHTML;
            $("followloadmorecontainer").style.display = "";
        } else {
            $("followedposts").innerHTML = "It looks like you aren't following anyone, or nobody has posted yet.";
        }
    }
    xhttp.open("get", "https://api.stibarc.com/v3/getfollowposts.sjs?sess="+sess, true);
    xhttp.send(null);
}

var lastid = 1;
var lastfollowid = 1;

function loadMore() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.responseText.trim() != "") {
            var tmp = JSON.parse(this.responseText);
            var tmp2 = lastid-1;
            for (var i = tmp2; i > tmp2-20; i--) {
                toLink(i,tmp[i]);
            }
            $("posts").innerHTML = postsHTML;
        } else {
            $("loadmorecontainer").style.display = "none";
        }
    }
    xhttp.open("GET", "https://api.stibarc.com/v2/getposts.sjs?id="+lastid, true);
	xhttp.send(null);
}

function loadMoreFollow() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.responseText.trim() != "No posts") {
            var tmp = JSON.parse(this.responseText);
            var tmp2 = [];
            for (var i in tmp) {
                tmp2.push(i);
            }
            for (var i = tmp2.length-1; i >= 0; i--) {
                toFollowLink(tmp2[i],tmp[tmp2[i]]);
            }
            $("followedposts").innerHTML = toFollowHTML;
        } else {
            $("followloadmorecontainer").style.display = "none";
        }
    }
    xhttp.open("GET", "https://api.stibarc.com/v3/getfollowposts.sjs?sess="+sess+"&id="+lastfollowid, true);
	xhttp.send(null);
}

loadPosts();
if (sess != undefined && sess != null && sess != "") {
    loadFollowedPosts();
}

if(loggedIn){
    $('loggedOutHero').style.display = "none";
    $('feedselect').style.display = "";
}else{
    $('loggedOutHero').style.display = "block";
}
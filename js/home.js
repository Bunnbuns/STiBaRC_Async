
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
        //posts = posts.concat('<a class="post" " href="post.html?id=').concat(id).concat('"><b>').concat().concat('</b><div class="1"></div>&#8679; "+item['upvotes']+" &#8681; "+item['downvotes']'+"</a>"+'<div class="2">Posted by: <a href="user.html?id=').concat(item['poster']).concat('">').concat(item['poster']).concat("</a></div>");
        //
        //document.getElementById("list").innerHTML = document.getElementById("list").innerHTML.concat('<div class="post"><a style="font-size:100%;text-decoration:none;" href="post.html?id=').concat(id).concat('"><b>').concat(item['title'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")).concat('</b></a><br/>Posted by: <a href="user.html?id=').concat(item['poster']).concat('">').concat(item['poster']).concat("</a><br/>&#8679; "+item['upvotes']+" &#8681; "+item['downvotes']+"</div><br/>");
        //
        postsHTML += '<div class="post" onclick="goToPost('+id+');"><a style="font-size:100%;text-decoration:none;" href="post.html?id='+id+'"><b>'+emojiPost(title)+'</b></a><div class="meta"><span>Posted by: <a href="user.html?id='+item['poster']+'">'+item['poster']+'</a><br>&#8679; '+item['upvotes']+' &#8681; '+item['downvotes']+'</a></span></div></div>';
        lastid = id;
      
    }catch (err){
        console.log(err);
    }
}

function loadPosts(){
    $("posts").innerHTML = '<center><h2>Loading...</h2></center>';
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

loadPosts();

if(loggedIn){
    $('loggedOutHero').style.display = "none";
}else{
    $('loggedOutHero').style.display = "block";
}
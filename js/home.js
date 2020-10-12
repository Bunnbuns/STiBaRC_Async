var posts = '<h2 style="margin-top:.5rem;">Latest posts</h2>';
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
        posts += '<div class="post"><a class="overlay" style="font-size:100%;text-decoration:none;" href="post.html?id='+id+'"><b>'+title+'</b></a><div class="inner"><br>Posted by: <a href="user.html?id='+item['poster']+'">'+item['poster']+'</a><br>&#8679; '+item['upvotes']+' &#8681; '+item['downvotes']+'</a></div></div>';
        lastid = id;
      
    }catch (err){
        console.log(err);
    }
}

function loadPosts(){
    $("posts").innerHTML = '<h2 style="margin-top:.5rem;">Latest posts</h2><center><h2>Loading...</h2></center>';
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var tmp = JSON.parse(xhttp.responseText);
		$("posts").innerHTML = '';
		for (var i = tmp['totalposts']; i > tmp['totalposts']-20; i--) {
			toLink(i,tmp[i]);
        }
        $("posts").innerHTML = posts;
    };
    xhttp.open("GET", "https://api.stibarc.com/v2/getposts.sjs", true);
    xhttp.send();
}

loadPosts();

if(loggedIn){
    $('loggedOutHero').style.display = "none";
}else{
    $('loggedOutHero').style.display = "block";
}
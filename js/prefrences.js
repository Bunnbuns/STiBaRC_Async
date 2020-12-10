function loadPrefrences(){
    try {
        $("themechng").value = localStorage.getItem("theme");
        $("themecust").value = localStorage.getItem("customtheme");
        if(localStorage.getItem("theme") == undefined){
            $("themechng").value = "auto";
        }
        if (localStorage.getItem("theme") != "custom") {
            $("themecust").style.display = "none";
        } else {
            $("themecust").style.display = "";
        }
    } catch(err){}

    $("themechng").onchange = function() {
        var value = $("themechng").value;
        localStorage.setItem("theme", value);
        if (value != "custom") {
            $("themecust").style.display = "none";
            loadTheme();
        } else {
            $("themecust").style.display = "";
        }
    }

    $("submit").onclick = function() {
        var value = $("themecust").value;
        localStorage.setItem("customtheme", value);
        if (value.trim() != "") {
            loadTheme();
        }
        document.location = "index.html";
    }

    $("logout").onclick = function(){
        logout();
    }

    $("ssk").onclick = function(){
        if (confirm("Are you sure?") == true) {
            $('ssk').style.display = 'none';
            $('sska').innerHTML = localStorage.getItem('sess');
        } else {
            
        }
    }
}
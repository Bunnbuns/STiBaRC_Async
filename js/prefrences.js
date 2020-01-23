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

    $("themechng").onchange = function(evt) {
        var value = $("themechng").value;
        localStorage.setItem("theme", value);
        if (value != "custom") {
            $("themecust").style.display = "none";
            loadTheme();
        } else {
            $("themecust").style.display = "";
        }
    }

    $("submit").onclick = function(evt) {
        var value = $("themecust").value;
        localStorage.setItem("customtheme", value);
        if (value.trim() != "") {
            loadTheme();
        }
        document.location = "index.html";
    }

    $("logout").onclick = function(evt){
        logout();
    }
}
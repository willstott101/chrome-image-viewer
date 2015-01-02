// Take your time with snazzy stuff.
chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
        console.timeEnd("before");

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
        
        var img = document.img = document.getElementsByTagName("img")[0];
        
        // Viewport dimensions
        document.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 30;
        document.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 30;
        
        // Image dimensions
        // width & height don't work because chrome changes them.
        img.w = img.naturalWidth;
        img.h = img.naturalHeight;
        
        // Aspect ratios: Bigger is wider.
        img.r = img.w/img.h;
        document.r = document.w/document.h;
        
        // Have to set image size in style cause it overrides .width/.height
        // and those are the attributes that chrome sets.
        img.fitHeight = function (limitRealSize) {
            //var w = imgw / imgh * vph; // Fit height formula
            if (this.h > document.h || !limitRealSize) {
                this.style.width = this.r * document.h + "px";
                this.style.height = document.h + "px";
                return "height";
            }
            this.style.width = this.w;
            this.style.height = this.h;
        }
        img.fitWidth = function (limitRealSize) {
            //var h = imgh / imgw * vpw; // Fit width formula
            if (this.w > document.w || !limitRealSize) {
                this.style.width = document.w + "px";
                this.style.height = 1 / this.r * document.w + "px";
                return "width";
            }
            // Actual size
            this.style.width = this.w;
            this.style.height = this.h;
        }
        img.fitEither = function (limitRealSize) {
            if (this.r > document.r) {
                return this.fitWidth(limitRealSize);
            } else {
                return this.fitHeight(limitRealSize);
            }
        }
        img.setScale = function (scale) {
            this.style.width = this.w * scale;
            this.style.height = this.h * scale;
        }
        
        // Fit the image by default
        var fitResult = img.fitEither(true);
        
        // Create control bar.
        var div = document.createElement("div");
        div.className = "out";
        div.innerHTML = "<div class='mid'><div class='mid'><div class='in'><ul><li id='fit-w'></li><li id='fit-h'></li><li id='actual'></li></ul></div></div></div>";
        document.body.appendChild(div);
        var btn_fitW = document.getElementById("fit-w");
        var btn_fitH = document.getElementById("fit-h");
        var btn_actual = document.getElementById("actual");
        
        // Format control bar
        if (fitResult == "height") {
            btn_fitH.className = "active";
            btn_fitW.className = btn_actual.className = "";
        } else if (fitResult == "width") {
            btn_fitW.className = "active";
            btn_fitH.className = btn_actual.className = "";
        } else {
            btn_actual.className = "active";
            btn_fitH.className = btn_fitW.className = "";
        }
        
        // Apply actions to control bar.
        btn_fitH.addEventListener("click", function () {
            img.fitHeight();
            btn_fitH.className = "active";
            btn_fitW.className = btn_actual.className = "";
        });
        btn_fitW.addEventListener("click", function () {
            img.fitWidth();
            btn_fitW.className = "active";
            btn_fitH.className = btn_actual.className = "";
        });
        btn_actual.addEventListener("click", function () {
            img.setScale(1);
            btn_actual.className = "active";
            btn_fitH.className = btn_fitW.className = "";
        });
	}
	}, 10);
});
function getScrollbarSize(force) {
    // Taken from ExtJS: http://extjs-public.googlecode.com/svn/tags/extjs-4.2.1/release/ext-all-debug.js
    var db = document.body,
        div = document.createElement('div');

    div.style.width = div.style.height = '100px';
    div.style.overflow = 'scroll';
    div.style.position = 'absolute';

    db.appendChild(div); 

    var scrollbarSize = {
        width: div.offsetWidth - div.clientWidth,
        height: div.offsetHeight - div.clientHeight
    };

    db.removeChild(div);

    return scrollbarSize;
}

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
        
        var scrollbarSize = getScrollbarSize();
        
        // Viewport dimensions
        document.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - scrollbarSize.width;
        document.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - scrollbarSize.height;
        
        // Image dimensions
        // width & height don't work because chrome changes them.
        img.w = img.naturalWidth;
        img.h = img.naturalHeight;
        
        // Aspect ratios: Bigger is wider.
        img.r = img.w/img.h;
        document.r = document.w/document.h;
        
        // Have to set image size in style cause it overrides el.width/el.height
        // and those are the attributes that chrome sets.
        img.fitHeight = function (limitRealSize) {
            //var w = imgw / imgh * vph; // Fit height formula
            if (!limitRealSize || this.h > document.h) {
                this.style.width = this.r * document.h + "px";
                this.style.height = document.h + "px";
                return "fitH";
            }
            this.style.width = this.w;
            this.style.height = this.h;
            return "full";
        }
        img.fitWidth = function (limitRealSize) {
            //var h = imgh / imgw * vpw; // Fit width formula
            if (!limitRealSize || this.w > document.w) {
                this.style.width = document.w + "px";
                this.style.height = 1 / this.r * document.w + "px";
                return "fitW";
            }
            // Actual size
            this.style.width = this.w;
            this.style.height = this.h;
            return "full";
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
        
        // Fit the image by default (limiting to full size)
        var fitResult = img.fitEither(true);
        
        // Create control bar.
        var div = document.createElement("div");
        div.className = "out";
        div.innerHTML = "<div class='mid'><div class='mid'><div class='in'><ul><li id='fit-w'></li><li id='fit-h'></li><li id='full'></li></ul></div></div></div>";
        document.body.appendChild(div);
        
        var btnGroup = function () {};
        btnGroup.prototype.resetClasses = function () {
            for (name in this) {
                this[name].className = '';
            }
        };
        btnGroup.prototype.setActive = function (btnName) {
            this.resetClasses();
            this[btnName].className = 'active';
        };
        
        var btns = new btnGroup();
        btns.fitW = document.getElementById("fit-w");
        btns.fitH = document.getElementById("fit-h");
        btns.full = document.getElementById("full");
        
        // Format control bar
        btns.setActive(fitResult);
        
        // Apply actions to control bar.
        btns.fitH.addEventListener("click", function () {
            img.fitHeight();
            btns.setActive('fitH');
        });
        btns.fitW.addEventListener("click", function () {
            img.fitWidth();
            btns.setActive('fitW');
        });
        btns.full.addEventListener("click", function () {
            img.setScale(1);
            btns.setActive('full');
        });
	}
	}, 10);
});
// Add EMI content
// var emiBuyButtonUrl = 'http://widgets.platform.emi.com/widget/1.0/';
// var emiBuyButtonUuids = ["c9e456919b824bdeb2e3a326b122db43"];
// var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl.": "http://www.");
// document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
// document.writeln(unescape("%3Cscript src='" + emiBuyButtonUrl + "js/emi_buy_button.js' type='text/javascript'%3E%3C/script%3E"));

var Footer = function(container, prefix) {

    var path = prefix || "files/footer";
    var init = true;
    var emiButton;

    this.id = Footer.multipleInstances;
    var divReplacement = "rome_footer_buy_album-" + this.id;
    var terms          = "rome_terms-" + this.id;
    var privacy        = "rome_privacy-" + this.id;
    var facebook       = "rome_facebook-" + this.id;
    var twitter        = "rome_twitter-" + this.id;
    var credits        = "rome_credits-" + this.id;

    if(!window.screenX && !window.screenY) {
      window.screenX = window.screenLeft;
      window.screenY = window.screenTop;
    }

    var popupPosition = {
      x: (window.screenX + window.innerWidth / 2.0),
      y: (window.screenY + window.innerHeight / 2.0)
    };
    var DEFAULT_POPUP_PROPERTIES = 'menubar=0, resizable=0, location=0, toolbar=0, status=0, scrollbars=1, titlebar=0, left=' + (popupPosition.x - 150) + ', top=' + (popupPosition.y - 300) + ', width=330, height=600';
    var DEFAULT_POPUP_SHARING = 'menubar=0, resizable=0, location=0, toolbar=0, status=0, scrollbars=1, titlebar=0, left=' + (popupPosition.x - 225) + ', top=' + (popupPosition.y - 250) + ', width=550, height=500';

    this.getDomElement = function() {

        return container;

    };

    this.load = function() {

        var EMIBuyButton = EMIBuyButton || null;
        if (EMIBuyButton) {
            emiButton = new EMIBuyButton({

                buttonID: "c9e456919b824bdeb2e3a326b122db43",
                buttonImageUrl: path + "./buy_button-trans.png",
                useVendorImages: true

            }).replaceDiv(divReplacement);

            init = false;

        }

        Footer.handleLinkListeners(document.getElementById(credits), "Credits", DEFAULT_POPUP_PROPERTIES);
        Footer.handleLinkListeners(document.getElementById(privacy), "Privacy", DEFAULT_POPUP_PROPERTIES);
        Footer.handleLinkListeners(document.getElementById(terms), "Terms", DEFAULT_POPUP_PROPERTIES);

        // Footer.handleLinkListeners(document.getElementById(twitter), "Twitter", DEFAULT_POPUP_SHARING);
        // Footer.handleLinkListeners(document.getElementById(facebook), "Facebook", DEFAULT_POPUP_SHARING);

        return this;

    };

    Footer.handleLinkListeners = function(dom, title, properties) {

      if(!properties) {
        properties = DEFAULT_POPUP_PROPERTIES;
      }

			if(dom.addEventListener) {

	      dom.addEventListener("click", function(e) {

					handleDomEvent(this, e);

				}, false);

			} else {

				dom.attachEvent("click", function(e) {

					handleDomEvent(this, e);

				});

			}
      
			function handleDomEvent(d, e) {

				e.preventDefault();
				var url = d.getAttribute("href");
				var win = window.open(url, title, properties);
				return false;

			}

    }

		if(window.addEventListener) {

			window.addEventListener("load", this.load, false);

		} else {

			window.attachEvent("load", this.load);

		}

    // Add html
    var html = ['<div class="rome-footer">',
		'<div class="shout-out">',
		'  <ul>',
		'    <li class="last"><a href="https://gigamaster.github.io/codemo/" title="Codemo Digital Nomad"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0h-.079c-1.66 0-3.239.349-4.667.978l.074-.029A12.269 12.269 0 0 0 3.52 3.523A12.219 12.219 0 0 0 .978 7.251l-.031.079A11.398 11.398 0 0 0 0 11.919v.086v-.004v.079c0 1.66.349 3.239.978 4.667l-.029-.074a12.276 12.276 0 0 0 2.572 3.807a12.224 12.224 0 0 0 3.729 2.542l.079.031c1.354.6 2.933.949 4.593.949h.083h-.004h.079c1.66 0 3.239-.349 4.667-.978l-.074.029a12.276 12.276 0 0 0 3.809-2.573a12.219 12.219 0 0 0 2.542-3.728l.031-.079c.6-1.354.949-2.932.949-4.593v-.158c0-1.66-.349-3.239-.978-4.667l.029.074a12.286 12.286 0 0 0-2.573-3.806A12.219 12.219 0 0 0 16.754.981L16.675.95C15.321.35 13.741 0 12.08 0h-.083zm.64 22.79v-2.087l5.193-2.633a.421.421 0 0 0 .154-.129l.001-.001a.335.335 0 0 0 .059-.191v-.011v.001v-1.186c.225-.082.412-.226.543-.412l.002-.004c.133-.179.214-.404.214-.648v-.118a1.146 1.146 0 0 0-.366-.746l-.001-.001a1.09 1.09 0 0 0-.75-.297h-.022h.001h-.02c-.308 0-.587.127-.786.332c-.205.2-.332.478-.332.787v.021v-.001v.059c.002.03.011.057.024.081v-.001c.013.222.096.423.227.583l-.001-.002c.133.163.304.289.501.364l.008.003v.949l-4.649 2.372v-1.942l2.039-.949a.533.533 0 0 0 .166-.13l.001-.001a.3.3 0 0 0 .071-.194v-3.233l3.793-2.134a.318.318 0 0 0 .142-.141l.001-.002a.407.407 0 0 0 .047-.189v-.901c.223-.079.409-.218.543-.397l.002-.003c.133-.177.214-.401.214-.644v-.04c0-.308-.127-.587-.332-.786a1.066 1.066 0 0 0-.775-.332H18.4a1.082 1.082 0 0 0-.71.366l-.001.001a1.113 1.113 0 0 0-.285.746v.025v-.001v.02c0 .243.08.466.216.646l-.002-.003c.137.182.322.321.538.397l.008.003v.688l-3.818 2.134a.51.51 0 0 0-.129.129l-.001.002a.338.338 0 0 0-.055.184v.017v-.001v3.2l-1.52.711v-6.972l3.2-1.566a.379.379 0 0 0 .153-.141l.001-.002a.347.347 0 0 0 .059-.189V7.04c.223-.079.409-.218.543-.397l.002-.003c.133-.177.214-.401.214-.644v-.021v.001v-.061a.078.078 0 0 0-.024-.057a1.127 1.127 0 0 0-.366-.719l-.001-.001a1.06 1.06 0 0 0-.738-.297h-.128a1.108 1.108 0 0 0-.719.378l-.001.001a1.103 1.103 0 0 0-.297.754v.123c.032.227.12.428.251.596l-.002-.003c.127.167.301.291.502.354l.007.002v.972l-2.656 1.304V5.288c.225-.082.412-.226.543-.412l.002-.004c.133-.179.214-.404.214-.648V4.2c0-.308-.127-.587-.332-.786a1.095 1.095 0 0 0-.787-.332h-.021h.001h-.02c-.308 0-.587.127-.786.332c-.205.2-.332.478-.332.787v.021v-.001v.118c.03.223.119.421.25.583l-.002-.002c.133.163.304.289.501.364l.008.003v6.569l-1.874-.996V7.865a.292.292 0 0 0-.048-.16l.001.001a.87.87 0 0 0-.095-.119l-1.306-.998a.825.825 0 0 0 .07-.196l.001-.006c.015-.067.024-.143.024-.222v-.024c0-.308-.127-.587-.332-.786a1.097 1.097 0 0 0-.786-.331H7.52h.001h-.02c-.308 0-.587.127-.786.332c-.205.2-.332.478-.332.787v.021v-.001v.024c0 .305.125.581.326.78c.2.205.478.332.787.332h.021h-.001h.015a.858.858 0 0 0 .288-.049l-.006.002c.11-.041.2-.081.287-.125l-.015.007l1.162.925v3.035a.29.29 0 0 0 .06.178l-.001-.001a.42.42 0 0 0 .152.129l.002.001l2.419 1.28V15.1l-4.055-1.874l.071-1.47v-.024a.29.29 0 0 0-.06-.178l.001.001a.42.42 0 0 0-.152-.129l-.002-.001l-1.851-.97a.522.522 0 0 0 .024-.157v-.2a1.127 1.127 0 0 0-.366-.719l-.001-.001a1.093 1.093 0 0 0-.752-.299h-.018h.001h-.007c-.305 0-.58.127-.775.332c-.208.2-.338.481-.338.792v.015v-.001v.118c.029.285.164.534.366.71l.001.001c.193.177.451.285.735.285h.131a1.45 1.45 0 0 0 .33-.083l-.01.003c.104-.04.195-.092.275-.156l-.002.002l1.707.88l-.047 1.47v.008c0 .075.017.145.048.208l-.001-.003a.305.305 0 0 0 .164.142l.002.001l4.577 2.134v6.869q-.308 0-.605-.024l-.605-.047l.071-4.364a.349.349 0 0 0-.06-.191l.001.001a.364.364 0 0 0-.175-.142l-.002-.001l-2.87-1.328v-.125c0-.305-.127-.58-.332-.775a1.095 1.095 0 0 0-.787-.332H6.49h.001h-.114a1.082 1.082 0 0 0-.71.366l-.001.001a1.113 1.113 0 0 0-.285.746v.025v-.001v.007c0 .305.127.58.332.775c.195.205.47.332.775.332h.039c.156 0 .305-.033.439-.094l-.007.003c.14-.067.261-.147.369-.242l-.002.002l2.656 1.21v4.008a10.611 10.611 0 0 1-3.534-1.343l.048.027a10.85 10.85 0 0 1-2.773-2.354l-.014-.017a11.1 11.1 0 0 1-1.824-3.112l-.026-.076a10.267 10.267 0 0 1-.676-3.699v-.111c0-1.494.314-2.915.88-4.201l-.026.067a11.06 11.06 0 0 1 2.324-3.44A11.019 11.019 0 0 1 7.73 2.065l.071-.028a10.269 10.269 0 0 1 4.139-.856h.061h-.003h.064c1.494 0 2.915.314 4.201.88l-.067-.026a11.078 11.078 0 0 1 3.44 2.32a11 11 0 0 1 2.296 3.369l.028.071c.54 1.218.854 2.639.854 4.134v.067v-.003v.064c0 1.444-.292 2.82-.82 4.072l.026-.069a11.1 11.1 0 0 1-2.175 3.373l.005-.006a10.852 10.852 0 0 1-3.172 2.32l-.065.028c-1.16.568-2.516.932-3.948 1.009l-.026.001z"></path></svg></a></li>',
		'    <li class="clear">&nbsp;</li>',
		'  </ul>',
		'</div>',
		'<div class="navigation">',
		'  <ul class="primary">',
		'    <li class="first"><a href="./tech" target="_blank">Technology</a></li>',
		'    <li><a id = "' + credits + '" href="./credits.html">Credits</a></li>',
		'    <li><a href="http://romealbum.com/" target="_blank">Rome Album</a></li>',
		'    <li class="clear last">&nbsp;</li>',
		'  </ul>',
		'  <ul class="secondary">',
		'    <li class="first"><a id = "' + terms + '" href="./terms">Terms</a></li>',
		'    <li class="last"><a id = "' + privacy + '" href="./privacy">Privacy</a></li>',
		'    <li class="clear last">&nbsp;</li>',
		'  </ul>',
		'</div>',
		'<div class="clear">&nbsp;</div>',
		'</div>',
		'</div>'].join("\n");

    var css = ['.rome-footer * {',
		'  margin: 0;',
		'  padding: 0;',
		'}',
		'.rome-footer {',
		'  font: 500 10px/18px "FuturaBT-Medium", Arial, sans-serif;',
		'  color: #434343;',
		'  text-transform: uppercase;',
		'  letter-spacing: 1px;',
		'}',
		'.rome-footer .shout-out {',
		'  float: left;',
		'  margin: 0 0 0 18px;',
		'}',
		'.rome-footer .navigation {',
		'  float: right;',
		'  margin: 20px 26px 0 0;',
		'  vertical-align: middle;',
		'}',
		'.rome-footer ul li {',
		'  height: 16px;',
		'  border-right: 1px solid #a0a0a0;',
		'  padding: 0 10px 0 10px;',
		'  width: auto;',
		'  float: left;',
		'  line-height: 18px;',
		'  list-style: none;',
		'}',
		'.rome-footer ul li.last,',
		'.rome-footer ul li.last li {',
		'  border: none;',
		'  padding: 0 0 0 10px;',
		'}',
		'.rome-footer .shout-out ul li {',
		'  margin: 0;',
		'  border: 0;',
		'}',
		'.rome-footer .shout-out li.divider {',
		'  margin: 15px -15px 15px 15px;',
		'  height: 24px;',
		'  border-left: 1px solid #a0a0a0;',
		'  border-right: 0 !important;',
		'}',
		'.rome-footer a img {',
		'  border: 0;',
		'}',
		'.rome-footer .secondary a:link, .rome-footer .secondary a:visited {',
		'  color: #777;',
		'}',
		'.rome-footer a:link, .rome-footer a:visited,',
		'.rome-footer .secondary a:hover, .rome-footer .secondary a:active {',
		'  color: #434343;',
		'  text-decoration: none;',
		'}',
		'.rome-footer a:hover, .rome-footer a:active {',
		'  color: #000;',
		'}',
		'.emi_buy_button_link {',
		'  margin-top: 2px;',
		'  height: 8px;',
		'  line-height: 8px;',
		'  overflow: hidden;',
		'}',
		'.rome-footer .rome_footer_buy_album img {',
		'  display: block;',
		'  margin-top: 0;',
		'}',
		'.rome-footer .rome_footer_buy_album a:hover img {',
		'  margin-top: -8px;',
		'}',
		'.emi_vendor_menu.using_image a:hover img {',
		'  margin-top: 0;',
		'}',
		'.emi_vendor_menu.using_image {',
		'  margin-top: -145px;',
		'  margin-left: -11px;',
		'  padding: 10px;',
		'}',
		'.emi_vendor_menu.using_image * {',
		'  text-transform: none;',
		'}',
		'.emi_vendor_menu.using_image .emi_vendor_link {',
		'  margin-top: 5px;',
		'}',
		'.rome-footer .secondary {',
		'  margin: 10px 0 0 0;',
		'  float: right;',
		'}',
		'.clear {',
		'  clear: both;',
		'  display: block;',
		'  overflow: hidden;',
		'  visibility: hidden;',
		'  width: 0;',
		'  height: 0;',
		'}'].join("\n");

    // Handle dom and html content
    container.innerHTML = html;

    // Append stylesheets
    if (Footer.multipleInstances < 1) {

        var rule = document.createTextNode(css);
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
						style.type = "text/css";

        if (style.styleSheet) {

            style.styleSheet.cssText = rule.nodeValue;

        } else {

          style.appendChild(rule);

        }

        head.appendChild(style);

    }

    Footer.multipleInstances++;
}
Footer.multipleInstances = 0;
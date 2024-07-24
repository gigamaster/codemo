let mediaScanUrl = 'scan.php';

class MediaModal {
	constructor (modal = true)
	{
		this.isInit = false;
		this.isModal = modal;
		
		this.modalHtml = 
		`
		<div class="modal fade modal-full" id="MediaModal" tabindex="-1" role="dialog" aria-labelledby="MediaModalLabel" aria-hidden="true">
		  <div class="modal-dialog modal-xl modal-dialog-scrollable" role="document">
			<div class="modal-content">
			  <div class="modal-header">
				<h5 class="modal-title" id="MediaModalLabel">Media</h5>
                
				<button type="button" class="btn btn-sm" data-bs-dismiss="modal" aria-label="Close">
				  <span aria-hidden="true"><i class="la la-times la-lg"></i></span>
				</button>
			  </div>
			  <div class="modal-body">
	
                       <div class="filemanager">

						<div class="top-right">
                                                
                            <div class="search">
                                                           
                                <input type="search" placeholder="Find a file.." />
                            </div>
                            
                            <button class="btn btn-outline-secondary btn-sm btn-icon me-4 float-end" 
                               data-bs-toggle="collapse" 
                               data-bs-target=".upload" 
                               aria-expanded="false" 
                               >
                               <i class="la la-image la-lg"></i>
                                Upload new file
                            </button>
           
						</div>

						<div class="breadcrumbs"></div>


                        <div class="upload collapse toggle-panel">
                           <h3>Drop or choose files to upload</h3>
                           
                           <input type="file" multiple class=""> 
                        </div>
                    
						<ul class="data"></ul>

						<div class="nothingfound">
							<div class="nofiles"></div>
							<span>No files here.</span>
						</div>

					</div>

			  </div>
			  <div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary save-btn">Add selected</button>
			  </div>
			</div>
		  </div>
		</div>`;
		
		this.response = [],
		this.currentPath = '';
		this.breadcrumbsUrls = [];
		this.filemanager = null;
		this.breadcrumbs = null;
		this.fileList = null;
		this.mediaPath = "/public/media/";
		this.type = "single";
		
	}
	
	addModalHtml()
	{
		if (this.isModal) $("body").append(this.modalHtml);
		$("#MediaModal .save-btn").on("click", () => this.save());
	}
	
	save() 
	{
		let file = $("#MediaModal .files input:checked").eq(0).val();
		$(this.targetInput).val(this.mediaPath + file).trigger("change");
		$(this.targetThumb).attr("src", this.mediaPath + file);
		if (this.isModal) $("#MediaModal").modal('hide');
	}
	
	init()
	{
		if (!this.isInit)
		{
			if (this.isModal) this.addModalHtml();
			this.initGallery();
			this.isInit = true;
		}
	}
	
	open(element)
	{
		this.init();
		this.targetInput = element.dataset.targetInput;
		this.targetThumb = element.dataset.targetThumb;
		if (element.dataset.type) {
			this.type = element.dataset.type;
		}
		
		if (this.isModal) $('#MediaModal').modal('show');
	}


	initGallery() 
	{
		this.filemanager = $('.filemanager'),
		this.breadcrumbs = $('.breadcrumbs'),
		this.fileList = this.filemanager.find('.data');
		let _this = this;

		// Start by fetching the file data from scan.php with an AJAX request
		$.get(mediaScanUrl, function(data) {
		//$.get('/this.filemanager/scan.php', function(data) {
			

			 _this.response = [data],
			 _this.currentPath = '',
			 _this.breadcrumbsUrls = [];

			var folders = [],
				files = [];
				
				
			$(window).trigger('hashchange');	
		});

		// This event listener monitors changes on the URL. We use it to
		// capture back/forward navigation in the browser.

		$(window).on('hashchange', function(){

			_this.goto(window.location.hash);

			// We are triggering the event. This will execute 
			// this function on page load, so that we show the correct folder:

		});


		// Hiding and showing the search box

		this.filemanager.find('.search').click(function(){

			var search = $(this);

			search.find('span').hide();
			search.find('input[type=search]').show().focus();

		});


		// Listening for keyboard input on the search field.
		// We are using the "input" event which detects cut and paste
		// in addition to keyboard input.

		this.filemanager.find('input').on('input', function(e){

			var folders = [];
			var files = [];

			var value = this.value.trim();

			if(value.length) {

				_this.filemanager.addClass('searching');

				// Update the hash on every key stroke
				window.location.hash = 'search=' + value.trim();

			}

			else {

				_this.filemanager.removeClass('searching');
				window.location.hash = encodeURIComponent(_this.currentPath);

			}

		}).on('keyup', function(e){

			// Clicking 'ESC' button triggers focusout and cancels the search

			var search = $(this);

			if(e.keyCode == 27) {

				search.trigger('focusout');

			}

		}).focusout(function(e){

			// Cancel the search

			var search = $(this);

			if(!search.val().trim().length) {

				window.location.hash = encodeURIComponent(_this.currentPath);
				search.hide();
				search.parent().find('span').show();

			}

		});


		// Clicking on folders

		this.fileList.on('click', 'li.folders', function(e){
			e.preventDefault();

			var nextDir = $(this).find('a.folders').attr('href');

			if(_this.filemanager.hasClass('searching')) {

				// Building the this.breadcrumbs

				_this.breadcrumbsUrls = _this.generateBreadcrumbs(nextDir);

				_this.filemanager.removeClass('searching');
				_this.filemanager.find('input[type=search]').val('').hide();
				_this.filemanager.find('span').show();
			}
			else {
				_this.breadcrumbsUrls.push(nextDir);
			}

			window.location.hash = encodeURIComponent(nextDir);
			_this.currentPath = nextDir;
		});


		// Clicking on this.breadcrumbs

		this.breadcrumbs.on('click', 'a', function(e){
			e.preventDefault();

			var index = _this.breadcrumbs.find('a').index($(this)),
				nextDir = _this.breadcrumbsUrls[index];

			_this.breadcrumbsUrls.length = Number(index);

			window.location.hash = encodeURIComponent(nextDir);

		});
	}


		// Navigates to the given hash (path)

		goto(hash) {

			hash = decodeURIComponent(hash).slice(1).split('=');
			let _this = this;

			if (hash.length) {
				var rendered = '';

				// if hash has search in it

				if (hash[0] === 'search') {

					this.filemanager.addClass('searching');
					rendered = _this.searchData(_this.response, hash[1].toLowerCase());

					if (rendered.length) {
						this.currentPath = hash[0];
						this.render(rendered);
					}
					else {
						this.render(rendered);
					}

				}

				// if hash is some path

				else if (hash[0].trim().length) {

					rendered = this.searchByPath(hash[0]);

					if (rendered.length) {

						this.currentPath = hash[0];
						this.breadcrumbsUrls = this.generateBreadcrumbs(hash[0]);
						this.render(rendered);

					}
					else {
						this.currentPath = hash[0];
						this.breadcrumbsUrls = this.generateBreadcrumbs(hash[0]);
						this.render(rendered);
					}

				}

				// if there is no hash

				else {
					console.dir(this.response);
					this.currentPath = this.response[0].path;
					this.breadcrumbsUrls.push(this.response[0].path);
					this.render(this.searchByPath(this.response[0].path));
				}
			}
		}

		// Splits a file path and turns it into clickable breadcrumbs
_
		generateBreadcrumbs(nextDir){
			var path = nextDir.split('/').slice(0);
			for(var i=1;i<path.length;i++){
				path[i] = path[i-1]+ '/' +path[i];
			}
			return path;
		}


		// Locates a file by path

		searchByPath(dir) {
					console.dir(dir);

			var path = dir.split('/'),
				demo = this.response,
				flag = 0;

			for(var i=0;i<path.length;i++){
				for(var j=0;j<demo.length;j++){
					if(demo[j].name === path[i]){
						flag = 1;
						demo = demo[j].items;
						break;
					}
				}
			}

			//demo = flag ? demo : [];
			return demo;
		}


		// Recursively search through the file tree

		searchData(data, searchTerms) {

			let _this = this;
			let folders = [];
			let files = [];

			let _searchData = function (data, searchTerms) { 
				data.forEach(function(d){
					if(d.type === 'folder') {

						_searchData(d.items,searchTerms);

						if(d.name.toLowerCase().indexOf(searchTerms) >= 0) {
							folders.push(d);
						}
					}
					else if(d.type === 'file') {
						if(d.name.toLowerCase().indexOf(searchTerms) >= 0) {
							files.push(d);
							console.log(d);
						}
					}
				});
			};
			
			_searchData(data, searchTerms);
			
			return {folders: folders, files: files};
		}


		// Render the HTML for the file manager

		render(data) {


			var scannedFolders = [],
				scannedFiles = [];

			if(Array.isArray(data)) {

				data.forEach(function (d) {

					if (d.type === 'folder') {
						scannedFolders.push(d);
					}
					else if (d.type === 'file') {
						scannedFiles.push(d);
					}

				});

			}
			else if(typeof data === 'object') {

				scannedFolders = data.folders;
				scannedFiles = data.files;

			}


			// Empty the old result and make the new one

			this.fileList.empty();//.hide();
			if(!scannedFolders.length && !scannedFiles.length) {
				this.filemanager.find('.nothingfound').show();
			}
			else {
				this.filemanager.find('.nothingfound').hide();
			}

			let _this = this;
			
			if(scannedFolders.length) {

				scannedFolders.forEach(function(f) {

					var itemsLength = f.items.length,
						name = _this.escapeHTML(f.name),
						icon = '<span class="icon folder"></span>';

					if(itemsLength) {
						icon = '<span class="icon folder full"></span>';
					}

					if(itemsLength == 1) {
						itemsLength += ' item';
					}
					else if(itemsLength > 1) {
						itemsLength += ' items';
					}
					else {
						itemsLength = 'Empty';
					}

					var folder = $('<li class="folders"><a href="'+ f.path +'" title="'+ f.path +'" class="folders">'+icon+'<div class="info"><span class="name">' + name + '</span> <span class="details">' + itemsLength + '</span></div></a></li>');
					folder.appendTo(_this.fileList);
				});

			}

			if(scannedFiles.length) {

				scannedFiles.forEach(function(f) {

					var fileSize = _this.bytesToSize(f.size),
						name = _this.escapeHTML(f.name),
						fileType = name.split('.'),
						icon = '<span class="icon file"></span>';

					fileType = fileType[fileType.length-1];
					
					if (fileType == "jpg" || fileType == "png") {
						//icon = '<div class="image" style="background-image: url(' + _this.mediaPath + f.path + ');"></div>';
						icon = '<img class="image" loading="lazy" src="' + _this.mediaPath + f.path + '">';
					} else {
						icon = '<span class="icon file f-'+fileType+'">.'+fileType+'</span>';
					}
					//icon = '<span class="icon file f-'+fileType+'">.'+fileType+'</span>';

					var file = $('<li class="files">\
									<label class="form-check">\
									  <input type="' + ((_this.type == "single") ? "radio" : "checkbox") + '" class="form-check-input" value="' + f.path + '" name="file[]"><span class="form-check-label"></span>\
									  <div href="#\" class="files">'+icon+'<div class="info"><span class="name">'+ name +'</span> <span class="details">'+fileSize+'</span> <!-- a href="#">View info</a --></div></div>\
									</label>\
								</li>');
					file.appendTo(_this.fileList);
				});

			}


			// Generate the breadcrumbs

			var url = '';

			if(this.filemanager.hasClass('searching')){

				url = '<span>Search results: </span>';
				this.fileList.removeClass('animated');

			}
			else {

				this.fileList.addClass('animated');

				this.breadcrumbsUrls.forEach(function (u, i) {

					var name = u.split('/');

					if (i !== _this.breadcrumbsUrls.length - 1) {
						url += '<a href="'+u+'"><span class="folderName">' + name[name.length-1] + '</span></a> <span class="arrow">→</span> ';
					}
					else {
						url += '<span class="folderName">' + name[name.length-1] + '</span>';
					}

				});

			}
			this.breadcrumbs.html('<a href="/"><i class="la la-home"></i><span class="folderName">&ensp;home</span></a>').append(url);



			// Show the generated elements

			this.fileList.animate({'display':'inline-block'});

		}


		// This function escapes special html characters in names

		escapeHTML(text) {
			return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
		}


		// Convert file sizes from bytes to human readable units

		bytesToSize(bytes) {
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if (bytes == 0) return '0 Bytes';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		}	
}
/*
export {
  MediaModal
}
*/

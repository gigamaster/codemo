/**
 * Import and drag-and-drop file to textarea
 * 2024 Codemo, Nuno Luciano
 * 
 * Usage
 ** <script src="import_html.js"></script>
 ** <script>
 ** // import_html
 ** new ImportHTML("import_html");
 ** </script>
 * Wrap textarea and input
 ** <div data-file="import_html">
 ** <textarea>
 ** <input type="file">
 ** </div>
 */

class ImportHTML {
    constructor(id) {

        this.wrapper = document.querySelector(`[data-file="${id}"]`);
        this.fileInput = this.wrapper.querySelector('input');
        this.textArea = this.wrapper.querySelector('textarea');
        this.fileMsg = document.getElementById('fileMsg');

        this.textInitialHeight = this.textArea.style.height;
        if (this.textArea.style.maxHeight === '') {
            this.textArea.style.maxHeight = '30em';
        }
        this.textArea.style.overflowY = 'auto';

        this.fileInput.addEventListener('change', this.handleFileInputChange.bind(this));
        
        this.textArea.parentElement.addEventListener('dragover', this.handleDragOver.bind(this));
        this.textArea.parentElement.addEventListener('drop', this.handleDrop.bind(this));
    }

    readFile(source, target) {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            target.value = event.target.result;
            target.style.height = this.textInitialHeight;
            target.style.height = target.scrollHeight 
                + parseFloat(getComputedStyle(target).paddingTop) 
                + parseFloat(getComputedStyle(target).paddingBottom) + 'px';
        });
        reader.readAsText(source);
    }

    handleFileInputChange(event) {
        event.preventDefault();
        const input = this.fileInput.files[0];
        this.readFile(input, this.textArea);
        this.fileInput.value = '';
        this.fileInput.blur();
    }

    handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    handleDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        const input = event.dataTransfer.files[0];
        const fileTypes = this.fileInput.accept;
        if (fileTypes.includes(event.dataTransfer.files[0].type)) {
            // alert('valid');
            this.fileMsg.innerHTML = 'Filename: ' + input.name + 'Type: ' + input.type;
            this.fileMsg.classList.remove("error");
            // console.log("Filename: " + input.name);
            // console.log("Type: " + input.type);
            // console.log("Size: " + input.size + " bytes")
            this.readFile(input, this.textArea);
        }else{
            // alert('not valid');
            this.fileMsg.classList.add("error");
            
        }
    }
}   
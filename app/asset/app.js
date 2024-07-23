/**
 * Codemo - GitHub Web File Browser
 * https://gigamaster.github.io/codemo/
 */
/* Color schemes, mobile, panel */
const setup = () => {
    const getTheme = () => {
    if (window.localStorage.getItem('dark')) {
    return JSON.parse(window.localStorage.getItem('dark'))
    }
    
    return !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    const setTheme = (value) => {
    window.localStorage.setItem('dark', value)
    }
    
    const getColor = () => {
    if (window.localStorage.getItem('color')) {
    return window.localStorage.getItem('color')
    }
    return 'blue'
    }
    
    const setColors = (color) => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', `var(--color-${color})`)
    root.style.setProperty('--color-primary-50', `var(--color-${color}-50)`)
    root.style.setProperty('--color-primary-100', `var(--color-${color}-100)`)
    root.style.setProperty('--color-primary-light', `var(--color-${color}-light)`)
    root.style.setProperty('--color-primary-lighter', `var(--color-${color}-lighter)`)
    root.style.setProperty('--color-primary-dark', `var(--color-${color}-dark)`)
    root.style.setProperty('--color-primary-darker', `var(--color-${color}-darker)`)
    this.selectedColor = color
    window.localStorage.setItem('color', color)
    }
    return {
    loading: true,
    isDark: getTheme(),
    toggleTheme() {
    this.isDark = !this.isDark
    setTheme(this.isDark)
    },
    setLightTheme() {
    this.isDark = false
    setTheme(this.isDark)
    },
    setDarkTheme() {
    this.isDark = true
    setTheme(this.isDark)
    },
    color: getColor(),
    selectedColor: 'blue',
    setColors,
    toggleSidbarMenu() {
    this.isSidebarOpen = !this.isSidebarOpen
    },
    isSettingsPanelOpen: false,
    openSettingsPanel() {
    this.isSettingsPanelOpen = true
    this.$nextTick(() => {
    this.$refs.settingsPanel.focus()})
    },
    isNotificationsPanelOpen: false,
    openNotificationsPanel() {
    this.isNotificationsPanelOpen = true
    this.$nextTick(() => {
    this.$refs.notificationsPanel.focus()})
    },
    isMobileSubMenuOpen: false,
    openMobileSubMenu() {
    this.isMobileSubMenuOpen = true
    this.$nextTick(() => {
    this.$refs.mobileSubMenu.focus()})
    },
    isMobileMainMenuOpen: false,
    openMobileMainMenu() {
    this.isMobileMainMenuOpen = true
    this.$nextTick(() => {
    this.$refs.mobileMainMenu.focus()})
    }
    }
}

/* global LinkPreviewer */
const linkPreviewer = new LinkPreviewer();
linkPreviewer.attach('td a.preview');

/* Search palette */
document.addEventListener('alpine:init', () => {
  Alpine.data('spotlight', () => ({
    data: [],
    query: '',
    show: false,
    currentIndex: -1,
    init() {
      // Initialize data
      fetch('https://gigamaster.github.io/codemo/asset/sourceData.json')
          .then(res => res.json())
          .then(data => this.data = data.data);
    },
    showSearchBar() {
      this.show = true;
      this.query = ''
      // focus in input
      this.$nextTick(() => {
          this.$refs.input.focus()
      })
    },
    closeSearchBar() {
      this.show = false
      this.query = ''
      this.currentIndex = -1
    },
    get queryFilter() {
      // Return filtered items if query is not empty
      // then return the items which includes query string
      return this.query && this.data.filter(item => {
          const page_name = item.page_title + "—" + item.page_desc
          return page_name.toLowerCase().includes(this.query.toLowerCase())
      })
    },
    previous() {
      // move cursor to previous item
      // if currentIndex is -1 dont execute
      if (this.currentIndex == -1)
          return
      this.currentIndex--
      // if index is less than 0 set input value to query
      if (this.currentIndex < 0) {
          this.$nextTick(() => {
              // cursor at the end of text 
              this.$refs.input.focus()
              this.$refs.input.value = this.query
            
          })
          return
      }
      // set the input value to current filtered item value
      this.$nextTick(() => {
          // cursor at the end of text 
          this.$refs.input.focus()
          this.$refs.input.value = this.queryFilter[this.currentIndex].page_title + ' ' + this.queryFilter[this.currentIndex].page_cat
      })
      this.observer()
    },
    next() {
      // move cursor to next item
      // if currentIndex is last of filtered items then return
      if (this.currentIndex >= this.queryFilter.length - 1)
          return
      this.currentIndex++
      this.$refs.input.value = this.queryFilter[this.currentIndex].page_title + ' ' + this.queryFilter[this.currentIndex].page_desc
      this.observer()
    },
    observer() {
      // Observe if item is visible or not
      var element = document.getElementById(`item-${this.currentIndex}`)
      var parent = this.$refs.parent;

      const elementTop = element.offsetTop;
      const elementBottom = elementTop + element.clientHeight;

      const parentTop = parent.scrollTop;
      const parentBottom = parentTop + parent.clientHeight;

      // Scroll  bottom 
      // triggered for this.next()
      if (elementBottom > parentBottom) {
          parent.scrollBy(0, 65)
      }
      // Scroll  Top
      // triggered for this.previous()
      if (elementTop < parentTop) {
          parent.scrollBy(0, -65)
      }
    },
    select() {
      // Select Item - key 'enter'
      //window.open(this.options[this.selectedIndex].page_url, '_blank');
      var pageSelect = this.queryFilter[this.currentIndex];
      var pageUrl    = pageSelect.page_url;
      var pageTitle  = pageSelect.page_title;
      console.log (pageUrl);
      console.log (pageTitle);
      // 1. window parent
      window.open(pageUrl, '_parent');
      // 2. window new or tab _blank
      // window.open(pageUrl, '_blank');
      // 3. window pop-up 
      // openWithSelfMain(pageUrl, pageTitle, '960', '540');
      this.closeSearchBar()
    }
  }))
})

/*
  Usage Example:
  openWithSelfMain('https://example.com','XOOPSCube','960','540');
  Location = null is useless because modern browsers now prevent, by default, 
  hiding the address bar for security reasons (phishing)
*/
function openWithSelfMain(url, title, w, h) {
  // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
  var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;
  width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
  var left = ((width / 2) - (w / 2)) + dualScreenLeft;
  var top = ((height / 2) - (h / 2)) + dualScreenTop;
  var newWindow = window.open(url, title,
      'scrollbars=yes, ' +
      'width=' + w + ', ' +
      'height=' + h + ', ' +
      'top=' + top + ', ' +
      'left=' + left + ',' +
      'titlebar=no,toolbar=no,directories=no,status=no,menubar=no,resizable=yes,copyhistory=no');
  // Puts focus on the newWindow
  if (window.focus) {
      newWindow.focus();
  }
}

/* GitHub Fetch Repo Commits */
function commitsData() {
  return {
  title: 'Latest Commits',
  commits: [],
  reload() {
  sessionStorage.removeItem("commits");
  this.commits = [];
  this.init();
  },
  init() {
  // Testdata
  /*let commits = [
  {
  "message": "commit",
  "author": "gigamaster",
  "date": "2024-05-27"
  }
  ];*/
  // Check sessionData to avoid calling the api
  const commits = JSON.parse(sessionStorage.getItem("commits"));
  if(commits){
  // storage accessible to x-data
  this.commits = commits;
  //console.log('sessionStorage', commits);
  return;
  }
  // get commits latest 10 first page
  fetch('https://api.github.com/repos/gigamaster/codemo/commits?per_page=10&page=1')
  .then(response => response.json())
  .then(response => {
  //console.log('fetched',response);
  // removed collect
  let commits = response.map((item) => {
    // removed parser
    return item;
  });
  this.commits = commits;
  sessionStorage.setItem("commits",JSON.stringify(commits));
  console.log(this,response)
  });
  }
  };
  }
/*! fetch */
var _htmlToElements=function(e){var t=document.createElement("template");t.innerHTML=e;const n=t.content.childNodes,o=[],a=[];for(var d in n)1==n[d].nodeType&&("SCRIPT"===n[d].nodeName?a.push(n[d]):o.push(n[d]));return o.concat(a)},_loadContent=function(e,t,n,o){if(0!==t||o||(document.querySelector(n).innerHTML=""),!(t<=e.length))return!0;var a=e[t];if(void 0!==a&&"SCRIPT"===a.nodeName){var d=document.createElement("script");a.type&&(d.type=a.type),Array.prototype.forEach.call(a.attributes,(function(e){d.setAttribute(e.nodeName,e.nodeValue)})),""!=a.src?(d.src=a.src,d.onload=function(){_loadContent(e,t+1,n)},document.head.appendChild(d)):(d.text=a.text,document.body.appendChild(d),_loadContent(e,t+1,n))}else void 0!==a&&document.querySelector(n).appendChild(a),_loadContent(e,t+1,n)},loadData=async function(e,t,n=!1){return _loadContent(_htmlToElements(e),0,t,n)};
 
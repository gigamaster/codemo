ToggleSideMenuBtnDat = {
  width: 40,
  status: false
}
function linkfilterToggle(index) {

  var li = Array.from(document.querySelectorAll("#link-filter>li"))
  for (let i of li) {

    i.style.color = "#505061"
  }
  li[index].style.color = "white"
  var linkfilterContHr = document.querySelector("#link-filter>hr")
  linkfilterContHr.style.left = li[index].offsetLeft + "px"
  linkfilterContHr.style.width = li[index].offsetWidth + "px"
  linkfilterContHr.setAttribute("index", index)
}
var MainBody = document.querySelector("#MainBody")
var scrolLef = 0


MainBody.onwheel = (e) => {
  if (MainBody.clientHeight + MainBody.scrollTop >= MainBody.scrollHeight) {
    e.preventDefault()
    if (e.deltaY < 0 && scrolLef < 0) {
      scrolLef += 100
      console.log(scrolLef)
      for (let i of document.querySelectorAll("#link-container>.website")) {
        i.style.marginLeft = scrolLef + "px"
      }
    } else if (e.deltaY > 0) {
      scrolLef -= 100
      for (let i of document.querySelectorAll("#link-container>.website")) {
        i.style.marginLeft = scrolLef + "px"
      }
    }
  }

}

function ToggleSideMenu(btn) {

  var SideNav = document.querySelector("#LeftNav")
  if (SideNav.offsetWidth == 0) {
    SideNav.style.width = "240px"
    if (window.innerWidth > 801) {
      MainBody.style.width = "calc(100% - 240px)"
    } else {
      MainBody.style.width = "100%"
    }
    for (let i of Array.from(btn.querySelectorAll("svg"))) {
      console.log(i)
      i.style.left = "0px"
    }
    document.querySelector("#logo").style.left = "-0px"
    ToggleSideMenuBtnDat.status = false

  } else {
    ToggleSideMenuBtnDat.status = true
    document.querySelector("#logo").style.left = "-240px"

    SideNav.style.width = "0px"
    MainBody.style.width = "100%"
    for (let i of Array.from(btn.querySelectorAll("svg"))) {
      console.log(i)
      i.style.left = -ToggleSideMenuBtnDat.width + "px"
    }

  }
  console.log(ToggleSideMenuBtnDat.status)
  setTimeout(function () {
    linkfilterToggle(parseInt(document.querySelector("#link-filter>hr").getAttribute("index")))
  }, 300)

}
linkfilterToggle(1)
function MediaQueryListner() {


  if (window.innerWidth < 801) {
    document.querySelector("#logo").innerHTML = `<i class="icon-codemo"></i>`
    ToggleSideMenuBtnDat.width = 35
  } else {
    document.querySelector("#logo").innerHTML = `<i class="icon-codemo"></i><span>Codemo</span>`
  }

  setTimeout(function () { linkfilterToggle(parseInt(document.querySelector("#link-filter>hr").getAttribute("index"))) }, 300)

}
window.onresize = MediaQueryListner
window.onload = MediaQueryListner
// Mobile slider with swipe
function GoTopFunc() {
  MainBody.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

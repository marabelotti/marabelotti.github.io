function adjustFont(){

    var c=(26)/(1848)
    var x=window.screen.width

    if (window.screen.width< 1079){
        document.documentElement.style["font-size"] = 4*c*x
    }else{
        document.documentElement.style["font-size"] = c*x
    }
}

adjustFont()

window.addEventListener('resize', adjustFont)
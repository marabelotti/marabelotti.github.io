function adjustFont(){

    var c=(26)/(1848*1044)
    var x=window.screen.width*window.screen.height

    if (window.screen.width< 857){
        document.documentElement.style["font-size"] = 5*c*x
    }else{
        document.documentElement.style["font-size"] =1.05*Math.sqrt(26*c*x)
    }
}

adjustFont()

window.addEventListener('resize', adjustFont)
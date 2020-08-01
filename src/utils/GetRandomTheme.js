import GetContrastTextColor from "./GetContrastTextColor"

const GetRandomTheme = () => {
    // return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
    var color ='#' + Math.floor(Math.random()*16777215).toString(16)
    return { backgroundColor : color , textColor: GetContrastTextColor(color)}
}

export default GetRandomTheme
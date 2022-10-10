let r = document.querySelector(":root");
function setProp(prop,value){
	r.style.setProperty(prop,value);
}
setProp("--accent",localStorage.getItem("accent"));
setProp("--background",localStorage.getItem("background"));
setProp("--text",localStorage.getItem("text"));
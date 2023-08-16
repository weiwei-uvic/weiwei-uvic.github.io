const DEFAULT_RECTANGLE_SIZE = [0.233, 0.583]; //width, height
const STIMULUS_CONTAINER_WIDTH = 8;//inchs
const STIMULUS_CONTAINER_HEIGHT = 6;

const DEFAULT_LENGTH_RATIO = 1.5;
const DEFAULT_TARGET_COLOR = "hsl(7, 92%, 50%)";
const DEFAULT_DISTRACTOR_COLOR = "hsl(221, 34%, 50%)";
const DEFAULT_LUMINANCE = 25;
const DEFAULT_TARGET_SHAPE = "rectangle";
const DEFAULT_DISTRACTOR_SHAPE = "rectangle";

var Factor ={
    targetNumber: 1,
    elementNumber: 36,
    targetLocation: {}, //Has 4 variables - left, right, top, middle 
    orientation: 0,
    spatialPattern: null, //string: "Gridded", "Randomized"
    proximity : null,  // type: float
    activeFactor: "None"
  }



function createStimulus(data)
{
    console.log(data);
    const stimulusContainer = document.createElement("div");
    stimulusContainer.style.position = "absolute";
    stimulusContainer.style.left = `${0}px`;
    stimulusContainer.style.top = `${0}px`;
    stimulusContainer.style.width = `${STIMULUS_CONTAINER_WIDTH}in`;
    stimulusContainer.style.height = `${STIMULUS_CONTAINER_HEIGHT}in`;
    stimulusContainer.style.border = "1px solid black";

    const fileName = "Length_1_36_Free_bottom_random_Free";
    const stringList = fileName.split("_");

    var ElementWidth = DEFAULT_RECTANGLE_SIZE[0];
    var ElementHeight = DEFAULT_RECTANGLE_SIZE[1];
    var TargetHeight = DEFAULT_RECTANGLE_SIZE[1];
    var DistractorColor = DEFAULT_DISTRACTOR_COLOR;
    var TargetColor = DEFAULT_DISTRACTOR_COLOR;


    if(stringList[0] == 'Length')TargetHeight*= DEFAULT_LENGTH_RATIO;
    if(stringList[0] == 'Hue')TargetColor = DEFAULT_TARGET_COLOR;
    if(stringList[0] == 'Luminance')TargetColor = "hsl(221, 34%, "+ DEFAULT_LUMINANCE + "%)";

    const canvas = document.getElementById("myCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");  
    for (var i =0; i< data.length; i++) {
        console.log("in the loop");
        var theColor = DistractorColor;
        var theHeight = ElementHeight;
        if(data[i].isTarget)
        {
          theHeight = TargetHeight;
          theColor  = TargetColor;
        }
        console.log("left: " + data[i].left + ", top: " + data[i].top);
        ctx.fillStyle = theColor;
        ctx.fillRect(parseFloat(data[i].left)*96, parseFloat(data[i].top)*96, ElementWidth*96, theHeight*96);
        //ctx.fillRect(0+ i*20, 0+ i*20, 100, 150);
        }
}
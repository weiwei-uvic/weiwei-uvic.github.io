//default feature setting
const defaultShape = 'rectangle';
const DEFAULTELEMENTCOLOR = '#87b0e5';
const defaultTargetColor = '#ee9590';
const defaultHeightWidthRatio = 2.5;
const defaultOrientation = 'rectangle'; 
const defaultCurvature = false;
const defaultClosure = false;
const defaultIntersection = false;
const defaultTerminator = false;
const ShapeEnum = {
    Rectangle: 'Rectangle',
    Circle: 'Circle',
    Square: 'Square'
  };

//Macro const for the stimulus container
const DEFAULT_RECTANGLE_SIZE = [0.08, 0.2]; //width, height 12/43, 30/43
const STIMULUSCONTAINERWIDTH = 8;//inchs
const STIMULUSCONTAINERHEIGHT = 6;
const DPI = 96;// this DPI only works on Wei's screen
const MINDISBETWEENELEM = 0.03; // the min distance between rectangnles

const DEGREE_RECT_LENGTH = 0.5; // The subtended degree of the rectangle length;
const DEGREE_FOCUS_LONG = 8; // The subtended degree of the focus area;
const DEGREE_FOCUS_SHORT = 8;// 

const SQUARE_RECTWIDTH_RATIO = 1.75;

// The data structure that store all necessary feature info for an experiment
var Feature ={
  targetShape: "rectangle",
  distractorShape: "rectangle",
  targetColor: "hsl(3, 73%, 75%)",
  distractorColor: "hsl(214, 64%, 72%)",
  tdSizeRatio: 1,//the ratio between target size and distractor size
  tdLengthRatio: 1, //the ratio between target length and distractor length
  targetAngle: 0,
  distractorAngle: 0,
  curvature: null,
  closure: null,
  intersection: null,
  terminator: null,
  activeFeature: "Hue"
}

// The data structure that store all necessary factor info for an experiment
var Factor ={
  targetNumber: 1,
  elementNumber: 36,
  targetLocation: {}, //Has 4 variables - left, right, top, middle 
  orientation: 0,
  spatialPattern: null, //string: "Gridded", "Randomized"
  proximity : null,  // type: float
  activeFactor: "None",
  row: 0,
  col: 0
}

// The data structure that stores all elements
var ElementArray = [];

var ElementsRect = [];

var ElementWidth = 0;

var CSVFileName = "";


function setFoveationArea(value)
{
  if (value)
    document.getElementById('focus_svg_for_proximity').style.visibility = 'visible';
  else
    document.getElementById('focus_svg_for_proximity').style.visibility = 'hidden';
}

function defineFeature(object)
{
    Feature.targetColor = object.targetColor||Feature.targetColor;
    Feature.distractorColor = object.distractorColor||Feature.distractorColor;
    Feature.tdLengthRatio = object.tdLengthRatio||Feature.tdLengthRatio;
    Feature.tdSizeRatio = object.tdSizeRatio||Feature.tdSizeRatio;
    Feature.distractorShape = object.distractorShape||Feature.distractorShape;
    Feature.targetShape = object.targetShape||Feature.targetShape;
    Feature.curvature = object.curvature||Feature.curvature;
    Feature.intersection = object.intersection||Feature.intersection;
    Feature.terminator = object.terminator||Feature.terminator;
    Feature.activeFeature = object.activeFeature||Feature.activeFeature;
    //for those value could be 0 --- targetAngle,distractorAngle
    if(object.distractorShape != null)
      Feature.distractorAngle = object.distractorAngle;
    if(object.targetAngle != null)
      Feature.targetAngle = object.targetAngle;
}

function defineFactor(object)
{
    /* 
    All elements are generated through a loop, 
    So each element has an implicit serial number,
    *targets* stores the randoom serial number to randomized the location of targets 
  */
  Factor.targetNumber = object.targetNumber || Factor.targetNumber;
  Factor.elementNumber = object.elementNumber || Factor.elementNumber;
  /*
      The following four variables are used to restrict the position of targets,
      based on user input. The default value is equal to the container size.
    */
  Factor.targetLocation.left = 0;
  Factor.targetLocation.right = STIMULUSCONTAINERWIDTH;
  Factor.targetLocation.top = 0;
  Factor.targetLocation.bottom = STIMULUSCONTAINERHEIGHT;
  switch(object.targetLocationX) {
    case -1: //left
      Factor.targetLocation.left  = 0;
      Factor.targetLocation.right = STIMULUSCONTAINERWIDTH/3;
      break;
    case 0: //middle
      Factor.targetLocation.left  = STIMULUSCONTAINERWIDTH/3;
      Factor.targetLocation.right = 2*STIMULUSCONTAINERWIDTH/3;
      break;
    case 1: //right
      Factor.targetLocation.left = 2*STIMULUSCONTAINERWIDTH/3;
      Factor.targetLocation.right = STIMULUSCONTAINERWIDTH;
      break;
    default:
      break;
  }

  switch(object.targetLocationY) {
    case -1: //top
      Factor.targetLocation.top = 0;
      Factor.targetLocation.bottom = STIMULUSCONTAINERHEIGHT/3;
      break;
    case 0: //middle
      Factor.targetLocation.top  = STIMULUSCONTAINERHEIGHT/3;
      Factor.targetLocation.bottom = 2*STIMULUSCONTAINERHEIGHT/3;
      break;
    case 1: //bottom
      Factor.targetLocation.bottom = STIMULUSCONTAINERHEIGHT;
      Factor.targetLocation.top = 2*STIMULUSCONTAINERHEIGHT/3;
      break;
    default:
      break;
  }
  Factor.spatialPattern = object.spatialPattern || Factor.spatialPattern;
  Factor.proximity = object.proximity;
  Factor.activeFactor = object.activeFactor;
  Factor.row = object.row || Factor.row;
  Factor.col = object.col || Factor.col;
  
  if (Factor.spatialPattern === "Gridded"&& Factor.row * Factor.col != Factor.elementNumber)
  {
    // if user selected gridded by input the wrong row and/or col number,
    // Show a message and set spatial pattern back to random

    /**
     * To D0: Show error message
     */
    const errorWindow = document.getElementById("error-window");
    errorM = document.getElementById("errorMessage");
    errorM.innerHTML = "The product of row and col is not the set size. The layout will keep being random."
    errorWindow.style.display = 'block';
    Factor.spatialPattern = "Randomized";
    Factor.row = 0;
    Factor.col = 0;
  }
}

function createGriddedStimulus(container,rowNum,colNum)
{ 
  var elementHeight = ElementWidth;
  var elementWidth = ElementWidth; 
  var targetsize = calculateTargetSize();
  var targetWidth = targetsize[0];
  var targetHeight = targetsize[0];
  if(Feature.distractorShape == "rectangle")
    elementHeight = elementWidth * defaultHeightWidthRatio;
  if(Feature.distractorShape == 'square')
    {
      elementHeight = elementWidth * SQUARE_RECTWIDTH_RATIO;
      elementWidth = elementHeight;
    }
  if(Feature.targetShape == "rectangle")
    targetHeight = targetsize[1]; 
  var elementPaddingH = (STIMULUSCONTAINERWIDTH - colNum*elementWidth);
  elementPaddingH = elementPaddingH/(+colNum +1)
  var elementPaddingV = (STIMULUSCONTAINERHEIGHT - defaultHeightWidthRatio*rowNum*elementWidth)/(+rowNum+1);

  var targetPos = parseInt(Math.random() * (Factor.elementNumber));
  var count = 1;
  for (let i = 0; i < rowNum; i++) 
    for(let j = 0; j < colNum; j++) {
      const element = document.createElement("div");
      
      let x = (j+1) * (elementWidth + elementPaddingH)-elementWidth;
      let y = (i+1) * (elementHeight + elementPaddingV) -elementHeight;
      element.style.position = "absolute";
      element.style.left = `${x}in`;
      element.style.top = `${y}in`;
      const rect = { x, y, width: targetWidth, height: targetHeight, isTarget: "false"  };
      if(count == targetPos)
      {
        element.classList.add(Feature.targetShape);
        element.style.backgroundColor  = Feature.targetColor;
        element.style.width = `${targetWidth}in`;
        element.style.height = `${targetHeight}in`;
        rect.isTarget = "true";
        //rotate target
        element.style.transform = `rotate(${Feature.targetAngle}deg)`;
        if (Feature.targetShape == 'circle')
          element.style.borderRadius = `${targetWidth}in`;
          element.addEventListener("click", function() {
          const textElement = document.getElementById("correct-message-window");
  
          textElement.style.display = 'block';
  
          // Set a timeout to hide the text element after 3 second
          setTimeout(function() {
            textElement.style.display = 'none'; // or textElement.style.opacity = "0";
          }, 1500);
  
        });
      }
      else
      {
        element.classList.add(Feature.distractorShape);
        element.style.backgroundColor  = Feature.distractorColor;
        element.style.width = `${elementWidth}in`;
        element.style.height = `${elementHeight}in`;
        element.style.transform = `rotate(${Feature.distractorAngle}deg)`;
        if (Feature.distractorShape == 'circle')
          element.style.borderRadius = `${elementWidth}in`;
      }
      ElementArray.push(element);
      ElementsRect.push(rect);
      count++;
      //elements.push({ x, y });
      container.appendChild(element);
  }
}

function calculateTargetSize()
{
    var totalLengthRatio = defaultHeightWidthRatio*Feature.tdLengthRatio;
    var distractorArea = ElementWidth*totalLengthRatio*ElementWidth;
    var targetWidth = Math.sqrt(distractorArea*Feature.tdSizeRatio/(totalLengthRatio));
    var targetHeight = targetWidth*totalLengthRatio;

    if (Feature.targetShape == 'circle') // this hard coding is only for test
    {
      targetWidth = 2*Math.sqrt((targetWidth*SQUARE_RECTWIDTH_RATIO)**2/Math.PI);
      targetHeight = targetWidth;
    }
    console.log("radius ", targetWidth)
  return [targetWidth,targetHeight];
}

function createRandomTarget(container)
{
  console.log("target shape: "+ Feature.targetShape);
  var count = 1;
  var targetsize = calculateTargetSize();
  var targetWidth = targetsize[0];
  var targetHeight = targetsize[0];
  if (Feature.targetShape == 'rectangle')
     targetHeight = targetsize[1];
  while(count <= Factor.targetNumber)
  {
    const x = Math.random() * (STIMULUSCONTAINERWIDTH - targetWidth);
    const y = Math.random() * (STIMULUSCONTAINERHEIGHT - targetHeight);
    const rect = { x, y, width: targetWidth, height: targetHeight, isTarget: "true"  };
    if (!checkCollision(rect, ElementsRect) && checkLocation(rect))
    {    
      const target = document.createElement('div');
      target.classList.add(Feature.targetShape);
      target.style.position = "absolute";
      target.style.left = `${rect.x}in`;
      target.style.top = `${rect.y}in`;
      target.style.width = `${targetWidth}in`;
      target.style.height = `${targetHeight}in`;
      target.addEventListener("click", function() {
        const textElement = document.getElementById("correct-message-window");

        textElement.style.display = 'block';

        // Set a timeout to hide the text element after 3 second
        setTimeout(function() {
          textElement.style.display = 'none'; // or textElement.style.opacity = "0";
        }, 1500);

      });
      //shape determine
      // if (Feature.targetShape == 'circle')
      //   target.style.borderRadius = `${targetWidth}in`;
      target.style.backgroundColor = Feature.targetColor;
      //rotate target
      target.style.transform = `rotate(${Feature.targetAngle}deg)`;
      ElementArray.push(target);
      container.appendChild(target);
      ElementsRect.push(rect);
      count++;
      
      //comment following lines can make the proximity circle disappered
      if(Factor.proximity>0)
      {
        var centerR = Factor.proximity*DPI;
        drawCircle(target,centerR,container);
      }
    }
  }
}


/*
    This function will draw circle around the target when the proximity factor is toggled.
 */
function drawCircle(target,r,container)
{
  const containerRect = container.getBoundingClientRect();
  // Create an SVG element
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // Set the SVG attributes (e.g., width, height)
  var realCX = target.getBoundingClientRect().left - containerRect.left + target.getBoundingClientRect().width/2;
  var realCY = target.getBoundingClientRect().top - containerRect.top + target.getBoundingClientRect().height/2;
  svg.setAttribute("width", containerRect.width.toString());
  svg.setAttribute("height", containerRect.height.toString());
  svg.setAttribute("left", containerRect.left.toString());
  svg.setAttribute("top", containerRect.top.toString());
  svg.id = "circle_svg_for_proximity";
  //svg.setAttribute("border", "2px solid red");
  // Create a circle element
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  // Set the circle attributes (e.g., cx, cy, r, fill)
  circle.setAttribute("cx", realCX.toString());
  circle.setAttribute("cy", realCY.toString());
  circle.setAttribute("r", r.toString());
  circle.setAttribute("fill", "white");
  circle.setAttribute("stroke", "black");
  circle.setAttribute("stroke-dasharray", "5,5");
  
  // Append the circle to the SVG element
  svg.appendChild(circle);
  //svg.style.visibility = "hidden"
  // Append the SVG element to the div
  container.appendChild(svg);
}


/**
 * Draw the focus area.
 * Here the setting is: The focus area is circle, it's diameter subtends 18 degree. 18 is based on: https://en.wikipedia.org/wiki/Peripheral_vision
 */
function drawFocusArea(container)
{ 
  const containerRect = container.getBoundingClientRect();
  var virtualViewDis = DEFAULT_RECTANGLE_SIZE[1]/Math.tan(DEGREE_RECT_LENGTH*Math.PI/180);
  console.log("virtualViewDis ",virtualViewDis);
  var focusAreaLongRadius = DPI*virtualViewDis * Math.tan(DEGREE_FOCUS_LONG*Math.PI/180)/2;
  var focusAreaShortRadius = DPI*virtualViewDis * Math.tan(DEGREE_FOCUS_SHORT*Math.PI/180)/2;
  console.log("focus area radius",focusAreaLongRadius);
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // Set the SVG attributes (e.g., width, height)
  svg.setAttribute("width", containerRect.width.toString());
  svg.setAttribute("height", containerRect.height.toString());
  svg.setAttribute("left", containerRect.left.toString());
  svg.setAttribute("top", containerRect.top.toString());
  svg.id = "focus_svg_for_proximity";
  //svg.setAttribute("border", "2px solid red");
  // Create a circle element
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  //console.log('focusAreaRadius', focusAreaRadius);
  // Set the circle attributes (e.g., cx, cy, r, fill)
  var xpos = DPI*STIMULUSCONTAINERWIDTH/2;
  var ypos = DPI*STIMULUSCONTAINERHEIGHT/2;
  circle.setAttribute("cx", xpos.toString());
  circle.setAttribute("cy", ypos.toString());
  circle.setAttribute("rx", focusAreaLongRadius.toString());
  circle.setAttribute("ry", focusAreaShortRadius.toString());
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke", "black");
  circle.setAttribute("stroke-dasharray", "5,5");

  // Append the circle to the SVG element
  svg.appendChild(circle);
  // Draw the two lines

  // Set attributes for the line
  var line1StarterX = 0;
  var line1StarterY = 0;
  var line1EndX = DPI*STIMULUSCONTAINERWIDTH;
  var line1EndY = DPI*STIMULUSCONTAINERHEIGHT;
  var line2StarterX = DPI*STIMULUSCONTAINERWIDTH;
  var line2StarterY = 0;
  var line2EndX = 0;
  var line2EndY = DPI*STIMULUSCONTAINERHEIGHT;
  var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", line1StarterX.toString());
  line.setAttribute("y1", line1StarterY.toString());
  line.setAttribute("x2", line1EndX.toString());
  line.setAttribute("y2", line1EndY.toString());
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-dasharray", "5,5");
  var line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line2.setAttribute("x1", line2StarterX.toString());
  line2.setAttribute("y1", line2StarterY.toString());
  line2.setAttribute("x2", line2EndX.toString());
  line2.setAttribute("y2", line2EndY.toString());
  line2.setAttribute("stroke", "black");
  line2.setAttribute("stroke-dasharray", "5,5");
  svg.appendChild(line);
  svg.appendChild(line2);
  // Append the SVG element to the div
  container.appendChild(svg);

}

function createRandomElements(container)
{
  console.log("element shape: "+ Feature.distractorShape);
  const targetRect = ElementsRect[0];
  var elementHeight = ElementWidth;
  var elementWidth = ElementWidth;
  if(Feature.distractorShape == 'rectangle')
    elementHeight = ElementWidth * defaultHeightWidthRatio;
  if(Feature.distractorShape == 'square')
    {
      elementHeight = ElementWidth * SQUARE_RECTWIDTH_RATIO;
      elementWidth = elementHeight;
    }
  var count = 1;
  var numOutofTarget = Factor.elementNumber- Factor.targetNumber;
  while (count <= numOutofTarget) {
      const x = Math.random() * (STIMULUSCONTAINERWIDTH - elementWidth);
      const y = Math.random() * (STIMULUSCONTAINERHEIGHT - elementHeight);
      const rect = { x, y, width: elementWidth, height: elementHeight, isTarget: "false" };

      if (!checkCollision(rect, ElementsRect) && checkProximity(rect,targetRect)) {
          ElementsRect.push(rect);
          const element = document.createElement('div');
          element.classList.add(Feature.distractorShape);
          element.style.position = "absolute";
          element.style.left = `${rect.x}in`;
          element.style.top = `${rect.y}in`;
          element.style.width = `${elementWidth}in`;
          element.style.height = `${elementHeight}in`;
          //shape determine
          if (Feature.distractorShape == 'circle')
            element.style.borderRadius = `${elementWidth/2}in`;
          element.style.backgroundColor  = Feature.distractorColor;
          //rotate element
          element.style.transform = `rotate(${Feature.distractorAngle}deg)`;
          ElementArray.push(element);
          container.appendChild(element);
          count++;
      }
  }
}

function checkLocation(element)
{
  var elementHeight = ElementWidth*defaultHeightWidthRatio;
  return (Factor.targetLocation.left <= element.x + ElementWidth/2
     && Factor.targetLocation.right >= element.x + ElementWidth/2
     && Factor.targetLocation.top  <= element.y + elementHeight/2 
     && Factor.targetLocation.bottom >= element.y + elementHeight/2);
}

function checkCollision(element, elements)
{
  for (const rect of elements) {
    if (
      element.x < rect.x + rect.width + MINDISBETWEENELEM&&
      element.x + element.width  + MINDISBETWEENELEM > rect.x &&
      element.y < rect.y + rect.height + MINDISBETWEENELEM &&
      element.y + element.height  + MINDISBETWEENELEM > rect.y
    ) {
        return true;
    }
  }
  return false;
}

function checkProximity(element, target)
{
  if(Factor.proximity == null)
    return true;
  var dx = element.x + element.width/2-target.x - target.width/2;
  var dy = element.y + element.height/2-target.y - target.height/2;
  return (Math.sqrt(dx**2 +dy**2) >= Factor.proximity);
}

/*
    ***
      This function is only for researchers to sava the random seeds which are haphazardly spread on the canvas
    ***
*/

function saveRandomSeed()
{
  const data = [];
  for(var i = 0; i< ElementsRect.length; i++)
  {
    const element = ElementsRect[i];
    data.push([parseFloat(element.x), parseFloat(element.y), element.isTarget]);
  }

  // Create CSV content
  let csvContent = "left,top,isTarget\r\n";

  data.forEach(row => {
    const csvRow = row.map(value => String(value).trim()).join(",");
    csvContent += csvRow + "\r\n";
  });

  // Create Blob object
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  //CSVFileName was assigned in showInfo() function
  var fileName = CSVFileName + ".csv"
    
  // Save the file
  saveAs(blob, fileName);

}

function showInfo(infoContainer,stimulusContainer,factorData)
{
  const stimulusRect = stimulusContainer.getBoundingClientRect();
  infoContainer.style.position = "absolute";
  infoContainer.style.left = `${stimulusRect.left + stimulusRect.width + 20}px`;
  infoContainer.style.top = `${stimulusRect.top}px`;
  var xLocationText = "Free";
  var yLocationText = "Free";
  var spatialPatternText = Factor.spatialPattern||"Free";
  var proximityText = Factor.proximity||"Free"
  switch(factorData.targetLocationY) {
    case -1:
      yLocationText = "top";
      break;
    case 0:
      yLocationText = "middle";
      break;
    case 1:
      yLocationText = "bottom";
      break;
    default:break;
  }
  switch(factorData.targetLocationX) {
    case -1: 
      xLocationText = "left";
      break;
    case 0:
      xLocationText = "middle";
      break;
    case 1:
      xLocationText = "right";
      break;
  }
  var info = "<b>Target number: </b>" + Factor.targetNumber + "<br>" +
             "<b>Element number: </b>" + Factor.elementNumber + "<br>" +
             "<b>Horizontal location restriction: </b>" + xLocationText + "<br>" +
             "<b>Vertical location restriction: </b>" + yLocationText + "<br>" +
             "<b>Spatial pattern: </b>" + spatialPatternText + "<br>" +
             "<b>Proximity: </b>" + proximityText + "<br>";
  CSVFileName = Feature.activeFeature +"_"+ Factor.targetNumber.toString() + "_" + Factor.elementNumber; //+ "_"+ xLocationText + "_"+ yLocationText + "_"+ spatialPatternText + "_"+ proximityText;
  infoContainer.innerHTML = info;
}

function generateStimulus(featureData, factorData) {
  
    defineFeature(featureData);
    defineFactor(factorData);
    //console.log(Feature);
    
    ElementsRect = [];
    // clear the element array
    ElementArray = [];
    // Get the pivot object - the first factor cell
    const firstFactor = document.getElementById("first-factor");
    // Get the stimulus container
    const stimulusContainer = document.getElementById("stimulus-container");
    // Get the stimulus container
    const infoContainer = document.getElementById("info-container");
    // Clear the content
    stimulusContainer.innerHTML = ""
    
    // // Set the pos and size of stimulus container
    const firstFactorRect = firstFactor.getBoundingClientRect();
    let stimulusLeft = firstFactorRect.left + firstFactorRect.width;
    let stimulusTop = firstFactorRect.top;
    stimulusContainer.style.position = "absolute";
    stimulusContainer.style.left = `${stimulusLeft}px`;
    stimulusContainer.style.top = `${stimulusTop}px`;
    stimulusContainer.style.width = `${STIMULUSCONTAINERWIDTH}in`;
    stimulusContainer.style.height = `${STIMULUSCONTAINERHEIGHT}in`;
    stimulusContainer.style.border = "1px solid black";


    showInfo(infoContainer,stimulusContainer,factorData);
    //var defaultRowNum = Math.round(Math.sqrt(Factor.elementNumber));

    //The following line can adjust the size according to numbers automatically. But we decided to make elements' size consistent. So it's commented.
    //ElementWidth = STIMULUSCONTAINERHEIGHT/(rowNum*defaultHeightWidthRatio) - 1/rowNum


    ElementWidth = DEFAULT_RECTANGLE_SIZE[0];
    
    if(Factor.spatialPattern == "Gridded")
      {
        rowNum = Factor.row;
        colNum = Factor.col;
        if(Factor.row <=0 ||Factor.col <=0)
          {
            rowNum = Math.round(Math.sqrt(Factor.elementNumber));
            colNum = rowNum;
          }
        createGriddedStimulus(stimulusContainer,rowNum,colNum);
      }
    else
      {
        createRandomTarget(stimulusContainer);
        createRandomElements(stimulusContainer);
      }
    drawFocusArea(stimulusContainer);
}

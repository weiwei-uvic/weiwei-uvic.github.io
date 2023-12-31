const DEFAULT_COLOR = "hsl(221, 34%, 50%)";
const DEFAULT_HIGHLIGHT_COLOR = "hsl(7, 92%, 50%)";
const DEFAULT_TARGET_HUE = 7; // 7 degree out of 360
const DEFAULT_DISTRACTOR_HUE = 221;
const DEFAULT_SHAPE_NUM = 3;
const DEFAULT_TARGET_SHAPE = "rectangle";
const DEFAULT_DISTRACTOR_SHAPE = "rectangle";
const DEFAULT_TARGET_WIDTH = "hsl(7, 92%, 58%)";
const DEFAULT_TARGET_LENGTH = "hsl(7, 92%, 58%)";
const DEFAULT_DISTRACTOR_WIDTH = "hsl(7, 92%, 58%)";
const DEFAULT_DISTRACTOR_HEIGHT = "hsl(7, 92%, 58%)";
const DEFAULT_TARGET_LUMINANCE = 50;
const DEFAULT_DISTRACTOR_LUMINANCE = 50; //50%
const DEFAULT_TARGET_ORIENTATION = "hsl(7, 92%, 58%)";
const DEFAULT_DISTRACTOR_ORIENTATION = "hsl(7, 92%, 58%)";

// target color: "hsl(7, 92%, 50%)"; distractor color: "hsl(221, 34%, 50%)"
var FeatureData ={
    targetShape: "rectangle",
    distractorShape: "rectangle",
    targetColor: "hsl(7, 92%, 50%)",
    distractorColor: "hsl(221, 34%, 50%)",
    targetHeight: null,
    tdSizeRatio: 1, //the ratio between target size and distractor size
    tdLengthRatio: 1, //the ratio between target length and distractor length
    targetAngle: 0,
    distractorAngle: 0,
    curvature: null,
    closure: null,
    intersection: null,
    terminator: null,
    activeFeature: "Hue" //The default feature is hue
  }

// followings are global variables. They are used to store values input by users
var SizeFlag = '';
var TargetShape = 'rectangle';
var DistractorShape = 'rectangle';
var IsMultipleFeature = false;
var Luminance = 50;
var TargetHue = 7;

function initializeFeatureData(featureName)
  {
    if(IsMultipleFeature)
      return;
    FeatureData ={
        targetShape: DEFAULT_TARGET_SHAPE,
        distractorShape: DEFAULT_DISTRACTOR_SHAPE,
        targetColor: "hsl(221, 34%, 50%)",
        distractorColor: "hsl(221, 34%, 50%)",
        tdSizeRatio: 1,
        tdLengthRatio: 1,
        targetAngle: 0,
        distractorAngle: 0,
        curvature: null,
        closure: null,
        intersection: null,
        terminator: null,
        activeFeature: featureName
      };
    if(TargetShape != DistractorShape)
      {
        FeatureData.targetColor = DEFAULT_COLOR;
        FeatureData.distractorColor = DEFAULT_COLOR;
      }
    // When users set the target shape and distractor shape the same one. shape is not a feature
    // if(TargetShape == DistractorShape)
    // {
    //   FeatureData.targetShape = TargetShape;
    //   FeatureData.distractorShape = DistractorShape;
    // } 
  }

function openFeatureModal(modalName, flag) {
    if (modalName == "size_input_window")
        {
          SizeFlag = flag;
          if(flag == "Length" && (FeatureData.targetShape!= "rectangle" ||FeatureData.distractorShape!= "rectangle" ))
          {
            const errorWindow = document.getElementById("error-window");
            errorWindow.style.display = 'block';
          }
          else
          {    
            const modal = document.getElementById(modalName);
            modal.style.display = 'block';
          }
        }
    else
    {    
      const modal = document.getElementById(modalName);
      modal.style.display = 'block';
    }
}

function setIsMultipleFeature(value){IsMultipleFeature = value;}

function getHueInput()
{
    var targetHueSlider = document.getElementById("targetHueSlider");
    var distractorHueSlider = document.getElementById("distractorHueSlider");
    var targetHueSample = document.getElementById("targetHueSample");
    var distractorHueSample = document.getElementById("distractorHueSample");
    targetHueSlider.addEventListener("input", function() {
      var hue = targetHueSlider.value;
      targetHueSample.style.backgroundColor = "hsl(" + hue + ", 34%, " + DEFAULT_TARGET_LUMINANCE + "%)";
    });
    distractorHueSlider.addEventListener("input", function() {
        var hue = distractorHueSlider.value;
        distractorHueSample.style.backgroundColor = "hsl(" + hue + ", 92%, " + DEFAULT_DISTRACTOR_LUMINANCE + "%)";
      });
}

function getLuminanceInput()
{
  var luminanceSlider = document.getElementById("luminanceSlider");
  var luminanceSample = document.getElementById("luminanceSample");
  luminanceSlider.addEventListener("input", function() {
    var luminance = luminanceSlider.value;
    if(IsMultipleFeature)
      luminanceSample.style.backgroundColor = "hsl(" + TargetHue + ", 34%, " + luminance+ "%)";
   else
      luminanceSample.style.backgroundColor = "hsl(" + DEFAULT_DISTRACTOR_HUE + ", 34%, " + luminance+ "%)";
  });
}

function submitLuminanceInput(modalName)
{
    var luminanceSlider = document.getElementById("luminanceSlider");
    var luminance = luminanceSlider.value;
    initializeFeatureData("Luminance");
    Luminance = luminance;
    // use the distractor hue to set lumuniance the only variable
    if(IsMultipleFeature)
      FeatureData.targetColor = "hsl(" + TargetHue + ", 34%, " + luminance+ "%)";
    else
      FeatureData.targetColor = "hsl(" + DEFAULT_DISTRACTOR_HUE + ", 34%, " + luminance+ "%)";
    generateStimulus(FeatureData,{});
    closeModal(modalName);
}

function submitHueInput(modalName)
{
    var targetHueSlider = document.getElementById("targetHueSlider");
    var distractorHueSlider = document.getElementById("distractorHueSlider");
    var targetHue = targetHueSlider.value;
    var distractorHue = distractorHueSlider.value;
    TargetHue = targetHue;
    // Call this function makes sure there is only one feature that's changing, 
    // all the rest will maintain the default value
    initializeFeatureData("Hue");
    var lumi = DEFAULT_TARGET_LUMINANCE;
    if(IsMultipleFeature) 
      lumi = Luminance;
    FeatureData.targetColor = "hsl(" + targetHue + ", 34%, " + lumi + "%)";
    FeatureData.distractorColor = "hsl(" + distractorHue + ", 92%, "+ DEFAULT_DISTRACTOR_LUMINANCE + "%)";
    generateStimulus(FeatureData,{});
    closeModal(modalName);
}

/*

  Set the default value

 */
function useDeafult(modalName){
  initializeFeatureData();

  //the default feature is hue
  if( modalName == "hue_input_window")
    FeatureData.targetColor = "hsl(7, 92%, 50%)";
  generateStimulus(FeatureData,{});
  closeModal(modalName);
}

function submitSizeInput(modalName){
  var SizeInput = document.getElementById("size_input");
  var Size = SizeInput.value;
  initializeFeatureData(SizeFlag);
  if(SizeFlag == 'Size')
    FeatureData.tdSizeRatio = Size;
  else if(SizeFlag == 'Length')
    FeatureData.tdLengthRatio = Size;
  generateStimulus(FeatureData,{});
  closeModal(modalName);
}

function submitOrientationInput(modalName){
  var targetAngle = document.getElementById("angle_input1").value;
  var distractorAngle = document.getElementById("angle_input2").value;
  initializeFeatureData("Orientation");
  FeatureData.targetAngle = targetAngle;
  FeatureData.distractorAngle = distractorAngle;
  generateStimulus(FeatureData,{});
  closeModal(modalName);
}

function getTShapeInput(shape, shapeName){
  for (var i = 1; i <= DEFAULT_SHAPE_NUM; i++)
    document.getElementById("targetShape-" + i).style.backgroundColor = DEFAULT_COLOR;
  shape.style.backgroundColor = DEFAULT_HIGHLIGHT_COLOR;
  TargetShape = shapeName;
}

function getDShapeInput(shape, shapeName){
  for (var i = 1; i <= DEFAULT_SHAPE_NUM; i++)
    document.getElementById("distractorShape-" + i).style.backgroundColor = DEFAULT_COLOR;
  shape.style.backgroundColor = DEFAULT_HIGHLIGHT_COLOR;
  DistractorShape = shapeName;
}

function closeShapeModal(modalName)
{
  for (var i = 1; i <= DEFAULT_SHAPE_NUM; i++)
  {
    document.getElementById("targetShape-" + i).style.backgroundColor = DEFAULT_COLOR;
    document.getElementById("distractorShape-" + i).style.backgroundColor = DEFAULT_COLOR;
  }
  const modal = document.getElementById(modalName);
  modal.style.display = 'none';
}

function submitShapeInput(modalName){

  initializeFeatureData("Shape");
  //if the shapes of target and distractor are the same, hue is the "preattentive feature"
  FeatureData.targetShape = TargetShape;
  FeatureData.distractorShape = DistractorShape;
  generateStimulus(FeatureData,{});
  closeShapeModal(modalName);
}
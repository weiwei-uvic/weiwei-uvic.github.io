const DEFAULT_COLOR = "hsl(221, 34%, 50%)";
const DEFAULT_HIGHLIGHT_COLOR = "hsl(7, 92%, 50%)";
const DEFAULT_TARGET_SATURATION = 50; 
const DEFAULT_DISTRACTOR_SATURATION = 50; 
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
    var targetSaturationSlider = document.getElementById("targetSaturationSlider");
    var targetLuminanceSlider = document.getElementById("targetLuminanceSlider");
    var distractorHueSlider = document.getElementById("distractorHueSlider");
    var distractorSaturationSlider = document.getElementById("distractorSaturationSlider");
    var distractorLuminanceSlider = document.getElementById("distractorLuminanceSlider");
    var targetHueNumber = document.getElementById("targetHNumber");
    var targetSaturationNumber = document.getElementById("targetSNumber");
    var targetLuminanceNumber = document.getElementById("targetLNumber");
    var distractorHueNumber = document.getElementById("distractorHNumber");
    var distractorSaturationNumber = document.getElementById("distractorSNumber");
    var distractorLuminanceNumber = document.getElementById("distractorLNumber");

    var targetSample = document.getElementById("targetHueSample");
    var distractorSample = document.getElementById("distractorHueSample");
    var ciedetxt = document.getElementById("ciede00_value");

    function colorSListnerT(){// slider listenr for target color
      var targetH = targetHueSlider.value;
      var targetS = targetSaturationSlider.value;
      var targetL = targetLuminanceSlider.value;
      var distractorH = distractorHueSlider.value;
      var distractorS = distractorSaturationSlider.value;
      var distractorL = distractorLuminanceSlider.value;
      var hslD = "hsl(" + distractorH.toString() + ", " + distractorS.toString() + "%, " + distractorL.toString() + "%)";
      var hslT = "hsl(" + targetH.toString() + ", " + targetS.toString() + "%, " + targetL.toString() + "%)";

      targetHueNumber.value = targetH;
      targetSaturationNumber.value = targetS;
      targetLuminanceNumber.value = targetL;
      targetSample.style.backgroundColor = hslT;
      let colorT = new Color(hslT);
      let colorD = new Color(hslD);
      ciedetxt.innerText = Color.deltaE(colorT, colorD, "2000").toString();
    }
    function colorSListnerD(){
      var targetH = targetHueSlider.value;
      var targetS = targetSaturationSlider.value;
      var targetL = targetLuminanceSlider.value;
      var distractorH = distractorHueSlider.value;
      var distractorS = distractorSaturationSlider.value;
      var distractorL = distractorLuminanceSlider.value;
      var hslD = "hsl(" + distractorH.toString() + ", " + distractorS.toString() + "%, " + distractorL.toString() + "%)";
      var hslT = "hsl(" + targetH.toString() + ", " + targetS.toString() + "%, " + targetL.toString() + "%)";

      distractorHueNumber.value = distractorH;
      distractorSaturationNumber.value = distractorS;
      distractorLuminanceNumber.value = distractorL;
      distractorSample.style.backgroundColor = hslD;
      let colorT = new Color(hslT);
      let colorD = new Color(hslD);
      ciedetxt.innerText = Color.deltaE(colorT, colorD, "2000").toString();
    }
    function colorNListnerT(){// Number listenr for target color
      var targetH = targetHueNumber.value;
      var targetS = targetSaturationNumber.value;
      var targetL = targetLuminanceNumber.value;
      var distractorH = distractorHueSlider.value;
      var distractorS = distractorSaturationSlider.value;
      var distractorL = distractorLuminanceSlider.value;
      var hslD = "hsl(" + distractorH.toString() + ", " + distractorS.toString() + "%, " + distractorL.toString() + "%)";
      var hslT = "hsl(" + targetH.toString() + ", " + targetS.toString() + "%, " + targetL.toString() + "%)";

      targetHueSlider.value = targetH;
      targetSaturationSlider.value = targetS;
      targetLuminanceSlider.value = targetL;
      targetSample.style.backgroundColor = hslT;
      let colorT = new Color(hslT);
      let colorD = new Color(hslD);
      ciedetxt.innerText = Color.deltaE(colorT, colorD, "2000").toString();
    }
    function colorNListnerD(){
      var targetH = targetHueSlider.value;
      var targetS = targetSaturationSlider.value;
      var targetL = targetLuminanceSlider.value;
      var distractorH = distractorHueNumber.value;
      var distractorS = distractorSaturationNumber.value;
      var distractorL = distractorLuminanceNumber.value;
      var hslD = "hsl(" + distractorH.toString() + ", " + distractorS.toString() + "%, " + distractorL.toString() + "%)";
      var hslT = "hsl(" + targetH.toString() + ", " + targetS.toString() + "%, " + targetL.toString() + "%)";

      distractorHueSlider.value = distractorH;
      distractorSaturationSlider.value = distractorS;
      distractorLuminanceSlider.value = distractorL;
      distractorSample.style.backgroundColor = hslD;
      let colorT = new Color(hslT);
      let colorD = new Color(hslD);
      ciedetxt.innerText = Color.deltaE(colorT, colorD, "2000").toString();
    }
    
    targetHueSlider.addEventListener("change", colorSListnerT);
    targetSaturationSlider.addEventListener("change", colorSListnerT);
    targetLuminanceSlider.addEventListener("change", colorSListnerT);
    distractorHueSlider.addEventListener("change", colorSListnerD);
    distractorSaturationSlider.addEventListener("change", colorSListnerD);
    distractorLuminanceSlider.addEventListener("change", colorSListnerD);

    targetHueNumber.addEventListener("input", colorNListnerT);
    targetSaturationNumber.addEventListener("input", colorNListnerT);
    targetLuminanceNumber.addEventListener("input", colorNListnerT);
    distractorHueNumber.addEventListener("input", colorNListnerD);
    distractorSaturationNumber.addEventListener("input", colorNListnerD);
    distractorLuminanceNumber.addEventListener("input", colorNListnerD);
}


function submitHueInput(modalName)
{
  var targetHueSlider = document.getElementById("targetHueSlider");
  var targetSaturationSlider = document.getElementById("targetSaturationSlider");
  var targetLuminanceSlider = document.getElementById("targetLuminanceSlider");
  var distractorHueSlider = document.getElementById("distractorHueSlider");
  var distractorSaturationSlider = document.getElementById("distractorSaturationSlider");
  var distractorLuminanceSlider = document.getElementById("distractorLuminanceSlider");
  var targetHue = targetHueSlider.value;
  var distractorHue = distractorHueSlider.value;
  var targetLumi = targetLuminanceSlider.value;
  var distractorLumi = distractorLuminanceSlider.value;
  var targetSatu = targetSaturationSlider.value;
  var distractorSatu = distractorSaturationSlider.value;
  // Call this function makes sure there is only one feature that's changing, 
  // all the rest will maintain the default value
  initializeFeatureData("Color");
  var lumi = DEFAULT_TARGET_LUMINANCE;
  if(IsMultipleFeature) 
    lumi = Luminance;
  FeatureData.targetColor = "hsl(" + targetHue +", " + targetSatu + "%, " + targetLumi + "%)";
  FeatureData.distractorColor = "hsl(" + distractorHue + ", " + distractorSatu + "%, " + distractorLumi + "%)";
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
  //FeatureData.tdLengthRatio = 2; // This line is only to test another choice of shape size
  generateStimulus(FeatureData,{});
  closeShapeModal(modalName);
}


/* ALLG1 TEACHING ONLINE EXPERIMENTS
 * mapping the blindspot
  * 2019
  */

 jsPsych.plugins["allg1-blindspot"] = (function() {

    var plugin = {};
  
    plugin.info = {
      name: "allg1-blindspot",
      parameters: {
        x: {
          type: jsPsych.plugins.parameterType.INT, // x grid position of target, relative to target area
          default: undefined
        },
        y: {
          type: jsPsych.plugins.parameterType.INT, // y grid position of target
          default: undefined
        },
        sizeX: {
            type: jsPsych.plugins.parameterType.INT, // grid size in x dimension
            default: undefined
        },
        sizeY: {
            type: jsPsych.plugins.parameterType.INT, // grid size in y dimension
            default: undefined
        }
      }
    }
  
    plugin.trial = function(display_element, trial) {

        var targetX   = trial.x;
        var targetY   = trial.y;
        var gridSizeX = trial.sizeX;
        var gridSizeY = trial.sizeY;

        var fixSize        = 10;   // px
        var targSize       = 20;   // px
        var marginFixLeft  = 0.1;  // left margin of fix spot relative to screen width
        var marginTargVert = 0.1;  // vertical margin of targets
        var marginTargLeft = 0.2;  // left margin of targets
  
        // data saving
        var trialData = {
            targetX: trial.x,
            targetY: trial.y,
            gridSizeX: gridSizeX,
            gridSizeY: gridSizeY,
            screenX: window.innerWidth,
            screenY: window.innerHeight
        };    
    
        // create divs to draw stims in
        divs = {}
        // div for fix spot
        var fixLeft = marginFixLeft * window.innerWidth;
        var fixTop  = window.innerHeight / 2;
        divs['fix'] = document.createElement("div");
        divs['fix'].style.position = "absolute";
        divs['fix'].style.left = fixLeft + "px";  // left margin
        divs['fix'].style.top =  fixTop + "px";
        display_element.appendChild(divs['fix']);
    
        // div for text
        divs['text'] = document.createElement("div");
        divs['text'].style.position = "absolute";
        divs['text'].style.left = fixLeft - 30 + "px";
        divs['text'].style.top = fixTop - 40 + "px";
        display_element.appendChild(divs['text']);
    
        // div for target
        var targLeft = (marginTargLeft * window.innerWidth) + (targetX / gridSizeX * ((1 - marginTargLeft) * window.innerWidth));
        var targTop = (marginTargVert * window.innerHeight) + (targetY / gridSizeY * ((1 - 2 * marginTargVert) * window.innerHeight));
        divs['targ'] = document.createElement("div");
        divs['targ'].style.position = "absolute";
        divs['targ'].style.left = targLeft + "px";
        divs['targ'].style.top = targTop + "px";
        display_element.appendChild(divs['targ']);


        var drawFix = function(color){
            // color: blue/green
            divs['fix'].innerHTML = "<img src='jspsych/fix_"+ color + ".png'></img>";  // draw blue/green fix spot
        }

        var drawTarget = function(){
            divs['targ'].innerHTML = "<img src='jspsych/target.png'></img>";  // draw target
        }

        var drawText = function(text){
            divs['text'].innerHTML = text;
        }

        var endTrial = function(){
            display_element.removeChild(divs['fix']);
            display_element.removeChild(divs['targ']);
            display_element.removeChild(divs['text']);

            jsPsych.finishTrial(trialData);
        }

        var response = function(info){
            drawFix('blue');
            switch (info.key){
                case 78:  // n
                    trialData.responseVisible = 1;
                    drawText('Seen');
                    break;
                case 77:  // m
                    trialData.responseVisible = 0;
                    drawText('Not seen');
                    break;
            }
            
            jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: endTrial,
                valid_responses: ['space'],
                rt_method: 'performance',
                persist: false,
                allow_held_key: false
            });
        }

        drawFix('green');
        drawTarget();

        jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: response,
            valid_responses: ['n', 'm'],
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
        });

    };
  
    return plugin;
  })();
  
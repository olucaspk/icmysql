const { ReadDir } = require('../../utils/Files.js');
const { ParseArgs, ParseResponse } = require('../../utils/Parser.js');

module.exports = async function(name, func){
    const exportsPath = GetResourcePath(GetCurrentResourceName()) + "/exports";
    const exportsFiles = await ReadDir(exportsPath);
    exportsFiles.forEach(script => {
        const scriptReplacement = require(exportsPath + "/" + script);
        for(let i = 0; i < Object.keys(scriptReplacement.functions).length; i++){
            const scFunc = Object.values(scriptReplacement.functions)[i];
            if(typeof scFunc == "object") {
                for(let k = 0; k < Object.keys(scFunc).length; k++){
                    const icFunc = Object.keys(scriptReplacement.functions)[i];
                    if(icFunc == name) {
                        console.log(name)
                        AddEventHandler(`__cfx_export_${scriptReplacement.name}_${scFunc[i]}`, async function(cb){
                            return cb(await func);
                        });
                        break;
                    }
                }
            }else{
                const icFunc = Object.keys(scriptReplacement.functions)[i];
                if(icFunc == name) {
                    console.log(name)
                    AddEventHandler(`__cfx_export_${scriptReplacement.name}_${scFunc}`, async function(cb){
                        return cb(await func);
                    });
                    break;
                }
            }
        }
    });

    global.exports(name, func);
}
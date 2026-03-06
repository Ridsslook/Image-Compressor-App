const upload = document.getElementById("upload");
const compressBtn = document.getElementById("compressBtn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const downloadLink = document.getElementById("downloadLink");
const limitInfo = document.getElementById("limitInfo");
const qualitySlider = document.getElementById("quality");

const LIMIT = 3;
const COOLDOWN = 10 * 60 * 1000;

function getUsage(){
    return JSON.parse(localStorage.getItem("compressUsage")) || {count:0,time:0};
}

function setUsage(data){
    localStorage.setItem("compressUsage",JSON.stringify(data));
}

function checkLimit(){

    let data = getUsage();

    if(data.count >= LIMIT){
        let remaining = COOLDOWN - (Date.now() - data.time);

        if(remaining > 0){

            compressBtn.disabled = true;

            let minutes = Math.floor(remaining/60000);
            let seconds = Math.floor((remaining%60000)/1000);

            limitInfo.innerText = `Limit reached. Wait ${minutes}:${seconds}s`;

        }else{
            setUsage({count:0,time:0});
            compressBtn.disabled = false;
            limitInfo.innerText = "";
        }
    }else{
        compressBtn.disabled = false;
        limitInfo.innerText = `Remaining compressions: ${LIMIT - data.count}`;
    }
}

setInterval(checkLimit,1000);

compressBtn.addEventListener("click",()=>{

    const file = upload.files[0];
    if(!file) return alert("Upload image first");

    let data = getUsage();

    if(data.count >= LIMIT){
        return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function(){

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img,0,0);

        const quality = parseFloat(qualitySlider.value);

        const compressed = canvas.toDataURL("image/jpeg",quality);

        downloadLink.href = compressed;
        downloadLink.style.display="block";

        data.count++;
        data.time = Date.now();

        setUsage(data);

        checkLimit();
    }
});

checkLimit();
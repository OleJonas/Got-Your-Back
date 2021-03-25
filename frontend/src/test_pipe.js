const { spawn } = require('child_process');
const fs = require("fs");

function get_piped_data(){
    const pipe_path = "classification";
    const fd = fs.openSync(pipe_path, "r+");
    const stream = fs.createReadStream(null, {fd});

    stream.on("data", (data) =>{
        console.log("yo")
        console.log(parseInt(data))
    });

    console.log("yooo")
}
const p = spawn('python', ['scripts/realtime_test.py', ]);
let ready = false;

p.stderr.on("data", (data) =>{console.log(data.toString())})

p.stdout.on("data", (data) =>{
    console.log(data.toString())
    if(data.toString() === "ready"){
        ready == true;
        get_piped_data();
    }
});

//setTimeout(get_piped_data, 5000)



//const classifications = []; // Store readings


//sensor.stderr.on('data', function(data) {console.log(String.fromCharCode.apply(null,data));});

/*let count = 0
fifo.on("exit", function(status) {
    console.log("Pipe created")

    const fd = fs.openSync(pipe_path, "r+");
    let fifo_read = fs.createReadStream(null, {fd});

    console.log("Reading...")

    fifo_read.on('data', data => {

        let classification = parseInt(data)
        console.log(classification)
    });

    /*
    // Coerce Buffer object to Float
    let val = parseInt(data);
    if(!isNaN(val)){
        classifications.push(val)
    } else{
        val = String.fromCharCode.apply(null, data)
        classifications.push(val)
    }         
    // Log to debug

    console.log(classifications[count++]);
});*/
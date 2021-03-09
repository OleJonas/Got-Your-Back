const { spawn } = require('child_process');
const temperatures = []; // Store readings

const sensor = spawn('python', ['scripts/realtime_test.py']);

sensor.stderr.on('data', function(data) {console.log(String.fromCharCode.apply(null,data));});

sensor.stdout.on('data', function(data) {
    // Coerce Buffer object to Float
    let val = parseInt(data);
    if(!isNaN(val)){
        temperatures.push(val)
    } else{
        val = String.fromCharCode.apply(null, data)
        temperatures.push(val)
    }         
    // Log to debug

    console.log(temperatures[count++]);
});
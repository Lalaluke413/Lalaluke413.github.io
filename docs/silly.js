function init() {
    window.requestAnimationFrame(draw);
    window.requestAnimationFrame(animate_fractal);
}

function draw() {
    const ctx = document.getElementById("myCanvas").getContext("2d");

    ctx.globalCompositeOperation = "destination-over";
    ctx.clearRect(0, 0, 300, 300); // clear canvas

    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.strokeStyle = "rgba(0, 153, 255, 0.4)";
    ctx.save();

    const time = new Date();

    ms = time.getMilliseconds();
    s = time.getSeconds();

    ctx.beginPath();
    const start = (2*Math.PI*ms)/1000-Math.PI/2; 
    const stop = (4*Math.PI*ms)/1000-Math.PI/2;
    if (s % 2 === 1) {
        ctx.arc(150, 150, 50, start, stop);
    } else {
        ctx.arc(150, 150, 50, stop, start);
    }
    
    ctx.lineWidth = 5;
    ctx.strokeStyle = "blue";
    ctx.stroke();

    window.requestAnimationFrame(draw);
}

const f1 = ms => {
    return Math.acos(ms/500-1)
}

const f2 = ms => {
    return Math.asin(ms/500-1)
}
   

function animate_fractal() {
    const time = new Date();

    ms = time.getMilliseconds();
    s = time.getSeconds();

    period = 4000; //milliseconds

    t = (ms+s*1000)%period;

    prop = Math.cos(t*Math.PI*2/period)

    console.log(prop)

    render(
        {
            'x': 200,
            'y': 200
        },
        {
            'x': .02*prop+.39,
            'y': .02*prop+.39
        }
    )


    window.requestAnimationFrame(animate_fractal);
}


function compute_next(current, constant) {
    const zr = current.x * current.x - current.y * current.y;
    const zi = 2.0 * current.x * current.y;

    return {'x': zr+constant.x, 'y': zi+constant.y};
}

function mod2(z) {
    return z.x * z.x + z.y * z.y;
}

function computeIterations(z0, constant, max_iteration) {
    zn = z0;
    iteration = 0;
    while(mod2(zn) < 4.0 && iteration < max_iteration) {
        zn = compute_next(zn, constant);
        iteration++;
    }
    return iteration;
}

function render(render_size, constant) {
    ctx = document.getElementById('myCanvas2').getContext('2d');
    
    const max_iter = 50;

    const canvas_x = ctx.canvas.width;
    const canvas_y = ctx.canvas.height;

    const scale = 1.0 /(render_size.y/2.0);
    for (let y=0;y<render_size.y; y++) {
        for (let x=0; x<render_size.x; x++) {
            const px = (x - render_size.x/2.0) * scale
            const py = (y - render_size.y/2.0) * scale
            
            const iterations = computeIterations({'x': px, 'y': py}, constant, max_iter);
            

            ctx.fillStyle = `rgba(${iterations*255/max_iter}, ${iterations*255/max_iter}, ${iterations*255/max_iter}, 1)`;
            ctx.fillRect(x*canvas_x/render_size.x, y*canvas_y/render_size.y, canvas_x/render_size.x, canvas_y/render_size.y);
        }
    }
}

init();


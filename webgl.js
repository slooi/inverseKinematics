console.log('webgl.js loaded')

// config vars
const lineRGB = [1,1,1]

const comps_per_ele = 5;

let offsetCounter = 0
const BYTES_PER_LINE = 10*4
const MAX_NUM_OF_LINES = 10000

// shader source
const vsSource = document.getElementById('vsSource').innerText
const fsSource = document.getElementById('fsSource').innerText

// canvas
const canvas = document.createElement('canvas')
canvas.width = 400
canvas.height = canvas.width
document.body.append(canvas)

let gl = canvas.getContext('webgl',{antialias:false})
if(!gl){
	gl = canvas.getContext('experimental-webgl')
}
if(!gl){
	alert('ERROR: webgl not supported.')
}

gl.viewport(0,0,canvas.width,canvas.height)
gl.clearColor(0.5,0.4,0.7,1)
gl.clear(gl.COLOR_BUFFER_BIT)

// program
const program = buildProgram()
gl.useProgram(program)

// location
// attrib
const attribLocations = []
for(let i=0;i<gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES);i++){
	attribName = gl.getActiveAttrib(program,i).name
	attribLocations[attribName] = gl.getAttribLocation(program,attribName)
}

const uniformLocations = []
for(let i=0;i<gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);i++){
	uniformName = gl.getActiveUniform(program,i).name
	uniformLocations[uniformName] = gl.getUniformLocation(program,uniformName)
}

// data
let data = [
	0,0,			1,1,1,
	-0.7,-0.3,1,1,1,
	0.8,-0.1,	1,1,1,
	0,0.8,		1,1,1,
]
let data2 = [
	0,0, 1,1,1,
]

// buffer
const dataBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER,dataBuffer)
gl.bufferData(gl.ARRAY_BUFFER,BYTES_PER_LINE*MAX_NUM_OF_LINES,gl.DYNAMIC_DRAW)

// pointer
gl.vertexAttribPointer(
	attribLocations.a_Position,
	2,
	gl.FLOAT,
	0,
	5*Float32Array.BYTES_PER_ELEMENT,
	0
)
gl.enableVertexAttribArray(attribLocations.a_Position)
gl.vertexAttribPointer(
	attribLocations.a_Color,
	3,
	gl.FLOAT,
	0,
	5*Float32Array.BYTES_PER_ELEMENT,
	2*Float32Array.BYTES_PER_ELEMENT
)
gl.enableVertexAttribArray(attribLocations.a_Color)

// texture

// unifom
gl.uniform1f(uniformLocations.u_RadInv,2/canvas.width)


function line(x1,y1,x2,y2,r=1,g=1,b=1){
	const data = new Float32Array([
		x1,y1,r,g,b,
		x2,y2,r,g,b,
	])
	// console.log(data)
	gl.bufferSubData(gl.ARRAY_BUFFER,offsetCounter,data)
	offsetCounter += BYTES_PER_LINE
}

function render(){
	gl.drawArrays(gl.LINES,0,offsetCounter/BYTES_PER_LINE*2)
}
function clear(){
	offsetCounter = 0
	gl.clear(gl.COLOR_BUFFER_BIT)
}


function buildShader(type,source){
	const shader = gl.createShader(type)
	gl.shaderSource(shader,source)
	gl.compileShader(shader)
	if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
		throw new Error('ERROR: compiling shader of type '+type+' . Info: '+gl.getShaderInfoLog(shader))
	}
	return shader
}

function buildProgram(){
	const program = gl.createProgram()
	gl.attachShader(program,buildShader(gl.VERTEX_SHADER,vsSource))
	gl.attachShader(program,buildShader(gl.FRAGMENT_SHADER,fsSource))
	gl.linkProgram(program)
	gl.validateProgram(program)

	if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
		throw new Error('ERROR: linking program. Info: '+gl.getProgramInfoLog(program))
	}
	if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS)){
		throw new Error('ERROR: validating program. Info: '+gl.getProgramInfoLog(program))
	}
	return program
}
console.log('loaded main.js')

let points = []			// x,y 3*2
let arms = [100,50,50,100]	// points.length/2 - 1
let angles = [1,0,50,100]	// points.length/2 - 1
let start = [0,0]
let end = [80,30]


for(let i=0;i<6;i++){
	const ran = 60*(Math.random()+0.3)**3
	arms[i] = 2+ran
	angles[i] = 2
}

//
let oldTime = new Date()
const fps = 20


// check if in range

// populate points
popPoints()

line(start[0],start[1],start[0]+5,start[1]+5,0,1,0)
line(end[0],end[1],end[0]+5,end[1]+5,1,0,0)
render()
console.log(points)
looper()




function eachFrame(){
	clear()
	backwardsPass()
	forwardsPass()
	render()
}


function looper(){

	if(new Date()-oldTime > 1000/fps){
		eachFrame()
		oldTime = new Date()
	}

	requestAnimationFrame(looper)
}

//
function popPoints(){
	nextPoint = start
	points.push(...start)
	for(let i=0;i<arms.length;i++){
		newPoint = findNextPoint(nextPoint[0],nextPoint[1],arms[i],angles[i])
		nextPoint=newPoint
		points.push(...nextPoint)
	}
}


// forwards pass
function backwardsPass(){
	points[points.length-1] = end[1]	// y
	points[points.length-2] = end[0]	// x
	for(let i=points.length-4;i>=0;i-=2){
		newPoint = backPoint(points[i+2],points[i+3],points[i],points[i+1],arms[i/2])
		
		points[i]	= newPoint[0]
		points[i+1]	= newPoint[1]
	}
}


function forwardsPass(){
	points[0] = start[0]
	points[1] = start[1]
	for(let i=0;i<points.length-2;i+=2){
		newPoint = backPoint(points[i],points[i+1],points[i+2],points[i+3],arms[i/2])
		
		line(points[i],points[i+1],newPoint[0],newPoint[1],0,1,1)
		
		points[i+2]	= newPoint[0]
		points[i+3]	= newPoint[1]
	}
	line( end[0],end[1],end[0]+50,end[1]+50,1,1,1)
}

render()


// FUNCTIONS
// 
// function find previous point
function backPoint(currentX,currentY,targetX,targetY,len){
	// cal angle
	const dir = Math.atan2(targetY-currentY,targetX-currentX)
	return findNextPoint(currentX,currentY,len,dir)
}

//  
function findNextPoint(x,y,len,dir){
	// input:
	//	x,y,lenght,angle
	// output:
	//  x,y
	// dir = dir/180*Math.PI
	return [x+len*Math.cos(dir),y+len*Math.sin(dir)]
}

function getRealPos(e){
	const boundingBox = canvas.getBoundingClientRect()
	const realX = e.offsetX - boundingBox.left
	const realY = e.offsetY - boundingBox.top
	return [realX,realY]
}

window.addEventListener('mousemove',e=>{
	const realPos = getRealPos(e)
	// console.log(realPos)
	end[0]= realPos[0]-canvas.width/2
	end[1]=-realPos[1]+canvas.width/2
})
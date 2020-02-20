// import './modules/polyfill'
window.onload = () => {
  const canvas = document.getElementById('gameCanvas')
  const ctx = canvas.getContext('2d')
  const framesPerSecond = 30

  const PADDLE_WIDTH = 100
  const PADDLE_THICKNESS = 10
  const PADDLE_DIST_FROM_EDGE = 60
  const BRICK_WIDTH = 100
  const BRICK_HEIGHT = 50
  const BRICK_COUNT = 8

  const brickGrid = new Array(BRICK_COUNT).fill(false)

  const resetBricks = () => {
    for (var i = 0; i < brickGrid.length; i++) {
      brickGrid[i] = true
    }

    // brickGrid.map(el => !el && true)
    console.log('reset', brickGrid)
  }

  let ballX = 75
  let ballSpeedX = 5
  let ballY = 75
  let ballSpeedY = 7
  let paddleX = 400

  let mouseX = 0
  let mouseY = 0

  const moveAll = () => {
    ballX += ballSpeedX
    ballY += ballSpeedY

    if (ballX > canvas.width || ballX < 0) {
      ballSpeedX *= -1
    }

    if (ballY < 0) {
      ballSpeedY *= -1
    }

    if (ballY > canvas.height) {
      resetBall()
    }

    const paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE
    const paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS
    const paddleLeftEdgeX = paddleX
    const paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH

    if (ballY > paddleTopEdgeY && ballY < paddleBottomEdgeY && ballX > paddleLeftEdgeX && ballX < paddleRightEdgeX) {
      ballSpeedY *= -1

      const centerOfPaddleX = paddleX + PADDLE_WIDTH / 2
      const ballDistFromPaddleCenterX = ballX - centerOfPaddleX
      ballSpeedX = ballDistFromPaddleCenterX * 0.35
    }
  }

  const colorRect = (topLeftX, topLeftY, boxWidth, boxHeight, fillColor) => {
    ctx.fillStyle = fillColor
    ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight)
  }

  const colorCircle = (centerX, centerY, radius, fillColor) => {
    ctx.fillStyle = fillColor
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
    ctx.fill()
  }

  const colorText = (text, textX, textY, fillColor) => {
    ctx.fillStyle = fillColor
    ctx.fillText(text, textX, textY)
  }

  const drawBricks = () => {
    console.log('draw bricks', brickGrid)
    for (let i = 0; i < brickGrid.length; i++) {
      if (brickGrid[i]) {
        const x = i * (BRICK_WIDTH)
        colorRect(x, 0, BRICK_WIDTH - 2, BRICK_HEIGHT, 'blue')
      }
    }
  }

  const drawAll = () => {
    colorRect(0, 0, canvas.width, canvas.height, 'black') // clear screen
    colorCircle(ballX, ballY, 10, 'white') // draw ball
    colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white') // draw paddle
    drawBricks()
    colorText(`${mouseX}, ${mouseY}`, mouseX, mouseY, 'white')
  }

  const updateAll = () => {
    moveAll()
    drawAll()
  }

  const updateMousePos = (evt) => {
    const rect = canvas.getBoundingClientRect()
    // const root = document.documentElement
    // const mouseX = evt.clientX - rect.left - root.scrollLeft
    // const mouseY = evt.clientY - rect.top - root.scrollTop
    mouseX = evt.clientX - rect.left
    mouseY = evt.clientY - rect.top

    paddleX = mouseX - PADDLE_WIDTH / 2
  }

  const resetBall = () => {
    ballX = canvas.width / 2
    ballY = canvas.height / 2
  }

  setInterval(updateAll, 1000 / framesPerSecond)

  canvas.addEventListener('mousemove', updateMousePos)
  resetBricks()
}

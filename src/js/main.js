window.onload = () => {
  const canvas = document.getElementById('gameCanvas')
  const ctx = canvas.getContext('2d')
  const framesPerSecond = 30

  const PADDLE_WIDTH = 100
  const PADDLE_THICKNESS = 10
  const PADDLE_DIST_FROM_EDGE = 60
  const BRICK_WIDTH = 80
  const BRICK_HEIGHT = 40
  const BRICK_GAP = 2
  const BRICK_COLS = 10
  const BRICK_ROWS = 7

  const brickGrid = new Array(BRICK_COLS * BRICK_ROWS).fill(false)

  const resetBricks = () => {
    for (var i = 0; i < (BRICK_COLS * BRICK_ROWS); i++) {
      // if (Math.random() < 0.5) {
      brickGrid[i] = true
      // } else {
      //   brickGrid[i] = false
      // }
    }

    // brickGrid.map(el => !el && true)
    // brickGrid[8] = false
  }

  let ballX = 75
  let ballSpeedX = 5
  let ballY = 75
  let ballSpeedY = 7
  let paddleX = 400

  let mouseX = 0
  let mouseY = 0

  const ballMove = () => {
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
  }

  const ballBrickHandling = () => {
    const ballBrickCol = Math.floor(ballX / BRICK_WIDTH)
    const ballBrickRow = Math.floor(ballY / BRICK_HEIGHT)
    const brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow)
    // colorText(`${mouseBrickCol}, ${mouseBrickRow}: ${brickIndexUnderMouse}`, mouseX, mouseY, 'white')

    if (ballBrickCol >=0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
      if (brickGrid[brickIndexUnderBall]) {
        brickGrid[brickIndexUnderBall] = false
        const prevBallX = ballX - ballSpeedX
        const prevBallY = ballY - ballSpeedY
        const prevBrickCol = Math.floor(prevBallX / BRICK_WIDTH)
        const prevBrickRow = Math.floor(prevBallY / BRICK_HEIGHT)
        let bothTestsFailed = true

        if (prevBrickCol !== ballBrickCol) {
          const adjBrickSide = rowColToArrayIndex(prevBrickCol, ballBrickRow)
          if (!brickGrid[adjBrickSide]) {
            ballSpeedX *= -1
            bothTestsFailed = false
          }
        }
        if (prevBrickRow !== ballBrickRow) {
          const adjBrickTopBot = rowColToArrayIndex(ballBrickCol, prevBrickRow)
          if (!brickGrid[adjBrickTopBot]) {
            ballSpeedY *= -1
            bothTestsFailed = false
          }
        }
        if (bothTestsFailed) {
          ballSpeedX *= -1
          ballSpeedY *= -1
        }
      }
    }
  }

  const ballPaddleHandling = () => {
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

  const moveAll = () => {
    ballMove()
    ballBrickHandling()
    ballPaddleHandling()
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

  const rowColToArrayIndex = (col, row) => col + BRICK_COLS * row

  const drawBricks = () => {
    for (let k = 0; k < BRICK_ROWS; k++) {
      for (let i = 0; i < BRICK_COLS; i++) {
        const arrayIndex = rowColToArrayIndex(i, k)
        if (brickGrid[arrayIndex]) {
          const x = i * BRICK_WIDTH
          const y = k * BRICK_HEIGHT
          colorRect(x, y, BRICK_WIDTH - BRICK_GAP, BRICK_HEIGHT - BRICK_GAP, 'blue')
        }
      }
    }
  }

  const drawAll = () => {
    colorRect(0, 0, canvas.width, canvas.height, 'black') // clear screen
    colorCircle(ballX, ballY, 10, 'white') // draw ball
    colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white') // draw paddle
    drawBricks()
    
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

    ballX = mouseX
    ballY = mouseY
    ballSpeedX = 4
    ballSpeedY = -4
  }

  const resetBall = () => {
    ballX = canvas.width / 2
    ballY = canvas.height / 2
  }

  setInterval(updateAll, 1000 / framesPerSecond)

  canvas.addEventListener('mousemove', updateMousePos)
  resetBricks()
  // resetBall()
}

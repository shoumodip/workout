const beep = new Audio("beep.wav")
const list = JSON.parse(localStorage["list"] || "[]")

function saveList() {
  localStorage["list"] = JSON.stringify(list)
}

function drawHome() {
  const create = document.createElement("button")
  create.innerText = "+"
  create.onclick = () => {
    createWorkout(list.length)
    list.push([40, 20, 3])
    saveList()
  }

  document.body.replaceChildren(create)
  for (let i = 0; i < list.length; i++) {
    createWorkout(i)
  }
}

function drawWorkout(index) {
  const top = document.createElement("div")

  const back = document.createElement("button")
  back.innerText = "←"
  back.onclick = () => drawHome()
  top.appendChild(back)

  const start = document.createElement("button")
  start.innerText = "▶"
  start.onclick = () => {
    startWorkout(index)
  }
  top.appendChild(start)

  const create = document.createElement("button")
  create.innerText = "+"
  create.onclick = () => {
    list[index].push("Exercise " + (list[index].length - 2))
    createExercise(index, list[index].length - 1)
    saveList()
  }
  top.appendChild(create)

  document.body.replaceChildren(
    top,
    createNumber(index, 0, "Work:", 10),
    createNumber(index, 1, "Rest:", 5),
    createNumber(index, 2, "Round:", 2))

  for (let i = 3; i < list[index].length; i++) {
    createExercise(index, i)
  }
}

function startWorkout(index) {
  if (list[index].length == 3) {
    alert("No exercise provided")
    return
  }

  let rest = true
  let clock = 10
  let round = 0
  let exercise = 2

  const header = document.createElement("h1")
  header.innerText = "Prepare"

  const footer = document.createElement("h1")
  footer.innerText = "Round 1"

  const counter = document.createElement("h2")
  counter.innerText = String(clock)

  document.body.replaceChildren(header, counter, footer)

  const interval = setInterval(() => {
    counter.innerText = String(--clock)

    if (clock == 3) {
      beep.play()
    }

    if (clock == 0) {
      rest = !rest
      if (rest) {
        clock = list[index][1]
        header.innerText = "Rest"

        if (exercise + 1 == list[index].length && round + 1 == list[index][2]) {
          clearInterval(interval)

          footer.innerText = ""
          counter.innerText = ""

          header.innerText = "Done!"
          setTimeout(drawHome, 2000)
          return
        }
      } else {
        clock = list[index][0]
        exercise++
        if (exercise == list[index].length) {
          round++
          exercise = 3
          footer.innerText = "Round " + (round + 1)
        }
        header.innerText = list[index][exercise]
      }
      counter.innerText = String(clock)
    }
  }, 1000)
}

function createNumber(workout, index, label, min) {
  const div = document.createElement("div")
  div.innerText = label

  const input = document.createElement("input")
  input.min = min
  input.type = "number"
  input.value = list[workout][index]
  input.onchange = () => {
    if (input.validity.valid) {
      list[workout][index] = input.value
      saveList()
    }
  }

  div.appendChild(input)

  return div
}

function createWorkout(index) {
  const div = document.createElement("div")

  const item = document.createElement("button")
  item.innerText = "Workout " + (index + 1)
  item.onclick = () => {
    drawWorkout(index)
  }
  div.appendChild(item)

  const remove = document.createElement("button")
  remove.innerText = "🗑"
  remove.className = "remove"
  remove.onclick = () => {
    list.splice(index, 1)
    saveList()
    drawHome()
  }
  div.appendChild(remove)

  document.body.appendChild(div)
}

function createExercise(workout, exercise) {
  const div = document.createElement("div")

  const item = document.createElement("input")
  item.value = list[workout][exercise]
  item.onchange = () => {
    list[workout][exercise] = item.value
    saveList()
  }
  div.appendChild(item)

  const remove = document.createElement("button")
  remove.innerText = "🗑"
  remove.className = "remove"
  remove.onclick = () => {
    list[workout].splice(exercise, 1)
    saveList()
    drawWorkout(workout)
  }
  div.appendChild(remove)

  document.body.appendChild(div)
}

window.onload = () => {
  drawHome()
}

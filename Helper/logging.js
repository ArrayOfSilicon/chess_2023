// const pastMoves = [];
let counter = 0;
const orderList = document.querySelector("ol");

function logMoves(logMoves, inTurn) {
  console.log(orderList);
  if (inTurn === "white") {
    const list = document.createElement("li");
    list.innerHTML = `<span class="leftSide">${logMoves.to}</span>`;
    orderList.appendChild(list);
  } else {
    const allLiArray = orderList.querySelectorAll('li');
    const lastLi = allLiArray[allLiArray.length - 1];
    lastLi.innerHTML += `<span>${logMoves.to}</span>`;
  }
}

export default logMoves;

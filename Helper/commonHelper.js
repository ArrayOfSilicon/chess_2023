import { globalState } from "../index.js";

// function to check if piece exists of opponent
function checkPieceOfOpponentOnElement(id, color) {
  const flatArray = globalState.flat();
  const opponentColor = color === "white" ? "BLACK" : "WHITE";

  for (let index = 0; index < flatArray.length; index++) {
    const element = flatArray[index];
    if (element.id == id) {
      if (element.piece && element.piece.piece_name.includes(opponentColor)) {
        const el = document.getElementById(id);
        el.classList.add("captureColor");
        element.captureHighlight = true;
      }
      break;
    }
  }

  return false;
}

export { checkPieceOfOpponentOnElement };

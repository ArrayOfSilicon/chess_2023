import { ROOT_DIV } from "../Helper/constants.js";
import { globalState } from "../index.js";
import { renderHighlight } from "../Render/main.js";
import { clearHightlight } from "../Render/main.js";
import { selfHighlight } from "../Render/main.js";
import { globalStateRender } from "../Render/main.js";
import { clearPreviousSelfHighlight } from "../Render/main.js";
import { moveElement } from "../Render/main.js";
import { checkPieceOfOpponentOnElement } from "../Helper/commonHelper.js";

// hightlighted or not => state
let hightlight_state = false;

// current self-highlighted square state
let selfHighlightState = null;

// in move state or not
let moveState = null;

// local function that will clear highlight with state
function clearHighlightLocal() {
  clearHightlight();
  hightlight_state = false;
}

// move piece from x-square to y-square
function movePieceFromXToY(from, to) {
  // console.log(from, to);
}

// white pawn event
function whitePawnClick({ piece }) {
  // globalStateRender();

  if (hightlight_state) return;

  clearPreviousSelfHighlight(selfHighlightState);

  // if clicked on same element twice
  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    selfHighlightState = null;
    clearHighlightLocal();
    return;
  }

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  // on initial position movement
  if (current_pos[1] == "2") {
    const hightlightSquareIds = [
      `${current_pos[0]}${Number(current_pos[1]) + 1}`,
      `${current_pos[0]}${Number(current_pos[1]) + 2}`,
    ];

    // clear board for any previous highlight
    clearHighlightLocal();

    hightlightSquareIds.forEach((hightlight) => {
      globalState.forEach((row) => {
        row.forEach((element) => {
          if (element.id == hightlight) {
            element.highlight = true;
          }
        });
      });
    });

    globalStateRender();
  } else {
    const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
      Number(current_pos[1]) + 1
    }`;
    const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
      Number(current_pos[1]) + 1
    }`;

    const captureIds = [col1, col2];

    const hightlightSquareIds = [
      `${current_pos[0]}${Number(current_pos[1]) + 1}`,
    ];

    captureIds.forEach((element) => {
      checkPieceOfOpponentOnElement(element, "white");
    });

    hightlightSquareIds.forEach((hightlight) => {
      globalState.forEach((row) => {
        row.forEach((element) => {
          if (element.id == hightlight) {
            element.highlight = true;
          }
        });
      });
    });

    globalStateRender();
  }

  // console.log(globalState);
}

// black pawn event
function blackPawnClick({ piece }) {
  // globalStateRender();

  if (hightlight_state) {
    movePieceFromXToY(selfHighlightState, piece);
    return;
  }

  clearPreviousSelfHighlight(selfHighlightState);

  // // if clicked on same element twice
  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    selfHighlightState = null;
    clearHighlightLocal();
    return;
  }

  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  // on initial position movement
  if (current_pos[1] == "7") {
    const hightlightSquareIds = [
      `${current_pos[0]}${Number(current_pos[1]) - 1}`,
      `${current_pos[0]}${Number(current_pos[1]) - 2}`,
    ];

    // clear board for any previous highlight
    clearHighlightLocal();

    hightlightSquareIds.forEach((hightlight) => {
      globalState.forEach((row) => {
        row.forEach((element) => {
          if (element.id == hightlight) {
            element.highlight = true;
          }
        });
      });
    });

    globalStateRender();
  } else {
    const hightlightSquareIds = [
      `${current_pos[0]}${Number(current_pos[1]) - 1}`,
    ];

    // clear board for any previous highlight
    clearHighlightLocal();

    hightlightSquareIds.forEach((hightlight) => {
      globalState.forEach((row) => {
        row.forEach((element) => {
          if (element.id == hightlight) {
            element.highlight = true;
          }
        });
      });
    });
  }

  globalStateRender();
  // console.log(globalState);
}

function GlobalEvent() {
  ROOT_DIV.addEventListener("click", function (event) {
    if (event.target.localName === "img") {
      const clickId = event.target.parentNode.id;
      const flatArray = globalState.flat();
      const square = flatArray.find((el) => el.id == clickId);
      if (square.piece.piece_name == "WHITE_PAWN") {
        whitePawnClick(square);
      } else if (square.piece.piece_name == "BLACK_PAWN") {
        blackPawnClick(square);
      }
    } else {
      const childElementsOfclickedEl = Array.from(event.target.childNodes);

      if (
        childElementsOfclickedEl.length == 1 ||
        event.target.localName == "span"
      ) {
        if (event.target.localName == "span") {
          const id = event.target.parentNode.id;
          moveElement(moveState, id);
          moveState = null;
        } else {
          const id = event.target.id;
          moveElement(moveState, id);
          moveState = null;
        }
      } else {
        // clear highlights
        clearHighlightLocal();
        clearPreviousSelfHighlight(selfHighlightState);
        selfHighlightState = null;
      }
    }
  });
}

export { GlobalEvent };

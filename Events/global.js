import {
  giveBishopHighlightIds,
  giveRookCapturesIds,
} from "../Helper/commonHelper.js";
import { checkSquareCaptureId } from "../Helper/commonHelper.js";
import { checkPieceOfOpponentOnElement } from "../Helper/commonHelper.js";
import { giveKingCaptureIds } from "../Helper/commonHelper.js";
import { giveQueenCapturesIds } from "../Helper/commonHelper.js";
import { checkWeatherPieceExistsOrNot } from "../Helper/commonHelper.js";
import {
  giveRookHighlightIds,
  giveBishopCaptureIds,
} from "../Helper/commonHelper.js";
import { giveKnightCaptureIds } from "../Helper/commonHelper.js";
import {
  giveKingHighlightIds,
  giveKnightHighlightIds,
} from "../Helper/commonHelper.js";
import { giveQueenHighlightIds } from "../Helper/commonHelper.js";
import { ROOT_DIV } from "../Helper/constants.js";
import { clearHightlight } from "../Render/main.js";
import { selfHighlight } from "../Render/main.js";
import { globalStateRender } from "../Render/main.js";
import { globalState, keySquareMapper } from "../index.js";
import { globalPiece } from "../Render/main.js";
import pawnPromotion from "../Helper/modalCreator.js";
import HypotheticalClass from "../Others/HypotheticalBoard.js";
import HypotheticalBoard from "../Others/HypotheticalBoard.js";

// hightlighted or not => state
let hightlight_state = false;
let inTurn = "white";
let whoInCheck = null;

function changeTurn() {
  inTurn = inTurn === "white" ? "black" : "white";
}

function checkForCheck() {
  if (inTurn === "black") {
    const whiteKingCurrentPosition = globalPiece.white_king.current_position;
    const knight_1 = globalPiece.black_knight_1.current_position;
    const knight_2 = globalPiece.black_knight_2.current_position;
    const king = globalPiece.black_king.current_position;
    const bishop_1 = globalPiece.black_bishop_1.current_position;
    const bishop_2 = globalPiece.black_bishop_2.current_position;
    const rook_1 = globalPiece.black_rook_1.current_position;
    const rook_2 = globalPiece.black_rook_2.current_position;
    const queen = globalPiece.black_queen.current_position;

    let finalCheckList = [];
    finalCheckList.push(giveKnightCaptureIds(knight_1, inTurn));
    finalCheckList.push(giveKnightCaptureIds(knight_2, inTurn));
    finalCheckList.push(giveKingCaptureIds(king, inTurn));
    finalCheckList.push(giveBishopCaptureIds(bishop_1, inTurn));
    finalCheckList.push(giveBishopCaptureIds(bishop_2, inTurn));
    finalCheckList.push(giveRookCapturesIds(rook_1, inTurn));
    finalCheckList.push(giveRookCapturesIds(rook_2, inTurn));
    finalCheckList.push(giveQueenCapturesIds(queen, inTurn));

    finalCheckList = finalCheckList.flat();
    const checkOrNot = finalCheckList.find(
      (element) => element === whiteKingCurrentPosition
    );

    if (checkOrNot) {
      whoInCheck = "white";
    }
  } else {
    const blackKingCurrentPosition = globalPiece.black_king.current_position;
    const knight_1 = globalPiece.white_knight_1.current_position;
    const knight_2 = globalPiece.white_knight_2.current_position;
    const king = globalPiece.white_king.current_position;
    const bishop_1 = globalPiece.white_bishop_1.current_position;
    const bishop_2 = globalPiece.white_bishop_2.current_position;
    const rook_1 = globalPiece.white_rook_1.current_position;
    const rook_2 = globalPiece.white_rook_2.current_position;
    const queen = globalPiece.white_queen.current_position;

    let finalCheckList = [];
    finalCheckList.push(giveKnightCaptureIds(knight_1, inTurn));
    finalCheckList.push(giveKnightCaptureIds(knight_2, inTurn));
    finalCheckList.push(giveKingCaptureIds(king, inTurn));
    finalCheckList.push(giveBishopCaptureIds(bishop_1, inTurn));
    finalCheckList.push(giveBishopCaptureIds(bishop_2, inTurn));
    finalCheckList.push(giveRookCapturesIds(rook_1, inTurn));
    finalCheckList.push(giveRookCapturesIds(rook_2, inTurn));
    finalCheckList.push(giveQueenCapturesIds(queen, inTurn));

    finalCheckList = finalCheckList.flat();
    const checkOrNot = finalCheckList.find(
      (element) => element === blackKingCurrentPosition
    );

    if (checkOrNot) {
      whoInCheck = "black";
    }
  }
}

function captureInTurn(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  return;
}

function checkForPawnPromotion(piece, id) {
  if (inTurn === "white") {
    if (
      piece?.piece_name?.toLowerCase()?.includes("pawn") &&
      id?.includes("8")
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    if (
      piece?.piece_name?.toLowerCase()?.includes("pawn") &&
      id?.includes("1")
    ) {
      return true;
    } else {
      return false;
    }
  }
}

function callbackPawnPromotion(piece, id) {
  const realPiece = piece(id);
  const currentSquare = keySquareMapper[id];
  piece.current_position = id;
  currentSquare.piece = realPiece;
  const image = document.createElement("img");
  image.src = realPiece.img;
  image.classList.add("piece");

  const currentElement = document.getElementById(id);
  currentElement.innerHTML = "";
  currentElement.append(image);
}

// move element to square with id
function moveElement(piece, id, castle) {
  const pawnIsPromoted = checkForPawnPromotion(piece, id);

  if (piece.piece_name.includes("KING") || piece.piece_name.includes("ROOK")) {
    piece.move = true;

    if (
      piece.piece_name.includes("KING") &&
      piece.piece_name.includes("BLACK")
    ) {
      if (id === "c8" || id === "g8") {
        let rook = keySquareMapper[id === "c8" ? "a8" : "h8"];
        moveElement(rook.piece, id === "c8" ? "d8" : "f8", true);
      }
    }

    if (
      piece.piece_name.includes("KING") &&
      piece.piece_name.includes("WHITE")
    ) {
      if (id === "c1" || id === "g1") {
        let rook = keySquareMapper[id === "c1" ? "a1" : "h1"];
        moveElement(rook.piece, id === "c1" ? "d1" : "f1", true);
      }
    }
  }

  const flatData = globalState.flat();
  flatData.forEach((el) => {
    if (el.id == piece.current_position) {
      delete el.piece;
    }
    if (el.id == id) {
      if (el.piece) {
        el.piece.current_position = null;
      }
      el.piece = piece;
    }
  });
  clearHightlight();
  const previousPiece = document.getElementById(piece.current_position);
  piece.current_position = null;
  previousPiece?.classList?.remove("highlightYellow");
  const currentPiece = document.getElementById(id);
  currentPiece.innerHTML = previousPiece?.innerHTML;
  if (previousPiece) previousPiece.innerHTML = "";
  piece.current_position = id;
  if (pawnIsPromoted) {
    pawnPromotion(inTurn, callbackPawnPromotion, id);
  }
  checkForCheck();
  // if(whoInCheck)
  // {
  // }
  // new HypotheticalBoard(globalState);
  if (!castle) {
    changeTurn();
  }
  // globalStateRender();
}

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
  to.piece = from.piece;
  from.piece = null;
  globalStateRender();
}

// white pawn event
function whitePawnClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let hightlightSquareIds = null;

  // on initial position movement
  if (current_pos[1] == "2") {
    hightlightSquareIds = [
      `${current_pos[0]}${Number(current_pos[1]) + 1}`,
      `${current_pos[0]}${Number(current_pos[1]) + 2}`,
    ];
  } else {
    hightlightSquareIds = [`${current_pos[0]}${Number(current_pos[1]) + 1}`];
  }

  hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);

  hightlightSquareIds.forEach((hightlight) => {
    const element = keySquareMapper[hightlight];
    element.highlight = true;
  });

  // capture id logic
  const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
    Number(current_pos[1]) + 1
  }`;
  const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
    Number(current_pos[1]) + 1
  }`;

  let captureIds = [col1, col2];
  // captureIds = checkSquareCaptureId(captureIds);

  captureIds.forEach((element) => {
    checkPieceOfOpponentOnElement(element, "white");
  });

  globalStateRender();
}

// white bishop event
function whiteBishopClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let hightlightSquareIds = giveBishopHighlightIds(current_pos);
  let temp = [];

  const { bottomLeft, topLeft, bottomRight, topRight } = hightlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));

  // insert into temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);

  // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
  hightlightSquareIds = result.flat();

  hightlightSquareIds.forEach((hightlight) => {
    const element = keySquareMapper[hightlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("white")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "white")) {
        break;
      }
    }
  }

  // let captureIds = [col1, col2];
  // console.log(captureIds);
  // // captureIds = checkSquareCaptureId(captureIds);

  // captureIds.forEach((element) => {
  //   checkPieceOfOpponentOnElement(element, "white");
  // });

  globalStateRender();
}

// black bishop event
function blackBishopClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let hightlightSquareIds = giveBishopHighlightIds(current_pos);
  let temp = [];

  const { bottomLeft, topLeft, bottomRight, topRight } = hightlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));

  // insert into temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);

  // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
  hightlightSquareIds = result.flat();

  hightlightSquareIds.forEach((hightlight) => {
    const element = keySquareMapper[hightlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("black")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "black")) {
        break;
      }
    }
  }

  // let captureIds = [col1, col2];
  // console.log(captureIds);
  // // captureIds = checkSquareCaptureId(captureIds);

  // captureIds.forEach((element) => {
  //   checkPieceOfOpponentOnElement(element, "white");
  // });

  globalStateRender();
}

// black rook
function blackRookClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let hightlightSquareIds = giveRookHighlightIds(current_pos);
  let temp = [];

  const { bottom, top, right, left } = hightlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(left));

  // insert into temp
  temp.push(bottom);
  temp.push(top);
  temp.push(right);
  temp.push(left);

  // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
  hightlightSquareIds = result.flat();

  hightlightSquareIds.forEach((hightlight) => {
    const element = keySquareMapper[hightlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("black")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "black")) {
        break;
      }
    }
  }

  // let captureIds = [col1, col2];
  // console.log(captureIds);
  // // captureIds = checkSquareCaptureId(captureIds);

  // captureIds.forEach((element) => {
  //   checkPieceOfOpponentOnElement(element, "white");
  // });

  globalStateRender();
}

// white rook click
function whiteRookClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let hightlightSquareIds = giveRookHighlightIds(current_pos);
  let temp = [];

  const { bottom, top, right, left } = hightlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(left));

  // insert into temp
  temp.push(bottom);
  temp.push(top);
  temp.push(right);
  temp.push(left);

  // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
  hightlightSquareIds = result.flat();

  hightlightSquareIds.forEach((hightlight) => {
    const element = keySquareMapper[hightlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("white")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "white")) {
        break;
      }
    }
  }

  // let captureIds = [col1, col2];
  // console.log(captureIds);
  // // captureIds = checkSquareCaptureId(captureIds);

  // captureIds.forEach((element) => {
  //   checkPieceOfOpponentOnElement(element, "white");
  // });

  globalStateRender();
}

// handle knight click
function whiteKnightClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let hightlightSquareIds = giveKnightHighlightIds(current_pos);
  // const { bottom, top, right, left } = hightlightSquareIds;
  // let temp = [];

  // let result = [];
  // result.push(checkSquareCaptureId(bottom));
  // result.push(checkSquareCaptureId(top));
  // result.push(checkSquareCaptureId(right));
  // result.push(checkSquareCaptureId(left));

  // // insert into temp
  // temp.push(bottom);
  // temp.push(top);
  // temp.push(right);
  // temp.push(left);

  // // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
  // hightlightSquareIds = result.flat();

  // hightlightSquareIds.forEach((hightlight) => {
  //   const element = keySquareMapper[hightlight];
  //   element.highlight = true;
  // });

  hightlightSquareIds.forEach((hightlight) => {
    const element = keySquareMapper[hightlight];
    element.highlight = true;
  });

  let captureIds = [];

  // for (let index = 0; index < temp.length; index++) {
  //   const arr = temp[index];

  //   for (let j = 0; j < arr.length; j++) {
  //     const element = arr[j];

  //     let checkPieceResult = checkWeatherPieceExistsOrNot(element);
  //     if (
  //       checkPieceResult &&
  //       checkPieceResult.piece &&
  //       checkPieceResult.piece.piece_name.toLowerCase().includes("white")
  //     ) {
  //       break;
  //     }

  //     if (checkPieceOfOpponentOnElement(element, "white")) {
  //       break;
  //     }
  //   }
  // }

  // let captureIds = [col1, col2];
  // console.log(captureIds);
  // // captureIds = checkSquareCaptureId(captureIds);

  hightlightSquareIds.forEach((element) => {
    checkPieceOfOpponentOnElement(element, "white");
  });

  globalStateRender();
}

// handle knight click
function blackKnightClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let hightlightSquareIds = giveKnightHighlightIds(current_pos);
  // const { bottom, top, right, left } = hightlightSquareIds;
  // console.log(hightlightSquareIds);
  // let temp = [];

  // let result = [];
  // result.push(checkSquareCaptureId(bottom));
  // result.push(checkSquareCaptureId(top));
  // result.push(checkSquareCaptureId(right));
  // result.push(checkSquareCaptureId(left));

  // // insert into temp
  // temp.push(bottom);
  // temp.push(top);
  // temp.push(right);
  // temp.push(left);

  // // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
  // hightlightSquareIds = result.flat();

  // hightlightSquareIds.forEach((hightlight) => {
  //   const element = keySquareMapper[hightlight];
  //   element.highlight = true;
  // });

  hightlightSquareIds.forEach((hightlight) => {
    const element = keySquareMapper[hightlight];
    element.highlight = true;
  });

  let captureIds = [];

  // for (let index = 0; index < temp.length; index++) {
  //   const arr = temp[index];

  //   for (let j = 0; j < arr.length; j++) {
  //     const element = arr[j];

  //     let checkPieceResult = checkWeatherPieceExistsOrNot(element);
  //     if (
  //       checkPieceResult &&
  //       checkPieceResult.piece &&
  //       checkPieceResult.piece.piece_name.toLowerCase().includes("white")
  //     ) {
  //       break;
  //     }

  //     if (checkPieceOfOpponentOnElement(element, "white")) {
  //       break;
  //     }
  //   }
  // }

  // let captureIds = [col1, col2];
  // console.log(captureIds);
  // // captureIds = checkSquareCaptureId(captureIds);

  hightlightSquareIds.forEach((element) => {
    checkPieceOfOpponentOnElement(element, "black");
  });

  globalStateRender();
}

// white queen event
function whiteQueenClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let hightlightSquareIds = giveQueenHighlightIds(current_pos);
  let temp = [];

  const {
    bottomLeft,
    topLeft,
    bottomRight,
    topRight,
    top,
    right,
    left,
    bottom,
  } = hightlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(left));

  // insert into temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);
  temp.push(top);
  temp.push(right);
  temp.push(bottom);
  temp.push(left);

  // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
  hightlightSquareIds = result.flat();

  hightlightSquareIds.forEach((hightlight) => {
    const element = keySquareMapper[hightlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("white")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "white")) {
        break;
      }
    }
  }

  // let captureIds = [col1, col2];
  // console.log(captureIds);
  // // captureIds = checkSquareCaptureId(captureIds);

  // captureIds.forEach((element) => {
  //   checkPieceOfOpponentOnElement(element, "white");
  // });

  globalStateRender();
}

// white king event
function whiteKingClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let hightlightSquareIds = giveKingHighlightIds(current_pos);
  let temp = [];

  const {
    bottomLeft,
    topLeft,
    bottomRight,
    topRight,
    top,
    right,
    left,
    bottom,
  } = hightlightSquareIds;

  let result = [];

  if (!piece.move) {
    const rook1 = globalPiece.white_rook_1;
    const rook2 = globalPiece.white_rook_2;
    if (!rook1.move) {
      const b1 = keySquareMapper["b1"];
      const c1 = keySquareMapper["c1"];
      const d1 = keySquareMapper["d1"];
      if (!b1.piece && !c1.piece && !d1.piece) {
        result.push("c1");
      }
    }
    if (!rook2.move) {
      const f1 = keySquareMapper["f1"];
      const g1 = keySquareMapper["g1"];
      if (!f1.piece && !g1.piece) {
        result.push("g1");
      }
    }
  }

  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(left));

  // insert into temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);
  temp.push(top);
  temp.push(right);
  temp.push(bottom);
  temp.push(left);

  // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
  hightlightSquareIds = result.flat();

  hightlightSquareIds.forEach((hightlight) => {
    const element = keySquareMapper[hightlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("white")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "white")) {
        break;
      }
    }
  }

  // let captureIds = [col1, col2];
  // console.log(captureIds);
  // // captureIds = checkSquareCaptureId(captureIds);

  // captureIds.forEach((element) => {
  //   checkPieceOfOpponentOnElement(element, "white");
  // });

  globalStateRender();
}
// white king event
function blackKingClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;

  let hightlightSquareIds = giveKingHighlightIds(current_pos);
  let temp = [];

  const {
    bottomLeft,
    topLeft,
    bottomRight,
    topRight,
    top,
    right,
    left,
    bottom,
  } = hightlightSquareIds;

  let result = [];

  if (!piece.move) {
    const rook1 = globalPiece.black_rook_1;
    const rook2 = globalPiece.black_rook_2;
    if (!rook1.move) {
      const b1 = keySquareMapper["b8"];
      const c1 = keySquareMapper["c8"];
      const d1 = keySquareMapper["d8"];
      if (!b1.piece && !c1.piece && !d1.piece) {
        result.push("c8");
      }
    }
    if (!rook2.move) {
      const f1 = keySquareMapper["f8"];
      const g1 = keySquareMapper["g8"];
      if (!f1.piece && !g1.piece) {
        result.push("g8");
      }
    }
  }

  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(left));

  // insert into temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);
  temp.push(top);
  temp.push(right);
  temp.push(bottom);
  temp.push(left);

  // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
  hightlightSquareIds = result.flat();

  hightlightSquareIds.forEach((hightlight) => {
    const element = keySquareMapper[hightlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("black")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "black")) {
        break;
      }
    }
  }

  // let captureIds = [col1, col2];
  // console.log(captureIds);
  // // captureIds = checkSquareCaptureId(captureIds);

  // captureIds.forEach((element) => {
  //   checkPieceOfOpponentOnElement(element, "white");
  // });

  globalStateRender();
}

// black queen event
function blackQueenClick(square) {
  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  // clear all highlights
  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let hightlightSquareIds = giveQueenHighlightIds(current_pos);
  let temp = [];

  const {
    bottomLeft,
    topLeft,
    bottomRight,
    topRight,
    top,
    right,
    left,
    bottom,
  } = hightlightSquareIds;

  let result = [];
  result.push(checkSquareCaptureId(bottomLeft));
  result.push(checkSquareCaptureId(topLeft));
  result.push(checkSquareCaptureId(bottomRight));
  result.push(checkSquareCaptureId(topRight));
  result.push(checkSquareCaptureId(top));
  result.push(checkSquareCaptureId(right));
  result.push(checkSquareCaptureId(bottom));
  result.push(checkSquareCaptureId(left));

  // insert into temp
  temp.push(bottomLeft);
  temp.push(topLeft);
  temp.push(bottomRight);
  temp.push(topRight);
  temp.push(top);
  temp.push(right);
  temp.push(bottom);
  temp.push(left);

  // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
  hightlightSquareIds = result.flat();

  hightlightSquareIds.forEach((hightlight) => {
    const element = keySquareMapper[hightlight];
    element.highlight = true;
  });

  let captureIds = [];

  for (let index = 0; index < temp.length; index++) {
    const arr = temp[index];

    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];

      let checkPieceResult = checkWeatherPieceExistsOrNot(element);
      if (
        checkPieceResult &&
        checkPieceResult.piece &&
        checkPieceResult.piece.piece_name.toLowerCase().includes("black")
      ) {
        break;
      }

      if (checkPieceOfOpponentOnElement(element, "black")) {
        break;
      }
    }
  }

  // let captureIds = [col1, col2];
  // console.log(captureIds);
  // // captureIds = checkSquareCaptureId(captureIds);

  // captureIds.forEach((element) => {
  //   checkPieceOfOpponentOnElement(element, "white");
  // });

  globalStateRender();
}

// black pawn function
function blackPawnClick(square) {
  // clear board for any previous highlight

  const piece = square.piece;

  if (piece == selfHighlightState) {
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  if (square.captureHighlight) {
    // movePieceFromXToY();
    moveElement(selfHighlightState, piece.current_position);
    clearPreviousSelfHighlight(selfHighlightState);
    clearHighlightLocal();
    return;
  }

  clearPreviousSelfHighlight(selfHighlightState);
  clearHighlightLocal();

  // highlighting logic
  selfHighlight(piece);
  hightlight_state = true;
  selfHighlightState = piece;

  // add piece as move state
  moveState = piece;

  const current_pos = piece.current_position;
  const flatArray = globalState.flat();

  let hightlightSquareIds = null;

  // on initial position movement
  if (current_pos[1] == "7") {
    hightlightSquareIds = [
      `${current_pos[0]}${Number(current_pos[1]) - 1}`,
      `${current_pos[0]}${Number(current_pos[1]) - 2}`,
    ];
  } else {
    hightlightSquareIds = [`${current_pos[0]}${Number(current_pos[1]) - 1}`];
  }

  hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);

  hightlightSquareIds.forEach((hightlight) => {
    const element = keySquareMapper[hightlight];
    element.highlight = true;
  });

  // capture logic id
  const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
    Number(current_pos[1]) - 1
  }`;
  const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
    Number(current_pos[1]) - 1
  }`;

  let captureIds = [col1, col2];
  // captureIds = checkSquareCaptureId(captureIds);

  captureIds.forEach((element) => {
    checkPieceOfOpponentOnElement(element, "black");
  });

  globalStateRender();
}

function clearPreviousSelfHighlight(piece) {
  if (piece) {
    document
      .getElementById(piece.current_position)
      .classList.remove("highlightYellow");
    // console.log(piece);
    // selfHighlight = false;
    selfHighlightState = null;
  }
}

// // black pawn event

function GlobalEvent() {
  ROOT_DIV.addEventListener("click", function (event) {
    if (event.target.localName === "img") {
      const clickId = event.target.parentNode.id;

      const square = keySquareMapper[clickId];

      if (
        (square.piece.piece_name.includes("WHITE") && inTurn === "black") ||
        (square.piece.piece_name.includes("BLACK") && inTurn === "white")
      ) {
        captureInTurn(square);
        return;
      }

      if (square.piece.piece_name == "WHITE_PAWN") {
        if (inTurn == "white") whitePawnClick(square);
      } else if (square.piece.piece_name == "BLACK_PAWN") {
        if (inTurn == "black") blackPawnClick(square);
      } else if (square.piece.piece_name == "WHITE_BISHOP") {
        if (inTurn == "white") whiteBishopClick(square);
      } else if (square.piece.piece_name == "BLACK_BISHOP") {
        if (inTurn == "black") blackBishopClick(square);
      } else if (square.piece.piece_name == "BLACK_ROOK") {
        if (inTurn == "black") blackRookClick(square);
      } else if (square.piece.piece_name == "WHITE_ROOK") {
        if (inTurn == "white") whiteRookClick(square);
      } else if (square.piece.piece_name == "WHITE_KNIGHT") {
        if (inTurn == "white") whiteKnightClick(square);
      } else if (square.piece.piece_name == "BLACK_KNIGHT") {
        if (inTurn == "black") blackKnightClick(square);
      } else if (square.piece.piece_name == "WHITE_QUEEN") {
        if (inTurn == "white") whiteQueenClick(square);
      } else if (square.piece.piece_name == "BLACK_QUEEN") {
        if (inTurn == "black") blackQueenClick(square);
      } else if (square.piece.piece_name == "WHITE_KING") {
        if (inTurn == "white") whiteKingClick(square);
      } else if (square.piece.piece_name == "BLACK_KING") {
        if (inTurn == "black") blackKingClick(square);
      }
    } else {
      const childElementsOfclickedEl = Array.from(event.target.childNodes);

      if (
        childElementsOfclickedEl.length == 1 ||
        event.target.localName == "span"
      ) {
        if (event.target.localName == "span") {
          clearPreviousSelfHighlight(selfHighlightState);
          const id = event.target.parentNode.id;
          moveElement(moveState, id);
          moveState = null;
        } else {
          clearPreviousSelfHighlight(selfHighlightState);
          const id = event.target.id;
          moveElement(moveState, id);
          moveState = null;
        }
      } else {
        // clear highlights
        clearHighlightLocal();
        clearPreviousSelfHighlight(selfHighlightState);
      }
    }
  });
}

export { GlobalEvent, movePieceFromXToY };

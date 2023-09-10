import { initGame } from "./Data/data.js";
import { initGameRender } from "./Render/main.js";
import { GlobalEvent } from "./Events/global.js";

// will be usefull till game ends
const globalState = initGame();

initGameRender(globalState);
GlobalEvent();

export { globalState };

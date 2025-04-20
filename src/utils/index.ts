import { OtauInfo } from "../types";

function deepCopy(object:any) {
    return JSON.parse(JSON.stringify(object));
}

function findSelectedOtauIndex(board: OtauInfo[], selectedOtau: OtauInfo) {
    return board.findIndex(
        (cell: any) =>
          cell.playerId === selectedOtau.playerId && cell.id === selectedOtau.id
      );
}

export {deepCopy, findSelectedOtauIndex}
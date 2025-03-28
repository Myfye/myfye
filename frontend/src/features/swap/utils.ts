function formatAmount(amount: number, num: number) {
  const str = String(num);
  switch (input) {
    case "delete": {
      if (valArr.length === 1) {
        return ["0"];
      }
      valArr.pop();
      if (!valArr.includes(","))
        return valArr.length === 0 ? ["0"] : [...valArr];

      const newArr = formatValueArray(valArr);
      if (newArr) return newArr;
      return valArr;
    }
    case ".": {
      if (!valArr.includes(".")) return [...valArr, "."];
      return valArr;
    }
    default:
      if (valArr.length === 1 && valArr[0] === "0") {
        return [input];
      }
      const newArr = formatValueArray([...valArr, input]);
      if (newArr) return newArr;
      return valArr;
  }
}

function generateGhostValueArr(arr) {
  switch (arr.length) {
    case 0:
      return ["0", ".", "0", "0"];
    case 1:
      return arr[0] !== "0" ? [arr[0], ".", "0", "0"] : ["0", ".", "0", "0"];
    case 2:
      return arr[1] !== "." ? arr : [arr[0], ".", "0", "0"];
    case 3:
      return arr[1] === "." ? [arr[0], ".", arr[2], "0"] : ["0", ".", "0", "0"];
    case 4:
      return arr[1] === "."
        ? [arr[0], ".", arr[2], arr[3]]
        : ["0", ".", "0", "0"];
    default:
      return arr;
  }
}

function formatValueArray(arr: string[]) {
  const strValue = arr.join("").replace(",", "");

  const num = new Intl.NumberFormat("en-EN").format(strValue);

  if (num === "NaN") return false;

  return num.split("");
}

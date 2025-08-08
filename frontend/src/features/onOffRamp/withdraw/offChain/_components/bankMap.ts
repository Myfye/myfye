import bbva from "@/assets/icons/bankIcons/bbva.png";
import banamex from "@/assets/icons/bankIcons/banamex.png";
import santander from "@/assets/icons/bankIcons/santander.png";
import hsbc from "@/assets/icons/bankIcons/hsbc.png";
import banorte from "@/assets/icons/bankIcons/banorte.jpg";

/*
  40002 Banco Nacional de México (Banamex / Citibanamex)
  40012 BBVA México
  40014 Santander México
  40021 HSBC México
  40072 Banorte (Banco Mercantil del Norte)
  */

type BankType =
  | "banamex"
  | "bbva_mexico"
  | "santander_mexico"
  | "hsbc_mexico"
  | "banorte";

interface Bank {
  id: BankType;
  code: string;
  value: string;
  label: string;
  icon: string;
}

interface BankMap {
  ids: BankType[];
  banks: Record<BankType, Bank>;
}
export const bankMap: BankMap = {
  ids: ["banamex", "bbva_mexico", "santander_mexico", "hsbc_mexico", "banorte"],
  banks: {
    banamex: {
      id: "banamex",
      code: "40002",
      value: "banamex",
      label: "Banamex",
      icon: banamex,
    },
    bbva_mexico: {
      id: "bbva_mexico",
      code: "40012",
      value: "bbva_mexico",
      label: "BBVA México",
      icon: bbva,
    },
    santander_mexico: {
      id: "santander_mexico",
      code: "40014",
      value: "santander_mexico",
      label: "Santander México",
      icon: santander,
    },
    hsbc_mexico: {
      id: "hsbc_mexico",
      code: "40021",
      value: "hsbc_mexico",
      label: "HSBC México",
      icon: hsbc,
    },
    banorte: {
      id: "banorte",
      code: "40072",
      value: "banorte",
      label: "Banorte",
      icon: banorte,
    },
  },
};

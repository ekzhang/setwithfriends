import {
  conjugateCard,
  checkSet,
  checkSetUltra,
  findSet,
  filter,
} from "./util";

it("computes conjugate cards", () => {
  expect(conjugateCard("0001", "0002")).toBe("0000");
  expect(conjugateCard("1201", "1002")).toBe("1100");
  expect(conjugateCard("0112", "0112")).toBe("0112");
});

it("checks sets", () => {
  expect(checkSet("0001", "0002", "0000")).toBe(true);
  expect(checkSet("0001", "0002", "0020")).toBe(false);
  expect(checkSet("1201", "1002", "1100")).toBe(true);
  expect(checkSet("1221", "1002", "1100")).toBe(false);
  expect(checkSet("0112", "0112", "0112")).toBe(true);
  expect(checkSet("0112", "0122", "0112")).toBe(false);
});

const verifyUltra = (cards) => {
  expect(cards).toBeTruthy();
  const [a, b, c, d] = cards;
  expect(conjugateCard(a, b)).toBe(conjugateCard(c, d));
};

it("checks ultrasets", () => {
  verifyUltra(checkSetUltra("0001", "0002", "1202", "2101"));
  verifyUltra(checkSetUltra("1202", "0001", "0002", "2101"));
  verifyUltra(checkSetUltra("1202", "0001", "2101", "0002"));

  expect(checkSetUltra("0000", "1111", "2222", "1212")).toBe(null);
  expect(checkSetUltra("0000", "1111", "1010", "1212")).toBe(null);
  verifyUltra(checkSetUltra("1001", "1221", "1010", "1212"));
});

describe("findSet()", () => {
  it("can find normal sets", () => {
    for (const deck of [
      ["0112", "0112", "0112"],
      ["2012", "0112", "0112", "2011", "0112"],
      ["1111", "2222", "1010", "2021", "0201", "1021", "1022", "0112"],
    ]) {
      expect(findSet(deck, "normal")).toBeTruthy();
      expect(findSet(deck, "setchain", [])).toBeTruthy();
    }

    for (const deck of [
      ["2012", "0112", "0000", "2011", "2020"],
      ["1121", "2222", "1010", "2021", "0201", "1021", "1022", "0112"],
      ["1121", "2021", "2222", "0112", "1021", "1022", "0201", "1010"],
    ]) {
      expect(findSet(deck, "normal")).toBe(null);
      expect(findSet(deck, "setchain", [])).toBe(null);
    }
  });

  it("can find set-chains", () => {
    expect(
      findSet(["0112", "0111", "0110"], "setchain", ["1200", "0012", "2121"])
    ).toBe(null);
    expect(
      findSet(["0112", "0211", "0110"], "setchain", ["1200", "0012", "2121"])
    ).toStrictEqual(["0012", "0211", "0110"]);
  });

  it("can find ultrasets", () => {
    verifyUltra(findSet(["1202", "0001", "0002", "2101"], "ultraset"));
    verifyUltra(findSet(["1202", "0000", "0001", "0002", "2101"], "ultraset"));
    expect(findSet(["1202", "0000", "0001", "0002"], "ultraset")).toBe(null);
  });
});

describe("bad-words filter", () => {
  it("does not trigger on 'wang'", () => {
    expect(filter.isProfane("Rona Wang")).toBe(false);
    expect(filter.isProfane("wang")).toBe(false);
  });
});

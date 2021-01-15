import { conjugateCard, checkSet, checkSetUltra } from "./util";

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

it("checks ultrasets", () => {
  const verifyUltra = (cards) => {
    expect(cards).toBeTruthy();
    const [a, b, c, d] = cards;
    expect(conjugateCard(a, b)).toBe(conjugateCard(c, d));
  };

  verifyUltra(checkSetUltra("0001", "0002", "1202", "2101"));
  verifyUltra(checkSetUltra("1202", "0001", "0002", "2101"));
  verifyUltra(checkSetUltra("1202", "0001", "2101", "0002"));

  expect(checkSetUltra("0000", "1111", "2222", "1212")).toBe(null);
  expect(checkSetUltra("0000", "1111", "1010", "1212")).toBe(null);
  verifyUltra(checkSetUltra("1001", "1221", "1010", "1212"));
});

/** @format */

function tokenize(input) {
  // convert negative contractions into negate_<word>
  return $.map(
    input
      .replace(".", "")
      .replace("/ {2,}/", " ")
      .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "")
      .toLowerCase()
      .replace(/\w+['’]t\s+(a\s+)?(.*?)/g, "negate_$2")
      .split(" "),
    $.trim
  );
}

function sentiment(phrase) {
  var tokens = tokenize(phrase),
    score = 0,
    words = [],
    positive = [],
    negative = [];

  // Iterate over tokens
  var len = tokens.length;
  const verdicts = {};
  tokens.forEach((element) => {
    verdicts[element] = null;
  });
  while (len--) {
    (score = 0), (words = []), (positive = []), (negative = []);
    var obj = tokens[len];
    var negate = obj.startsWith("negate_");

    if (negate) obj = obj.slice("negate_".length);

    if (!afinn.hasOwnProperty(obj)) continue;

    var item = afinn[obj];

    words.push(obj);
    if (negate) item = item * -1.0;
    if (item > 0) positive = [obj];
    if (item < 0) negative = [obj];

    score += item;
    var verdict = score == 0 ? "NEUTRAL" : score < 0 ? "NEGATIVE" : "POSITIVE";
    verdicts[obj] = score;
  }
  return verdicts;
}

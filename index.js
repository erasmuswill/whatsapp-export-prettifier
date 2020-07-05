const util = require("util");
const glob = util.promisify(require("glob"));
const readFile = util.promisify(require("fs").readFile);

const readMessages = async () => {
  const array = await glob("testData/*.txt").then(([file]) =>
    readFile(
      file
      //   "testData/WhatsApp Chat with Katelynne Smith.txt"
    ).then((data) =>
      data
        .toString()
        .split(/(?=([01]?\d\/[12]?\d\/\d?\d, [0-2]\d:[0-5]\d - .+?: ))/)
        .filter((v, i) => i % 2 == 0)
        .map((v) => {
          let time = v
            .match(/([01]?\d\/[12]?\d\/\d?\d, [0-2]\d:[0-5]\d(?= - ))/)[0]
            .split(", ");
          let author;
          if (v.includes(""))
            if (v.includes("'s security code changed. Tap for more info."))
              author = v.match(
                /((?<=([01]?\d\/[12]?\d\/\d?\d, [0-2]\d:[0-5]\d - )).+?(?='s))/
              );
            else
              author = v.match(
                /((?<=([01]?\d\/[12]?\d\/\d?\d, [0-2]\d:[0-5]\d - )).+?(?=: ))/
              );
          let message = v.split(": ");
          message.shift();
          //   console.log(message);
          message =
            message.length > 1
              ? message.join(": ")
              : message.length === 1 && message[0];
          message = message && message.trim();
          return { time, author: author && author[0], message };
        })
        .filter(({ message }) => message)
    )
  );

  //   console.log(JSON.stringify(array));
  console.table(array);
};

readMessages();

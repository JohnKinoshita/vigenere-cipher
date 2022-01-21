import isEmpty from "validator/lib/isEmpty";
import isAlpha from "validator/lib/isAlpha";

const form = document.getElementById("form") as HTMLFormElement;
const inputMessage = document.getElementById(
  "inputMessage"
) as HTMLTextAreaElement;
let inputKey = document.getElementById("inputKey") as HTMLInputElement;
const results = document.getElementById("results") as HTMLTextAreaElement;
const randomKeyGenBtn = document.getElementById(
  "randomKeyGenBtn"
) as HTMLButtonElement;

function getRandomKey(): void {
  inputKey.value = "";
  let numOfChar = Math.floor(Math.random() * (15 - 3) + 3);
  for (let i = 0; i < numOfChar; i++) {
    inputKey.value += String.fromCharCode(
      Math.floor(Math.random() * (90 - 65) + 65)
    );
  }
}

function getKeyCharCodeArray(): number[] {
  let keyCharCodeArray = [];
  const keyValue: string = inputKey.value
    .trim()
    .toUpperCase()
    .replaceAll(/\s+/g, "");
  inputKey.value = keyValue;
  for (let i = 0; i < keyValue.length; i++) {
    let keyCharCode = keyValue.charCodeAt(i);
    keyCharCodeArray[i] = keyCharCode - 65;
  }
  return keyCharCodeArray;
}

function encryptMessage(): void {
  let encryptedMessage: string = "";
  let keyCharCodeArray: number[] = getKeyCharCodeArray();
  let count = 0;
  for (let i = 0; i < inputMessage.value.length; i++) {
    let messageCharCode = inputMessage.value.trim().toUpperCase().charCodeAt(i);
    if (
      messageCharCode < "A".charCodeAt(0) ||
      messageCharCode > "Z".charCodeAt(0)
    ) {
      let nonLetterChars = inputMessage.value.charAt(i);
      encryptedMessage += nonLetterChars;
    } else {
      messageCharCode = messageCharCode - 65;
      let encryptedCharCode =
        ((keyCharCodeArray[count++ % keyCharCodeArray.length] +
          messageCharCode) %
          26) +
        65;
      encryptedMessage += String.fromCharCode(encryptedCharCode);
    }
  }
  results.value = encryptedMessage;
}

function decryptMessage(): void {
  let encryptedMessage: string = "";
  let keyCharCodeArray: number[] = getKeyCharCodeArray();
  for (let i = 0; i < keyCharCodeArray.length; i++) {
    keyCharCodeArray[i] = 26 - keyCharCodeArray[i];
  }
  let count = 0;
  for (let i = 0; i < inputMessage.value.length; i++) {
    let messageCharCode = inputMessage.value.trim().toUpperCase().charCodeAt(i);
    if (
      messageCharCode < "A".charCodeAt(0) ||
      messageCharCode > "Z".charCodeAt(0)
    ) {
      let nonLetterChars = inputMessage.value.charAt(i);
      encryptedMessage += nonLetterChars;
    } else {
      messageCharCode = messageCharCode - 65;
      let encryptedCharCode =
        ((keyCharCodeArray[count++ % keyCharCodeArray.length] +
          messageCharCode) %
          26) +
        65;
      encryptedMessage += String.fromCharCode(encryptedCharCode);
    }
  }
  results.value = encryptedMessage;
}

randomKeyGenBtn.onclick = getRandomKey;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  setSuccessFor(inputMessage, "");
  setSuccessFor(inputKey, "");
  if (isEmpty(inputMessage.value, { ignore_whitespace: true })) {
    setErrorFor(inputMessage, "Message cannot be blank");
  } else if (isEmpty(inputKey.value, { ignore_whitespace: true })) {
    setErrorFor(inputKey, "Key cannont be blank");
  } else if (!isAlpha(inputKey.value)) {
    setErrorFor(inputKey, "Key must only use alphabetical characters");
  } else if (e.submitter!.outerHTML.includes("encryptBtn")) {
    encryptMessage();
  } else {
    decryptMessage();
  }
});

function setErrorFor(input: HTMLElement, message: string): void {
  const small = input.parentElement!.querySelector("small");
  input.classList.add("ring-red-600");
  input.classList.add("ring-2");
  small!.innerText = message;
}

function setSuccessFor(input: HTMLElement, message: string): void {
  const small = input.parentElement!.querySelector("small");
  inputMessage.classList.remove("ring-red-600");
  inputKey.classList.remove("ring-red-600");
  small!.innerText = message;
}

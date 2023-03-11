const CHAR_STR = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';

export function randomStr(length) {
  let randomStr = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * CHAR_STR.length)
    randomStr += CHAR_STR[randomIndex]
  }
  return randomStr
}

/** Demo session flag: logout / inactivity timeout marks the session as ended,
 *  and the shell refuses entry (back-button included) until the next sign-in.
 *  A fresh browser session carries no flag, so demo deep-links still work. */
const KEY = 'sfmp.session.ended'

export const startSession = () => sessionStorage.removeItem(KEY)
export const endSession = () => sessionStorage.setItem(KEY, '1')
export const sessionEnded = () => sessionStorage.getItem(KEY) === '1'

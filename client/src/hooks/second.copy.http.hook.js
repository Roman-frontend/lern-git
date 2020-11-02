export const reduxServer = async ( url, token, method="GET", body=null ) => {
  try {
    const headers = {}

    headers['authorization'] = token

    if ( body ) {
      /**передаємо body на сервер як строку а не обєкт */
      body = JSON.stringify(body)
      /**Щоб на сервері пирйняти json */
      headers['Content-Type'] = 'application/json'
    }

    console.log("http request", url, headers, method, body)

    const response = await fetch(url, {method, body, headers})
    const data = await response.json()

    if (!response.ok) {
    	throw new Error(data.message || 'Щось пішло не так ')
    }

    console.log("http data ", data)
    return data

  } catch (e) {
    if ( url.match(/\/api\/chat\/post-message/gi) ) return "403"
    throw e
  }
}

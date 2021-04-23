export const reduxServer = async (url, token, method = 'GET', body = null) => {
  try {
    const headers = {};

    headers['authorization'] = token;

    if (body) {
      /**передаємо body на сервер як строку а не обєкт */
      body = JSON.stringify(body);
      /**Щоб на сервері пирйняти json */
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, { method, body, headers });
    const data = await response.json();

    if (!response.ok) {
      console.log('Щось пішло не так(');
      throw new Error(data.message || 'Щось пішло не так ');
    }

    return data;
  } catch (e) {
    console.log('http response error ', e);
    if (url.match(/\/api\/chat\/post-message/gi)) {
      return { messages: '403' };
    } else return { e, messages: '403' };
    throw e;
  }
};

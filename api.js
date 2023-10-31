class API {
  /**
   * Create a new API instance.
   * @param {string} baseUrl - The base URL for API requests.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Create a new task.
   * @param {string} cookie - Pre-authorized cookie.
   * @param {string} Text - Text/description of the task.
   * @param {string} Date - Due date of the task.
   * @returns {Promise<Response>} Response from the server.
   */
  createTask(cookie, Text, Date) {
    const url = new URL('/api/v1/tasks', this.baseUrl);
    const data = { Text, Date };
    const headers = {
      'Content-Type': 'application/json',
      'Cookie': `it210_session=${cookie}`
    };
    return fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
  }

  /**
   * Reads all task items.
   * @param {string} cookie - Pre-authorized cookie.
   * @returns {Promise<Response>} Response from the server.
   */
  readAllTasks(cookie) {
    const url = new URL('/api/v1/tasks', this.baseUrl);
    const headers = {
      'Cookie': `it210_session=${cookie}`
    };
    return fetch(url.toString(), {
      method: 'GET',
      headers
    });
  }

  /**
   * Reads a task item.
   * @param {string} cookie - Pre-authorized cookie.
   * @param {string} taskId - unique id of a task
   * @returns {Promise<Response>} Response from the server.
   */
  readTask(cookie, taskId) {
    const url = new URL('/api/v1/tasks/'+taskId, this.baseUrl);
    const headers = {
      'Cookie': `it210_session=${cookie}`
    };
    return fetch(url.toString(), {
      method: 'GET',
      headers
    });
  }

  /**
   * Updates the status of a task.
   * @param {string} cookie - Pre-authorized cookie.
   * @param {string} taskId - unique id of a task
   * @param {boolean} Done - status of a task: true for done, false for not done.
   * @returns {Promise<Response>} Response from the server.
   */
  updateTask(cookie, taskId, Done) {
    const url = new URL('/api/v1/tasks/'+taskId, this.baseUrl);
    const headers = {
      'Content-Type': 'application/json',
      'Cookie': `it210_session=${cookie}`
    };
    return fetch(url.toString(), {
      method: 'PUT',
      headers,
      body: JSON.stringify({ Done: Done })
    });
  }

  /**
   * dlelets a task item.
   * @param {string} cookie - Pre-authorized cookie.
   * @param {string} taskId - unique id of a task
   * @returns {Promise<Response>} Response from the server.
   */
  deleteTask(cookie, taskId) {
    const url = new URL('/api/v1/tasks/'+taskId, this.baseUrl);
    const headers = {
      'Cookie': `it210_session=${cookie}`
    };
    return fetch(url.toString(), {
      method: 'DELETE',
      headers,
    });
  }

  /**
   * read user info.
   * @param {string} cookie - Pre-authorized cookie.
   * @returns {Promise<Response>} Response from the server.
   */
  readCurrentUser(cookie) {
    const url = new URL('/api/v1/user', this.baseUrl);
    const headers = {
      'Content-Type': 'application/json',
      'Cookie': `it210_session=${cookie}`
    };
    return fetch(url.toString(), {
      method: 'GET',
      headers
    });
  }
}

if (require.main === module) {
  // Here is where you can test your API methods.
  const baseUrl = 'https://s1.cf-itc210.net';
  const cookie = 's%3AgQSzVI5FfLjcIbpJNM2EQx9VwMz-bdZE.MSD2lQL9cLG8fSXtrhv58XVWEgeX0j%2BVw3hBrzflbYw';
  const api = new API(baseUrl);

  // As an example, here is some code you could use to test the `createTask` method.
  api.createTask(cookie, 'Test the API', '2023-01-01')
    .then((response) => {
      console.log(response.ok);
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  api.readAllTasks(cookie)
    .then((response) => {
      console.log("readAllTasks: "+response.ok);
      console.log("readAllTasks: "+response.status);
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("readAllTasks: "+error);
    });

  api.readTask(cookie, '6539988efae6d717d28f5e88')
    .then((response) => {
      console.log("readTask: "+response.ok);
      console.log("readTask: "+response.status);
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("readTask: "+error);
    });

  api.updateTask(cookie, '653996c5fae6d717d28f5e85', true)
    .then((response) => {
      console.log("updateTask: "+response.ok);
      console.log("updateTask: "+response.status);
      return response.text;
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("updateTask: "+error);
    });

  api.deleteTask(cookie, '6539997dfae6d717d28f5e8f')
    .then((response) => {
      console.log("deleteTask: "+response.ok);
      console.log("deleteTask: "+response.status);
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("deleteTask: "+error);
    });

  api.readCurrentUser(cookie)
    .then((response) => {
      console.log("readCurrentUser: "+response.ok);
      console.log("readCurrentUser: "+response.status);
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("readCurrentUser: "+error);
    });
}

module.exports = API;

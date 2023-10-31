const API = require('./api');

/**
 * Helper function to generate random text for creating new tasks.
 * @param {number} l - How long the generated text should be (default 10).
 * @returns {string} A randomly-generated string of length `l`.
 */
function generateRandomText(l=10) {
    const characters = 'ABCDEFabcdef0123456789';
    let result = '';
    for (let i = 0; i < l; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

/**
 * Helper function to generate random date for creating new tasks.
 * @param {string|null} year - Specify a year (default null).
 * @param {string|null} month - Specify a month (default null).
 * @param {string|null} date - Specify a date (default null).
 * @returns {string} A randomly-generated string representation of a date.
 */
function generateRandomDate(year=null, month=null, date=null) {
    if (!year) {
      year = Math.floor(Math.random() * (2025 - 2000 + 1) + 2000).toString();
    }
    if (!month) {
      month = (Math.floor(Math.random() * 12) + 1).toString();
    }
    if (!date) {
      date = (Math.floor(Math.random() * 28) + 1).toString();
    }
    return `${year}-${month.padStart(2, '0')}-${date.padStart(2, '0')}:T00:00:00.000Z`;
}

// Use these values to test each server
// TODO: update the cookie values with your own
const {baseUrl, cookie} = {baseUrl: 'https://s1.cf-itc210.net', cookie: 's%3AgQSzVI5FfLjcIbpJNM2EQx9VwMz-bdZE.MSD2lQL9cLG8fSXtrhv58XVWEgeX0j%2BVw3hBrzflbYw'} // For s1
// const {baseUrl, cookie} = {baseUrl: 'https://s2.cf-itc210.net', cookie: 's%3AgQSzVI5FfLjcIbpJNM2EQx9VwMz-bdZE.MSD2lQL9cLG8fSXtrhv58XVWEgeX0j%2BVw3hBrzflbYw'} // For s2
// const {baseUrl, cookie} = {baseUrl: 'https://s3.cf-itc210.net', cookie: 's%3AgQSzVI5FfLjcIbpJNM2EQx9VwMz-bdZE.MSD2lQL9cLG8fSXtrhv58XVWEgeX0j%2BVw3hBrzflbYw'} // For s3
// const {baseUrl, cookie} = {baseUrl: 'https://s4.cf-itc210.net', cookie: 's%3AgQSzVI5FfLjcIbpJNM2EQx9VwMz-bdZE.MSD2lQL9cLG8fSXtrhv58XVWEgeX0j%2BVw3hBrzflbYw'} // For s4

// Tests for the API
describe('API Tests', () => {
    let api = new API(baseUrl);

    /* Tests that should pass */

    test('CREATE', async () => {
        /* Test if creating a task is successful.

        This is an example test:
            - Create the task w/dummy data
            - Verify that the task was created
            - Delete the task we created

        You will be required to implement the other tests
        that are defined in API Tests.
        */
        
        // Create task
        const Text = generateRandomText();
        const Date = generateRandomDate();
        let response = await api.createTask(cookie, Text, Date);
        expect(response.ok).toBe(true);
        let task = await response.json();

        // Verify that the response data is as expected
        expect(task.Text).toEqual(Text);
        expect(task.Date).toEqual(Date);
        expect(task.Done).toBe(false);
        expect(task).toHaveProperty('UserId');

        // Cleanup - we don't want to conflict with other tests or have a test task in our database
        api.deleteTask(cookie, task._id);
    });

    test('READ ONE', async () => {
        // Create task
        const Text = generateRandomText();
        const Date = generateRandomDate();
        let response = await api.createTask(cookie, Text, Date);
        expect(response.ok).toBe(true);
        let task = await response.json();

        // Read the task
        response = await api.readTask(cookie, task._id);
        expect(response.ok).toBe(true);
        let readTask = await response.json();

        // Verify that the response data is as expected
        expect(readTask.Text).toEqual(Text);
        expect(readTask.Date).toEqual(Date);
        expect(readTask.Done).toBe(false);
        expect(readTask).toHaveProperty('UserId');

        // Cleanup
        api.deleteTask(cookie, task._id);
    });

    test('READ ALL', async () => {
        // Create tasks
        const Text1 = generateRandomText();
        const Date1 = generateRandomDate();
        let response1 = await api.createTask(cookie, Text1, Date1);
        expect(response1.ok).toBe(true);
        let task1 = await response1.json();

        const Text2 = generateRandomText();
        const Date2 = generateRandomDate();
        let response2 = await api.createTask(cookie, Text2, Date2);
        expect(response2.ok).toBe(true);
        let task2 = await response2.json();

        // Read all tasks
        let response = await api.readAllTasks(cookie);
        expect(response.ok).toBe(true);
        let tasks = await response.json();

        // Verify that the response data includes the tasks we created
        expect(tasks).toEqual(expect.arrayContaining([expect.objectContaining(task1), expect.objectContaining(task2)]));

        // Cleanup
        api.deleteTask(cookie, task1._id);
        api.deleteTask(cookie, task2._id);
    });
    
    test('UPDATE', async () => {
        // Create a task
        const Text = generateRandomText();
        const Date = generateRandomDate();
        let response = await api.createTask(cookie, Text, Date);
        expect(response.ok).toBe(true);
        let task = await response.json();

        // Update the task
        const Done = true;
        response = await api.updateTask(cookie, task._id, Done);
        expect(response.ok).toBe(true);
        let updatedTask = await response.json();

        // Verify that the task was updated
        expect(updatedTask.Text).toEqual(Text);
        expect(updatedTask.Date).toEqual(Date);
        expect(updatedTask.Done).toBe(Done);
        expect(updatedTask).toHaveProperty('UserId');

        // Cleanup - delete the task
        api.deleteTask(cookie, task._id);
    });

    test('DELETE', async () => {
        // Create task
        const Text = generateRandomText();
        const Date = generateRandomDate();
        let response = await api.createTask(cookie, Text, Date);
        expect(response.ok).toBe(true);
        let task = await response.json();

        // Delete task
        response = await api.deleteTask(cookie, task._id);
        expect(response.ok).toBe(true);

        // Verify that the task was deleted
        response = await api.readTask(cookie, task._id);
        expect(response.ok).toBe(false);
    });

    test('READ USER', async () => {
        // Read user info
        let response = await api.readCurrentUser(cookie);
        expect(response.ok).toBe(true);
        let user = await response.json();

        // Verify that the response data is as expected
        expect(user).toHaveProperty('UserName');
        expect(user).toHaveProperty('Email');
        expect(user).toHaveProperty('id');
    });

    /* Tests that should fail */

    test('READ ONE NONEXISTENT', async() => {
        // Try to read a task that doesn't exist
        const taskId = generateRandomText(24);
        let response = await api.readTask(cookie, taskId);

        // Verify that the status code is 404
        expect(response.status).toBe(404);
    });
    
    test('DELETE NONEXISTENT', async() => {
        // Try to delete a task that doesn't exist
        const taskId = generateRandomText(24);
        let response = await api.deleteTask(cookie, taskId);

        // Verify that the response status is 404
        expect(response.status).toBe(404);
    });
    
    test('UPDATE NONEXISTENT', async() => {
       // Try to read a task that doesn't exist
       const taskId = generateRandomText(24);
       let response = await api.readTask(cookie, taskId);

       // Verify that the response status is 404
       expect(response.status).toBe(404);
    });
    
    test('DELETE INVALID ID', async() => {
       // Try to delete a task that doesn't exist
       const taskId = generateRandomText(23);
       let response = await api.deleteTask(cookie, taskId);

       // Verify that the response status is 404
       expect(response.status).toBe(500);
    });
    
    test('READ ALL NO COOKIE', async() => {
        // Try to read all tasks without a cookie
        let response = await api.readAllTasks();

        // Verify that the response status is 401
        expect(response.status).toBe(401);
    });
    
    test('CREATE NOT ENOUGH DATA', async() => {
       // Try to create a task without enough data
        const text = '';
        const date = '';
        let response = await api.createTask(cookie, text, date);

        // Verify that the response status is 500
        expect(response.status).toBe(500);
    });
    
});

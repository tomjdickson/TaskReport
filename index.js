// const express = require('express');
// const app = express();
require('dotenv').config({path: './data/production.env'});
const nodemailer = require('nodemailer');\
const trello = require('./plugins/trello');

// Extend functionality of Date.prototype to get Week of the year
Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

async function generateReport () {
    // Import configuration provided by ENV file
    let destinationAddress = process.env.TO_ADDRESS;
    let account = {
        user: process.env.SMTP_ACCOUNT,
        pass: process.env.SMTP_PASS
    }

    // Generate Week Number
    let weekNumber = new Date().getWeek();

    // Process Trello Information
    let trelloData = {
        openProjects: [trello.getOpen()],
        tasksClosedLastWeek: trello.getProgress(),
    }

    let htmlTemplate = `
        <h1>Week ` + weekNumber + ` Work Status</h1>
        <br />
        <h2>Current Open Projects</h2>
        <li>Project 1 - 5 Items Open - 3 In Backlog 2 In Progress</li>
        <ul>
            <li>Task 1 Lastest Update: Well today I wrote some stuff here to test it out, was really interesting</li>
            <li>Task 2 Latest Update: Figured out how to spell "latest" in this update, we will see how I progress in the future</li>
        </ul>
        <li>Project 2</li>
        <li>Project 3</li>
        <li>Project 4</li>
    `
    let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Trello Work Status" <trello@distinctict.com.au>', // sender address
        to: destinationAddress, // list of receivers
        subject: 'W45 - Work Status', // Subject line
        text: 'Looks like you are using a plain text email client, at the moment I cannot help you unless you help yourself.', // plain text body
        html: htmlTemplate
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

generateReport().catch(console.error);
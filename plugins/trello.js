const axios = require('axios');
module.exports.getOpen = function () {
    let ignoreLists = ['Inbox']
    let data = [
        {
            listName: 'Unity',
            cards: [
                {
                    cardName: 'Develop UnityAuth'
                }
            ]
        }
    ]
    return data 
}
module.exports.getProgress = function () {
    // Get previous weeks progress.
    // What was updated (Commented, checklists, labels, hoved)
}

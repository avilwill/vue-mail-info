// This file contains randomly generated ticket data for testing and demonstration purposes.
// Each ticket has a title, content, status flags, type, date, and optional attachments.
import moment from 'moment';

export default [
    {
        title: 'Confirm your subscription',
        content: `
            <p>Hello Bo,</p>
            <p>Thank you for subscribing to our newsletter!</p>
            <p>Before we can start spamming your mailbox, please confirm your subscription by clicking the below link.</p>
            <p><a href="#">Confirm Subscription</a></p>
            <p>Thanks again!</p>
        `,
        isImportant: false,
        isDone: false,
        inProgress: true,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment(),
        attachments: []
    },
    {
        title: 'CrunchBase Daily',
        content: `
            <p>Here's what happened yesterday.</p>
            <ul>
                <li>Seed Capital announced a $1 billion investment in Coding Explained. The company's CEO, Bo Andersen, comments that he is proud of the investment, and that this capital was needed for completing the company's major project; its Vue.js course.</li>
                <li>Coding Explained's YouTube channel once again sets new view record, for the 400th day in a row.</li>
                <li>Cats are still cute, according to major research carried out by Gartner. "Shocking," the company states in its latest press release, following the breaking news.</li>
            </ul>
            <p>Try to pay more attention next time.</p>
        `,
        isImportant: false,
        isDone: false,
        inProgress: true,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment(),
        attachments: []
    },
    {
        title: 'Design',
        content: `
            <p>Hey Bo, here's the design that you requested.</p>
            <p>Let me know what you think. Hope you like it!</p>
            <p>Sarah</p>
        `,
        isImportant: false,
        isDone: false,
        inProgress: true,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment(),
        attachments: [
            {
                fileName: 'design.psd',
                size: 14700000
            }
        ]
    }
]
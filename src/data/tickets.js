// This file contains randomly generated ticket data for testing and demonstration purposes.
// Each ticket has a title, content, status flags, type, date, and optional attachments.
import moment from 'moment';

export default [
    {
        code: 'DW-121',
        title: 'Designing apps with Vue.js',
        content: `
            <p>This is a fake note for showing</p>
            <p>You recently completed a purchase, and we'd like to know how we did. Your feedback is very important to us!</p>
            <p>Please click the following link to complete the survey. We're not going to lie, it will take way more than 5 minutes.</p>
        `,
        isPriority: false,
        isDone: false,
        inProgress: false,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment().subtract(10, 'minutes'),
        attachments: []
    },
    {
        code: 'DW-122',
        title: 'Code Review Checklist',
        content: `
            <p>Hello Bo,</p>
            <p>We noticed that your account was used to sign in from a new device, and we're pretty worried about it.</p>
            <p>It looks like the login came from <i class="fa fa-globe" aria-hidden="true"></i> <strong>Moscow, Russia</strong>, so unless you are on vacation, you're probably in big trouble.</p>
            <p>We just thought we'd let you know.</p>
            <p>Good luck with that!</p>
            <p><strong>Google Security Team</strong></p>
        `,
        isPriority: false,
        isDone: false,
        inProgress: false,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment().subtract(30, 'minutes'),
        attachments: []
    },
    {   code: 'DW-123',
        title: 'Implenting API Endpoints',
        content: `
            <p>Hello Bo,</p>
            <p>This is just to notify you that someone (hopefully you) has reset your Facebook password.</p>
            <p>The Facebook Team</p>
        `,
        isPriority: true,
        isDone: false,
        inProgress: false,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment().subtract(75, 'minutes'),
        attachments: []
    },
    {   code: 'DW-124',
        title: 'Backend vs Frontend Development',
        content: `
            <p>Hello Bo,</p>
            <p>Thank you for booking your stay on Hotels.com.</p>
            <p>You will find your reservation details attached to this message.</p>
            <p>We hope that you enjoy your stay!</p>
        `,
        isPriority: true,
        isDone: false,
        inProgress: false,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment().subtract(2, 'days'),
        attachments: [
            {
                fileName: 'booking.pdf',
                size: 1000000
            }
        ]
    },
    {   code: 'DW-125',
        title: "GitHub Essentials",
        content: `
            <p>Hey, want to grab a cup of coffee soon?</p>
            <p>Let me know if you get this, because who really uses e-mail these days?</p>
        `,
        isPriority: false,
        inProgress: false,
        onDeck: true,
        qaTesting: false,
        isDone: false,
        type: 'active',
        date: moment().subtract(7, 'days'),
        attachments: []
    },
    {   code: 'DW-126',
        title: 'IDE Recommendations',
        content: `
            <p>Thank you!</p>
            <p>We have received your payment, and your products are on the way!</p>
            <p>Order ID: ABCD1234</p>
        `,
        isPriority: false,
        isDone: false,
        inProgress: false,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment().subtract(2, 'weeks'),
        attachments: [
            {
                fileName: 'order.pdf',
                size: 2000000
            }
        ]
    },
    {   code: 'DW-127',
        title: 'College Courses',
        content: `
            <p>You recently signed up for Skype, and you need to activate your account.</p>
            <p>You can do this by clicking the below link, which expires in 10 seconds, so you better hurry!</p>
            <p><a href="#">Activate your profile</a></p>
            <p>Hope you made it!</p>
            <p><strong>The Skype Team</strong></p>
        `,
        isPriority: true,
        isDone: false,
        inProgress: false,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment().subtract(2, 'months'),
        attachments: []
    },
    {   code: 'DW-128',
        title: 'CS certifications',
        content: `
            <p>Hello,</p>
            <p>This is clearly spam, and we don't even know your name. But since you don't have a spam filter, we thought we'd try to trick you into clicking the below phishing link.</p>
            <p>Oh, by the way, you are visitor number 1,000,000,000 on some unknown website, so you just won one billion dollars. True story, just click the link now!</p>
            <p><a href="#we-want-to-steal-your-password">Click Here Now</a></p>
        `,
        isPriority: false,
        isDone: true,
        inProgress: false,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment().subtract(3, 'months'),
        attachments: []
    },
    {   code: 'DW-124',
        title: 'Q-training',
        content: `
            <p>Hey Adam,</p>
            <p>I would like to talk with you about a possible collaboration. I think we would both benefit from working together.</p>
            <p>Let me know if you are interested in having a word.</p>
            <p>Best regards,</p>
            <p>Bo Andersen</p>
        `,
        isPriority: false,
        inProgress: true,
        onDeck: false,
        qaTesting: false,
        isDone: false,
        type: 'active',
        date: moment().subtract(100, 'days'),
        attachments: []
    },
    {   code: 'DW-130',
        title: 'Computer Networks',
        content: `
            <p>Hey there!</p>
            <p>I saw that you have a guitar on sale. I never played an instrument, but I figured I'd be super good at it.</p>
            <p>Even though I know it's extremely annoying, I'm just going to ask "how much?"</p>
            <p>Let me know!</p>
        `,
        isPriority: false,
        inProgress: true,
        onDeck: false,
        qaTesting: false,
        isDone: false,
        type: 'active',
        date: moment().subtract(4, 'months'),
        attachments: []
    },
    {   code: 'DW-131',
        title: 'Tutor Information',
        content: `
            <p>This is a reminder that you have registered for an event at the local tax authorities on Tuesday.</p>
            <p>Perhaps you thought you paid a lot of taxes, living in the world's most expensive country. But no, we have a little surprise for you.</p>
            <p>Can't wait to see you there!</p>
        `,
        isPriority: false,
        isDone: true,
        inProgress: false,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment().subtract(5, 'months'),
        attachments: [
            {
                fileName: 'invite.ics',
                size: 500000
            }
        ]
    },
    {   code: 'DW-132',
        title: 'Unit Testing',
        content: `
            <p>Hey,</p>
            <p>I ordered a pizza from you guys yesterday. I ordered a vegetarian one, but you delivered a meat lover's pizza.</p>
            <p>I only noticed this half way through eating it, so obviously I am quite upset about that.</p>
            <p>Please deliver a new pizza tonight, but this time a vegetarian one, but with bacon.</p>
            <p>Regards,</p>
            <p>An Angry Customer</p>
        `,
        isPriority: false,
        inProgress: false,
        onDeck: false,
        qaTesting: true,
        isDone: false,
        type: 'active',
        date: moment().subtract(6, 'months'),
        attachments: []
    },
    {   code: 'DW-133',
        title: 'Looking for a developer',
        content: `
            <p>Hey Bo,</p>
            <p>We are looking for a developer who knows Elasticsearch and Vue.js. Would you be interested in hearing more about it?</p>
            <p>This is obviously just a message that I sent to hundreds of other people without checking out their CV first.</p>
            <p>Let me know if you are open to talking about it.</p>
            <p>Best regards,</p>
            <p>A random recruiter</p>
        `,
        isPriority: false,
        isDone: false,
        inProgress: false,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment().subtract(7, 'months'),
        attachments: [
            {
                fileName: 'job-description.pdf',
                size: 3000000
            }
        ]
    },
    {   code: 'DW-134',
        title: 'Database management',
        content: `
            <p>Hey Coding Explained,</p>
            <p>Your video titled "Why Vue.js is Awesome" is now live on YouTube!</p>
            <p>You can find it here: <a href="#">https://youtu.be/watch?v=hg23hgls</a></p>
        `,
        isPriority: false,
        isDone: false,
        inProgress: false,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment().subtract(8, 'months'),
        attachments: []
    },
    {   code: 'DW-135',
        title: "Andriod app development",
        content: `
            <p>Hey Bo,</p>
            <p>In case you missed what happened on Slack yesterday, here you go.</p>
            <p>We choose to believe that you went on a vacation or something, since you didn't open up the app.</p>
            <ol>
                <li>Brandom messaged you</li>
                <li>12 new messages in <a href="#">#general</a></li>
                <li>34 new messages in <a href="#">#crashed_systems</a></li>
                <li>56 new messages in <a href="#">#urgent</a></li>
            </ol>
            <p>You should probably check that out. Just sayin'.</p>
            <p><strong>The Slack Team</strong></p>
        `,
        isPriority: false,
        isDone: false,
        inProgress: false,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment().subtract(9, 'months'),
        attachments: []
    },
    {   code: 'DW-136',
        title: 'Work collaboration',
        content: `
            <p>Thank you for your purchase at SoundGear.com</p>
            <p>You bought the following item:</p>
            <ul>
                <li>Cloud Cloudlifter CL-1 ($199)</li>
            </ul>
        `,
        isPriority: false,
        isDone: false,
        inProgress: false,
        onDeck: false,
        qaTesting: false,
        type: 'backlog',
        date: moment().subtract(10, 'months'),
        attachments: [
            {
                fileName: 'order-confirmation.pdf',
                size: 2540000
            }
        ]
    }
];

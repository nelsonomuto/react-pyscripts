const express = require('express');
const morgan = require('morgan');
const app = express();

app.get('/ping', function(req, res, next) {
    // Required for container healthcheck
    res.sendStatus(200);
});

app.use(morgan('dev'));

app.use('/hotel/assets/ui-hotel-details', express.static('public'));
app.use('/hotel/common/assets/ui-hotel-details', express.static('public'));

app.use(
    '*/**/FontAwesome.otf',
    express.static('public/stylesheets/lib/font-awesome/font/FontAwesome.otf')
);
app.use(
    '*/**/fontawesome-webfont.woff',
    express.static('public/stylesheets/lib/font-awesome/font/fontawesome-webfont.woff')
);
app.use(
    '*/**/fontawesome-webfont.eot',
    express.static('public/stylesheets/lib/font-awesome/font/fontawesome-webfont.eot')
);
app.use(
    '*/**/fontawesome-webfont.ttf',
    express.static('public/stylesheets/lib/font-awesome/font/fontawesome-webfont.ttf')
);
app.use(
    '*/**/fontawesome-webfont.svg',
    express.static('public/stylesheets/lib/font-awesome/font/fontawesome-webfont.svg')
);
app.use('*/**/stewie-icons.eot', express.static('public/lib/icons/dist/fonts/stewie-icons.eot'));
app.use('*/**/stewie-icons.ttf', express.static('public/lib/icons/dist/fonts/stewie-icons.ttf'));
app.use('*/**/stewie-icons.woff', express.static('public/lib/icons/dist/fonts/stewie-icons.woff'));
app.use(
    '*/**/stewie-icons.woff2',
    express.static('public/lib/icons/dist/fonts/stewie-icons.woff2')
);
app.listen(4509, function() {
    console.log('ui-hotel-details is running on localhost:4509');
});

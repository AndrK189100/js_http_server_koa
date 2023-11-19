
const tickets = [
        {id: '1', name: 'тест', discribe: 'тестовый тикет', timestamp: '11.11.2011 14:00', status: true},
    ];

const uuid = require('uuid');    
const http = require('http');
const https = require('https')
const Koa = require('koa');
const { default: koaBody } = require('koa-body');
const fs = require('fs');
const path = require('path');
const app = new Koa();

app.use(koaBody({
    urlencoded: true,
    multipart: true
}))

app.use((ctx, next) => {
    if(ctx.request.method !== 'OPTIONS') {
        next();
        return;
    }
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
    ctx.response.status = 204;
})

app.use( ctx => {

    const {method} = ctx.request.query;

    switch(method) {
        case 'allTickets':
            const tempTickets = JSON.parse(JSON.stringify(tickets));
            tempTickets.forEach(element => {
                delete element.discribe;
            })
            ctx.response.set('Access-Control-Allow-Origin', '*');
            ctx.response.status = 200;
            ctx.response.body = tempTickets;
            return;
        case 'ticketById':
            const ticketDiscribe = tickets.find(element => element.id === ctx.query.id).discribe;
            ctx.response.set('Access-Control-Allow-Origin', '*');
            ctx.response.status = 200;
            ctx.response.body = ticketDiscribe;
            return;
        case 'createTicket':
            const ticket = ctx.request.body;
            ticket.id = uuid.v4();
            ticket.status = false;
            tickets.push(ticket);
            ctx.response.set('Access-Control-Allow-Origin', '*');
            ctx.response.status = 200;
            ctx.body = ticket.id;
            return;
        case 'deleteTicket':
            const delTicket = tickets.find(element => element.id === ctx.query.id);
            tickets.splice(tickets.indexOf(delTicket), 1);
            ctx.response.set('Access-Control-Allow-Origin', '*');
            ctx.response.status = 200;
            return;
        case 'setStatus':
            const statusTicket = tickets.find(element => element.id === ctx.request.body.id);
            if(ctx.request.body.status === 'true') {
                statusTicket.status = true;
            }
            else {
                statusTicket.status = false;
            }
            ctx.response.set('Access-Control-Allow-Origin', '*');
            ctx.response.status = 200;
            return;
        case 'editTicket':
            const editTicket = tickets.find(element => element.id === ctx.request.body.id);
            editTicket.discribe = ctx.request.body.discribe;
            ctx.response.set('Access-Control-Allow-Origin', '*');
            ctx.response.status = 200;
            return;        
    }
});

// const server = http.createServer(app.callback());

// server.listen(7070, (err) => {
//     if(err) {
//         console.log(err);
//         return;
//     }
// });
const options = {
    key: fs.readFileSync(path.resolve(process.cwd(), 'certs/privkey.pem'), 'utf8'),
    cert: fs.readFileSync(path.resolve(process.cwd(), 'certs/cert.pem'), 'utf8'),
    
}
const server =https.createServer(options, app.callback());




server.listen(7070, (err) => {
        if(err) {
            console.log(err);
            return;
        }
    });